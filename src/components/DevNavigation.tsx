// 开发环境导航栏 - 仅在开发模式显示
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TestTube, Home, User, Key } from 'lucide-react'

export default function DevNavigation() {
  const pathname = usePathname()

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const navItems = [
    { href: '/', label: '主页', icon: Home },
    { href: '/dashboard', label: '仪表板', icon: User },
    { href: '/test-license', label: 'License 测试', icon: TestTube },
  ]

  return (
    <div className="bg-gray-900 text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Key className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">开发模式</span>
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