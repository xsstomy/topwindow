'use client'

interface SuccessMessageProps {
  message: string
  onDismiss?: () => void
  showNextSteps?: boolean
}

export default function SuccessMessage({ message, onDismiss, showNextSteps = false }: SuccessMessageProps) {
  const getNextSteps = () => {
    if (message.includes('注册成功')) {
      return [
        '请检查您的邮箱收件箱',
        '点击邮件中的验证链接',
        '验证后即可正常登录'
      ]
    } else if (message.includes('密码重置')) {
      return [
        '请检查您的邮箱',
        '按照邮件中的指引重置密码',
        '使用新密码重新登录'
      ]
    }
    return []
  }

  const nextSteps = getNextSteps()

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-xl">✅</span>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-green-800">
              {message}
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
          
          {showNextSteps && nextSteps.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-green-700">接下来需要：</p>
              {nextSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center mr-2 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-xs text-green-700">{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}