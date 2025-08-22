import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { transfer } from "@/lib/stellar";
import { sendWhatsAppMessage, formatPhoneNumber } from "@/lib/whatsapp";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse(null, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  console.log("WhatsApp webhook called.");
  const body = await req.json();
  console.log("Incoming webhook payload:", JSON.stringify(body, null, 2));

  try {
    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const from = body.entry[0].changes[0].value.messages[0].from;
        const message = body.entry[0].changes[0].value.messages[0];

        console.log(`Received message: "${JSON.stringify(message)}" from: ${from}`);

        const formattedFrom = formatPhoneNumber(from);

        let messageText = '';
        if (message.text) {
          messageText = message.text.body;
        } else if (message.interactive && message.interactive.button_reply) {
          messageText = message.interactive.button_reply.id;
        }


        // 1. Verification Logic
        const verificationCode = messageText.trim();
        if (/^\d{6}$/.test(verificationCode)) {
          console.log(`Received verification code: ${verificationCode}`);
          const user = await prisma.user.findFirst({
            where: {
              whatsappVerificationCode: verificationCode,
              phone: formattedFrom,
            },
          });

          if (user) {
            console.log(`Found user with verification code: ${user.phone}`);
            await prisma.user.update({
              where: { id: user.id },
              data: {
                whatsappVerified: true,
                whatsappVerificationCode: null,
              },
            });
            console.log(`User ${user.phone} verified successfully.`);
            const welcomeMessage = `*Welcome to Zyra!*

Your account has been verified successfully!

Here's a quick overview of what you can do:

*DEPOSIT:* Add funds to your account via M-Pesa.
*SEND:* Transfer funds to other Zyra users instantly.
*BALANCE:* Check your current account balance.

Select an option below to get started:`;

            const interactiveMessage = {
              type: "button",
              header: {
                type: "text",
                text: "Account Verified"
              },
              body: {
                text: welcomeMessage
              },
              action: {
                buttons: [
                  {
                    type: "reply",
                    reply: {
                      id: "deposit",
                      title: "Deposit"
                    }
                  },
                  {
                    type: "reply",
                    reply: {
                      id: "send",
                      title: "Send"
                    }
                  },
                  {
                    type: "reply",
                    reply: {
                      id: "balance",
                      title: "Check Balance"
                    }
                  }
                ]
              }
            };

            await sendWhatsAppMessage(
              formattedFrom,
              welcomeMessage,
              interactiveMessage
            );
            console.log(`Sent verification confirmation to ${formattedFrom}`);
          } else {
            console.log(`No user found with verification code: ${verificationCode} and phone: ${formattedFrom}`);
          }
        }

        // 2. Deposit Logic
        else if (messageText.toLowerCase().startsWith("deposit")) {
          const amount = messageText.split(" ")[1];
          if (!amount || isNaN(parseInt(amount))) {
            // If the user just clicked the "Deposit" button, ask for the amount
            if (messageText.toLowerCase() === "deposit") {
              await sendWhatsAppMessage(
                formattedFrom,
                "Please enter the amount you want to deposit, e.g., *deposit 100*"
              );
              return new NextResponse(null, { status: 200 });
            }
            return NextResponse.json(
              { message: "Invalid deposit amount" },
              { status: 400 }
            );
          }

          const user = await prisma.user.findUnique({ where: { phone: formattedFrom } });
          if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/stk-push`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount,
                phone: formattedFrom,
                userId: user.publicKey,
              }),
            }
          );

          if (!response.ok) {
            console.error("STK Push API error:", await response.text());
            throw new Error("Failed to initiate STK Push");
          }

          await sendWhatsAppMessage(
            formattedFrom,
            `STK Push initiated for ${amount} KES. Check your phone to complete the transaction.`
          );
        }

        // 3. Send Logic
        else if (messageText.toLowerCase().startsWith("send")) {
          const parts = messageText.split(" ");
          const amount = parts[1];
          const recipientPhone = parts[3];

          if (!amount || isNaN(parseInt(amount)) || !recipientPhone) {
            // If the user just clicked the "Send" button, ask for the details
            if (messageText.toLowerCase() === "send") {
              await sendWhatsAppMessage(
                formattedFrom,
                "Please enter the amount and recipient, e.g., *send 100 to +254712345678*"
              );
              return new NextResponse(null, { status: 200 });
            }
            return NextResponse.json(
              { message: "Invalid send command. Use 'send <amount> to <phone>'" },
              { status: 400 }
            );
          }

          const sender = await prisma.user.findUnique({ where: { phone: formattedFrom } });
          if (!sender) {
            return NextResponse.json({ message: "Sender not found" }, { status: 404 });
          }

          const formattedRecipientPhone = formatPhoneNumber(recipientPhone);
          const recipient = await prisma.user.findUnique({
            where: { phone: formattedRecipientPhone },
          });
          if (!recipient) {
            return NextResponse.json(
              { message: "Recipient not found" },
              { status: 404 }
            );
          }

          if (sender.balance < parseInt(amount)) {
            return NextResponse.json(
              { message: "Insufficient balance" },
              { status: 400 }
            );
          }

          await transfer(sender.publicKey, recipient.publicKey, amount, sender.secret);

          await prisma.$transaction([
            prisma.user.update({
              where: { id: sender.id },
              data: { balance: { decrement: parseInt(amount) } },
            }),
            prisma.user.update({
              where: { id: recipient.id },
              data: { balance: { increment: parseInt(amount) } },
            }),
            prisma.transaction.create({
              data: {
                userId: sender.id,
                amount: parseInt(amount),
                phone: formattedRecipientPhone,
                status: "SUCCESS",
                type: "SEND",
              },
            }),
          ]);

          await sendWhatsAppMessage(
            formattedFrom,
            `🎉 Congratulations! You have successfully sent ${amount} XLM to ${formattedRecipientPhone}. 🎉`
          );
          await sendWhatsAppMessage(
            formattedRecipientPhone,
            `🎉 You have received ${amount} XLM from ${sender.phone}. 🎉`
          );
        }
        
        // 4. Balance Logic
        else if (messageText.toLowerCase().startsWith("balance")) {
            const user = await prisma.user.findUnique({ where: { phone: formattedFrom } });
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            await sendWhatsAppMessage(
                formattedFrom,
                `Your current balance is: ${user.balance} XLM`
            );
        }
        
        else {
          console.log("No command matched.");
        }
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return new NextResponse(null, { status: 500 });
  }
}

