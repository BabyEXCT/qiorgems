import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { VoucherType, VoucherStatus } from '@prisma/client'

// GET /api/dashboard/vouchers/[id] - Get a specific voucher
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const voucher = await prisma.voucher.findFirst({
      where: {
        id: id,
        sellerId: session.user.id
      }
    })

    if (!voucher) {
      return NextResponse.json(
        { error: 'Voucher not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(voucher)
  } catch (error) {
    console.error('Error fetching voucher:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/dashboard/vouchers/[id] - Update a voucher
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      status,
      startDate,
      endDate
    } = body

    // Check if voucher exists and belongs to the user
    const existingVoucher = await prisma.voucher.findFirst({
      where: {
        id: id,
        sellerId: session.user.id
      }
    })

    if (!existingVoucher) {
      return NextResponse.json(
        { error: 'Voucher not found' },
        { status: 404 }
      )
    }

    // Validate voucher type if provided
    if (type && !Object.values(VoucherType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid voucher type' },
        { status: 400 }
      )
    }

    // Validate voucher status if provided
    if (status && !Object.values(VoucherStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid voucher status' },
        { status: 400 }
      )
    }

    // Check if voucher code already exists (excluding current voucher)
    if (code && code !== existingVoucher.code) {
      const codeExists = await prisma.voucher.findFirst({
        where: {
          code,
          id: { not: id }
        }
      })

      if (codeExists) {
        return NextResponse.json(
          { error: 'Voucher code already exists' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (code !== undefined) updateData.code = code
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (value !== undefined) updateData.value = parseFloat(value)
    if (minOrderAmount !== undefined) updateData.minOrderAmount = parseFloat(minOrderAmount)
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount ? parseFloat(maxDiscount) : null
    if (usageLimit !== undefined) updateData.usageLimit = parseInt(usageLimit)
    if (status !== undefined) updateData.status = status
    if (startDate !== undefined) updateData.startDate = new Date(startDate)
    if (endDate !== undefined) updateData.endDate = new Date(endDate)

    const voucher = await prisma.voucher.update({
      where: { id: id },
      data: updateData
    })

    return NextResponse.json(voucher)
  } catch (error) {
    console.error('Error updating voucher:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/dashboard/vouchers/[id] - Delete a voucher
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if voucher exists and belongs to the user
    const existingVoucher = await prisma.voucher.findFirst({
      where: {
        id: id,
        sellerId: session.user.id
      }
    })

    if (!existingVoucher) {
      return NextResponse.json(
        { error: 'Voucher not found' },
        { status: 404 }
      )
    }

    await prisma.voucher.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Voucher deleted successfully' })
  } catch (error) {
    console.error('Error deleting voucher:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}