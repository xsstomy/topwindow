'use client'

import { useState } from 'react'

interface ErrorMessageProps {
  error: string
  onDismiss?: () => void
  showHelp?: boolean
}

export default function ErrorMessage({ error, onDismiss, showHelp = true }: ErrorMessageProps) {
  const [showSolutions, setShowSolutions] = useState(false)

  const getSolutions = (error: string) => {
    const solutions = []

    if (error.includes('邮箱或密码错误')) {
      solutions.push('请检查邮箱地址是否正确')
      solutions.push('确认密码是否输入正确')
      solutions.push('如果忘记密码，请使用"忘记密码"功能')
    } else if (error.includes('网络连接异常')) {
      solutions.push('检查您的网络连接是否正常')
      solutions.push('尝试刷新页面')
      solutions.push('如果使用VPN，请尝试关闭后重试')
    } else if (error.includes('请等待')) {
      solutions.push('Supabase 有安全限制，请耐心等待')
      solutions.push('可以尝试使用 Google 登录')
      solutions.push('稍后再试邮箱注册')
    } else if (error.includes('该邮箱已注册')) {
      solutions.push('请直接使用登录功能')
      solutions.push('如果忘记密码，请使用密码重置')
      solutions.push('或者使用其他邮箱地址注册')
    } else if (error.includes('Google OAuth 配置错误')) {
      solutions.push('请联系管理员检查 OAuth 配置')
      solutions.push('暂时使用邮箱登录功能')
    } else if (error.includes('请先验证您的邮箱地址')) {
      solutions.push('请检查您的邮箱收件箱')
      solutions.push('查看垃圾邮件文件夹')
      solutions.push('点击邮件中的验证链接')
    }

    return solutions
  }

  const solutions = getSolutions(error)
  
  const getErrorIcon = () => {
    if (error.includes('网络连接异常')) {
      return '🌐'
    } else if (error.includes('邮箱或密码错误')) {
      return '🔑'
    } else if (error.includes('请等待')) {
      return '⏰'
    } else if (error.includes('Google')) {
      return '🔍'
    }
    return '⚠️'
  }

  const getErrorType = () => {
    if (error.includes('网络连接异常')) {
      return 'network'
    } else if (error.includes('请等待')) {
      return 'rate-limit'
    } else if (error.includes('邮箱或密码错误')) {
      return 'credentials'
    }
    return 'general'
  }

  const errorType = getErrorType()

  return (
    <div className={`rounded-lg p-4 mb-4 ${
      errorType === 'network' ? 'bg-orange-50 border border-orange-200' :
      errorType === 'rate-limit' ? 'bg-yellow-50 border border-yellow-200' :
      'bg-red-50 border border-red-200'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-xl">{getErrorIcon()}</span>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${
              errorType === 'network' ? 'text-orange-800' :
              errorType === 'rate-limit' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              {error}
            </h3>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <span className="text-lg">×</span>
              </button>
            )}
          </div>
          
          {showHelp && solutions.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowSolutions(!showSolutions)}
                className={`text-xs font-medium ${
                  errorType === 'network' ? 'text-orange-700 hover:text-orange-900' :
                  errorType === 'rate-limit' ? 'text-yellow-700 hover:text-yellow-900' :
                  'text-red-700 hover:text-red-900'
                }`}
              >
                {showSolutions ? '隐藏解决方案' : '查看解决方案'}
              </button>
              
              {showSolutions && (
                <div className="mt-2 space-y-1">
                  {solutions.map((solution, index) => (
                    <div key={index} className="flex items-start">
                      <span className={`inline-block w-1 h-1 rounded-full mt-2 mr-2 ${
                        errorType === 'network' ? 'bg-orange-400' :
                        errorType === 'rate-limit' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`}></span>
                      <span className={`text-xs ${
                        errorType === 'network' ? 'text-orange-700' :
                        errorType === 'rate-limit' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {solution}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}