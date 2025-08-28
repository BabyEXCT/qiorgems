import 'server-only'
import nodemailer, { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    // Do not throw hard errors in production path, but log for visibility
    console.warn('SMTP environment variables are not fully configured. Emails will be skipped.')
    throw new Error('SMTP not configured')
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Brevo uses 587 (TLS) or 465 (SSL)
    auth: { user, pass },
  })

  return transporter
}

function parseFromHeader(from: string): { fromEmail: string; fromName?: string } {
  // Supports formats like: "Name <email@domain.com>" or "email@domain.com"
  const match = from.match(/^\s*([^<]*)<\s*([^>]+)\s*>\s*$/)
  if (match) {
    const name = match[1]?.trim()
    const email = match[2]?.trim()
    return { fromEmail: email, fromName: name || undefined }
  }
  return { fromEmail: from.trim() }
}

async function sendBrevoEmail({
  from,
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  from: string
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) throw new Error('BREVO_API_KEY is not configured')

  const { fromEmail, fromName } = parseFromHeader(from)

  const payload: any = {
    sender: { email: fromEmail, name: fromName },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text,
  }

  if (replyTo) {
    payload.replyTo = { email: replyTo }
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Brevo API error ${res.status}: ${body}`)
  }
}

export async function sendOrderStatusUpdate({
  order,
  newStatus,
  trackingNumber,
  customerEmail,
  customerName,
}: {
  order: any
  newStatus: string
  trackingNumber?: string
  customerEmail: string
  customerName?: string
}) {
  if (!customerEmail) {
    console.warn('Customer email not provided; skipping order status update email.')
    return
  }

  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@example.com'
  const to = customerEmail

  const subject = `Order Update: ${order?.id || 'Your Order'} - ${newStatus}`
  const total = typeof order?.total === 'number' ? order.total : 0

  const trackingInfo = trackingNumber 
    ? `<p style="margin:4px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>`
    : ''

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2 style="margin:0 0 12px;">Order Status Update</h2>
      <p style="margin:0 0 8px;">Hello ${customerName || 'Customer'},</p>
      <p style="margin:0 0 8px;">Your order status has been updated to: <strong>${newStatus}</strong></p>
      ${order?.id ? `<p style="margin:4px 0;"><strong>Order ID:</strong> ${order.id}</p>` : ''}
      <p style="margin:4px 0;"><strong>Total:</strong> RM ${total.toFixed(2)}</p>
      ${trackingInfo}
      <p style="margin-top:16px; color:#555;">Thank you for shopping with QioGems!</p>
    </div>
  `

  const text = [
    `Order Status Update`,
    `Hello ${customerName || 'Customer'},`,
    `Your order ${order?.id || ''} status: ${newStatus}`,
    `Total: RM ${total.toFixed(2)}`,
    trackingNumber ? `Tracking: ${trackingNumber}` : '',
    'Thank you for shopping with QioGems!'
  ].filter(Boolean).join('\n')

  try {
    if (process.env.BREVO_API_KEY) {
      await sendBrevoEmail({ from, to, subject, html, text })
    } else {
      const t = getTransporter()
      await t.sendMail({ from, to, subject, html, text })
    }
  } catch (err) {
    console.error('Failed to send order status update email:', err)
  }
}

export async function sendCustomerOrderConfirmation({
  order,
  customerEmail,
  customerName,
}: {
  order: any
  customerEmail: string
  customerName?: string
}) {
  if (!customerEmail) {
    console.warn('Customer email not provided; skipping order confirmation email.')
    return
  }

  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@example.com'
  const to = customerEmail

  const items = Array.isArray(order?.orderItems) ? order.orderItems : []
  const itemsHtml = items
    .map((item: any) => {
      const name = item?.product?.name || 'Product'
      const qty = item?.quantity || 0
      const price = typeof item?.price === 'number' ? item.price : 0
      return `<tr>
        <td style="padding:8px; border-bottom:1px solid #eee;">${name}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;" align="center">${qty}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;" align="right">RM ${price.toFixed(2)}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;" align="right">RM ${(price * qty).toFixed(2)}</td>
      </tr>`
    })
    .join('')

  const subject = `Order Confirmation - Thank you for your purchase!${order?.id ? ` (Order #${order.id.slice(-6).toUpperCase()})` : ''}`
  const total = typeof order?.total === 'number' ? order.total : 0
  const subtotal = typeof order?.subtotal === 'number' ? order.subtotal : 0
  const shippingCost = typeof order?.shippingCost === 'number' ? order.shippingCost : 0
  const tax = typeof order?.tax === 'number' ? order.tax : 0
  const shippingAddress = order?.shippingAddress || '-'
  const paymentMethod = order?.paymentMethod || 'Cash on Delivery'

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f5a623, #f39c12); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; color: white; font-size: 28px;">QioGems</h1>
        <p style="margin: 8px 0 0; color: white; opacity: 0.9;">Premium Jewelry & Accessories</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="margin: 0 0 20px; color: #333; font-size: 24px;">Order Confirmation</h2>
        
        <p style="margin: 0 0 16px; font-size: 16px;">Dear ${customerName || 'Valued Customer'},</p>
        
        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Thank you for your order! We're excited to confirm that we've received your purchase and it's being processed. Here are your order details:</p>
        
        ${order?.id ? `<div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;"><strong>Order Number:</strong> #${order.id.slice(-6).toUpperCase()}</p>
          <p style="margin: 8px 0 0; font-size: 14px; color: #666;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>` : ''}
        
        <h3 style="margin: 30px 0 15px; color: #333; font-size: 18px;">Order Items</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: 600;">Product</th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd; font-weight: 600;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd; font-weight: 600;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd; font-weight: 600;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Subtotal:</span>
            <span>RM ${subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Shipping:</span>
            <span>${shippingCost === 0 ? 'Free' : `RM ${shippingCost.toFixed(2)}`}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Tax:</span>
            <span>RM ${tax.toFixed(2)}</span>
          </div>
          <hr style="margin: 12px 0; border: none; border-top: 1px solid #ddd;">
          <div style="display: flex; justify-content: space-between; margin: 8px 0; font-weight: bold; font-size: 18px;">
            <span>Total:</span>
            <span style="color: #f39c12;">RM ${total.toFixed(2)}</span>
          </div>
        </div>
        
        <h3 style="margin: 30px 0 15px; color: #333; font-size: 18px;">Shipping & Payment Details</h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <p style="margin: 0 0 8px;"><strong>Shipping Address:</strong></p>
          <p style="margin: 0 0 15px; color: #666;">${shippingAddress}</p>
          <p style="margin: 0;"><strong>Payment Method:</strong> ${paymentMethod}</p>
        </div>
        
        <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #e8f5e8, #d4edda); border-radius: 6px; text-align: center;">
          <h3 style="margin: 0 0 10px; color: #155724;">What's Next?</h3>
          <p style="margin: 0; color: #155724; line-height: 1.5;">We'll send you another email with tracking information once your order ships. Thank you for choosing QioGems!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0; padding: 20px 0; border-top: 1px solid #eee;">
          <p style="margin: 0 0 10px; color: #666;">Questions about your order?</p>
          <p style="margin: 0; color: #666;">Contact us at <a href="mailto:support@qiogems.com" style="color: #f39c12;">support@qiogems.com</a></p>
        </div>
      </div>
    </div>
  `

  const text = [
    `QioGems - Order Confirmation`,
    `Dear ${customerName || 'Valued Customer'},`,
    `Thank you for your order! Here are your order details:`,
    order?.id ? `Order Number: #${order.id.slice(-6).toUpperCase()}` : '',
    `Total: RM ${total.toFixed(2)}`,
    `Shipping Address: ${shippingAddress}`,
    `Payment Method: ${paymentMethod}`,
    `We'll send you tracking information once your order ships.`,
    `Thank you for choosing QioGems!`,
    `Questions? Contact us at support@qiogems.com`
  ].filter(Boolean).join('\n\n')

  try {
    if (process.env.BREVO_API_KEY) {
      await sendBrevoEmail({ from, to, subject, html, text })
    } else {
      const t = getTransporter()
      await t.sendMail({ from, to, subject, html, text })
    }
    console.log(`Order confirmation email sent to ${customerEmail}`)
  } catch (err) {
    console.error('Failed to send customer order confirmation email:', err)
  }
}

export async function sendOrderNotification({
  order,
  customerEmail,
  customerName,
  sellerEmail,
}: {
  order: any
  customerEmail?: string
  customerName?: string
  sellerEmail?: string
}) {
  const to = sellerEmail || process.env.SELLER_NOTIFICATION_EMAIL
  if (!to) {
    console.warn('SELLER_NOTIFICATION_EMAIL not set; skipping order notification email.')
    return
  }

  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@example.com'
  const replyTo = customerEmail || undefined

  const items = Array.isArray(order?.orderItems) ? order.orderItems : []
  const itemsHtml = items
    .map((item: any) => {
      const name = item?.product?.name || 'Product'
      const qty = item?.quantity || 0
      const price = typeof item?.price === 'number' ? item.price : 0
      const subtotal = qty * price
      return `<tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 8px; font-weight: 500;">${name}</td>
        <td style="padding: 12px 8px; text-align: center; color: #666;">${qty}</td>
        <td style="padding: 12px 8px; text-align: right; color: #333;">RM ${price.toFixed(2)}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600;">RM ${subtotal.toFixed(2)}</td>
      </tr>`
    })
    .join('')

  const subject = `🛍️ New Order Alert - ${order?.id || 'Order Received'} | QioGems`
  const total = typeof order?.total === 'number' ? order.total : 0
  const shippingAddress = order?.shippingAddress || 'Not provided'
  const orderDate = new Date().toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  const paymentMethod = order?.paymentMethod || 'Cash on Delivery'

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">QioGems</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Premium Jewelry & Accessories</p>
      </div>
      
      <!-- Main Content -->
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Alert Badge -->
        <div style="background: #28a745; color: white; padding: 12px 20px; border-radius: 25px; text-align: center; margin-bottom: 25px; font-weight: 600; font-size: 16px;">
          🎉 New Order Received!
        </div>
        
        <!-- Order Summary -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #667eea;">
          <h2 style="margin: 0 0 15px; color: #333; font-size: 20px;">Order Summary</h2>
          <div style="display: grid; gap: 8px;">
            ${order?.id ? `<p style="margin: 0; font-size: 14px;"><strong style="color: #667eea;">Order ID:</strong> <span style="font-family: monospace; background: #e9ecef; padding: 2px 6px; border-radius: 4px;">${order.id}</span></p>` : ''}
            <p style="margin: 0; font-size: 14px;"><strong style="color: #667eea;">Date:</strong> ${orderDate}</p>
            <p style="margin: 0; font-size: 14px;"><strong style="color: #667eea;">Customer:</strong> ${customerName || customerEmail || 'Guest Customer'}</p>
            ${customerEmail ? `<p style="margin: 0; font-size: 14px;"><strong style="color: #667eea;">Email:</strong> <a href="mailto:${customerEmail}" style="color: #667eea; text-decoration: none;">${customerEmail}</a></p>` : ''}
            <p style="margin: 0; font-size: 14px;"><strong style="color: #667eea;">Payment:</strong> ${paymentMethod}</p>
            <p style="margin: 0; font-size: 16px; padding-top: 8px;"><strong style="color: #28a745;">Total Amount:</strong> <span style="font-size: 18px; font-weight: 700; color: #28a745;">RM ${total.toFixed(2)}</span></p>
          </div>
        </div>
        
        <!-- Shipping Information -->
        <div style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 12px; color: #333; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 8px;">📦 Shipping Address</h3>
          <div style="background: #fff; border: 1px solid #dee2e6; padding: 15px; border-radius: 6px; font-size: 14px; line-height: 1.5;">
            ${shippingAddress.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <!-- Order Items -->
        <div style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px; color: #333; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 8px;">🛍️ Order Items</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background: #667eea; color: white;">
                  <th style="padding: 15px 12px; text-align: left; font-weight: 600;">Product</th>
                  <th style="padding: 15px 12px; text-align: center; font-weight: 600;">Qty</th>
                  <th style="padding: 15px 12px; text-align: right; font-weight: 600;">Unit Price</th>
                  <th style="padding: 15px 12px; text-align: right; font-weight: 600;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background: #f8f9fa; border-top: 2px solid #667eea;">
                  <td colspan="3" style="padding: 15px 12px; text-align: right; font-weight: 600; font-size: 16px;">Total:</td>
                  <td style="padding: 15px 12px; text-align: right; font-weight: 700; font-size: 18px; color: #28a745;">RM ${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <!-- Action Required -->
        <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <h3 style="margin: 0 0 10px; color: #2d3436; font-size: 18px;">⚡ Action Required</h3>
          <p style="margin: 0; color: #2d3436; font-size: 14px; line-height: 1.5;">
            Please process this order and update the customer with shipping information.<br>
            <strong>Remember to mark the order as processed in your admin panel.</strong>
          </p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; color: #6c757d; font-size: 12px; line-height: 1.4;">
            This is an automated notification from <strong>QioGems</strong><br>
            Premium Jewelry & Accessories | Delivered with Excellence
          </p>
          ${customerEmail ? `<p style="margin: 8px 0 0; color: #6c757d; font-size: 12px;">Reply to this email to contact the customer directly</p>` : ''}
        </div>
      </div>
    </div>
  `

  const text = [
    '🛍️ NEW ORDER ALERT - QioGems',
    '================================',
    '',
    `Order ID: ${order?.id || 'N/A'}`,
    `Date: ${orderDate}`,
    `Customer: ${customerName || customerEmail || 'Guest Customer'}`,
    customerEmail ? `Email: ${customerEmail}` : '',
    `Payment Method: ${paymentMethod}`,
    `Total: RM ${total.toFixed(2)}`,
    '',
    'SHIPPING ADDRESS:',
    '----------------',
    shippingAddress,
    '',
    'ORDER ITEMS:',
    '------------',
    ...items.map((i: any) => {
      const name = i?.product?.name || 'Product'
      const qty = i?.quantity || 0
      const price = typeof i?.price === 'number' ? i.price : 0
      const subtotal = qty * price
      return `• ${name} x ${qty} @ RM ${price.toFixed(2)} = RM ${subtotal.toFixed(2)}`
    }),
    '',
    `TOTAL: RM ${total.toFixed(2)}`,
    '',
    '⚡ ACTION REQUIRED:',
    'Please process this order and update the customer with shipping information.',
    '',
    '---',
    'QioGems - Premium Jewelry & Accessories',
    'This is an automated notification.',
  ].filter(Boolean).join('\n')

  try {
    if (process.env.BREVO_API_KEY) {
      await sendBrevoEmail({ from, to, subject, html, text, replyTo })
    } else {
      const t = getTransporter()
      await t.sendMail({ from, to, subject, html, text, replyTo })
    }
  } catch (err) {
    // Log and continue (do not block order creation)
    console.error('Failed to send order notification email:', err)
  }
}