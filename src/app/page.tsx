'use client'

import Link from 'next/link'
import { Star, Heart, ShoppingCart, ArrowRight, Sparkles, Crown, Shield, Truck, Award } from 'lucide-react'
import { formatPrice } from '@/utils/currency'
import { useEffect, useState } from 'react'
import { showSuccess, showError, showToast } from '@/utils/alerts'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string
  stock: number
  status: string
  featured: boolean
  category?: {
    id: string
    name: string
  }
  materialRef?: {
    id: string
    name: string
  }
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured')
        if (response.ok) {
          const products = await response.json()
          setFeaturedProducts(products)
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newsletterEmail.trim()) {
      showError('Invalid Email', 'Please enter a valid email address.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newsletterEmail)) {
      showError('Invalid Email', 'Please enter a valid email address.')
      return
    }

    setIsSubscribing(true)

    // Simulate newsletter subscription
    setTimeout(() => {
      showSuccess(
        'Successfully Subscribed!',
        'Thank you for subscribing to our newsletter. You\'ll receive exclusive offers and updates.'
      )
      setNewsletterEmail('')
      setIsSubscribing(false)
    }, 1500)
  }
  return (
    <div className="min-h-screen" style={{backgroundColor: 'white'}}>
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{background: 'linear-gradient(to bottom right, var(--color-cream-50), var(--color-gold-100), var(--color-cream-100))'}}>
        <div className="absolute inset-0 bg-[url('/image-2.png')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium" style={{backgroundColor: 'var(--color-gold-100)', color: 'var(--color-gold-800)'}}>
                <Sparkles className="h-4 w-4 mr-2" />
                Luxury Jewelry Collection
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{fontFamily: 'var(--font-family-playfair)', color: 'var(--color-charcoal-900)'}}>
                Exquisite
                <span className="block text-gradient">
                  Jewelry
                </span>
                <span className="text-4xl md:text-5xl">Craftsmanship</span>
              </h1>
              <p className="text-xl leading-relaxed" style={{color: 'var(--color-charcoal-600)'}}>
                Discover our handcrafted jewelry pieces that blend timeless elegance with modern sophistication. Each piece tells a unique story of luxury and artistry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="btn-primary flex items-center justify-center group"
                >
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="btn-secondary flex items-center justify-center"
                >
                  Our Story
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5" style={{color: 'var(--color-gold-600)'}} />
                  <span className="text-sm" style={{color: 'var(--color-charcoal-600)'}}>Award Winning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" style={{color: 'var(--color-gold-600)'}} />
                  <span className="text-sm" style={{color: 'var(--color-charcoal-600)'}}>Lifetime Warranty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-current" style={{color: 'var(--color-gold-600)'}} />
                  <span className="text-sm" style={{color: 'var(--color-charcoal-600)'}}>5-Star Rated</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gold-100 to-cream-200 rounded-3xl overflow-hidden premium-shadow">
                <img
                  src="/image-2.png"
                  alt="Featured Luxury Jewelry"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gold-200">
                <div className="text-center">
                  <Star className="h-8 w-8 text-gold-500 fill-current mx-auto mb-2" />
                  <div className="text-2xl font-bold text-charcoal-900">4.9</div>
                  <div className="text-sm text-charcoal-600">Customer Rating</div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gold-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-600">10K+</div>
                  <div className="text-sm text-charcoal-600">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-charcoal-100 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-charcoal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-gray-600">Complimentary shipping on all orders over $200</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-charcoal-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-charcoal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Lifetime Warranty</h3>
              <p className="text-gray-600">Comprehensive coverage for all our jewelry pieces</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-charcoal-100 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-charcoal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Certified Quality</h3>
              <p className="text-gray-600">All diamonds and gemstones are certified authentic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-white to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-charcoal-100 text-charcoal-800 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Curated Selection
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal-900 mb-6">
              Featured <span className="text-gradient">Collection</span>
            </h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
              Handpicked pieces that showcase our finest craftsmanship and design excellence, each telling a story of luxury and sophistication
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="card-premium relative overflow-hidden mb-6 p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="card-premium relative overflow-hidden mb-6 p-4">
                    <div className="aspect-square bg-gradient-to-br from-cream-100 to-cream-200 rounded-xl overflow-hidden mb-4">
                      <img
                        src={product.images || '/api/placeholder/300/300'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="absolute top-6 left-6">
                      <span className="bg-gradient-to-r from-charcoal-700 to-charcoal-800 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        {product.category?.name || 'Featured'}
                      </span>
                    </div>
                    
                    <div className="absolute top-6 right-6">
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          const isWishlisted = isInWishlist(product.id)
                          if (isWishlisted) {
                            removeFromWishlist(product.id)
                          } else {
                            addToWishlist({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.images || '/api/placeholder/300/300',
                              material: product.materialRef?.name || 'Unknown',
                              category: product.category?.name || 'Jewelry'
                            })
                          }
                        }}
                        className={`glass-effect p-2 rounded-full hover:bg-white/90 transition-all duration-200 group/heart ${
                          isInWishlist(product.id) ? 'bg-red-50 border-red-200' : ''
                        }`}
                      >
                        <Heart className={`h-5 w-5 transition-colors ${
                          isInWishlist(product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-charcoal-600 group-hover/heart:text-charcoal-700'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.images || '/api/placeholder/300/300',
                            material: product.materialRef?.name || 'Unknown',
                            category: product.category?.name || 'Jewelry'
                          })
                        }}
                        className="bg-gradient-to-r from-charcoal-700 to-charcoal-800 text-white p-3 rounded-full hover:from-charcoal-800 hover:to-charcoal-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-playfair font-semibold text-lg text-charcoal-900 group-hover:text-charcoal-700 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-charcoal-500 fill-current" />
                          <span className="text-sm text-charcoal-600 ml-1 font-medium">4.8</span>
                        </div>
                        <span className="text-sm text-charcoal-400">(Stock: {product.stock})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-charcoal-900">{formatPrice(product.price)}</span>
                        {product.materialRef && (
                          <span className="text-sm text-charcoal-500">{product.materialRef.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No featured products message
              <div className="col-span-full text-center py-12">
                <div className="text-charcoal-400 text-lg">
                  No featured products available at the moment.
                </div>
                <Link
                  href="/products"
                  className="btn-primary inline-flex items-center mt-4 group"
                >
                  Browse All Products
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
          
          {/* View All Products Button */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center group"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-charcoal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-charcoal-100 mb-8">
            Subscribe to our newsletter for exclusive offers and new collection updates
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isSubscribing}
              className="flex-1 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-charcoal-600 bg-white text-charcoal-900 placeholder-charcoal-400 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isSubscribing}
              className="px-8 py-3 bg-white text-charcoal-600 font-semibold rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
