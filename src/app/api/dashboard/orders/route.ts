import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Temporarily bypass authentication for development
    // TODO: Re-enable authentication in production
    /*
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Unauthorized - Seller access required' },
        { status: 401 }
      )
    }
    */

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const skip = (page - 1) * limit

    // New: lightweight summary for notifications
    if (searchParams.get('summary') === 'true') {
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)

      const [totalOrders, pendingCount, todayNewOrders] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { createdAt: { gte: startOfToday } } })
      ])

      return NextResponse.json({
        success: true,
        summary: {
          totalOrders,
          pendingCount,
          todayNewOrders
        }
      })
    }

    // Use default seller ID for development
    const sellerId = 'default_seller_id'

    // Get total count for pagination (all orders)
    const totalOrders = await prisma.order.count()

    // Fetch paginated orders with related data (filtered by seller)
    const orders = await prisma.order.findMany({
      where: {
        // TODO: Re-enable authentication for production
        // Filter orders that contain products from this seller
        orderItems: {
          some: {
            product: {
              sellerId: 'cmeevnpsd0000m698by5biccw' // Temporary for development - actual seller ID
            }
          }
        }
      },
      skip,
      take: limit,
      include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  price: true
                }
              }
            }
          }
        },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the frontend interface
    const transformedOrders = orders.map((order, index) => {
      const customerName = order.user.firstName && order.user.lastName 
        ? `${order.user.firstName} ${order.user.lastName}`
        : order.user.username

      // Parse shipping address (assuming it's stored as JSON string)
      let shippingAddress
      try {
        shippingAddress = JSON.parse(order.shippingAddress)
      } catch {
        // If parsing fails, create a simple address object
        shippingAddress = {
          street: order.shippingAddress,
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      }

      return {
        id: `ORD${String(index + 1).padStart(3, '0')}`, // Generate simple numeric IDs like ORD001, ORD002, etc.
        customerName,
        customerEmail: order.user.email,
        customerPhone: order.user.phone || '',
        shippingAddress,
        items: order.orderItems.map(item => ({
          id: item.product.id,
          name: item.product.name, // Use actual product name from database
          price: item.price,
          quantity: item.quantity,
          image: item.product.images ? item.product.images.split(',')[0] : '📦'
        })),
        subtotal: order.subtotal,
        shipping: order.shippingCost,
        tax: order.tax,
        total: order.total,
        status: order.status.toLowerCase(),
        paymentStatus: order.paymentStatus.toLowerCase(),
        voucher: null, // No voucher relationship in current schema
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        trackingNumber: order.trackingNumber,
        originalId: order.id // Keep original ID for database operations
      }
    })

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit,
        hasNextPage: page < Math.ceil(totalOrders / limit),
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update order status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Unauthorized - Seller access required' },
        { status: 401 }
      )
    }

    const { orderId, status, trackingNumber } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      )
    }

    // Handle both original database ID and display ID formats
    let actualOrderId = orderId
    if (orderId.startsWith('ORD')) {
      // If it's a display ID like ORD001, we need to find the actual database ID
      // For now, we'll assume the client sends the originalId for updates
      // This is a limitation that would need frontend changes to handle properly
    }

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update order
    const updateData: any = {
      status: status.toUpperCase(),
      updatedAt: new Date()
    }

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
    }

    const updatedOrder = await prisma.order.update({
      where: { id: actualOrderId },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}