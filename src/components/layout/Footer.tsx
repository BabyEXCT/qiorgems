'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { useState } from 'react'
import { showSuccess, showError } from '@/utils/alerts'

export default function Footer() {
  const [footerEmail, setFooterEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleFooterNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!footerEmail.trim()) {
      showError('Invalid Email', 'Please enter a valid email address.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(footerEmail)) {
      showError('Invalid Email', 'Please enter a valid email address.')
      return
    }

    setIsSubscribing(true)

    // Simulate newsletter subscription
    setTimeout(() => {
      showSuccess(
        'Successfully Subscribed!',
        'Thank you for subscribing to our newsletter!'
      )
      setFooterEmail('')
      setIsSubscribing(false)
    }, 1500)
  }

  return (
    <footer className="bg-charcoal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-charcoal-700 to-charcoal-800 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-charcoal-300 to-charcoal-400 bg-clip-text text-transparent">
                QiorGems
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover exquisite jewelry pieces crafted with precision and passion. 
              From timeless classics to contemporary designs, we bring you the finest 
              collection of diamonds, gemstones, and precious metals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-charcoal-300 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-charcoal-300 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-charcoal-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-charcoal-300 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-charcoal-300 transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-charcoal-300 transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-charcoal-300 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-charcoal-300 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>



          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-charcoal-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Jewelry Street<br />
                  Diamond District, NY 10001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-charcoal-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-charcoal-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  info@qiogems.com
                </span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
              <form onSubmit={handleFooterNewsletterSubmit} className="flex">
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  disabled={isSubscribing}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-charcoal-500 focus:border-transparent text-sm text-white placeholder-gray-400 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-4 py-2 bg-charcoal-600 text-white rounded-r-md hover:bg-charcoal-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 databeta technology. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">We Accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
                  AMEX
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}