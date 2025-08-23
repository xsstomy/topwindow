'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Shield, Calendar, Monitor } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function LicensesPage() {
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
      title="许可证管理"
      description="管理您的 TopWindow 许可证和设备"
    >
      {/* 暂无许可证状态 */}
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无许可证</h3>
        <p className="text-gray-600 mb-6">
          您还没有购买任何许可证，购买后将在这里显示。
        </p>
        <button className="btn-primary">
          立即购买许可证
        </button>
      </div>
    </DashboardLayout>
  )
}