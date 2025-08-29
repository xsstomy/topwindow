'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function ProfilePage() {
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
      title="Profile Settings"
      description="Manage your account information and preferences"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Basic Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
              {user.email}
            </p>
          </div>
          
          {user.user_metadata?.full_name && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {user.user_metadata.full_name}
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Date
            </label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
              {new Date(user.created_at).toLocaleString('en-US')}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}