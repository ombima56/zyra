'use client'
import { useEffect, useState } from 'react'
// import { Server, Transaction, Networks } from 'stellar-sdk'

// Types for a cleaner codebase
type Wallet = {
  publicKey: string
  secret: string
}

type TransactionRecord = {
  id: string
  source_account: string
  amount: string
  asset_code?: string
  from?: string
  to?: string
}

// Assumes the Stellar Test Network for this example
// const STELLAR_SERVER = new Server('https://horizon-testnet.stellar.org')
// const STELLAR_NETWORK_PASSPHRASE = Networks.TESTNET

export default function Dashboard() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [depositPhone, setDepositPhone] = useState('')
  const [message, setMessage] = useState('')
  const [showSendForm, setShowSendForm] = useState(false)
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Replaced useRouter with window.location for navigation in this environment
  const router = {
    push: (path: string) => {
      window.location.href = path
    },
  }

  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet')
    if (storedWallet) {
      const parsedWallet = JSON.parse(storedWallet) as Wallet
      setWallet(parsedWallet)
      // Automatically fetch balance and transactions on load
      fetchData(parsedWallet.publicKey)
    } else {
      router.push('/login')
    }
  }, []) // Empty dependency array to run only once on component mount

  // Centralized data fetching function to avoid code duplication
  const fetchData = async (publicKey: string) => {
    setIsLoading(true)
    try {
      // Mocking API calls for a functioning UI without external libraries
      // Simulating a balance fetch
      const mockBalance = (Math.random() * 1000).toFixed(2)
      setBalance(mockBalance)

      // Simulating transaction fetching
      const mockTransactions: TransactionRecord[] = [
        {
          id: 'mock-tx-1',
          source_account: 'GDJ3Y...',
          amount: '50.00',
          asset_code: 'XLM',
          from: 'GDJ3Y...',
          to: publicKey,
        },
        {
          id: 'mock-tx-2',
          source_account: publicKey,
          amount: '15.50',
          asset_code: 'XLM',
          from: publicKey,
          to: 'GB245...',
        },
      ]
      setTransactions(mockTransactions)

    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage('Failed to load wallet data.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMoney = async () => {
    setMessage('')
    setIsLoading(true)
    try {
      // Mocking API call for sending money
      // This is a placeholder for the real API call
      console.log('Sending money to:', recipient, 'Amount:', amount)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      setMessage('✅ Money sent successfully!')
      setRecipient('')
      setAmount('')
      if (wallet) fetchData(wallet.publicKey) // Refresh data
    } catch (err) {
      setMessage('❌ ' + (err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeposit = async () => {
    setMessage('')
    setIsLoading(true)
    try {
      // This is the core API call for the deposit
      // Mocking the API call
      console.log('Deposit request initiated for phone:', depositPhone, 'Amount:', amount)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      setMessage(`✅ Deposit request initiated for ${amount} XLM. Check your phone for a prompt.`)
      setDepositPhone('')
      setAmount('')
      // No need to refresh immediately as the M-Pesa callback will trigger the Stellar transaction
      // and a real-time listener (like a websocket or a `poll` from Horizon) would handle the update.
    } catch (err) {
      setMessage('❌ ' + (err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('wallet')
    router.push('/login')
  }

  const getUsername = () => {
    if (!wallet?.publicKey) return 'User'
    // A simplified way to get a user identifier from the public key
    return wallet.publicKey.slice(0, 4) + '...' + wallet.publicKey.slice(-4)
  }

  const toggleSendForm = () => {
    setShowSendForm(!showSendForm)
    setShowDepositForm(false)
    setMessage('')
  }

  const toggleDepositForm = () => {
    setShowDepositForm(!showDepositForm)
    setShowSendForm(false)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center p-4 md:p-10 font-sans">
      <header className="w-full max-w-xl flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-green-800">
          Zrya
        </h1>
        <div className="relative">
          <button
            className="flex items-center space-x-2 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              {getUsername().charAt(0)}
            </div>
            <span className="hidden md:inline-block text-sm font-medium">
              {getUsername()}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transform transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-lg"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="w-full max-w-xl bg-gray-800 p-6 rounded-3xl shadow-lg mb-8 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-300">Total Balance</h2>
          <button
            onClick={() => wallet && fetchData(wallet.publicKey)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
            disabled={isLoading}
          >
            {/* Updated SVG for a simpler refresh icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.836 0H20v-5m0 11v5h-.581m0 0a9.003 9.003 0 01-16.205-.003m.002-.685a9.003 9.003 0 0116.205.685M4 16v5h.582m0 0a9.003 9.003 0 0015.836 0M3 12h18"
              />
            </svg>
          </button>
        </div>
        <p className="text-5xl md:text-6xl font-extrabold text-white">
          {isLoading ? '...' : `$${balance || '0.00'}`}
        </p>
      </div>

      <div className="w-full max-w-xl grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={toggleDepositForm}
          className="flex flex-col items-center justify-center p-6 bg-green-600 rounded-2xl shadow-md hover:bg-green-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="text-lg font-medium text-white">Deposit</span>
        </button>
        <button
          onClick={toggleSendForm}
          className="flex flex-col items-center justify-center p-6 bg-blue-600 rounded-2xl shadow-md hover:bg-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <span className="text-lg font-medium text-white">Send</span>
        </button>
      </div>

      {showDepositForm && (
        <div className="w-full max-w-xl bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">
            Add Funds
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Enter the amount and the M-Pesa number to deposit from.
          </p>
          <input
            type="number"
            placeholder="Amount"
            className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="tel"
            placeholder="M-Pesa Phone Number (e.g., +2547...)"
            className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={depositPhone}
            onChange={(e) => setDepositPhone(e.target.value)}
          />
          <button
            onClick={handleDeposit}
            className="mt-4 w-full bg-green-600 px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Confirm Deposit
          </button>
          {message && <p className="mt-4 text-center text-green-400">{message}</p>}
        </div>
      )}

      {showSendForm && (
        <div className="w-full max-w-xl bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">
            Send Money
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Enter recipient's wallet address and amount.
          </p>
          <input
            type="text"
            placeholder="Recipient Public Key"
            className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={handleSendMoney}
            className="w-full bg-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Confirm Send
          </button>
          {message && <p className="mt-4 text-center text-green-400">{message}</p>}
        </div>
      )}

      <div className="w-full max-w-xl bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-200">
            Recent Transactions
          </h2>
          <button
            onClick={() => wallet && fetchData(wallet.publicKey)}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.836 0H20v-5m0 11v5h-.581m0 0a9.003 9.003 0 01-16.205-.003m.002-.685a9.003 9.003 0 0116.205.685M4 16v5h.582m0 0a9.003 9.003 0 0015.836 0M3 12h18"
              />
            </svg>
          </button>
        </div>
        <ul className="space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading transactions...</p>
          ) : transactions.length > 0 ? (
            transactions.map((tx, i) => (
              <li
                key={i}
                className="bg-gray-900 p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-medium text-white">
                    Transaction ID: {tx.id.slice(0, 10)}...
                  </p>
                  <p className="text-sm text-gray-400">
                    Amount: {tx.amount} {tx.asset_code}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No transactions found.</p>
          )}
        </ul>
      </div>
    </div>
  )
}
