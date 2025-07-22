import { StrKey } from 'stellar-sdk';
import { Server as SorobanServer } from 'stellar-sdk/rpc';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicKey = searchParams.get('publicKey');

  if (!publicKey || !StrKey.isValidEd25519PublicKey(publicKey)) {
    return new Response(JSON.stringify({ error: 'Invalid public key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const server = new SorobanServer('https://soroban-testnet.stellar.org', {
      allowHttp: false,
    });

    // TODO: implement real RPC call
    const transactions = [
      { id: '1', amount: 100, to: 'GC...', from: 'GD...' },
    ];

    return new Response(JSON.stringify({ transactions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('RPC error', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch transactions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
