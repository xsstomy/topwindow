'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  Key, 
  Monitor, 
  User, 
  CreditCard, 
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

const navigationItems = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: Home,
    description: 'Account overview and quick actions'
  },
  {
    href: '/dashboard/licenses',
    label: 'Licenses',
    icon: Key,
    description: 'Manage your software licenses'
  },
  {
    href: '/dashboard/devices',
    label: 'Devices',
    icon: Monitor,
    description: 'View and manage activated devices'
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: User,
    description: 'Edit your account information'
  },
  {
    href: '/dashboard/billing',
    label: 'Billing',
    icon: CreditCard,
    description: 'View payment history and invoices'
  }
]

export default function DashboardLayout({ 
  children, 
  title,
  description 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      // Clear client session quickly; timebox to avoid hangs
      await Promise.race([
        signOut(),
        new Promise(resolve => setTimeout(resolve, 800)),
      ])
    } catch (e) {
      // ignore
    } finally {
      window.location.href = '/auth/logout'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto lg:w-64 lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">TopWindow</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 truncate max-w-[120px]">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 lg:hidden bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {title || 'Dashboard'}
            </h1>
            <div className="w-6" /> {/* Spacer for balance */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Page header */}
            {(title || description) && (
              <div className="mb-8">
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                )}
                {description && (
                  <p className="mt-2 text-gray-600">{description}</p>
                )}
              </div>
            )}

            {/* Page content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
