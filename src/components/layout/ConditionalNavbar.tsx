'use client'

import { usePathname } from 'next/navigation'
import CustomerNavbar from './CustomerNavbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Don't show customer navbar on seller dashboard pages
  const isSellerPage = pathname.startsWith('/dashboard') || pathname.startsWith('/seller')
  
  // Don't show navbar on auth pages for cleaner experience
  const isAuthPage = pathname.startsWith('/auth')
  
  if (isSellerPage || isAuthPage) {
    return null
  }
  
  return <CustomerNavbar />
}