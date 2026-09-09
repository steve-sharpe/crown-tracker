'use client'
import { useEffect, useState } from 'react'

interface Stage { id: string; stageName: string; isCompleted: boolean; completedAt: string | null }
interface Job { id: string; customerAddress: string; token: string; stages: Stage[] }

export default function SupplierView({ params }: { params: { token: string } }) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchJob()
  }, [params.token])

  const fetchJob = async () => {
    const res = await fetch('/api/jobs')
    const jobs = await res.json()
    const foundJob = jobs.find((j: Job) => j.token === params.token)
    setJob(foundJob || null)
    setLoading(false)
  }

  const toggleStage = async (stageName: string, currentStatus: boolean) => {
    if (!job) return
    setUpdating(stageName)
    
    const updatedStages = job.stages.map(s => 
      s.stageName === stageName ? { ...s, isCompleted: !currentStatus, completedAt: !currentStatus ? new Date().toISOString() : null } : s
    )
    setJob({ ...job, stages: updatedStages })

    await fetch(`/api/jobs/${job.id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageName, isCompleted: !currentStatus }),
    })
    setUpdating(null)
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  if (!job) return <div className="flex min-h-screen items-center justify-center text-red-600">Invalid or expired link.</div>

  const cabinetStages = job.stages.filter(s => s.stageName.startsWith('Cabinets'))
  const flooringStages = job.stages.filter(s => s.stageName.startsWith('Flooring'))

  const StageCheckbox = ({ stage }: { stage: Stage }) => (
    <button
      onClick={() => toggleStage(stage.stageName, stage.isCompleted)}
      disabled={updating === stage.stageName}
      className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all active:scale-95 ${
        stage.isCompleted 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold ${
        stage.isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 text-transparent'
      }`}>
        ✓
      </div>
      <div className="flex-1">
        <div className={`font-semibold text-lg ${stage.isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
          {stage.stageName}
        </div>
        {stage.isCompleted && stage.completedAt && (
          <div className="text-xs text-green-700 mt-1">
            Completed: {new Date(stage.completedAt).toLocaleString()}
          </div>
        )}
      </div>
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-black p-6 text-white">
        <h1 className="text-2xl font-bold">Crown Supplier Tracker</h1>
        <p className="mt-2 text-gray-300 text-lg">Job: {job.customerAddress}</p>
      </div>

      <div className="mx-auto max-w-md space-y-8 p-4">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
            <span className="h-6 w-1 rounded-full bg-blue-600"></span>
            Cabinets
          </h2>
          <div className="space-y-3">
            {cabinetStages.map(stage => <StageCheckbox key={stage.id} stage={stage} />)}
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
            <span className="h-6 w-1 rounded-full bg-amber-600"></span>
            Flooring
          </h2>
          <div className="space-y-3">
            {flooringStages.map(stage => <StageCheckbox key={stage.id} stage={stage} />)}
          </div>
        </section>
      </div>
    </div>
  )
}