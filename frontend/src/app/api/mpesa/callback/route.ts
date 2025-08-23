
// src/app/api/mpesa/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  console.log('M-Pesa Callback Received');

  

  try {
    const callbackData = await req.json();
    console.log('Callback Data:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    const { stkCallback } = Body;

    if (!stkCallback) {
      console.error('Invalid callback format: stkCallback not found');
      return NextResponse.json({ error: 'Invalid callback format' }, { status: 400 });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // 2. Find the transaction in the database
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { merchantRequestID: MerchantRequestID },
          { checkoutRequestID: CheckoutRequestID },
        ],
      },
      include: {
        user: true,
      },
    });

    if (!transaction) {
      console.error(`Transaction not found for MerchantRequestID: ${MerchantRequestID} or CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json({ message: 'Transaction not found, but callback acknowledged' });
    }

    // 3. Update the transaction and user balance
    let status: 'SUCCESS' | 'FAILED' = 'FAILED';
    let mpesaReceiptNumber: string | undefined = undefined;

    if (ResultCode === 0) {
      status = 'SUCCESS';
      if (CallbackMetadata) {
        const item = CallbackMetadata.Item.find((i: any) => i.Name === 'MpesaReceiptNumber');
        if (item) {
          mpesaReceiptNumber = item.Value;
        }
      }

      console.log(`Transaction ${transaction.id} successful. M-Pesa Receipt: ${mpesaReceiptNumber}`);

      // Fund the user's Stellar account from the testnet faucet
      const friendbotUrl = `https://friendbot.stellar.org?addr=${transaction.user.publicKey}`;
      const response = await fetch(friendbotUrl);

      if (!response.ok) {
        console.error("Friendbot error:", await response.text());
        throw new Error("Failed to fund account from friendbot");
      }

      // Update user balance
      const fundedAmount = 10000;
      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          balance: {
            increment: fundedAmount,
          },
        },
      });

      console.log(`User ${transaction.userId} balance updated with ${fundedAmount} XLM`);

      await sendWhatsAppMessage(transaction.user.phone, `🎉 Congratulations! Your account has been funded with ${fundedAmount} XLM from the testnet faucet. 🎉`);

    } else {
      console.error(`Transaction ${transaction.id} failed. Reason: ${ResultDesc}`);
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        mpesaReceiptNumber: mpesaReceiptNumber?.toString(),
      },
    });

    return NextResponse.json({ message: 'Callback handled successfully' });

  } catch (err) {
    console.error('Error handling M-Pesa callback:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to handle callback', details: errorMessage }, { status: 500 });
  }
}
