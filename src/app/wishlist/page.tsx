'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, Star } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/utils/currency'
import { showSuccess } from '@/utils/alerts'

export default function WishlistPage() {
  const { state, removeItem, clearWishlist } = useWishlist()
  const items = state.items
  const { addItem } = useCart()

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      material: item.material,
      category: item.category
    })
    showSuccess('Item added to cart!')
  }

  const handleRemoveFromWishlist = (itemId: string) => {
    removeItem(itemId)
    showSuccess('Item removed from wishlist!')
  }

  const handleClearWishlist = () => {
    clearWishlist()
    showSuccess('Wishlist cleared!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-gold-50">
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-charcoal-900 mb-2">My Wishlist</h1>
              <p className="text-charcoal-600">
                {items.length === 0 ? 'Your wishlist is empty' : `${items.length} item${items.length > 1 ? 's' : ''} in your wishlist`}
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={handleClearWishlist}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Wishlist Items */}
          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-24 w-24 text-charcoal-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-charcoal-700 mb-4">Your wishlist is empty</h2>
              <p className="text-charcoal-500 mb-8 max-w-md mx-auto">
                Start adding items to your wishlist by clicking the heart icon on products you love.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all duration-200 shadow-lg"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex gap-6 hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                    <div className={`text-4xl ${item.image ? 'hidden' : ''}`}>💎</div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-500 text-sm">{item.material}</p>
                        <p className="text-gray-500 text-sm">{item.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < 4 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">(4.5 reviews)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(item.price)}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="p-2 text-red-500 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-2 px-6 rounded-md hover:from-gold-600 hover:to-gold-700 transition-all duration-200 flex items-center shadow-lg"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Cart
                        </button>
                        <Link
                          href={`/products/${item.id}`}
                          className="px-6 py-2 border border-gold-300 text-charcoal-700 rounded-md hover:bg-gold-50 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}