'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout
      title='Dashboard Overview'
      description='Welcome to your TopWindow control center'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* User Information Card */}
        <div className='bg-white rounded-xl shadow-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            User Information
          </h3>
          <div className='space-y-3'>
            <div>
              <p className='text-sm text-gray-600'>Email Address</p>
              <p className='font-medium text-gray-900'>{user.email}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>User ID</p>
              <p className='font-medium text-gray-900'>{user.id}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Registration Date</p>
              <p className='font-medium text-gray-900'>
                {new Date(user.created_at).toLocaleString('en-US')}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Authentication Method</p>
              <p className='font-medium text-gray-900'>
                {user.app_metadata?.provider || 'Email Authentication'}
              </p>
            </div>
            {user.user_metadata?.full_name && (
              <div>
                <p className='text-sm text-gray-600'>Full Name</p>
                <p className='font-medium text-gray-900'>
                  {user.user_metadata.full_name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className='bg-white rounded-xl shadow-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Quick Actions
          </h3>
          <div className='space-y-3'>
            <button className='w-full btn-primary'>Purchase License</button>
            <button className='w-full btn-secondary'>View Documentation</button>
            <button className='w-full btn-outline'>Contact Support</button>
          </div>
        </div>

        {/* Account Status Card */}
        <div className='bg-white rounded-xl shadow-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Account Status
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>License Count</span>
              <span className='font-semibold text-gray-900'>0</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Active Devices</span>
              <span className='font-semibold text-gray-900'>0</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Account Status</span>
              <span className='font-semibold text-green-600'>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Information */}
      <div className='mt-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>
          Welcome to TopWindow!
        </h2>
        <p className='text-gray-600'>
          You have successfully logged in. This is your personal dashboard where
          you can manage licenses, devices, and personal settings.
        </p>
      </div>
    </DashboardLayout>
  );
}
