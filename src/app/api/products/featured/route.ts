import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-static'

export async function GET() {
  try {
    // Fetch featured products that are active
    const featuredProducts = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        featured: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        materialRef: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 8 // Limit to 8 featured products
    })

    return NextResponse.json(featuredProducts)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}