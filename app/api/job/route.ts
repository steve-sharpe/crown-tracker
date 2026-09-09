import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendJobEmail } from '@/lib/email'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  const jobs = await prisma.job.findMany({
    include: { stages: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(jobs)
}

export async function POST(req: Request) {
  try {
    const { customerAddress, crownEmail } = await req.json()
    const token = uuidv4()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const job = await prisma.job.create({
      data: {
        customerAddress,
        crownEmail,
        token,
        stages: {
          create: [
            { stageName: 'Cabinets - In Production' },
            { stageName: 'Cabinets - Delivered' },
            { stageName: 'Cabinets - Installed' },
            { stageName: 'Flooring - Ordered' },
            { stageName: 'Flooring - Delivered' },
          ]
        }
      },
      include: { stages: true }
    })

    await sendJobEmail(crownEmail, customerAddress, `${baseUrl}/job/${token}`)
    
    return NextResponse.json(job)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}