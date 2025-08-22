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

    if (error.includes('Invalid email or password') || error.includes('email or password')) {
      solutions.push('Please check if your email address is correct')
      solutions.push('Verify if your password is entered correctly')
      solutions.push('If you forgot your password, please use the "Forgot Password" feature')
    } else if (error.includes('Network connection') || error.includes('network')) {
      solutions.push('Check if your network connection is working properly')
      solutions.push('Try refreshing the page')
      solutions.push('If using VPN, try disabling it and retry')
    } else if (error.includes('Please wait') || error.includes('rate limit')) {
      solutions.push('Supabase has security restrictions, please wait patiently')
      solutions.push('Try using Google login instead')
      solutions.push('Try email registration again later')
    } else if (error.includes('already registered') || error.includes('already exists')) {
      solutions.push('Please use the login function directly')
      solutions.push('If you forgot your password, please use password reset')
      solutions.push('Or register with a different email address')
    } else if (error.includes('Google OAuth') || error.includes('OAuth configuration')) {
      solutions.push('Please contact administrator to check OAuth configuration')
      solutions.push('Use email login temporarily')
    } else if (error.includes('verify your email') || error.includes('email verification')) {
      solutions.push('Please check your email inbox')
      solutions.push('Check your spam/junk folder')
      solutions.push('Click the verification link in the email')
    }

    return solutions
  }

  const solutions = getSolutions(error)
  
  const getErrorIcon = () => {
    if (error.includes('Network connection') || error.includes('network')) {
      return '🌐'
    } else if (error.includes('email or password') || error.includes('Invalid')) {
      return '🔑'
    } else if (error.includes('Please wait') || error.includes('rate limit')) {
      return '⏰'
    } else if (error.includes('Google')) {
      return '🔍'
    }
    return '⚠️'
  }

  const getErrorType = () => {
    if (error.includes('Network connection') || error.includes('network')) {
      return 'network'
    } else if (error.includes('Please wait') || error.includes('rate limit')) {
      return 'rate-limit'
    } else if (error.includes('email or password') || error.includes('Invalid')) {
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
                {showSolutions ? 'Hide Solutions' : 'View Solutions'}
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