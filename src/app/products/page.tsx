'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// import Image from 'next/image' // Removed to use regular img tags for base64 images
import { Search, Filter, Star, ShoppingBag, Heart, Grid, List, Sparkles } from 'lucide-react'
import { formatPrice } from '@/utils/currency'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

interface Category {
  id: string
  name: string
  description: string | null
}

interface Material {
  id: string
  name: string
  description: string | null
}

interface PriceRange {
  min: number
  max: number
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string
  categoryId: string | null
  category: Category | null
  material?: string
  dimensions?: string
  gemstones?: string
  stock: number
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED'
  featured: boolean
  createdAt: string
  updatedAt: string
}

const generatePriceRanges = (min: number, max: number) => {
  const ranges = [
    { label: 'All', min: 0, max: Infinity }
  ]
  
  if (max > 0) {
    const step = Math.ceil((max - min) / 4)
    ranges.push(
      { label: `Under RM${(min + step).toLocaleString()}`, min: 0, max: min + step },
      { label: `RM${(min + step).toLocaleString()} - RM${(min + step * 2).toLocaleString()}`, min: min + step, max: min + step * 2 },
      { label: `RM${(min + step * 2).toLocaleString()} - RM${(min + step * 3).toLocaleString()}`, min: min + step * 2, max: min + step * 3 },
      { label: `Over RM${(min + step * 3).toLocaleString()}`, min: min + step * 3, max: Infinity }
    )
  }
  
  return ranges
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [priceRanges, setPriceRanges] = useState([{ label: 'All', min: 0, max: Infinity }])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState({ label: 'All', min: 0, max: Infinity })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchMaterials()
    fetchPriceRange()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, searchTerm, selectedMaterial, selectedPriceRange])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/public')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials/public')
      if (response.ok) {
        const data = await response.json()
        setMaterials(data)
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error)
    }
  }

  const fetchPriceRange = async () => {
    try {
      const response = await fetch('/api/products/price-range')
      if (response.ok) {
        const data = await response.json()
        const ranges = generatePriceRanges(data.min, data.max)
        setPriceRanges(ranges)
        setSelectedPriceRange(ranges[0])
      }
    } catch (error) {
      console.error('Failed to fetch price range:', error)
    }
  }

  const filterProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
      const matchesMaterial = selectedMaterial === 'All' || (product.material && product.material.toLowerCase().includes(selectedMaterial.toLowerCase()))
      const matchesPrice = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
      
      return matchesSearch && matchesCategory && matchesMaterial && matchesPrice
    })
    
    setFilteredProducts(filtered)
  }



  return (
    <div className="min-h-screen bg-white">
      
      {/* Page Header */}
      <section className="bg-gradient-to-br from-cream-50 to-gold-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gold-100 text-gold-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Luxury Collection
            </div>
            <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-charcoal-900 mb-4">
              Our <span className="text-gradient">Exquisite</span> Collection
            </h1>
            <p className="text-xl text-charcoal-600 max-w-2xl mx-auto">
              Discover our exquisite range of handcrafted jewelry pieces, each designed to celebrate life's special moments
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-500" />
            <input
              type="text"
              placeholder="Search luxury jewelry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="premium-input w-full pl-10 pr-4 py-3 placeholder-charcoal-400"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-3 border border-gold-300 rounded-lg hover:bg-gold-50 lg:hidden transition-colors"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
          
          {/* View Mode Toggle */}
          <div className="flex border border-gold-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-gold-500 text-white' : 'bg-white text-charcoal-600 hover:bg-gold-50'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-gold-500 text-white' : 'bg-white text-charcoal-600 hover:bg-gold-50'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Category Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-gray-700">All</span>
                </label>
                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-gold-600 focus:ring-gold-500"
                    />
                    <span className="ml-2 text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Material</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="material"
                    value="All"
                    checked={selectedMaterial === 'All'}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-gray-700">All</span>
                </label>
                {materials.map(material => (
                  <label key={material.id} className="flex items-center">
                    <input
                      type="radio"
                      name="material"
                      value={material.name}
                      checked={selectedMaterial === material.name}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="text-gold-600 focus:ring-gold-500"
                    />
                    <span className="ml-2 text-gray-700">{material.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range, index) => (
                  <label key={`${range.min}-${range.max}-${index}`} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.label}
                      checked={selectedPriceRange.label === range.label}
                      onChange={() => setSelectedPriceRange(range)}
                      className="text-gold-600 focus:ring-gold-500"
                    />
                    <span className="ml-2 text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading products...' : `Showing ${filteredProducts.length} of ${products.length} products`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map(product => (
                    <ProductListItem key={product.id} product={product} />
                  ))}
                </div>
              )
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('')
                    setSelectedMaterial('All')
                    setSelectedPriceRange(priceRanges[0])
                  }}
                  className="mt-4 text-gold-600 hover:text-gold-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // New if created within 7 days
  const isWishlisted = isInWishlist(product.id)
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images,
      material: product.material || 'Unknown',
      category: product.category?.name || 'Uncategorized'
    })
  }
  
  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images,
        material: product.material || 'Unknown',
        category: product.category?.name || 'Uncategorized'
      })
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
          {product.images ? (
            <img
              src={product.images}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`text-6xl ${product.images ? 'hidden' : ''}`}>💎</div>
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {product.status === 'ACTIVE' && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Available
            </span>
          )}
        </div>
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors ${
            isWishlisted ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <p className="text-gray-500 text-xs mb-3">{product.material}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
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
            <span className="text-sm text-gray-500 ml-1">(4.5)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 text-white py-2 px-4 rounded-md hover:from-gold-600 hover:to-gold-700 transition-all duration-200 flex items-center justify-center shadow-lg"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
          <Link
            href={`/products/${product.id}`}
            className="px-4 py-2 border border-gold-300 text-charcoal-700 rounded-md hover:bg-gold-50 transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProductListItem({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // New if created within 7 days
  const isWishlisted = isInWishlist(product.id)
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images,
      material: product.material || 'Unknown',
      category: product.category?.name || 'Uncategorized'
    })
  }
  
  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images,
        material: product.material || 'Unknown',
        category: product.category?.name || 'Uncategorized'
      })
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex gap-6 hover:shadow-lg transition-shadow">
      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {product.images ? (
          <img
            src={product.images}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={`text-4xl ${product.images ? 'hidden' : ''}`}>💎</div>
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-500 text-sm">{product.material}</p>
          </div>
          <div className="flex gap-1">
            {isNew && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                New
              </span>
            )}
            {product.status === 'ACTIVE' && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Available
              </span>
            )}
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
            <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleWishlistToggle}
              className={`p-2 border border-gold-300 rounded-md hover:bg-gold-50 transition-colors ${
                isWishlisted ? 'text-red-500 border-red-300' : 'text-charcoal-700'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button onClick={handleAddToCart} className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-2 px-6 rounded-md hover:from-gold-600 hover:to-gold-700 transition-all duration-200 flex items-center shadow-lg">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </button>
            <Link
              href={`/products/${product.id}`}
              className="px-6 py-2 border border-gold-300 text-charcoal-700 rounded-md hover:bg-gold-50 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}