import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendOrderNotification, sendCustomerOrderConfirmation } from '@/lib/email'

// Validation schema for order creation
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })),
  shippingAddress: z.string().min(1),
  billingAddress: z.string().optional(),
  paymentMethod: z.string().min(1),
  shippingCost: z.number().min(0),
  tax: z.number().min(0),
  subtotal: z.number().min(0),
  total: z.number().min(0),
  specialInstructions: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // Resolve effective user id to avoid FK errors from stale sessions
    const sessionUserId = session.user.id
    let effectiveUserId = sessionUserId
    const existingUser = await prisma.user.findUnique({ where: { id: sessionUserId } })
    if (!existingUser) {
      if (session.user.email) {
        const userByEmail = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (userByEmail) {
          effectiveUserId = userByEmail.id
        } else {
          return NextResponse.json(
            { error: 'Your session is stale. Please sign in again.' },
            { status: 401 }
          )
        }
      } else {
        return NextResponse.json(
          { error: 'Your session is stale. Please sign in again.' },
          { status: 401 }
        )
      }
    }

    // Server-side validation: ensure products exist and have sufficient stock
    const productIds = validatedData.items.map((i) => i.productId)
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
    const productMap = new Map(products.map((p) => [p.id, p]))

    const missingItem = validatedData.items.find((i) => !productMap.get(i.productId))
    if (missingItem) {
      return NextResponse.json(
        { error: 'One or more items in your cart are no longer available. Please review your cart and try again.' },
        { status: 400 }
      )
    }

    const insufficient = validatedData.items.find((i) => {
      const p = productMap.get(i.productId)!
      return (p.stock ?? 0) < i.quantity
    })
    if (insufficient) {
      const p = productMap.get(insufficient.productId)!
      return NextResponse.json(
        { error: `Insufficient stock for "${p.name}". Available: ${p.stock}. Please adjust quantity.` },
        { status: 400 }
      )
    }

    // Create order with order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: effectiveUserId,
          status: 'PENDING',
          total: validatedData.total,
          shippingCost: validatedData.shippingCost,
          tax: validatedData.tax,
          subtotal: validatedData.subtotal,
          shippingAddress: validatedData.shippingAddress,
          billingAddress: validatedData.billingAddress,
          paymentMethod: validatedData.paymentMethod,
          paymentStatus: 'PENDING',
          notes: validatedData.specialInstructions
        }
      })

      // Create order items and reduce stock
      for (const item of validatedData.items) {
        // Create order item
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }
        })

        // Reduce product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      // Return order with items
      return await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      })
    })

    // Send email notifications (non-blocking)
    // Send confirmation email to customer
    if (session.user.email) {
      await sendCustomerOrderConfirmation({
        order,
        customerEmail: session.user.email,
        customerName: (session.user as any).username || session.user.name || undefined,
      }).catch((err) => console.error('Customer email notification error:', err))
    }
    
    // Send notification email to seller
    await sendOrderNotification({
      order,
      customerEmail: session.user.email || undefined,
      customerName: (session.user as any).username || session.user.name || undefined,
    }).catch((err) => console.error('Seller email notification error:', err))

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Error creating order:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid order data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      orders
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}