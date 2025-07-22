'use client';

import { useState } from 'react';
import { Keypair, Transaction, Networks } from 'stellar-sdk';

export default function Send() {
  const [secretKey, setSecretKey] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSent, setIsSent] = useState(false);

  const sendPayment = async () => {
    try {
      const keypair = Keypair.fromSecret(secretKey);
      const response = await fetch(`/api/stellar/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: keypair.publicKey(),
          recipient,
          amount,
        }),
      });

      if (response.ok) {
        setIsSent(true);
      } else {
        console.error('Error sending payment:', await response.json());
      }
    } catch (error) {
      console.error('Error sending payment:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Send Payment</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
            Secret Key
          </label>
          <input
            type="password"
            id="secretKey"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
            Recipient Public Key
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button onClick={sendPayment} className="btn btn-primary" disabled={isSent}>
          {isSent ? 'Payment Sent' : 'Send Payment'}
        </button>
      </div>
    </div>
  );
}
