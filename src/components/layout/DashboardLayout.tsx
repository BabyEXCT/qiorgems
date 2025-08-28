'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  FolderOpen,
  Gem,
  Bell
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: Package
  },
  {
    name: 'Categories',
    href: '/dashboard/categories',
    icon: FolderOpen
  },
  {
    name: 'Materials',
    href: '/dashboard/materials',
    icon: Gem
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingBag
  },
  {
    name: 'Vouchers',
    href: '/dashboard/vouchers',
    icon: Ticket
  }
]

interface OrdersSummary {
  totalOrders: number
  pendingCount: number
  todayNewOrders: number
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [summary, setSummary] = useState<OrdersSummary | null>(null)
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  // Poll orders summary for notifications (seller only)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/dashboard/orders?summary=true', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (data?.summary) {
          setSummary(data.summary as OrdersSummary)
        }
      } catch (e) {
        // ignore
      }
    }

    if (session?.user?.role === 'SELLER') {
      fetchSummary()
      timer = setInterval(fetchSummary, 15000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [session?.user?.role])

  const newOrdersBadge = summary?.todayNewOrders && summary.todayNewOrders > 0

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-rose-600">QioGems</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
          </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-rose-100 text-rose-700 border-r-2 border-rose-600' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-rose-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-rose-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{session?.user?.username}</p>
              <p className="text-xs text-gray-500">Seller Account</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navbar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-2">
              {/* Sidebar toggle on mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              {/* Logo removed from top navigation */}
            </div>
            <div className="flex items-center gap-2">
              {session?.user?.role === 'SELLER' && (
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen((v) => !v)}
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {newOrdersBadge && (
                      <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center font-medium shadow">
                        {summary!.todayNewOrders}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Notifications</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">New orders today</span>
                            <span className="font-medium text-gray-900">{summary?.todayNewOrders ?? 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Pending orders</span>
                            <span className="font-medium text-gray-900">{summary?.pendingCount ?? 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total orders</span>
                            <span className="font-medium text-gray-900">{summary?.totalOrders ?? 0}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            href="/dashboard/orders"
                            className="inline-flex items-center justify-center w-full bg-rose-600 text-white px-3 py-2 rounded-md hover:bg-rose-700 transition-colors text-sm"
                            onClick={() => setNotifOpen(false)}
                          >
                            View Orders
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}