import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { VoucherType, VoucherStatus } from '@prisma/client'

// GET /api/dashboard/vouchers - Get all vouchers for the authenticated seller
export async function GET(request: NextRequest) {
  try {
    // Temporarily bypass authentication for development
    // TODO: Re-enable authentication in production
    /*
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    */
    
    // Use default seller ID for development
    const sellerId = 'default_seller_id'

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const vouchers = await prisma.voucher.findMany({
      where: {
        sellerId: sellerId
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    const totalVouchers = await prisma.voucher.count({
      where: {
        sellerId: sellerId
      }
    })

    const totalPages = Math.ceil(totalVouchers / limit)

    return NextResponse.json({
      vouchers,
      pagination: {
        currentPage: page,
        totalPages,
        totalVouchers,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/dashboard/vouchers - Create a new voucher
export async function POST(request: NextRequest) {
  try {
    // Temporarily bypass authentication for development
    // TODO: Re-enable authentication in production
    /*
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    */
    
    // Use default seller ID for development
    const sellerId = 'default_seller_id'

    const body = await request.json()
    const {
      code,
      name,
      description,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      startDate,
      endDate
    } = body

    // Validate required fields
    if (!code || !name || !type || !value || !usageLimit || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate voucher type
    if (!Object.values(VoucherType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid voucher type' },
        { status: 400 }
      )
    }

    // Check if voucher code already exists
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code }
    })

    if (existingVoucher) {
      return NextResponse.json(
        { error: 'Voucher code already exists' },
        { status: 400 }
      )
    }

    const voucher = await prisma.voucher.create({
      data: {
        code,
        name,
        description,
        type,
        value: parseFloat(value),
        minOrderAmount: parseFloat(minOrderAmount) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: parseInt(usageLimit),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        sellerId: sellerId
      }
    })

    return NextResponse.json(voucher, { status: 201 })
  } catch (error) {
    console.error('Error creating voucher:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}