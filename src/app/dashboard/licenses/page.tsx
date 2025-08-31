'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Shield, Calendar, Monitor } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function LicensesPage() {
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
      title='License Management'
      description='Manage your TopWindow licenses and devices'
    >
      {/* No license status */}
      <div className='text-center py-12'>
        <Shield className='w-16 h-16 text-gray-300 mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          No Licenses
        </h3>
        <p className='text-gray-600 mb-6'>
          You haven't purchased any licenses yet. Purchased licenses will appear
          here.
        </p>
        <button className='btn-primary'>Purchase License Now</button>
      </div>
    </DashboardLayout>
  );
}
