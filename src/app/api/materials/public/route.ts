import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-static'

// GET /api/materials/public - Get all active materials for public filtering
export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      where: {
        active: true
      },
      select: {
        id: true,
        name: true,
        description: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error fetching public materials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}