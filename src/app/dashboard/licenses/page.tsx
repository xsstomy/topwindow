'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Shield,
  Calendar,
  Monitor,
  Copy,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface DeviceInfo {
  device_id: string;
  device_name: string;
  device_type: string;
  activated_at: string;
  last_seen_at: string;
  status: string;
  device_info?: {
    name?: string;
    type?: string;
  };
}

interface License {
  id: string;
  license_key: string;
  status: string;
  activation_limit: number;
  activation_count: number;
  expires_at: string | null;
  created_at: string;
  user_devices: DeviceInfo[];
}

export default function LicensesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchLicenses();
    }
  }, [user, authLoading, router]);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/licenses/my', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.status === 'success') {
        setLicenses(result.licenses || []);
      } else {
        setError(result.message || 'Failed to fetch licenses');
      }
    } catch (err) {
      console.error('Error fetching licenses:', err);
      setError('Failed to load licenses');
    } finally {
      setLoading(false);
    }
  };

  const copyLicenseKey = (licenseKey: string) => {
    navigator.clipboard.writeText(licenseKey);
    setCopiedKey(licenseKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'revoked':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (authLoading) {
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
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-8 h-8 text-primary animate-spin' />
          <span className='ml-2 text-gray-600'>Loading licenses...</span>
        </div>
      ) : error ? (
        <div className='text-center py-12'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
            <p className='text-red-600 mb-4'>{error}</p>
            <button onClick={fetchLicenses} className='btn-primary'>
              Retry
            </button>
          </div>
        </div>
      ) : licenses.length === 0 ? (
        <div className='text-center py-12'>
          <Shield className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            No Licenses
          </h3>
          <p className='text-gray-600 mb-6'>
            You haven't purchased any licenses yet. Purchased licenses will
            appear here.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className='btn-primary'
          >
            Purchase License Now
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Your Licenses ({licenses.length})
            </h3>
            <button
              onClick={fetchLicenses}
              className='text-blue-600 hover:text-blue-700 flex items-center gap-2'
            >
              <RefreshCw className='w-4 h-4' />
              Refresh
            </button>
          </div>

          {licenses.map(license => (
            <div
              key={license.id}
              className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Shield className='w-5 h-5 text-gray-600' />
                    <h4 className='text-lg font-semibold text-gray-900'>
                      License Key
                    </h4>
                  </div>
                  <div className='flex items-center gap-2'>
                    <code className='text-sm font-mono text-gray-700 bg-gray-50 px-3 py-1 rounded'>
                      {license.license_key}
                    </code>
                    <button
                      onClick={() => copyLicenseKey(license.license_key)}
                      className='text-gray-600 hover:text-gray-700'
                      title='Copy license key'
                    >
                      {copiedKey === license.license_key ? (
                        <CheckCircle className='w-5 h-5 text-green-600' />
                      ) : (
                        <Copy className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(license.status)}`}
                >
                  {license.status}
                </span>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4'>
                <div>
                  <span className='text-gray-500'>Created:</span>
                  <span className='ml-2 text-gray-900'>
                    {formatDate(license.created_at)}
                  </span>
                </div>
                <div>
                  <span className='text-gray-500'>Activations:</span>
                  <span className='ml-2 text-gray-900'>
                    {license.activation_count} / {license.activation_limit}
                  </span>
                </div>
                {license.expires_at && (
                  <div>
                    <span className='text-gray-500'>Expires:</span>
                    <span className='ml-2 text-gray-900'>
                      {formatDate(license.expires_at)}
                    </span>
                  </div>
                )}
              </div>

              {license.user_devices.length > 0 && (
                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <h5 className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                    <Monitor className='w-4 h-4' />
                    Activated Devices ({license.user_devices.length})
                  </h5>
                  <div className='space-y-2'>
                    {license.user_devices.map(device => (
                      <div
                        key={device.device_id}
                        className='flex justify-between items-center text-sm bg-gray-50 rounded p-2'
                      >
                        <div>
                          <span className='font-medium text-gray-900'>
                            {device.device_info?.name || device.device_name}
                          </span>
                          <span className='text-gray-500 ml-2'>
                            ({device.device_info?.type || device.device_type})
                          </span>
                        </div>
                        <div className='flex items-center gap-4 text-xs text-gray-500'>
                          <span>
                            Activated: {formatDate(device.activated_at)}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              device.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {device.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
