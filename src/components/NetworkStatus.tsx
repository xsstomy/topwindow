'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { diagnoseLabelSupabaseConnection } from '@/lib/supabase/diagnostics'

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [diagnosticsData, setDiagnosticsData] = useState<any>(null)

  useEffect(() => {
    // Check network connection status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Check Supabase connection status
    checkSupabaseConnection()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const checkSupabaseConnection = async () => {
    try {
      setSupabaseStatus('checking')
      const { error } = await supabase.auth.getSession()
      setSupabaseStatus(error ? 'error' : 'connected')
    } catch (error) {
      setSupabaseStatus('error')
    }
  }

  const runDiagnostics = async () => {
    setShowDiagnostics(true)
    const results = await diagnoseLabelSupabaseConnection()
    setDiagnosticsData(results)
  }

  // Only show when there are issues
  if (isOnline && supabaseStatus === 'connected') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${
            !isOnline ? 'bg-red-500' : 
            supabaseStatus === 'error' ? 'bg-orange-500' :
            supabaseStatus === 'checking' ? 'bg-yellow-500 animate-pulse' :
            'bg-green-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-800">
            {!isOnline ? 'Network connection issue' :
             supabaseStatus === 'error' ? 'Service connection issue' :
             supabaseStatus === 'checking' ? 'Checking connection...' :
             'Connection normal'}
          </span>
        </div>

        {!isOnline && (
          <p className="text-xs text-gray-600 mb-2">
            Please check your network connection
          </p>
        )}

        {isOnline && supabaseStatus === 'error' && (
          <>
            <p className="text-xs text-gray-600 mb-2">
              Unable to connect to authentication service
            </p>
            <div className="flex space-x-2">
              <button
                onClick={checkSupabaseConnection}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Retry Connection
              </button>
              <button
                onClick={runDiagnostics}
                className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                Diagnose Issues
              </button>
            </div>
          </>
        )}

        {showDiagnostics && diagnosticsData && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
            <p className="font-medium">Diagnostic Results:</p>
            <ul className="mt-1 space-y-1">
              <li>Connection Status: {diagnosticsData.connection ? '✅ Normal' : '❌ Error'}</li>
              <li>Auth Service: {diagnosticsData.auth ? '✅ Normal' : '❌ Error'}</li>
              <li>Database: {diagnosticsData.database ? '✅ Normal' : '❌ Error'}</li>
              {diagnosticsData.errors.length > 0 && (
                <li>Errors: {diagnosticsData.errors.join(', ')}</li>
              )}
            </ul>
            <button
              onClick={() => setShowDiagnostics(false)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}