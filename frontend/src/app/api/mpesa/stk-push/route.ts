
// src/app/api/mpesa/stk-push/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import axios from 'axios';

// Helper function to get Daraja API access token
async function getDarajaAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const res = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return res.data.access_token;
  } catch (err) {
    console.error('Error getting Daraja access token:', err);
    throw new Error('Could not get Daraja access token');
  }
}

export async function POST(req: NextRequest) {
  try {
    const { amount, phone, userId } = await req.json();

    if (!amount || !phone || !userId) {
      return NextResponse.json({ error: 'Amount, phone, and userId are required' }, { status: 400 });
    }

    // 1. Get user from database
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Get Daraja access token
    const accessToken = await getDarajaAccessToken();

    // 3. Construct STK Push payload
    const shortCode = process.env.MPESA_BUSINESS_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline', // or 'CustomerBuyGoodsOnline'
      Amount: amount,
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: `${process.env.NEXT_PUBLIC_URL}/api/mpesa/callback?secret=${process.env.MPESA_CALLBACK_SECRET}`,
      AccountReference: `Zyra Deposit ${userId}`,
      TransactionDesc: 'Deposit to Zyra Wallet',
    };

    // 4. Make STK Push request
    const res = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 5. Create a transaction record in our database
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: parseFloat(amount),
        phone,
        merchantRequestID: res.data.MerchantRequestID,
        checkoutRequestID: res.data.CheckoutRequestID,
        status: 'PENDING',
        type: 'DEPOSIT',
      },
    });

    return NextResponse.json({ message: 'STK Push initiated successfully' });
  } catch (err) {
    console.error('Error initiating STK Push:', err);
    const errorMessage = (err as any).response?.data?.errorMessage || (err as Error).message || 'Unknown error';
    return NextResponse.json({ error: 'Failed to initiate STK Push', details: errorMessage }, { status: 500 });
  }
}
