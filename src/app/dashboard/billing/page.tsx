'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CreditCard, Receipt, Calendar } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function BillingPage() {
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
      title="账单管理"
      description="查看您的购买历史和账单信息"
    >
      {/* 暂无账单状态 */}
      <div className="text-center py-12">
        <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无账单记录</h3>
        <p className="text-gray-600 mb-6">
          您还没有任何购买记录，购买后的账单将在这里显示。
        </p>
        <button className="btn-primary">
          查看产品
        </button>
      </div>
    </DashboardLayout>
  )
}