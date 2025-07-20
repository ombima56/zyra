import { NextResponse } from 'next/server';
import { Keypair } from 'stellar-sdk';

// Handles POST requests to /api/register
export async function POST(request: Request) {
  const body = await request.json();
  const { email, phone } = body;

  // Generate Stellar wallet
  const pair = Keypair.random();

  return NextResponse.json({
    email,
    phone,
    publicKey: pair.publicKey(),
    secret: pair.secret(),
  });
}
