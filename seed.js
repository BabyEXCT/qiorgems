const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create or find seller user
  let seller = await prisma.user.findUnique({
    where: { id: 'default_seller_id' }
  })

  if (!seller) {
    // Try to find by username as fallback
    seller = await prisma.user.findUnique({
      where: { username: 'seller' }
    })
    
    if (!seller) {
      const hashedPassword = await bcrypt.hash('seller123', 12)
      seller = await prisma.user.create({
        data: {
          id: 'default_seller_id',
          username: 'seller',
          email: 'seller@qiogems.com',
          password: hashedPassword,
          role: 'SELLER',
          firstName: 'QioGems',
          lastName: 'Seller'
        }
      })
      console.log('Created seller user')
    }
  }

  // Create test categories
  const categories = [
    {
      name: 'Rings',
      description: 'Beautiful rings for all occasions',
      sellerId: seller.id
    },
    {
      name: 'Necklaces',
      description: 'Elegant necklaces and pendants',
      sellerId: seller.id
    },
    {
      name: 'Earrings',
      description: 'Stunning earrings collection',
      sellerId: seller.id
    },
    {
      name: 'Bracelets',
      description: 'Stylish bracelets and bangles',
      sellerId: seller.id
    }
  ]

  const createdCategories = []
  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: category.name, sellerId: seller.id }
    })
    
    if (!existingCategory) {
      const newCategory = await prisma.category.create({
        data: category
      })
      createdCategories.push(newCategory)
      console.log(`Created category: ${category.name}`)
    } else {
      createdCategories.push(existingCategory)
    }
  }

  // Create test materials
  const materials = [
    {
      name: 'Gold',
      description: '18K and 24K gold jewelry',
      sellerId: seller.id
    },
    {
      name: 'Silver',
      description: 'Sterling silver jewelry',
      sellerId: seller.id
    },
    {
      name: 'Pearl',
      description: 'Natural and cultured pearls',
      sellerId: seller.id
    },
    {
      name: 'Diamond',
      description: 'Precious diamond stones',
      sellerId: seller.id
    },
    {
      name: 'Sapphire',
      description: 'Beautiful sapphire gemstones',
      sellerId: seller.id
    }
  ]

  for (const material of materials) {
    const existingMaterial = await prisma.material.findFirst({
      where: { name: material.name, sellerId: seller.id }
    })
    
    if (!existingMaterial) {
      await prisma.material.create({
        data: material
      })
      console.log(`Created material: ${material.name}`)
    }
  }

  // Create test products with sellerId
  const products = [
    {
      name: 'Diamond Solitaire Ring',
      description: 'A beautiful diamond solitaire ring crafted with precision',
      price: 2499.99,
      images: 'diamond-ring.jpg',
      material: 'Gold',
      stock: 5,
      status: 'ACTIVE',
      featured: true,
      sellerId: seller.id,
      categoryId: createdCategories.find(c => c.name === 'Rings')?.id
    },
    {
      name: 'Pearl Necklace',
      description: 'Elegant pearl necklace perfect for special occasions',
      price: 899.99,
      images: 'pearl-necklace.jpg',
      material: 'Pearl',
      stock: 12,
      status: 'ACTIVE',
      featured: false,
      sellerId: seller.id,
      categoryId: createdCategories.find(c => c.name === 'Necklaces')?.id
    },
    {
      name: 'Sapphire Earrings',
      description: 'Stunning sapphire earrings with silver setting',
      price: 1299.99,
      images: 'sapphire-earrings.jpg',
      material: 'Silver',
      stock: 8,
      status: 'ACTIVE',
      featured: true,
      sellerId: seller.id,
      categoryId: createdCategories.find(c => c.name === 'Earrings')?.id
    }
  ]

  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name, sellerId: seller.id }
    })
    
    if (!existingProduct) {
      await prisma.product.create({
        data: product
      })
      console.log(`Created product: ${product.name}`)
    }
  }

  // Create test vouchers
  const vouchers = [
    {
      code: 'SAVE10',
      name: '10% Off',
      description: 'Get 10% off your order',
      type: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 100,
      usageLimit: 100,
      usedCount: 5,
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      sellerId: seller.id
    },
    {
      code: 'WELCOME20',
      name: 'Welcome Discount',
      description: 'Welcome new customers with 20% off',
      type: 'PERCENTAGE',
      value: 20,
      minOrderAmount: 200,
      usageLimit: 50,
      usedCount: 12,
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      sellerId: seller.id
    },
    {
      code: 'LUXURY15',
      name: 'Luxury Items Discount',
      description: '15% off on luxury jewelry',
      type: 'PERCENTAGE',
      value: 15,
      minOrderAmount: 500,
      usageLimit: 25,
      usedCount: 3,
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      sellerId: seller.id
    }
  ]

  for (const voucher of vouchers) {
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code: voucher.code }
    })
    
    if (!existingVoucher) {
      await prisma.voucher.create({
        data: voucher
      })
      console.log(`Created voucher: ${voucher.code}`)
    }
  }

  // Create test customer user
  let customer = await prisma.user.findUnique({
    where: { username: 'customer' }
  })

  if (!customer) {
    const hashedPassword = await bcrypt.hash('customer123', 12)
    customer = await prisma.user.create({
      data: {
        username: 'customer',
        email: 'customer@example.com',
        password: hashedPassword,
        role: 'CUSTOMER',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+60123456789'
      }
    })
    console.log('Created customer user')
  }

  // Get created products for orders
  const createdProducts = await prisma.product.findMany({
    where: { sellerId: seller.id }
  })

  // Create test orders
  const orders = [
    {
      userId: customer.id,
      status: 'DELIVERED',
      total: 2599.99,
      shippingCost: 50.00,
      tax: 259.99,
      subtotal: 2499.99,
      shippingAddress: JSON.stringify({
        street: '123 Main Street',
        city: 'Kuala Lumpur',
        state: 'Selangor',
        zipCode: '50000',
        country: 'Malaysia'
      }),
      billingAddress: JSON.stringify({
        street: '123 Main Street',
        city: 'Kuala Lumpur',
        state: 'Selangor',
        zipCode: '50000',
        country: 'Malaysia'
      }),
      paymentMethod: 'Credit Card',
      paymentStatus: 'PAID',
      trackingNumber: 'TRK001234567',
      notes: 'Please handle with care',
      createdAt: new Date('2024-01-15'),
      items: [{
        productId: createdProducts[0]?.id,
        quantity: 1,
        price: 2499.99
      }]
    },
    {
      userId: customer.id,
      status: 'SHIPPED',
      total: 949.99,
      shippingCost: 30.00,
      tax: 89.99,
      subtotal: 899.99,
      shippingAddress: JSON.stringify({
        street: '456 Oak Avenue',
        city: 'Penang',
        state: 'Penang',
        zipCode: '10000',
        country: 'Malaysia'
      }),
      paymentMethod: 'PayPal',
      paymentStatus: 'PAID',
      trackingNumber: 'TRK001234568',
      createdAt: new Date('2024-01-20'),
      items: [{
        productId: createdProducts[1]?.id,
        quantity: 1,
        price: 899.99
      }]
    },
    {
      userId: customer.id,
      status: 'PROCESSING',
      total: 1329.99,
      shippingCost: 25.00,
      tax: 129.99,
      subtotal: 1299.99,
      shippingAddress: JSON.stringify({
        street: '789 Pine Road',
        city: 'Johor Bahru',
        state: 'Johor',
        zipCode: '80000',
        country: 'Malaysia'
      }),
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'PAID',
      createdAt: new Date('2024-01-25'),
      items: [{
        productId: createdProducts[2]?.id,
        quantity: 1,
        price: 1299.99
      }]
    }
  ]

  for (const orderData of orders) {
    if (orderData.items[0]?.productId) {
      const existingOrder = await prisma.order.findFirst({
        where: {
          userId: orderData.userId,
          total: orderData.total,
          createdAt: orderData.createdAt
        }
      })
      
      if (!existingOrder) {
        const { items, ...orderWithoutItems } = orderData
        const order = await prisma.order.create({
          data: orderWithoutItems
        })
        
        // Create order items
        for (const item of items) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }
          })
        }
        
        console.log(`Created order: ${order.id}`)
      }
    }
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })