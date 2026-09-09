'use client'
import { useState, useEffect } from 'react'

interface Stage { stageName: string; isCompleted: boolean; completedAt: string | null }
interface Job { id: string; customerAddress: string; crownEmail: string; token: string; createdAt: string; stages: Stage[] }

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchJobs = async () => {
    const res = await fetch('/api/jobs')
    const data = await res.json()
    setJobs(data)
  }

  useEffect(() => { fetchJobs() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerAddress: address, crownEmail: email }),
    })
    setAddress('')
    setEmail('')
    setLoading(false)
    fetchJobs()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Crown Tracker Admin</h1>
          <a href="/api/logout" className="text-sm text-red-600 hover:underline">Logout</a>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">Create New Job</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Customer Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              type="email"
              placeholder="Crown Supplier Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-md bg-black py-3 text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition"
          >
            {loading ? 'Creating & Emailing...' : 'Create Job & Notify Crown'}
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Jobs</h2>
          {jobs.length === 0 && <p className="text-gray-500">No jobs created yet.</p>}
          {jobs.map((job) => {
            const completedCount = job.stages.filter(s => s.isCompleted).length
            const progress = Math.round((completedCount / job.stages.length) * 100)
            
            return (
              <div key={job.id} className="rounded-lg bg-white p-5 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{job.customerAddress}</h3>
                    <p className="text-sm text-gray-500">Sent to: {job.crownEmail}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-black">{progress}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-black transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}