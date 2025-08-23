'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Monitor, Cpu, HardDrive, Network } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function DevicesPage() {
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
      title="设备管理"
      description="查看和管理激活的设备"
    >
      {/* 暂无设备状态 */}
      <div className="text-center py-12">
        <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无激活设备</h3>
        <p className="text-gray-600 mb-6">
          您还没有在任何设备上激活许可证，激活后的设备将在这里显示。
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto text-left">
          <h4 className="font-semibold text-gray-900 mb-4">如何激活设备？</h4>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>1. 下载并安装 TopWindow 应用程序</li>
            <li>2. 打开应用程序并登录您的账户</li>
            <li>3. 输入您的许可证密钥进行激活</li>
            <li>4. 激活的设备将自动显示在这里</li>
          </ol>
        </div>
      </div>

      {/* 设备信息说明 */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-4">设备信息说明</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>设备型号和处理器信息</span>
          </div>
          <div className="flex items-center space-x-3">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <span>存储和内存配置</span>
          </div>
          <div className="flex items-center space-x-3">
            <Network className="w-5 h-5 text-blue-600" />
            <span>网络和连接状态</span>
          </div>
          <div className="flex items-center space-x-3">
            <Monitor className="w-5 h-5 text-blue-600" />
            <span>最后活跃时间和状态</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}