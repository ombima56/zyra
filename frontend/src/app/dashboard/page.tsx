'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [wallet, setWallet] = useState<{ publicKey: string; secret: string } | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [showSendForm, setShowSendForm] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  // load wallet from localStorage
  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet')
    if (storedWallet) {
      setWallet(JSON.parse(storedWallet))
    } else {
      router.push('/login')
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
      setRecipient('')
      setAmount('')
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

  const handleLogout = () => {
    localStorage.removeItem('wallet')
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 relative">
      {/* Top Right Profile */}
      <div className="absolute top-4 right-6">
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="w-10 h-10 bg-white rounded-full text-black font-bold"
          >
            {wallet?.publicKey?.charAt(0).toUpperCase() || 'U'}
          </button>
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">💳 Dashboard</h1>

      {/* Send Money Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowSendForm(!showSendForm)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {showSendForm ? 'Hide Send Form' : 'Send Money'}
        </button>

        {/* Send Form */}
        {showSendForm && (
          <div className="mt-4">
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
            {message && (
              <p className="mt-2 text-green-300 flex justify-between items-center">
                {message}
                <button
                  onClick={() => setMessage('')}
                  className="ml-4 px-2 py-1 text-sm text-red-300"
                >
                  ✖
                </button>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Balance Section */}
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

      {/* Transactions Section */}
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
              <p>From: {tx.fromPhone || 'Unknown'}</p>
              <p>To: {tx.toPhone || tx.to}</p>
              <p>Amount: {tx.amount}</p>
              <p>Date: {tx.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
