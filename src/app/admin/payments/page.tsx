'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Loader2,
  Eye,
  PlayCircle,
} from 'lucide-react';

interface Payment {
  id: string;
  user_id: string | null;
  payment_provider: string;
  provider_session_id: string | null;
  provider_payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  customer_info: {
    email: string;
    name?: string;
  };
  product_info: {
    name: string;
    product_id: string;
  };
  created_at: string;
  completed_at: string | null;
  webhook_received_at: string | null;
}

interface License {
  id: string;
  payment_id: string;
  license_key: string;
  status: string;
  created_at: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [licenseInfo, setLicenseInfo] = useState<License | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/payments/pending');
      const data = await response.json();

      if (data.status === 'success') {
        setPayments(data.data || []);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch payments' });
    } finally {
      setLoading(false);
    }
  };

  const fetchLicenseInfo = async (paymentId: string) => {
    try {
      const response = await fetch(
        `/api/admin/licenses?payment_id=${paymentId}`
      );
      const data = await response.json();

      if (data.status === 'success' && data.data) {
        setLicenseInfo(data.data);
      } else {
        setLicenseInfo(null);
      }
    } catch (error) {
      console.error('Failed to fetch license info:', error);
      setLicenseInfo(null);
    }
  };

  const handleProcessPayment = async (payment: Payment) => {
    if (
      !confirm(
        `Process payment ${payment.id} for ${payment.customer_info.email}?`
      )
    ) {
      return;
    }

    setProcessing(payment.id);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: payment.id,
          action: 'complete',
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage({
          type: 'success',
          text: `Payment processed successfully! License: ${data.data?.licenseKey || 'Generated'}`,
        });
        fetchPendingPayments();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to process payment' });
    } finally {
      setProcessing(null);
    }
  };

  const handleSendEmail = async (payment: Payment) => {
    if (!confirm(`Send license email to ${payment.customer_info.email}?`)) {
      return;
    }

    setProcessing(`email-${payment.id}`);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/send-license-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: payment.id,
          email: payment.customer_info.email,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage({
          type: 'success',
          text: 'License email sent successfully!',
        });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send email' });
    } finally {
      setProcessing(null);
    }
  };

  const handleTestEmail = async () => {
    const email = prompt('Enter email address for test:');
    if (!email) return;

    setProcessing('test-email');
    setMessage(null);

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Test email sent successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send test email' });
    } finally {
      setProcessing(null);
    }
  };

  const handleViewDetails = async (payment: Payment) => {
    setSelectedPayment(payment);
    await fetchLicenseInfo(payment.id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'failed':
        return <XCircle className='w-4 h-4 text-red-500' />;
      case 'pending':
        return <AlertTriangle className='w-4 h-4 text-yellow-500' />;
      default:
        return <AlertTriangle className='w-4 h-4 text-gray-500' />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US');
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Payment Management
            </h1>
            <div className='flex gap-2'>
              <button
                onClick={handleTestEmail}
                disabled={processing === 'test-email'}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2'
              >
                {processing === 'test-email' ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Mail className='w-4 h-4' />
                )}
                Test Email
              </button>
              <button
                onClick={fetchPendingPayments}
                disabled={loading}
                className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2'
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : message.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='w-8 h-8 animate-spin text-gray-400' />
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200'>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>
                      Status
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>
                      Payment ID
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>
                      Customer
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>
                      Product
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>
                      Amount
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>
                      Created
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className='text-center py-8 text-gray-500'
                      >
                        No pending payments found
                      </td>
                    </tr>
                  ) : (
                    payments.map(payment => (
                      <tr
                        key={payment.id}
                        className='border-b border-gray-100 hover:bg-gray-50'
                      >
                        <td className='py-3 px-4'>
                          <div className='flex items-center gap-2'>
                            {getStatusIcon(payment.status)}
                            <span className='text-sm capitalize'>
                              {payment.status}
                            </span>
                          </div>
                        </td>
                        <td className='py-3 px-4'>
                          <code className='text-xs bg-gray-100 px-2 py-1 rounded'>
                            {payment.id.slice(-8)}
                          </code>
                        </td>
                        <td className='py-3 px-4'>
                          <div>
                            <div className='text-sm font-medium'>
                              {payment.customer_info.email}
                            </div>
                            {payment.customer_info.name && (
                              <div className='text-xs text-gray-500'>
                                {payment.customer_info.name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className='py-3 px-4'>
                          <div className='text-sm'>
                            {payment.product_info.name}
                          </div>
                        </td>
                        <td className='py-3 px-4'>
                          <div className='text-sm font-medium'>
                            {payment.currency.toUpperCase()}{' '}
                            {payment.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className='py-3 px-4'>
                          <div className='text-xs text-gray-500'>
                            {formatDate(payment.created_at)}
                          </div>
                        </td>
                        <td className='py-3 px-4'>
                          <div className='flex gap-2'>
                            <button
                              onClick={() => handleViewDetails(payment)}
                              className='p-1.5 text-blue-600 hover:bg-blue-50 rounded'
                              title='View Details'
                            >
                              <Eye className='w-4 h-4' />
                            </button>
                            {payment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleProcessPayment(payment)}
                                  disabled={processing === payment.id}
                                  className='p-1.5 text-green-600 hover:bg-green-50 rounded disabled:opacity-50'
                                  title='Process Payment'
                                >
                                  {processing === payment.id ? (
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                  ) : (
                                    <PlayCircle className='w-4 h-4' />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleSendEmail(payment)}
                                  disabled={
                                    processing === `email-${payment.id}`
                                  }
                                  className='p-1.5 text-purple-600 hover:bg-purple-50 rounded disabled:opacity-50'
                                  title='Send Email'
                                >
                                  {processing === `email-${payment.id}` ? (
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                  ) : (
                                    <Send className='w-4 h-4' />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedPayment && (
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-gray-900'>
                Payment Details
              </h2>
              <button
                onClick={() => {
                  setSelectedPayment(null);
                  setLicenseInfo(null);
                }}
                className='text-gray-500 hover:text-gray-700'
              >
                ✕
              </button>
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <div>
                <h3 className='font-medium text-gray-700 mb-3'>
                  Payment Information
                </h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>ID:</span>
                    <code className='bg-gray-100 px-2 py-1 rounded'>
                      {selectedPayment.id}
                    </code>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Provider:</span>
                    <span className='capitalize'>
                      {selectedPayment.payment_provider}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Session ID:</span>
                    <code className='bg-gray-100 px-2 py-1 rounded text-xs'>
                      {selectedPayment.provider_session_id || 'N/A'}
                    </code>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Webhook Received:</span>
                    <span>
                      {selectedPayment.webhook_received_at ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='font-medium text-gray-700 mb-3'>
                  License Information
                </h3>
                {licenseInfo ? (
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>License Key:</span>
                      <code className='bg-green-100 px-2 py-1 rounded text-xs'>
                        {licenseInfo.license_key}
                      </code>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>Status:</span>
                      <span className='capitalize'>{licenseInfo.status}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>Created:</span>
                      <span className='text-xs'>
                        {formatDate(licenseInfo.created_at)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className='text-sm text-gray-500'>
                    No license generated yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
