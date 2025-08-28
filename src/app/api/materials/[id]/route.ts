import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-static'

// Generate static params for static export
export async function generateStaticParams() {
  return []
}

// PUT /api/materials/[id] - Update a material
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Access denied. Seller role required.' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, active } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Material name is required' },
        { status: 400 }
      )
    }

    // Check if material exists and belongs to the seller
    const existingMaterial = await prisma.material.findFirst({
      where: {
        id: id,
        sellerId: session.user.id
      }
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    // Check if new name conflicts with existing materials (excluding current one)
    const nameConflict = await prisma.material.findFirst({
      where: {
        sellerId: session.user.id,
        name: name.trim(),
        active: true,
        id: {
          not: id
        }
      }
    })

    if (nameConflict) {
      return NextResponse.json(
        { error: 'Material name already exists' },
        { status: 400 }
      )
    }

    const updatedMaterial = await prisma.material.update({
      where: {
        id: id
      },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        active: active !== undefined ? active : existingMaterial.active
      }
    })

    return NextResponse.json(updatedMaterial)
  } catch (error) {
    console.error('Error updating material:', error)
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    )
  }
}

// DELETE /api/materials/[id] - Delete a material
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Access denied. Seller role required.' }, { status: 403 })
    }

    // Check if material exists and belongs to the seller
    const existingMaterial = await prisma.material.findFirst({
      where: {
        id: id,
        sellerId: session.user.id
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    // Check if material has products
    if (existingMaterial._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete material with existing products. Please move or delete products first.' },
        { status: 400 }
      )
    }

    await prisma.material.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: 'Material deleted successfully' })
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json(
      { error: 'Failed to delete material' },
      { status: 500 }
    )
  }
}