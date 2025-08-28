import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    // Temporarily bypass authentication for development
    // TODO: Remove this bypass in production
    if (process.env.NODE_ENV === 'production' && (!session || session.user.role !== 'SELLER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orderId = id

    // Check if the ID is a display ID (ORD001, ORD002, etc.) or a database ID
    let order;
    if (orderId.startsWith('ORD')) {
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
      const orderIndex = parseInt(orderId.replace('ORD', '')) - 1
      if (orderIndex >= 0 && orderIndex < orders.length) {
        const actualOrderId = orders[orderIndex].id
        order = await prisma.order.findUnique({
          where: {
            id: actualOrderId
          },
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: true
                  }
                }
              }
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        })
       }
     } else {
      // Fetch the order with database ID
       order = await prisma.order.findUnique({
         where: {
           id: orderId
         },
         include: {
           orderItems: {
             include: {
               product: {
                 select: {
                   name: true,
                   images: true
                 }
               }
             }
           },
           user: {
             select: {
               firstName: true,
               lastName: true,
               email: true,
               phone: true
             }
           }
         }
       })
     }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Transform the order data to match the frontend interface
    const transformedOrder = {
      id: order.id,
      originalId: order.id,
      customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Unknown Customer',
      customerEmail: order.user.email || '',
      customerPhone: order.user.phone || '',
      shippingAddress: {
        street: order.shippingAddress || '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      items: order.orderItems.map(item => ({
        id: item.id,
        name: item.product.name,
        price: parseFloat(item.price.toString()),
        quantity: item.quantity,
        image: item.product.images && item.product.images.length > 0 
          ? item.product.images[0] 
          : ''
      })),
      subtotal: parseFloat(order.subtotal.toString()),
      shipping: parseFloat(order.shippingCost.toString()),
      tax: parseFloat(order.tax.toString()),
      total: parseFloat(order.total.toString()),
      status: order.status.toLowerCase() as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
      paymentStatus: order.paymentStatus?.toLowerCase() as 'pending' | 'paid' | 'failed' | 'refunded' || 'pending',
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      trackingNumber: order.trackingNumber || undefined
    }

    return NextResponse.json({
      success: true,
      order: transformedOrder
    })

  } catch (error) {
    console.error('Error fetching order details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}