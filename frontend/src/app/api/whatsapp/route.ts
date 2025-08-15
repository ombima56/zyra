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
        const message = body.entry[0].changes[0].value.messages[0].text.body;

        console.log(`Received message: "${message}" from: ${from}`);

        const formattedFrom = formatPhoneNumber(from);

        // 1. Verification Logic
        const verificationCode = message.trim();
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
            await sendWhatsAppMessage(
              formattedFrom,
              "Your account has been verified successfully!\n\nTo deposit money, send: deposit <amount>\nTo send money, send: send <amount> to <phone_number>"
            );
            console.log(`Sent verification confirmation to ${formattedFrom}`);
          } else {
            console.log(`No user found with verification code: ${verificationCode} and phone: ${formattedFrom}`);
          }
        }

        // 2. Deposit Logic
        else if (message.toLowerCase().startsWith("deposit")) {
          const amount = message.split(" ")[1];
          if (!amount || isNaN(parseInt(amount))) {
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
            `${process.env.NEXT_PUBLIC_URL}/api/mpesa/stk-push`,
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
        else if (message.toLowerCase().startsWith("send")) {
          const parts = message.split(" ");
          const amount = parts[1];
          const recipientPhone = parts[3];

          if (!amount || isNaN(parseInt(amount)) || !recipientPhone) {
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
            `Successfully sent ${amount} to ${formattedRecipientPhone}`
          );
          await sendWhatsAppMessage(
            formattedRecipientPhone,
            `You have received ${amount} from ${sender.phone}`
          );
        } else {
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

