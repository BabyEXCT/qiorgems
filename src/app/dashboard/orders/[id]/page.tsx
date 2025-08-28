'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  Save,
  X
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { showSuccess, showError, showConfirm, showLoading, closeLoading } from '@/utils/alerts'


interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: string
  updatedAt: string
  trackingNumber?: string
  originalId?: string
}

export default function OrderDetailsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditingTracking, setIsEditingTracking] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/dashboard/orders/${orderId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }
        const data = await response.json()
        setOrder(data.order)
        setTrackingNumber(data.order.trackingNumber || '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order details')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role === 'SELLER' && orderId) {
      fetchOrder()
    }
  }, [session, orderId])

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'SELLER') {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const handleUpdateOrderStatus = async (newStatus: Order['status']) => {
    if (!order) return
    
    // Show confirmation dialog before updating
    const result = await showConfirm(
      'Update Order Status',
      `Are you sure you want to change the order status to ${newStatus.toLowerCase()}? The customer will be notified via email.`
    )
    
    if (!result.isConfirmed) return
    
    try {
      setIsUpdatingStatus(true)
      
      // Show loading alert
      showLoading('Updating order status and sending notification...')
      
      // Call API to update order status and send email
       const response = await fetch(`/api/dashboard/orders/${params.id}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      const apiResult = await response.json()
      
      // Update local state with response data
      // Map orderItems to items for frontend compatibility
      const updatedOrder = {
        ...apiResult.order,
        items: apiResult.order.orderItems?.map((item: any) => ({
          id: item.id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          image: item.product.image
        })) || []
      }
      setOrder(updatedOrder)

      // Close loading and show success message
      closeLoading()
      showSuccess(
        'Order Status Updated!',
        'The order status has been updated successfully and the customer has been notified via email.'
      )
    } catch (error) {
      console.error('Error updating order status:', error)
      closeLoading()
      showError(
        'Update Failed',
        'Failed to update order status. Please try again.'
      )
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleSaveTrackingNumber = async () => {
    if (!order) return
    
    try {
      const response = await fetch(`/api/dashboard/orders/${params.id}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: order.status,
          trackingNumber
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update tracking number')
      }

      const result = await response.json()
      
      setOrder(result.order)
      
      setIsEditingTracking(false)
      alert('Tracking number updated successfully!')
    } catch (error) {
      console.error('Error updating tracking number:', error)
      alert('Failed to update tracking number')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'confirmed': return <Package className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !order) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <XCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error loading order details</p>
              <p className="text-sm">{error || 'Order not found'}</p>
            </div>
            <div className="space-x-4">
              <button 
                onClick={() => router.back()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Go Back
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session || session.user.role !== 'SELLER') {
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Orders
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order ID: {order.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize">{order.status}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-16 h-16 mr-4 bg-gray-200 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                        <div className="text-sm text-gray-500">Unit Price: RM{(item.price || 0).toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="text-lg font-medium text-gray-900">
                      RM{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="text-base text-gray-900">{order.customerName}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="text-base text-gray-900">{order.customerEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="text-base text-gray-900">{order.customerPhone}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Shipping Address</div>
                      <div className="text-base text-gray-900">
                        <div>{order.shippingAddress.street}</div>
                        <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
                        <div>{order.shippingAddress.country}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">RM{(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">RM{(order.shipping || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">RM{(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">RM{(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Created</div>
                    <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Last Updated</div>
                    <div className="text-sm text-gray-900">{formatDate(order.updatedAt)}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Payment Status</div>
                    <div className="text-sm text-gray-900 capitalize">{order.paymentStatus}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Number */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h2>
              {isEditingTracking ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveTrackingNumber}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingTracking(false)
                        setTrackingNumber(order.trackingNumber || '')
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Tracking Number</div>
                      <div className="text-sm text-gray-900">
                        {order.trackingNumber || 'Not assigned'}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditingTracking(true)}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
              <div className="space-y-3">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(e.target.value as Order['status'])}
                  disabled={isUpdatingStatus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                {isUpdatingStatus && (
                  <div className="text-sm text-gray-500">Updating status and sending notification...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}