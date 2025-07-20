'use client'
import { useState } from 'react'

type Wallet = { publicKey: string; secret: string }

export default function Home() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [error, setError] = useState('')

  // ✅ validation helper
  const validateForm = () => {
    if (!email || !phone || !password || !confirmpassword) {
      return 'All fields are required.'
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return 'Invalid email address.'
    }
    if (!/^\d{10,15}$/.test(phone)) {
      return 'Phone number must be 10-15 digits.'
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.'
    }
    if (password !== confirmpassword) {
      return 'Passwords do not match.'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to create wallet')
      }

      if (data.user?.publicKey && data.user?.secret) {
        setWallet({
          publicKey: data.user.publicKey,
          secret: data.user.secret,
        })
        setEmail('')
        setPhone('')
        setPassword('')
        setConfirmPassword('')

      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      setError((err as Error).message || 'Something went wrong')
    }

  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-900 p-6">
      <h1 className="text-4xl font-extrabold text-white text-center mb-4">
        Send money like a message.
      </h1>
      <p className="text-lg text-white/70 max-w-xl text-center mb-6">
        Zyra lets you chat and transfer funds instantly—across borders, with no fees or friction.
      </p>

      <div
        className={`bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-md w-full space-y-4 transition-all duration-300 ${wallet ? 'max-w-2xl' : 'max-w-md'
          }`}
      >
        <h2 className="text-2xl font-bold text-white text-center">Create Stellar Wallet</h2>

        {error && (
          <div className="text-red-400 bg-red-900/30 p-3 rounded text-center font-semibold">
            ⚠️ {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          className="w-full p-3 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-semibold transition"
        >
          Register Wallet
        </button>

        {wallet && (
          <div className="bg-white/20 text-white p-4 mt-4 rounded-lg">
            <p className="font-semibold text-green-300 mb-2">✅ Wallet Created!</p>
            <div className="space-y-2">
              <div>
                <strong>Public Key:</strong>
                <div className="mt-1 p-2 bg-black/30 rounded text-sm font-mono break-all">
                  {wallet.publicKey}
                </div>
              </div>
              <div>
                <strong>Secret Key:</strong>
                <div className="mt-1 p-2 bg-black/30 rounded text-sm font-mono break-all">
                  {wallet.secret}
                </div>
              </div>
            </div>
            <p className="text-sm text-yellow-300 mt-2">
              ⚠️ Save your secret key somewhere safe!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
