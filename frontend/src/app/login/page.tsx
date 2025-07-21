'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      // Optional: save user data in localStorage (you can use JWT/session instead later)
      localStorage.setItem('wallet', JSON.stringify(data.user))

      // ✅ Redirect to dashboard
      router.push('/dashboard')
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
          className="w-full p-3 rounded-md bg-white/20 text-white placeholder-white/70"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-md bg-white/20 text-white placeholder-white/70"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-semibold transition"
        >
          Login
        </button>
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
