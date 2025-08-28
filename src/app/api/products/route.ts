import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// Helper function to get session with error handling
async function getAuthSession() {
  try {
    return await getServerSession(authOptions)
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const forDashboard = searchParams.get('dashboard') === 'true'
    
    if (forDashboard) {
      // Dashboard endpoint - requires authentication and shows seller's products
      const session = await getAuthSession()
      if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const products = await prisma.product.findMany({
        where: {
          sellerId: session.user.id
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({ products })
    } else {
      // Public endpoint - no authentication required for viewing products
      const products = await prisma.product.findMany({
        where: {
          status: 'ACTIVE' // Only show active products to public
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json(products)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()
    
    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, stock, categoryId, material, status, featured, imageUrl } = body

    // Validate required fields
    if (!name || !price || !stock || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        categoryId: categoryId || null,
        material: material || '',
        stock: parseInt(stock),
        status: status || 'ACTIVE',
        featured: featured || false,
        images: imageUrl || '',
        sellerId: session.user.id
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthSession()
    
    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, price, stock, category, material, status, imageUrl } = body

    // Validate required fields
    if (!id || !name || !price || !stock) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if product belongs to the seller
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        sellerId: session.user.id
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        material,
        status,
        ...(imageUrl && { image: imageUrl })
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession()
    
    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product belongs to the seller
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        sellerId: session.user.id
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}