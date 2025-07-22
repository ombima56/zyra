import { NextResponse } from 'next/server';
import { SorobanRpc, Network } from 'stellar-sdk';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicKey = searchParams.get('publicKey');

  if (!publicKey) {
    return NextResponse.json({ error: 'Public key is required' }, { status: 400 });
  }

  try {
    const rpc = new SorobanRpc.Server('https://soroban-testnet.stellar.org:443', {
      allowHttp: true,
    });

    const contractId = 'YOUR_CONTRACT_ID'; // Replace with your contract ID
    const account = await rpc.getAccount(publicKey);
    const balance = account.balances.find((b) => b.asset_type === 'native')?.balance ?? 0;

    return NextResponse.json({ balance });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { from, to, amount } = await request.json();

  if (!from || !to || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Simulate transaction submission
    console.log(`Transferring ${amount} from ${from} to ${to}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to transfer funds' }, { status: 500 });
  }
}
