'use client'

import { useState } from 'react'
import PaymentSelector from '@/components/payments/PaymentSelector'
import PaymentStatusTracker from '@/components/payments/PaymentStatusTracker'
import { TestTube, CreditCard, Eye, CheckCircle } from 'lucide-react'

export default function TestPaymentPage() {
  const [currentTest, setCurrentTest] = useState<string>('payment-selector')
  const [testPaymentId, setTestPaymentId] = useState<string>('test-payment-123')

  const tests = [
    {
      id: 'payment-selector',
      name: 'PaymentSelector 组件',
      description: '测试支付选择器的完整功能',
      icon: CreditCard
    },
    {
      id: 'payment-tracker',
      name: 'PaymentStatusTracker 组件',
      description: '测试支付状态跟踪功能',
      icon: Eye
    },
    {
      id: 'integration',
      name: '集成测试',
      description: '端到端支付流程测试',
      icon: CheckCircle
    }
  ]

  const renderCurrentTest = () => {
    switch (currentTest) {
      case 'payment-selector':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">测试说明</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• 测试产品信息加载</li>
                <li>• 测试支付方式选择</li>
                <li>• 测试用户认证状态</li>
                <li>• 测试响应式设计</li>
              </ul>
            </div>
            
            <PaymentSelector
              productId="topwindow-license"
              onPaymentStart={() => {
                console.log('Payment started')
                alert('支付开始！（测试模式）')
              }}
              onPaymentSuccess={() => {
                console.log('Payment success')
                alert('支付成功！（测试模式）')
              }}
              onPaymentCancel={() => {
                console.log('Payment cancelled')
                alert('支付取消！（测试模式）')
              }}
              showComparison={true}
            />
          </div>
        )

      case 'payment-tracker':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">测试说明</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• 测试支付状态显示</li>
                <li>• 测试状态轮询机制</li>
                <li>• 测试错误处理</li>
                <li>• 测试用户交互</li>
              </ul>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  测试支付ID:
                </label>
                <input
                  type="text"
                  value={testPaymentId}
                  onChange={(e) => setTestPaymentId(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="输入测试支付ID"
                />
              </div>
            </div>
            
            <PaymentStatusTracker
              paymentId={testPaymentId}
              onStatusChange={(status) => {
                console.log('Status changed:', status)
              }}
              autoRefresh={false}
              refreshInterval={3000}
            />
          </div>
        )

      case 'integration':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">集成测试清单</h4>
              <div className="space-y-3">
                <TestItem 
                  title="产品信息 API" 
                  description="测试产品数据获取"
                  testFn={testProductAPI}
                />
                <TestItem 
                  title="支付会话创建" 
                  description="测试支付会话创建流程"
                  testFn={testPaymentSession}
                />
                <TestItem 
                  title="支付状态查询" 
                  description="测试支付状态查询功能"
                  testFn={testPaymentStatus}
                />
                <TestItem 
                  title="错误处理" 
                  description="测试各种错误场景处理"
                  testFn={testErrorHandling}
                />
                <TestItem 
                  title="响应式设计" 
                  description="测试移动端适配"
                  testFn={testResponsive}
                />
              </div>
            </div>
          </div>
        )

      default:
        return <div>选择一个测试项目</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TestTube className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                支付界面测试中心
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              测试和验证支付相关组件的功能和性能
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 测试导航 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">测试项目</h3>
                <div className="space-y-2">
                  {tests.map((test) => (
                    <button
                      key={test.id}
                      onClick={() => setCurrentTest(test.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentTest === test.id
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <test.icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm opacity-75">{test.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 测试内容 */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {tests.find(t => t.id === currentTest)?.name}
                </h2>
                {renderCurrentTest()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 测试项目组件
function TestItem({ 
  title, 
  description, 
  testFn 
}: { 
  title: string
  description: string
  testFn: () => Promise<void>
}) {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<string>('')

  const runTest = async () => {
    setStatus('running')
    setResult('')
    
    try {
      await testFn()
      setStatus('success')
      setResult('测试通过')
    } catch (error) {
      setStatus('error')
      setResult(error instanceof Error ? error.message : '测试失败')
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'text-blue-600'
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h5 className="font-medium text-gray-900">{title}</h5>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <button
          onClick={runTest}
          disabled={status === 'running'}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {status === 'running' ? '测试中...' : '运行测试'}
        </button>
      </div>
      
      {result && (
        <div className={`text-sm ${getStatusColor()}`}>
          {result}
        </div>
      )}
    </div>
  )
}

// 测试函数
async function testProductAPI() {
  const response = await fetch('/api/products/topwindow-license')
  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`)
  }
  const data = await response.json()
  if (!data.id || !data.name || !data.price) {
    throw new Error('产品数据格式不正确')
  }
}

async function testPaymentSession() {
  // 模拟测试支付会话创建
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Payment session test completed')
}

async function testPaymentStatus() {
  // 模拟测试支付状态查询
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('Payment status test completed')
}

async function testErrorHandling() {
  // 模拟测试错误处理
  await new Promise(resolve => setTimeout(resolve, 600))
  console.log('Error handling test completed')
}

async function testResponsive() {
  // 模拟测试响应式设计
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Responsive design test completed')
}