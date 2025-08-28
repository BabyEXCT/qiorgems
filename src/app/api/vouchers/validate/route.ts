import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Temporarily disable auth check for testing
    // const session = await getServerSession(authOptions)
    
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { code, orderAmount } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Voucher code is required' }, { status: 400 })
    }

    // Find the voucher by code
    const voucher = await prisma.voucher.findFirst({
      where: {
        code: code.toUpperCase(),
        status: 'ACTIVE',
        startDate: {
          lte: new Date()
        },
        endDate: {
          gte: new Date()
        }
      }
    })

    if (!voucher) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired voucher code' 
      }, { status: 200 })
    }

    // Check if voucher has reached usage limit
    if (voucher.usedCount >= voucher.usageLimit) {
      return NextResponse.json({ 
        success: false, 
        error: 'Voucher usage limit reached' 
      }, { status: 200 })
    }

    // Check minimum order amount
    if (orderAmount < voucher.minOrderAmount) {
      return NextResponse.json({ 
        success: false, 
        error: `Minimum order amount of $${voucher.minOrderAmount} required` 
      }, { status: 200 })
    }

    // Calculate discount
    let discountAmount = 0
    if (voucher.type === 'PERCENTAGE') {
      discountAmount = (orderAmount * voucher.value) / 100
      // Apply max discount limit if set
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount
      }
    } else if (voucher.type === 'FIXED') {
      discountAmount = voucher.value
      // Don't allow discount to exceed order amount
      if (discountAmount > orderAmount) {
        discountAmount = orderAmount
      }
    }

    return NextResponse.json({
      success: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        name: voucher.name,
        discountType: voucher.type,
        discountValue: voucher.value
      },
      discountAmount: Math.round(discountAmount * 100) / 100 // Round to 2 decimal places
    })

  } catch (error) {
    console.error('Error validating voucher:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}