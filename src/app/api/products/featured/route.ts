import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Return static featured products data to avoid database connection issues
    const featuredProducts = [
      {
        id: '1',
        name: 'Premium Diamond Ring',
        price: 2500.00,
        image: '/images/products/diamond-ring.jpg',
        category: { id: '1', name: 'Rings' },
        status: 'ACTIVE',
        featured: true
      },
      {
        id: '2',
        name: 'Gold Necklace',
        price: 1200.00,
        image: '/images/products/gold-necklace.jpg',
        category: { id: '2', name: 'Necklaces' },
        status: 'ACTIVE',
        featured: true
      },
      {
        id: '3',
        name: 'Silver Bracelet',
        price: 450.00,
        image: '/images/products/silver-bracelet.jpg',
        category: { id: '3', name: 'Bracelets' },
        status: 'ACTIVE',
        featured: true
      },
      {
        id: '4',
        name: 'Pearl Earrings',
        price: 800.00,
        image: '/images/products/pearl-earrings.jpg',
        category: { id: '4', name: 'Earrings' },
        status: 'ACTIVE',
        featured: true
      }
    ]

    return NextResponse.json(featuredProducts)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}