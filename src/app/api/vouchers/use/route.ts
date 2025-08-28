import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { voucherId, orderId } = await request.json()

    if (!voucherId) {
      return NextResponse.json({ error: 'Voucher ID is required' }, { status: 400 })
    }

    // Update voucher usage count
    const updatedVoucher = await prisma.voucher.update({
      where: {
        id: voucherId
      },
      data: {
        usedCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      voucher: updatedVoucher
    })

  } catch (error) {
    console.error('Error updating voucher usage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}