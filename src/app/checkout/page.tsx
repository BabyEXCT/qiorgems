'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CreditCard, Lock, Truck, MapPin, User, Mail, Phone, Shield, Sparkles } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, calculateTotal } from '@/utils/currency'
import { showError, showSuccess, showLoading, closeLoading, showConfirm } from '@/utils/alerts'

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { state, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Malaysia',
    
    // Order Options
    shippingMethod: 'standard',
    specialInstructions: ''
  })

  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 0, time: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 15, time: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 35, time: '1 business day' }
  ]

  const selectedShipping = shippingOptions.find(option => option.id === formData.shippingMethod)
  const subtotal = state.originalTotal || state.total
  const discount = state.appliedVoucher ? state.appliedVoucher.discountAmount : 0
  const shippingCost = selectedShipping?.price || 0
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shippingCost + tax - discount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = [
      { field: formData.firstName, name: 'First Name' },
      { field: formData.lastName, name: 'Last Name' },
      { field: formData.email, name: 'Email' },
      { field: formData.phone, name: 'Phone' },
      { field: formData.address, name: 'Address' },
      { field: formData.city, name: 'City' },
      { field: formData.state, name: 'State' },
      { field: formData.zipCode, name: 'Postcode' }
    ]

    const emptyField = requiredFields.find(field => !field.field.trim())
    if (emptyField) {
      showError('Missing Information', `Please fill in the ${emptyField.name} field.`)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showError('Invalid Email', 'Please enter a valid email address.')
      return
    }



    setIsProcessing(true)
    showLoading('Processing Payment...')

    try {
      // Prepare order data
      const orderData = {
        items: state.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
        billingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
        paymentMethod: 'Cash on Delivery',
        shippingCost,
        tax,
        subtotal,
        discount,
        total,
        voucherId: state.appliedVoucher?.id || null,
        voucherCode: state.appliedVoucher?.code || null,
        specialInstructions: formData.specialInstructions
      }

      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      // Try to safely parse JSON, falling back to text if necessary
      let result: any = null
      try {
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          result = await response.json()
        } else {
          const text = await response.text()
          try {
            result = text ? JSON.parse(text) : null
          } catch {
            result = { error: text }
          }
        }
      } catch (e) {
        // If parsing fails, set a generic error container
        result = { error: 'Unexpected response from server.' }
      }

      closeLoading()

      if (response.ok && result?.success) {
        // Track voucher usage if a voucher was applied
        if (state.appliedVoucher) {
          try {
            await fetch('/api/vouchers/use', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                voucherId: state.appliedVoucher.id
              })
            })
          } catch (error) {
            console.error('Error tracking voucher usage:', error)
            // Don't fail the order if voucher tracking fails
          }
        }
        
        // Clear cart
        clearCart()
        
        showSuccess(
          'Order Placed Successfully!',
          `Your order has been confirmed. Order #${result.order.id.slice(-6).toUpperCase()}`
        ).then(() => {
          // Redirect to success page with order ID
          router.push(`/order-success?orderId=${result.order.id}`)
        })
      } else {
        if (response.status === 401) {
          // Prompt user to sign in again
          showConfirm(
            'Session expired',
            'Please sign in to continue with checkout.'
          ).then((confirm) => {
            if (confirm) {
              router.push('/auth/signin?callbackUrl=/checkout')
            }
          })
          return
        }

        const message = result?.error || (response.status >= 500
          ? 'Server error. Please try again shortly.'
          : 'There was an issue processing your order. Please review and try again.')

        showError(
          'Order Failed',
          message
        )
      }
    } catch (error) {
      closeLoading()
      console.error('Order creation error:', error)
      showError(
        'Network Error',
        'We could not reach the server. Please check your connection and try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gold-100 text-gold-800 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Secure Checkout
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal-900 mb-4">Checkout</h1>
          <p className="text-xl text-charcoal-600">Complete your order securely</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="card-premium p-8">
              <div className="flex items-center mb-8">
                <Truck className="h-6 w-6 text-gold-600 mr-3" />
                <h2 className="text-2xl font-playfair font-semibold text-charcoal-900">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="premium-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="premium-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="premium-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="premium-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="premium-input"
                    placeholder="123 Jalan Bukit Bintang"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="premium-input"
                    placeholder="Kuala Lumpur"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="premium-input"
                    placeholder="Kuala Lumpur"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="premium-input"
                    placeholder="50200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="premium-input"
                  >
                    <option value="Malaysia">Malaysia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Thailand">Thailand</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="card-premium p-8">
              <h2 className="text-2xl font-playfair font-semibold text-charcoal-900 mb-8">Shipping Method</h2>
              <div className="space-y-6">
                {shippingOptions.map((option) => (
                  <label key={option.id} className="flex items-center p-6 border-2 border-gold-200 rounded-xl cursor-pointer hover:bg-cream-50 transition-all duration-200">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={option.id}
                      checked={formData.shippingMethod === option.id}
                      onChange={handleInputChange}
                      className="text-gold-600 focus:ring-gold-500 w-5 h-5"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-charcoal-900 text-lg">{option.name}</p>
                          <p className="text-charcoal-600">{option.time}</p>
                        </div>
                        <p className="font-bold text-charcoal-900 text-lg">
                          {option.price === 0 ? 'Free' : formatPrice(option.price)}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="card-premium p-8">
              <div className="flex items-center mb-8">
                <CreditCard className="h-6 w-6 text-gold-600 mr-3" />
                <h2 className="text-2xl font-playfair font-semibold text-charcoal-900">Payment Method</h2>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900">Cash on Delivery</h3>
                    <p className="text-charcoal-600">Pay when your order arrives at your doorstep</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="card-premium p-8">
              <h2 className="text-2xl font-playfair font-semibold text-charcoal-900 mb-6">Special Instructions</h2>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any special delivery instructions..."
                className="premium-input"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-premium p-8 sticky top-8">
              <h2 className="text-2xl font-playfair font-semibold text-charcoal-900 mb-8">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-6 mb-8">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-cream-100 to-gold-50 rounded-xl flex items-center justify-center text-2xl p-2">
                      <div className="w-full h-full bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image && item.image.startsWith('data:image') ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-xs text-gray-400 text-center p-1">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-playfair font-medium text-charcoal-900 text-lg">{item.name}</h3>
                      <p className="text-charcoal-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-charcoal-900 text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Order Totals */}
              <div className="border-t border-gold-200 pt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-600">Subtotal</span>
                  <span className="font-semibold text-lg">{formatPrice(subtotal)}</span>
                </div>
                {state.appliedVoucher && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-600">Discount ({state.appliedVoucher.code})</span>
                    <span className="font-semibold text-lg text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-600">Shipping</span>
                  <span className="font-semibold text-lg">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-600">SST (8%)</span>
                  <span className="font-semibold text-lg">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gold-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-playfair font-bold text-charcoal-900">Total</span>
                    <span className="text-xl font-bold text-charcoal-900">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary w-full mt-8 py-4 px-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Lock className="h-5 w-5 mr-2" />
                {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
              </button>
              
              <div className="mt-6">
                <div className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-charcoal-700 font-medium">256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}