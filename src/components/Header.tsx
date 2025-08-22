'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  CreditCard,
  Shield,
  ChevronDown
} from 'lucide-react'

interface HeaderProps {
  transparent?: boolean
  sticky?: boolean
  showAuthButtons?: boolean
}

export default function Header({ 
  transparent = false, 
  sticky = true,
  showAuthButtons = true 
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState('')
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hash 变化监听
  useEffect(() => {
    const updateHash = () => {
      const hash = window.location.hash
      setCurrentHash(hash)
    }
    
    // 初始化
    updateHash()
    
    // 监听 hash 变化
    window.addEventListener('hashchange', updateHash)
    
    // 监听路由变化（适配 Next.js）
    const handleRouteChange = () => {
      setTimeout(updateHash, 100) // 延迟一点确保 hash 已更新
    }
    
    // 添加路由变化监听
    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('hashchange', updateHash)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  // 导航菜单项
  const navItems = [
    { href: '/', label: '首页' },
    { href: '/#features', label: '功能特色' },
    { href: '/#pricing', label: '价格' },
    { href: '/#support', label: '支持' },
  ]

  // 用户菜单项
  const userMenuItems = [
    { 
      href: '/dashboard', 
      label: '仪表板', 
      icon: User 
    },
    { 
      href: '/profile', 
      label: '个人设置', 
      icon: Settings 
    },
    { 
      href: '/licenses', 
      label: '我的许可证', 
      icon: Shield 
    },
    { 
      href: '/billing', 
      label: '账单管理', 
      icon: CreditCard 
    },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsUserMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${transparent && !isScrolled 
      ? 'bg-transparent' 
      : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
    }
  `.trim()

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" onClick={() => setCurrentHash('')} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TopWindow</span>
            </Link>
          </motion.div>

          {/* 桌面导航菜单 */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              // 更精确的激活状态判断
              let isActive = false
              if (item.href === '/') {
                // 首页：只有在根路径且没有hash时激活
                isActive = pathname === '/' && !currentHash
              } else if (item.href.startsWith('/#')) {
                // 锚点链接：只有在首页且URL hash匹配时激活
                isActive = pathname === '/' && currentHash === item.href.substring(1)
              } else {
                // 其他页面：精确匹配路径
                isActive = pathname === item.href
              }
              
              
              const handleClick = () => {
                // 对于锚点链接，手动更新hash状态
                if (item.href.startsWith('/#')) {
                  setTimeout(() => {
                    setCurrentHash(item.href.substring(1))
                  }, 100)
                } else if (item.href === '/') {
                  // 对于首页链接，清除hash状态
                  setTimeout(() => {
                    setCurrentHash('')
                  }, 100)
                } else {
                  // 对于其他页面（如支持页面），也清除hash状态
                  setCurrentHash('')
                }
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClick}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors
                    ${isActive 
                      ? 'text-primary' 
                      : 'text-gray-700 hover:text-primary'
                    }
                  `}
                >
                  {item.label}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform origin-left transition-all duration-300 ease-out ${
                      isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          {/* 用户区域 */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              // 已登录用户菜单
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="用户头像"
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* 用户下拉菜单 */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                    >
                      {/* 用户信息 */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.user_metadata?.full_name || '用户'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>

                      {/* 菜单项 */}
                      <div className="py-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          )
                        })}
                      </div>

                      {/* 退出登录 */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          退出登录
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : showAuthButtons ? (
              // 未登录用户按钮
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary text-sm"
                >
                  免费注册
                </Link>
              </div>
            ) : null}

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => {
                  const handleMobileClick = () => {
                    setIsMobileMenuOpen(false)
                    // 对于锚点链接，手动更新hash状态
                    if (item.href.startsWith('/#')) {
                      setTimeout(() => {
                        setCurrentHash(item.href.substring(1))
                      }, 100)
                    } else if (item.href === '/') {
                      // 对于首页链接，清除hash状态
                      setTimeout(() => {
                        setCurrentHash('')
                      }, 100)
                    } else {
                      // 对于其他页面（如支持页面），也清除hash状态
                      setCurrentHash('')
                    }
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleMobileClick}
                      className="text-gray-700 hover:text-primary font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  )
                })}
                
                {!user && showAuthButtons && (
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-primary font-medium transition-colors"
                    >
                      登录
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-primary text-center"
                    >
                      免费注册
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}