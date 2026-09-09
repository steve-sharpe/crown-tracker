'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
      router.refresh()
    } else {
      setError('Invalid password')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="w-full rounded-md bg-black py-3 text-white font-semibold hover:bg-gray-800 transition">
          Login
        </button>
      </form>
    </div>
  )
}