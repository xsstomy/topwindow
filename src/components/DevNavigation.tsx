// Development environment navigation bar - only shown in dev mode
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TestTube, Home, User, Key } from 'lucide-react'

export default function DevNavigation() {
  const pathname = usePathname()

  // Only show in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: User },
    { href: '/test-license', label: 'License Test', icon: TestTube },
  ]

  return (
    <div className="bg-gray-900 text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Key className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">Dev Mode</span>
        </div>
        
        <nav className="flex items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="text-xs text-gray-400">
          TopWindow Dev Tools
        </div>
      </div>
    </div>
  )
}