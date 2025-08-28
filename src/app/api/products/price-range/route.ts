import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-static'

export async function GET() {
  try {
    const priceRange = await prisma.product.aggregate({
      where: {
        status: 'ACTIVE'
      },
      _min: {
        price: true
      },
      _max: {
        price: true
      }
    })

    // If no products exist, return default range
    if (!priceRange._min.price || !priceRange._max.price) {
      return NextResponse.json({
        min: 0,
        max: 10000
      })
    }

    return NextResponse.json({
      min: Math.floor(priceRange._min.price),
      max: Math.ceil(priceRange._max.price)
    })
  } catch (error) {
    console.error('Error fetching price range:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price range' },
      { status: 500 }
    )
  }
}