'use client';

import { useState, useEffect } from 'react';

export default function History() {
  const [publicKey, setPublicKey] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/stellar/history?publicKey=${publicKey}`);
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="publicKey" className="block text-sm font-medium text-gray-700">
            Public Key
          </label>
          <input
            type="text"
            id="publicKey"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button onClick={fetchTransactions} className="btn btn-primary">
          Fetch Transactions
        </button>
        {transactions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">Transactions</h2>
            <ul>
              {transactions.map((tx) => (
                <li key={tx.id}>{tx.id}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
