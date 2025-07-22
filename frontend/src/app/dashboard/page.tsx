'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const checkBalance = async () => {
    try {
      const response = await fetch(`/api/stellar?publicKey=${publicKey}`);
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleTransfer = async () => {
    try {
      await fetch('/api/stellar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: publicKey, to, amount }),
      });
      alert('Transfer successful!');
    } catch (error) {
      console.error('Error transferring funds:', error);
      alert('Transfer failed!');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="publicKey" className="block text-sm font-medium text-gray-700">
            Your Public Key
          </label>
          <input
            type="text"
            id="publicKey"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button onClick={checkBalance} className="btn btn-primary">
          Check Balance
        </button>
        {balance !== null && (
          <div>
            <h2 className="text-xl font-semibold">Balance</h2>
            <p>{balance}</p>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">Transfer Funds</h2>
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">
            Recipient Public Key
          </label>
          <input
            type="text"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
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
        <button onClick={handleTransfer} className="btn btn-primary">
          Transfer
        </button>
      </div>
    </div>
  );
}