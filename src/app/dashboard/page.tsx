'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                欢迎来到 TopWindow！
              </h2>
              <p className="text-gray-600 mb-6">
                您已成功登录。这里是您的个人仪表板。
              </p>
              
              <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">用户信息</h3>
                <div className="space-y-2 text-left">
                  <p><strong>邮箱：</strong> {user.email}</p>
                  <p><strong>用户 ID：</strong> {user.id}</p>
                  <p><strong>注册时间：</strong> {new Date(user.created_at).toLocaleString('zh-CN')}</p>
                  <p><strong>认证提供商：</strong> {user.app_metadata?.provider || 'email'}</p>
                  {user.user_metadata?.full_name && (
                    <p><strong>姓名：</strong> {user.user_metadata.full_name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}