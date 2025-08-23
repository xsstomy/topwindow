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
  Monitor,
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

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hash change listener
  useEffect(() => {
    const updateHash = () => {
      const hash = window.location.hash
      setCurrentHash(hash)
    }
    
    // Initialize
    updateHash()
    
    // Listen for hash changes
    window.addEventListener('hashchange', updateHash)
    
    // Listen for route changes (Next.js compatibility)
    const handleRouteChange = () => {
      setTimeout(updateHash, 100) // Delay to ensure hash is updated
    }
    
    // Add route change listener
    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('hashchange', updateHash)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  // Navigation menu items
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#support', label: 'Support' },
  ]

  // User menu items
  const userMenuItems = [
    {
      href: '/dashboard',
      label: '仪表板总览',
      icon: User
    },
    {
      href: '/dashboard/profile',
      label: '个人资料设置',
      icon: Settings
    },
    {
      href: '/dashboard/licenses',
      label: '许可证管理',
      icon: Shield
    },
    {
      href: '/dashboard/devices',
      label: '设备管理',
      icon: Monitor
    },
    {
      href: '/dashboard/billing',
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
      console.error('Logout failed:', error)
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

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              // More precise active state determination
              let isActive = false
              if (item.href === '/') {
                // Home: only active when on root path with no hash
                isActive = pathname === '/' && !currentHash
              } else if (item.href.startsWith('/#')) {
                // Anchor links: only active when on home page and URL hash matches
                isActive = pathname === '/' && currentHash === item.href.substring(1)
              } else {
                // Other pages: exact path matching
                isActive = pathname === item.href
              }
              
              
              const handleClick = () => {
                // For anchor links, manually update hash state
                if (item.href.startsWith('/#')) {
                  setTimeout(() => {
                    setCurrentHash(item.href.substring(1))
                  }, 100)
                } else if (item.href === '/') {
                  // For home link, clear hash state
                  setTimeout(() => {
                    setCurrentHash('')
                  }, 100)
                } else {
                  // For other pages (like support page), also clear hash state
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

          {/* User Area */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              // Logged-in user menu
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="User Avatar"
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

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                    >
                      {/* User Information */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>

                      {/* Menu Items */}
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

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : showAuthButtons ? (
              // Not logged-in user buttons
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary text-sm"
                >
                  Free Sign Up
                </Link>
              </div>
            ) : null}

            {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
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
                    // For anchor links, manually update hash state
                    if (item.href.startsWith('/#')) {
                      setTimeout(() => {
                        setCurrentHash(item.href.substring(1))
                      }, 100)
                    } else if (item.href === '/') {
                      // For home link, clear hash state
                      setTimeout(() => {
                        setCurrentHash('')
                      }, 100)
                    } else {
                      // For other pages (like support page), also clear hash state
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
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-primary text-center"
                    >
                      Free Sign Up
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