'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Login() {
  const [identifier, setIdentifier] = useState('') // can be email or phone
  const [password, setPassword] = useState('')
  const [wallet, setWallet] = useState<{ publicKey: string; secret: string } | null>(null)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }), // 👈 send identifier (email or phone)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setWallet(data.user)
      setIdentifier('')
      setPassword('')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-900 p-6">
      <h1 className="text-4xl font-extrabold text-white mb-6">Login to Wallet</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        {error && (
          <div className="text-red-400 bg-red-900/30 p-3 rounded text-center font-semibold">
            ⚠️ {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Email or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-3 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-semibold transition"
        >
          Login
        </button>

        {wallet && (
          <div className="bg-white/20 text-white p-4 mt-4 rounded-lg">
            <p className="font-semibold text-green-300 mb-2">✅ Wallet Found!</p>
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
          </div>
        )}
      </form>
      <p className="text-white mt-4">
        Don’t have an account?{' '}
        <Link href="/register" className="text-blue-400 hover:underline font-semibold">
          Register
        </Link>
      </p>
    </main>
  )
}
