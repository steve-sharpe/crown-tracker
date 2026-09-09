import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { stageName, isCompleted } = await req.json()
    const { id } = await params // <-- This line is the fix
    
    await prisma.stage.updateMany({
      where: { jobId: id, stageName },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 })
  }
}