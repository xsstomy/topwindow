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
    // 检查网络连接状态
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // 检查 Supabase 连接状态
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

  // 仅在有问题时显示
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
            {!isOnline ? '网络连接异常' :
             supabaseStatus === 'error' ? '服务连接异常' :
             supabaseStatus === 'checking' ? '检查连接中...' :
             '连接正常'}
          </span>
        </div>

        {!isOnline && (
          <p className="text-xs text-gray-600 mb-2">
            请检查您的网络连接
          </p>
        )}

        {isOnline && supabaseStatus === 'error' && (
          <>
            <p className="text-xs text-gray-600 mb-2">
              无法连接到认证服务
            </p>
            <div className="flex space-x-2">
              <button
                onClick={checkSupabaseConnection}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                重试连接
              </button>
              <button
                onClick={runDiagnostics}
                className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                诊断问题
              </button>
            </div>
          </>
        )}

        {showDiagnostics && diagnosticsData && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
            <p className="font-medium">诊断结果:</p>
            <ul className="mt-1 space-y-1">
              <li>连接状态: {diagnosticsData.connection ? '✅ 正常' : '❌ 异常'}</li>
              <li>认证服务: {diagnosticsData.auth ? '✅ 正常' : '❌ 异常'}</li>
              <li>数据库: {diagnosticsData.database ? '✅ 正常' : '❌ 异常'}</li>
              {diagnosticsData.errors.length > 0 && (
                <li>错误: {diagnosticsData.errors.join(', ')}</li>
              )}
            </ul>
            <button
              onClick={() => setShowDiagnostics(false)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              关闭
            </button>
          </div>
        )}
      </div>
    </div>
  )
}