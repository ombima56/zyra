'use client'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [wallet, setWallet] = useState<{ publicKey: string; secret: string } | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  // load wallet from localStorage
  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet')
    if (storedWallet) {
      setWallet(JSON.parse(storedWallet))
    }
  }, [])

  const handleSendMoney = async () => {
    setMessage('')
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessage('✅ Money sent!')
    } catch (err) {
      setMessage('❌ ' + (err as Error).message)
    }
  }

  const handleCheckBalance = async () => {
    const res = await fetch('/api/balance')
    const data = await res.json()
    setBalance(data.balance)
  }

  const handleTransactions = async () => {
    const res = await fetch('/api/transactions')
    const data = await res.json()
    setTransactions(data.transactions)
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">💳 Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Send Money</h2>
        <input
          placeholder="Recipient Phone"
          className="block w-full p-2 rounded mt-2 text-black"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          placeholder="Amount"
          className="block w-full p-2 rounded mt-2 text-black"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={handleSendMoney}
          className="mt-3 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
        {message && <p className="mt-2 text-green-300">{message}</p>}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Check Balance</h2>
        <button
          onClick={handleCheckBalance}
          className="mt-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Show Balance
        </button>
        {balance && <p className="mt-2">Balance: ${balance}</p>}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <button
          onClick={handleTransactions}
          className="mt-2 bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
        >
          Show Transactions
        </button>
        <ul className="mt-4 space-y-2">
          {transactions.map((tx, i) => (
            <li key={i} className="bg-white/10 p-2 rounded">
              <p>From: {tx.fromPhone || 'Unknown'}</p> {/* sender phone */}
              <p>To: {tx.toPhone || tx.to}</p>         {/* recipient phone */}
              <p>Amount: {tx.amount}</p>
              <p>Date: {tx.date}</p>
            </li>
          ))}
        </ul>

      </div>
    </main>
  )
}
