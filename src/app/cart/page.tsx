'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Truck, Sparkles, Shield } from 'lucide-react'
import { useCart, AppliedVoucher } from '@/contexts/CartContext'
import { formatPrice, calculateTotal } from '@/utils/currency'
import { showConfirm, showSuccess, showError, showWarning, showToast } from '@/utils/alerts'

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart, applyVoucher, removeVoucher } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  
  const subtotal = state.originalTotal || state.total
  const discount = state.appliedVoucher ? state.appliedVoucher.discountAmount : 0
  const shipping = subtotal > 200 ? 0 : 25
  const tax = subtotal * 0.08 // 8% tax
  const finalTotal = subtotal + shipping + tax - discount

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      showWarning('Missing Code', 'Please enter a promo code')
      return
    }

    setIsValidating(true)
    
    try {
      const response = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: promoCode.trim(),
          orderAmount: subtotal
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        const voucher: AppliedVoucher = {
          id: result.voucher.id,
          code: result.voucher.code,
          discountType: result.voucher.discountType,
          discountValue: result.voucher.discountValue,
          discountAmount: result.discountAmount
        }
        
        applyVoucher(voucher)
        showSuccess('Promo Code Applied!', `You saved ${formatPrice(result.discountAmount)} with code ${promoCode}`)
        setPromoCode('')
      } else {
        showError('Invalid Promo Code', result.error || 'This promo code is not valid or has expired')
      }
    } catch (error) {
      console.error('Voucher validation error:', error)
      showError('Error', 'Failed to validate promo code. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const removePromoCode = () => {
    removeVoucher()
    showToast('Promo code removed', 'info')
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gold-100 text-gold-800 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Luxury Shopping
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal-900 mb-4">Shopping Cart</h1>
          <p className="text-xl text-charcoal-600 mb-6">{state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart</p>
          <Link
            href="/products"
            className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium text-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card-premium p-8">
              <div className="border-b border-gold-200 pb-6 mb-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-playfair font-semibold text-charcoal-900">
                    Cart Items ({state.itemCount})
                  </h2>
                  <button
                    onClick={async () => {
                      const result = await showConfirm(
                        'Clear Cart',
                        'Are you sure you want to remove all items from your cart?'
                      );
                      if (result.isConfirmed) {
                        clearCart();
                        showSuccess('Cart cleared successfully!');
                      }
                    }}
                    className="text-sm text-charcoal-500 hover:text-red-600 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="space-y-8">
                {state.items.map((item) => (
                  <div key={item.id} className="pb-8 border-b border-gold-200 last:border-b-0">
                    <div className="flex items-center space-x-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-cream-100 to-gold-50 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                        <div className="w-full h-full bg-white rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                target.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <div className={`text-2xl ${item.image ? 'hidden' : ''}`}>💎</div>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-playfair font-medium text-charcoal-900 truncate">{item.name}</h3>
                        <p className="text-charcoal-500 mt-1">{item.material}</p>
                        <p className="text-charcoal-500">{item.category || 'Uncategorized'}</p>
                        <p className="text-xl font-bold text-charcoal-900 mt-2">{formatPrice(item.price)}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 border border-gold-300 rounded-lg hover:bg-gold-50 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 border border-gold-300 rounded-lg hover:bg-gold-50 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Total Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-charcoal-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={async () => {
                            const result = await showConfirm(
                              'Remove Item',
                              `Are you sure you want to remove ${item.name} from your cart?`
                            );
                            if (result.isConfirmed) {
                              removeItem(item.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 transition-colors mt-2 p-1"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <div className="card-premium p-6">
              <h3 className="text-xl font-playfair font-semibold text-charcoal-900 mb-4">Promo Code</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
                <button
                  onClick={applyPromoCode}
                  disabled={isValidating}
                  className="px-4 py-3 bg-charcoal-900 text-white rounded-lg hover:bg-charcoal-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0 flex items-center justify-center space-x-2"
                >
                  {isValidating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  <span>{isValidating ? 'Validating...' : 'Apply'}</span>
                </button>
              </div>
              {state.appliedVoucher && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 text-sm font-medium">
                        {state.appliedVoucher.code} applied!
                      </p>
                      <p className="text-green-600 text-xs">
                        You saved {formatPrice(discount)}
                      </p>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="card-premium p-8">
              <h3 className="text-2xl font-playfair font-semibold text-charcoal-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-600">Subtotal ({state.itemCount} items)</span>
                  <span className="font-semibold text-lg">{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-600">Shipping</span>
                  <span className="font-semibold text-lg">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
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
                    <span className="text-xl font-bold text-charcoal-900">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
              
              {subtotal < 200 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-800 font-medium">
                      Add {formatPrice(200 - subtotal)} more for free shipping!
                    </span>
                  </div>
                </div>
              )}
              
              <Link
                href="/checkout"
                className="btn-primary w-full mt-8 py-4 px-6 text-lg font-semibold flex items-center justify-center"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Proceed to Checkout
              </Link>
              
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-charcoal-700 font-medium">Secure checkout guaranteed</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="card-premium p-6">
              <h3 className="text-xl font-playfair font-semibold text-charcoal-900 mb-4">We Accept</h3>
              <div className="grid grid-cols-4 gap-3">
                {['💳', '💰', '🏦', '📱'].map((icon, index) => (
                  <div key={index} className="aspect-square bg-gradient-to-br from-cream-100 to-gold-50 rounded-lg flex items-center justify-center border border-gold-200">
                    <div className="text-2xl">{icon}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}