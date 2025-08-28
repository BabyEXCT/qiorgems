import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderStatusUpdate } from '@/lib/email'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    // Temporarily bypass authentication for development
    // TODO: Remove this bypass in production
    if (process.env.NODE_ENV === 'production' && (!session?.user || session.user.role !== 'SELLER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { status, trackingNumber } = await request.json()

    // Check if the ID is a display ID (ORD001, ORD002, etc.) or a database ID
    let actualOrderId = id;
    if (id.startsWith('ORD')) {
      // First, get all orders to find the one with matching display ID
      const orders = await prisma.order.findMany({
        select: {
          id: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      // Generate display IDs and find the matching order
      const orderIndex = parseInt(id.replace('ORD', '')) - 1
      if (orderIndex >= 0 && orderIndex < orders.length) {
        actualOrderId = orders[orderIndex].id
      } else {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
    }

    // Update order in database
    const updatedOrder = await prisma.order.update({
      where: { id: actualOrderId },
      data: {
        status,
        trackingNumber: trackingNumber || null,
        updatedAt: new Date()
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })

    // Send email notification
    try {
      await sendOrderStatusUpdate({
        order: updatedOrder,
        newStatus: status,
        trackingNumber: trackingNumber || updatedOrder.trackingNumber,
        customerEmail: updatedOrder.user.email,
        customerName: updatedOrder.user.username
      })
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the status update if email fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        trackingNumber: updatedOrder.trackingNumber,
        updatedAt: updatedOrder.updatedAt,
        customerEmail: updatedOrder.user.email,
        customerName: updatedOrder.user.username,
        total: updatedOrder.total,
        shippingAddress: updatedOrder.shippingAddress,
        orderItems: updatedOrder.orderItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: {
            id: item.product.id,
            name: item.product.name,
            image: item.product.images
          }
        }))
      }
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}