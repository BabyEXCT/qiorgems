'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { showConfirm, showSuccess } from '@/utils/alerts'

export default function Header() {
  const { data: session } = useSession()
  const { state } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const result = await showConfirm(
      'Sign Out',
      'Are you sure you want to sign out?'
    )
    if (result.isConfirmed) {
      showSuccess('Signed out successfully!')
      setTimeout(() => {
        signOut({ callbackUrl: '/' })
      }, 1000)
    }
  }

  // Hide public navbar on customer pages
  return null
  
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-charcoal-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-charcoal-700 to-charcoal-800 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-2xl font-playfair font-bold text-gradient hover:scale-105 transition-transform duration-200">
                QiorGems
              </span>
            </Link>
          </div>
+          {/* Logo removed as requested */}
+          <div className="flex-shrink-0" aria-hidden="true" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link href="/" className="text-charcoal-700 hover:text-charcoal-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
              Home
            </Link>
            <Link href="/products" className="text-charcoal-700 hover:text-charcoal-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
              Products
            </Link>
            <Link href="/about" className="text-charcoal-700 hover:text-charcoal-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
              About
            </Link>
          </nav>





          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Shopping Cart */}
            <Link href="/cart" className="p-2 text-charcoal-700 hover:text-charcoal-600 transition-colors duration-200 relative">
              <ShoppingBag className="h-5 w-5" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-charcoal-700 to-charcoal-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {session ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-charcoal-700 hover:text-charcoal-600 transition-colors duration-200"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block text-sm font-medium">
                      {session?.user?.username}
                    </span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-charcoal-200">
                      {session?.user?.role === 'SELLER' ? (
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <>
                          <Link
                            href="/account"
                            className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <Link
                            href="/order-history"
                            className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Order History
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth/signin"
                    className="text-charcoal-700 hover:text-charcoal-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-to-r from-charcoal-700 to-charcoal-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-charcoal-800 hover:to-charcoal-900 transition-all duration-200 shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-charcoal-700 hover:text-charcoal-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-charcoal-200 py-4">
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className="text-charcoal-700 hover:text-charcoal-600 hover:bg-charcoal-50 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg mx-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-charcoal-700 hover:text-charcoal-600 hover:bg-charcoal-50 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg mx-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-charcoal-700 hover:text-charcoal-600 hover:bg-charcoal-50 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg mx-3"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}