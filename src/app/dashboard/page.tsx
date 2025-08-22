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
      console.error('Sign out failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to TopWindow!
              </h2>
              <p className="text-gray-600 mb-6">
                You have successfully signed in. This is your personal dashboard.
              </p>
              
              <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                <div className="space-y-2 text-left">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Registered:</strong> {new Date(user.created_at).toLocaleString('en-US')}</p>
                  <p><strong>Auth Provider:</strong> {user.app_metadata?.provider || 'email'}</p>
                  {user.user_metadata?.full_name && (
                    <p><strong>Name:</strong> {user.user_metadata.full_name}</p>
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