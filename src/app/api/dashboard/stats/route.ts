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
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sellerId = session.user.id
    */
    
    // Use default seller ID for development
    const sellerId = 'cmeevnpsd0000m698by5biccw'

    // Get voucher statistics
    const totalVouchers = await prisma.voucher.count({
      where: { sellerId }
    })

    const activeVouchers = await prisma.voucher.count({
      where: {
        sellerId,
        status: 'ACTIVE',
        endDate: { gt: new Date() }
      }
    })

    // Get orders count for this seller
    const totalOrders = await prisma.order.count({
      where: {
        orderItems: {
          some: {
            product: {
              sellerId: sellerId
            }
          }
        }
      }
    })

    // Get total revenue for this seller
    const revenueResult = await prisma.orderItem.aggregate({
      where: {
        product: {
          sellerId: sellerId
        },
        order: {
          paymentStatus: 'PAID'
        }
      },
      _sum: {
        price: true
      }
    })

    const totalRevenue = revenueResult._sum.price || 0

    // Get pending orders count for this seller
    const pendingOrders = await prisma.order.count({
      where: {
        status: 'PENDING',
        orderItems: {
          some: {
            product: {
              sellerId: sellerId
            }
          }
        }
      }
    })

    // Get product statistics
    const totalProducts = await prisma.product.count({
      where: {
        sellerId
      }
    })

    const activeProducts = await prisma.product.count({
      where: {
        sellerId,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({
      vouchers: {
        total: totalVouchers,
        active: activeVouchers
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders
      },
      revenue: {
        total: totalRevenue,
        currency: 'RM'
      },
      products: {
        total: totalProducts,
        active: activeProducts
      }
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}