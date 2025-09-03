import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

interface License {
  id: string;
  license_key: string;
  status: string;
  activation_limit: number;
  activation_count: number;
  expires_at: string | null;
  created_at: string;
  user_devices: any[];
}

interface DashboardData {
  licenses: License[];
  licenseCount: number;
  activeDevicesCount: number;
  loading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/licenses/my', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (result.status === 'success') {
          const userLicenses = result.licenses || [];
          setLicenses(userLicenses);
        } else {
          setError(result.message || 'Failed to fetch licenses');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const licenseCount = licenses.length;
  const activeDevicesCount = licenses.reduce((total, license) => {
    return total + (license.user_devices?.length || 0);
  }, 0);

  return {
    licenses,
    licenseCount,
    activeDevicesCount,
    loading,
    error,
  };
}
