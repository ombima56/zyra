'use client';

import { useState } from 'react';
import { Keypair } from 'stellar-sdk';

export default function Register() {
  const [keypair, setKeypair] = useState<Keypair | null>(null);
  const [isFunded, setIsFunded] = useState(false);

  const createAccount = () => {
    const newKeypair = Keypair.random();
    setKeypair(newKeypair);
  };

  const fundAccount = async () => {
    if (keypair) {
      try {
        await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);
        setIsFunded(true);
      } catch (error) {
        console.error('Error funding account:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Stellar Account</h1>
      <div className="space-y-4">
        <button onClick={createAccount} className="btn btn-primary">
          Create Account
        </button>
        {keypair && (
          <div>
            <h2 className="text-xl font-semibold">New Account Created</h2>
            <p>
              <strong>Public Key:</strong> {keypair.publicKey()}
            </p>
            <p>
              <strong>Secret Key:</strong> {keypair.secret()}
            </p>
            <button onClick={fundAccount} className="btn btn-secondary mt-2" disabled={isFunded}>
              {isFunded ? 'Account Funded' : 'Fund Account (Testnet)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}