'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [wallet, setWallet] = useState<{ publicKey: string; secret: string } | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [showSendForm, setShowSendForm] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const router = useRouter()

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

  const handleLogout = () => {
    localStorage.removeItem('wallet')
    router.push('/login')
  }

  const getUsername = () => {
  if (!wallet?.publicKey) return 'User'
  const email = wallet.publicKey
  console.log(email)
  const name = email.split('@')[0] // get 'quinter' from 'quinter@example.com'
  return name.charAt(0).toUpperCase() + name.slice(1) // Capitalize: 'Quinter'
}

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">💳 Dashboard</h1>

        <div className="relative">
          <p
            className="cursor-pointer text-sm hover:underline"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            👤 {getUsername()}
          </p>
          {showProfileMenu && (
            <div className="absolute right-0 mt-1 bg-white text-black rounded shadow p-2">
              <p
                className="cursor-pointer hover:underline"
                onClick={handleLogout}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowSendForm(!showSendForm)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Money
        </button>

        {showSendForm && (
          <div className="mt-4">
            <input
              placeholder="Recipient Phone"
              className="block w-full p-2 rounded mt-2 bg-gray-800 text-white placeholder-gray-400"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              placeholder="Amount"
              className="block w-full p-2 rounded mt-2 bg-gray-800 text-white placeholder-gray-400"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={handleSendMoney}
              className="mt-3 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Confirm Send
            </button>
            {message && <p className="mt-2 text-green-300">{message}</p>}
          </div>
        )}
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
