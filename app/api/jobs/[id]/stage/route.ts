import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { stageName, isCompleted } = await req.json()
    
    await prisma.stage.updateMany({
      where: { jobId: params.id, stageName },
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