'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('xsstomy@gmail.com');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/email/test');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4'>
      <div className='max-w-md mx-auto bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
          📧 Email Service Test
        </h1>

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Test Email Address:
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter email address'
            />
          </div>

          <div className='flex space-x-2'>
            <button
              onClick={checkHealth}
              disabled={loading}
              className='flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors'
            >
              {loading ? 'Checking...' : 'Health Check'}
            </button>

            <button
              onClick={testEmail}
              disabled={loading || !email}
              className='flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors'
            >
              {loading ? 'Sending...' : 'Send Test Email'}
            </button>
          </div>
        </div>

        {result && (
          <div className='mt-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Result:</h3>
            <pre className='bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-96 whitespace-pre-wrap'>
              {result}
            </pre>
          </div>
        )}

        <div className='mt-8 p-4 bg-blue-50 rounded-md'>
          <h4 className='font-medium text-blue-900 mb-2'>How to Test:</h4>
          <ol className='text-sm text-blue-800 space-y-1'>
            <li>
              1. Click "Health Check" to verify email service configuration
            </li>
            <li>2. Enter your email address above</li>
            <li>3. Click "Send Test Email" to send a test message</li>
            <li>4. Check your inbox (including spam folder)</li>
          </ol>
        </div>

        <div className='mt-4 p-4 bg-green-50 rounded-md'>
          <h4 className='font-medium text-green-900 mb-2'>
            Current Configuration:
          </h4>
          <ul className='text-sm text-green-800 space-y-1'>
            <li>• From: noreply@license.topwindow.app</li>
            <li>• Provider: Resend API</li>
            <li>• Mode: {process.env.NODE_ENV}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
