'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ErrorMessage from './ErrorMessage'
import SuccessMessage from './SuccessMessage'

interface AuthFormProps {
  mode: 'login' | 'register'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const { signIn, signUp, signInWithGoogle, user, loading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cooldownTime, setCooldownTime] = useState(0)
  const [lastAttemptTime, setLastAttemptTime] = useState(0)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  })

  const isLogin = mode === 'login'

  // 如果用户已登录，显示登录成功状态
  useEffect(() => {
    if (user && isLogin) {
      console.log('用户已登录，显示成功状态')
      setSuccess('登录成功！正在跳转...')
      setLoading(false)
      setGoogleLoading(false)
    }
  }, [user, isLogin])

  // 检查 URL 参数中的错误信息
  useEffect(() => {
    const errorParam = searchParams?.get('error')
    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_error':
          setError('认证失败，请重试')
          break
        default:
          setError(decodeURIComponent(errorParam))
      }
    }
  }, [searchParams])

  // 冷却时间倒计时
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownTime])

  // 检查操作冷却
  const checkCooldown = () => {
    const now = Date.now()
    const timeSinceLastAttempt = now - lastAttemptTime
    const requiredCooldown = 3000 // 3秒冷却

    if (timeSinceLastAttempt < requiredCooldown) {
      const remainingTime = Math.ceil((requiredCooldown - timeSinceLastAttempt) / 1000)
      setCooldownTime(remainingTime)
      setError(`请等待 ${remainingTime} 秒后再试`)
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || googleLoading || cooldownTime > 0) return

    // 检查冷却时间
    if (!checkCooldown()) return

    setLoading(true)
    setError('')
    setSuccess('')
    setLastAttemptTime(Date.now())

    try {
      if (isLogin) {
        console.log('开始登录:', formData.email)
        await signIn(formData.email, formData.password)
        console.log('登录请求完成')
      } else {
        if (!formData.fullName.trim()) {
          throw new Error('请输入姓名')
        }
        await signUp(formData.email, formData.password, formData.fullName)
        setSuccess('注册成功！请检查您的邮箱并点击验证链接')
      }
    } catch (err: any) {
      console.error('认证错误:', err)
      setError(err.message || '操作失败，请重试')
      setLoading(false)
      
      // 如果是频率限制错误，设置更长的冷却时间
      if (err.message.includes('请等待')) {
        const waitMatch = err.message.match(/(\d+) 秒/)
        if (waitMatch) {
          setCooldownTime(parseInt(waitMatch[1]))
        }
      }
    } finally {
      // 登录成功时不设置 loading 为 false，让用户看到"正在跳转"状态
      // 只有在出现错误或注册时才设置 loading 为 false
      if (!isLogin) {
        setLoading(false)
      }
    }
  }

  const handleGoogleLogin = async () => {
    if (loading || googleLoading || cooldownTime > 0) return
    
    // 检查冷却时间
    if (!checkCooldown()) return
    
    setGoogleLoading(true)
    setError('')
    setSuccess('')
    setLastAttemptTime(Date.now())

    try {
      await signInWithGoogle()
    } catch (err: any) {
      console.error('Google 登录错误:', err)
      setError(err.message || 'Google 登录失败，请重试')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // 如果正在认证状态检查中，显示加载
  if (authLoading) {
    return (
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">检查登录状态...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isLogin ? '登录 TopWindow' : '注册 TopWindow'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isLogin ? '欢迎回来！请登录您的账户' : '创建您的 TopWindow 账户'}
        </p>
      </div>

      {error && (
        <ErrorMessage 
          error={error} 
          onDismiss={() => setError('')}
          showHelp={true}
        />
      )}

      {success && (
        <SuccessMessage 
          message={success} 
          onDismiss={() => setSuccess('')}
          showNextSteps={true}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              姓名
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required={!isLogin}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入您的姓名"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            邮箱地址
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="请输入您的邮箱"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            密码
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={isLogin ? '请输入密码' : '请设置密码（至少6位）'}
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading || cooldownTime > 0}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {isLogin ? '登录中...' : '注册中...'}
            </div>
          ) : cooldownTime > 0 ? (
            `请等待 ${cooldownTime} 秒`
          ) : (
            isLogin ? '登录' : '注册'
          )}
        </button>
      </form>

      {/* 分隔线 */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">或使用</span>
        </div>
      </div>

      {/* Google 登录按钮 */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading || googleLoading || cooldownTime > 0}
        className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
            Google 登录中...
          </div>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            使用 Google 账户{isLogin ? '登录' : '注册'}
          </>
        )}
      </button>

      {/* 底部链接 */}
      <div className="mt-6 text-center">
        {isLogin ? (
          <p className="text-sm text-gray-600">
            还没有账户？{' '}
            <Link href="/auth/register" className="text-primary hover:text-primary-dark font-medium">
              立即注册
            </Link>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            已有账户？{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium">
              立即登录
            </Link>
          </p>
        )}
      </div>

      {!isLogin && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          注册即表示您同意我们的{' '}
          <a href="#" className="text-primary hover:text-primary-dark">服务条款</a>{' '}
          和{' '}
          <a href="#" className="text-primary hover:text-primary-dark">隐私政策</a>
        </div>
      )}
    </div>
  )
}