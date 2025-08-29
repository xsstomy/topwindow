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
      title="Device Management"
      description="View and manage activated devices"
    >
      {/* 暂无设备状态 */}
      <div className="text-center py-12">
        <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activated Devices</h3>
        <p className="text-gray-600 mb-6">
          You haven't activated licenses on any devices yet. Activated devices will appear here.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto text-left">
          <h4 className="font-semibold text-gray-900 mb-4">How to activate devices?</h4>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>1. Download and install the TopWindow application</li>
            <li>2. Open the application and log in to your account</li>
            <li>3. Enter your license key to activate</li>
            <li>4. Activated devices will automatically appear here</li>
          </ol>
        </div>
      </div>

      {/* 设备信息说明 */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-4">Device Information Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>Device model and processor information</span>
          </div>
          <div className="flex items-center space-x-3">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <span>Storage and memory configuration</span>
          </div>
          <div className="flex items-center space-x-3">
            <Network className="w-5 h-5 text-blue-600" />
            <span>Network and connection status</span>
          </div>
          <div className="flex items-center space-x-3">
            <Monitor className="w-5 h-5 text-blue-600" />
            <span>Last active time and status</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}