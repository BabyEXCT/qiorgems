import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-static'

// GET /api/materials - Get all materials for a seller
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Access denied. Seller role required.' }, { status: 403 })
    }

    const materials = await prisma.material.findMany({
      where: {
        sellerId: session.user.id,
        active: true
      },
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}

// POST /api/materials - Create a new material
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Access denied. Seller role required.' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Material name is required' },
        { status: 400 }
      )
    }

    // Check if material name already exists for this seller
    const existingMaterial = await prisma.material.findFirst({
      where: {
        sellerId: session.user.id,
        name: name.trim(),
        active: true
      }
    })

    if (existingMaterial) {
      return NextResponse.json(
        { error: 'Material name already exists' },
        { status: 400 }
      )
    }

    const material = await prisma.material.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        sellerId: session.user.id
      }
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    )
  }
}