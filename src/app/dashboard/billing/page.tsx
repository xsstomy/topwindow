'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CreditCard, Receipt, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function BillingPage() {
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
      title='Billing Management'
      description='View your purchase history and billing information'
    >
      {/* No billing status */}
      <div className='text-center py-12'>
        <Receipt className='w-16 h-16 text-gray-300 mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          No Billing Records
        </h3>
        <p className='text-gray-600 mb-6'>
          You don't have any purchase records yet. Bills from purchases will
          appear here.
        </p>
        <button className='btn-primary'>View Products</button>
      </div>
    </DashboardLayout>
  );
}
