'use client'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone }),
    })
    const data = await res.json()
    alert(`Wallet Address: ${data.publicKey}`)
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-900 p-6">
      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-white text-center">Create Stellar Wallet</h1>

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

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-semibold transition"
        >
          Register Wallet
        </button>
      </form>
    </main>
  )
}
