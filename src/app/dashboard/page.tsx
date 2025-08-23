'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function DashboardPage() {
  const { user, loading } = useAuth()
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

  return (
    <DashboardLayout
      title="仪表板总览"
      description="欢迎来到您的 TopWindow 控制中心"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">用户信息</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">邮箱地址</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">用户ID</p>
              <p className="font-medium text-gray-900">{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">注册时间</p>
              <p className="font-medium text-gray-900">
                {new Date(user.created_at).toLocaleString('zh-CN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">认证方式</p>
              <p className="font-medium text-gray-900">
                {user.app_metadata?.provider || '邮箱认证'}
              </p>
            </div>
            {user.user_metadata?.full_name && (
              <div>
                <p className="text-sm text-gray-600">姓名</p>
                <p className="font-medium text-gray-900">{user.user_metadata.full_name}</p>
              </div>
            )}
          </div>
        </div>

        {/* 快速操作卡片 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary">
              购买许可证
            </button>
            <button className="w-full btn-secondary">
              查看文档
            </button>
            <button className="w-full btn-outline">
              联系支持
            </button>
          </div>
        </div>

        {/* 状态概览卡片 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">账户状态</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">许可证数量</span>
              <span className="font-semibold text-gray-900">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">激活设备</span>
              <span className="font-semibold text-gray-900">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">账户状态</span>
              <span className="font-semibold text-green-600">活跃</span>
            </div>
          </div>
        </div>
      </div>

      {/* 欢迎信息 */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          欢迎使用 TopWindow!
        </h2>
        <p className="text-gray-600">
          您已成功登录。这是您的个人仪表板，在这里您可以管理许可证、设备和个人设置。
        </p>
      </div>
    </DashboardLayout>
  )
}