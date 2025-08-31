'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw, Award, Plus, Minus } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/utils/currency'
import { showError, showLoading, closeLoading, showSuccess } from '@/utils/alerts'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  material: string
  images: string
  status: string
  featured: boolean
  category: {
    id: string
    name: string
  } | null
  createdAt: string
}



export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        showLoading('Loading product details...')
        const response = await fetch(`/api/products/${productId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found')
            closeLoading()
            showError('Error', 'Product not found')
          } else {
            setError('Failed to load product')
            closeLoading()
            showError('Error', 'Failed to load product')
          }
          return
        }
        
        const productData = await response.json()
        setProduct(productData)
        closeLoading()
      } catch (err) {
        console.error('Error fetching product:', err)
        const errorMessage = 'Failed to load product'
        setError(errorMessage)
        closeLoading()
        showError('Error', errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">{error || "The product you're looking for doesn't exist."}</p>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images,
        material: product.material,
        category: product.category?.name || 'Uncategorized'
      })
    }
    showSuccess(`Added ${quantity} ${product.name} to cart!`)
  }

  return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-gray-700">Products</a>
          <span>/</span>
          <a href={`/products?category=${product.category?.id}`} className="hover:text-gray-700">{product.category?.name || 'Uncategorized'}</a>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-cream-100 to-gold-50 rounded-2xl flex items-center justify-center card-premium p-6">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                {product.images ? (
                  <img 
                    src={product.images} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-8xl">💎</div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Badges */}
            <div className="flex gap-2">
              <div className="inline-flex items-center px-3 py-1 bg-charcoal-100 text-charcoal-800 rounded-full text-sm font-medium">
                <Award className="h-4 w-4 mr-2" />
                Premium Collection
              </div>
              {new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                  New Arrival
                </span>
              )}

            </div>

            {/* Title and Category */}
            <div>
              <div className="text-sm text-charcoal-600 mb-2">{product.category?.name || 'Uncategorized'}</div>
              <h1 className="text-4xl font-playfair font-bold text-charcoal-900 mb-4">{product.name}</h1>
              
              {/* Material */}
              <div className="flex items-center mb-6">
                <span className="text-charcoal-600">
                  Material: <span className="font-medium">{product.material}</span>
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="card-premium p-6 space-y-3">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-charcoal-900">{formatPrice(product.price)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="card-premium p-6">
              <h3 className="text-xl font-playfair font-semibold text-charcoal-900 mb-4">Description</h3>
              <p className="text-charcoal-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">In Stock ({product.stock} available)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-xl font-playfair font-semibold text-charcoal-900 mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 border border-gold-300 rounded-lg hover:bg-gold-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-3 border border-gold-300 rounded-lg min-w-[80px] text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 border border-gold-300 rounded-lg hover:bg-gold-50 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                className="btn-primary w-full py-4 px-6 text-lg font-semibold flex items-center justify-center"
                disabled={product.stock <= 0}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`btn-secondary flex-1 py-3 px-6 font-semibold flex items-center justify-center ${
                    isWishlisted ? 'bg-charcoal-50 border-charcoal-600 text-charcoal-600' : ''
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="btn-secondary px-6 py-3 font-semibold flex items-center justify-center"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gold-200 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <Truck className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-semibold text-charcoal-900">Free Shipping</div>
                    <div className="text-sm text-charcoal-600">On orders over RM470</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-semibold text-charcoal-900">Lifetime Warranty</div>
                    <div className="text-sm text-charcoal-600">Against manufacturing defects</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <RotateCcw className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="font-semibold text-charcoal-900">30-Day Returns</div>
                    <div className="text-sm text-charcoal-600">Hassle-free returns</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gold-50 to-gold-100 rounded-lg">
                  <Award className="h-8 w-8 text-gold-600" />
                  <div>
                    <div className="font-semibold text-charcoal-900">Certified Authentic</div>
                    <div className="text-sm text-charcoal-600">Premium quality guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="border-t border-gold-200 pt-16 mb-16">
          <div className="bg-white rounded-2xl card-premium p-8">
            <h3 className="text-xl font-semibold text-charcoal-900 mb-4">Description</h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>


      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share Product</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  showSuccess('Link copied to clipboard!')
                  setShowShareModal(false)
                }}
                className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 flex items-center"
              >
                <span className="mr-3">🔗</span>
                Copy Link
              </button>
              <button
                onClick={() => {
                  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
                  window.open(url, '_blank')
                  setShowShareModal(false)
                }}
                className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 flex items-center"
              >
                <span className="mr-3">📘</span>
                Share on Facebook
              </button>
              <button
                onClick={() => {
                  const text = `Check out this amazing ${product.name} - ${formatPrice(product.price)}`
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
                  window.open(url, '_blank')
                  setShowShareModal(false)
                }}
                className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 flex items-center"
              >
                <span className="mr-3">🐦</span>
                Share on Twitter
              </button>
              <button
                onClick={() => {
                  const text = `Check out this amazing ${product.name} - ${formatPrice(product.price)} ${window.location.href}`
                  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
                  window.open(url, '_blank')
                  setShowShareModal(false)
                }}
                className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 flex items-center"
              >
                <span className="mr-3">💬</span>
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}