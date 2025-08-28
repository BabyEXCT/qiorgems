'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { showSuccess, showInfo, showToast } from '@/utils/alerts'

function OrderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState<string>('')

  useEffect(() => {
    // Get order ID from URL params or generate a stable one
    const orderId = searchParams.get('orderId')
    if (orderId) {
      setOrderNumber(orderId)
    } else {
      // Generate a stable order number for demo purposes
      const storedOrderNumber = sessionStorage.getItem('lastOrderNumber')
      if (storedOrderNumber) {
        setOrderNumber(storedOrderNumber)
      } else {
        const newOrderNumber = `QG${Math.floor(Math.random() * 900000) + 100000}`
        sessionStorage.setItem('lastOrderNumber', newOrderNumber)
        setOrderNumber(newOrderNumber)
      }
    }
  }, [searchParams])
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const handleContactSupport = () => {
    showInfo(
      'Contact Support',
      'You can reach our support team at support@qiogems.com or call 1-800-QIO-GEMS (Mon-Fri 9AM-6PM EST)'
    )
  }

  const handleSocialShare = (platform: string) => {
    showToast(`Shared on ${platform}!`, 'success')
    // In a real app, this would open the actual sharing dialog
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-sm text-gray-500">
            Order #{orderNumber}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Order Processing */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">
                We're preparing your jewelry with care and attention to detail.
              </p>
            </div>

            {/* Shipping */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipping</h3>
              <p className="text-sm text-gray-600">
                Estimated delivery: <br />
                <span className="font-medium">{estimatedDelivery}</span>
              </p>
            </div>

            {/* Email Confirmation */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Sent</h3>
              <p className="text-sm text-gray-600">
                Order confirmation and tracking details have been sent to your email.
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-rose-600">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Order Confirmation</h3>
                <p className="text-sm text-gray-600">
                  You'll receive an email confirmation with your order details and receipt.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-rose-600">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Quality Check & Packaging</h3>
                <p className="text-sm text-gray-600">
                  Our experts will carefully inspect and package your jewelry in our signature gift box.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-charcoal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-charcoal-600">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Shipping & Tracking</h3>
                <p className="text-sm text-gray-600">
                  Once shipped, you'll receive tracking information to monitor your package's journey.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-charcoal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-charcoal-600">4</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Your beautiful jewelry will arrive safely at your doorstep, ready to be enjoyed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Support */}
        <div className="bg-charcoal-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            Our customer service team is here to assist you with any questions about your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="text-sm">
              <span className="font-medium text-gray-900">Email:</span>
              <span className="text-gray-600 ml-2">support@qiogems.com</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-900">Phone:</span>
              <span className="text-gray-600 ml-2">1-800-QIO-GEMS</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-900">Hours:</span>
              <span className="text-gray-600 ml-2">Mon-Fri 9AM-6PM EST</span>
            </div>
          </div>
          <button
            onClick={handleContactSupport}
            className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors font-medium"
          >
            Contact Support
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/products')}
            className="bg-rose-600 text-white px-8 py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium flex items-center justify-center"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-white text-gray-700 px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>

        {/* Social Sharing */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Share your QioGems experience</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => handleSocialShare('Facebook')}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <span className="text-sm font-bold">f</span>
            </button>
            <button 
              onClick={() => handleSocialShare('Twitter')}
              className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
            >
              <span className="text-sm font-bold">t</span>
            </button>
            <button 
              onClick={() => handleSocialShare('Instagram')}
              className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
            >
              <span className="text-sm font-bold">ig</span>
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderContent />
    </Suspense>
  )
}