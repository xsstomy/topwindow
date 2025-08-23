'use client'

// License Key 系统测试页面
import { useState, useEffect } from 'react'
import { generateLicenseKey, validateLicenseKeyFormat, generateLicenseKeyBatch } from '@/lib/license/generator'
import { validators } from '@/lib/utils/validators'
import { validateActivationRequest, validateValidationRequest } from '@/lib/license/validator'
import { 
  validateLicenseKeyComplete, 
  validateLicenseKeyFormatOnly, 
  getInvalidLicenseKeyExamples,
  type LicenseKeyValidationResult 
} from '@/lib/license/validation-utils'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/context/AuthContext'
import { Copy, Check, X, RefreshCw, Database, Key, Shield, TestTube, Sparkles, LogIn, Smartphone } from 'lucide-react'
import TestInstructions from '@/components/test/TestInstructions'

interface TestResult {
  success: boolean
  message: string
  data?: any
}

interface Product {
  id: string
  name: string
  price: number
  currency: string
  license_type: string
  activation_limit: number
}

interface GeneratedLicense {
  license_key: string
  product_id: string
  product_name: string
  status: string
  activation_limit: number
  expires_at: string
  created_at: string
}

interface ActivationRequest {
  license_key: string
  device_id: string
  device_info: {
    name: string
    type: string
    version?: string
    arch?: string
  }
}

interface ActivationResult {
  success: boolean
  status: 'success' | 'error'
  message: string
  expires_at?: string
  activation_info?: {
    activated_at?: string
    device_name?: string
    remaining_activations?: number
    activated_count?: number
    activation_limit?: number
  }
}

export default function LicenseTestPage() {
  // 认证状态
  const { user, loading: authLoading } = useAuth()
  
  // 生成器测试状态
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // 格式验证测试状态
  const [testKey, setTestKey] = useState('')
  const [formatValidationResult, setFormatValidationResult] = useState<LicenseKeyValidationResult | null>(null)

  // 输入验证测试状态
  const [validationTests, setValidationTests] = useState<Record<string, TestResult>>({})

  // API连接测试状态
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [connectionMessage, setConnectionMessage] = useState('')

  // 真实密钥生成状态
  const [isGeneratingReal, setIsGeneratingReal] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [realLicenses, setRealLicenses] = useState<GeneratedLicense[]>([])
  const [realLicenseError, setRealLicenseError] = useState('')

  // 设备激活测试状态
  const [activationForm, setActivationForm] = useState<ActivationRequest>({
    license_key: '',
    device_id: '',
    device_info: {
      name: '',
      type: 'macbook_pro',
      version: '',
      arch: 'arm64'
    }
  })
  const [isActivating, setIsActivating] = useState(false)
  const [activationResults, setActivationResults] = useState<ActivationResult[]>([])
  const [activationError, setActivationError] = useState('')

  // 测试用数据（动态生成）
  const [testCases, setTestCases] = useState({
    validLicenseKeys: [] as string[],
    invalidLicenseKeys: getInvalidLicenseKeyExamples(),
    validDeviceIds: [
      'macbook-pro-12345678',
      'test-device-abcdef12'
    ],
    invalidDeviceIds: [
      { id: 'abc', reason: '长度不足' },
      { id: '12', reason: '长度不足' },
      { id: 'device-with-invalid-chars-!@#', reason: '包含无效字符' },
      { id: 'a'.repeat(65), reason: '超过最大长度' }
    ],
    validEmails: [
      'test@example.com',
      'user@topwindow.app'
    ],
    invalidEmails: [
      { email: 'invalid-email', reason: '缺少@符号' },
      { email: '@example.com', reason: '缺少用户名' },
      { email: 'test@', reason: '缺少域名' }
    ]
  })

  // License Key 生成器测试
  const handleGenerateKey = async () => {
    setIsGenerating(true)
    try {
      // 模拟一些延迟让用户看到加载状态
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newKey = generateLicenseKey()
      setGeneratedKeys(prev => [newKey, ...prev.slice(0, 9)]) // 保留最近10个
    } catch (error) {
      console.error('生成License Key失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // 批量生成测试
  const handleBatchGenerate = async () => {
    setIsGenerating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const batchKeys = generateLicenseKeyBatch(5)
      setGeneratedKeys(prev => [...batchKeys, ...prev.slice(0, 5)])
    } catch (error) {
      console.error('批量生成失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // 复制到剪贴板
  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  // 格式验证测试
  const handleValidateFormat = () => {
    if (!testKey.trim()) {
      setFormatValidationResult(null)
      return
    }

    const result = validateLicenseKeyComplete(testKey.trim())
    setFormatValidationResult(result)
  }

  // 运行输入验证测试
  const runValidationTests = () => {
    const results: Record<string, TestResult> = {}

    // 测试License Key验证
    results['license_valid'] = {
      success: testCases.validLicenseKeys.every(key => validateLicenseKeyComplete(key).isValid),
      message: `有效License Key格式测试: ${testCases.validLicenseKeys.length}个用例`,
      data: testCases.validLicenseKeys.map(key => ({
        key,
        validation: validateLicenseKeyComplete(key)
      }))
    }

    results['license_invalid'] = {
      success: testCases.invalidLicenseKeys.every(item => !validateLicenseKeyComplete(item.key).isValid),
      message: `无效License Key格式测试: ${testCases.invalidLicenseKeys.length}个用例`,
      data: testCases.invalidLicenseKeys.map(item => ({
        key: item.key,
        expectedReason: item.reason,
        validation: validateLicenseKeyComplete(item.key)
      }))
    }

    // 测试设备ID验证
    results['device_valid'] = {
      success: testCases.validDeviceIds.every(id => validators.deviceId(id)),
      message: `有效设备ID格式测试: ${testCases.validDeviceIds.length}个用例`,
      data: testCases.validDeviceIds
    }

    results['device_invalid'] = {
      success: testCases.invalidDeviceIds.every(item => !validators.deviceId(item.id)),
      message: `无效设备ID格式测试: ${testCases.invalidDeviceIds.length}个用例`,
      data: testCases.invalidDeviceIds
    }

    // 测试邮箱验证
    results['email_valid'] = {
      success: testCases.validEmails.every(email => validators.email(email)),
      message: `有效邮箱格式测试: ${testCases.validEmails.length}个用例`,
      data: testCases.validEmails
    }

    results['email_invalid'] = {
      success: testCases.invalidEmails.every(item => !validators.email(item.email)),
      message: `无效邮箱格式测试: ${testCases.invalidEmails.length}个用例`,
      data: testCases.invalidEmails
    }

    // 测试激活请求验证（使用真实生成的License Key）
    const testLicenseKey = testCases.validLicenseKeys.length > 0 
      ? testCases.validLicenseKeys[0] 
      : generateLicenseKey() // 如果没有有效密钥，临时生成一个

    const validActivationRequest = {
      license_key: testLicenseKey,
      device_id: 'test-device-12345678',
      device_info: {
        name: 'MacBook Pro',
        type: 'macbook_pro',
        version: '14.0'
      }
    }

    const activationResult = validateActivationRequest(validActivationRequest)
    results['activation_request'] = {
      success: activationResult.isValid,
      message: '激活请求验证测试',
      data: {
        request: validActivationRequest,
        validation: activationResult
      }
    }

    setValidationTests(results)
  }

  // 获取可用产品列表
  const fetchAvailableProducts = async () => {
    try {
      const response = await fetch('/api/licenses/generate')
      const result = await response.json()
      
      if (result.success) {
        setAvailableProducts(result.products)
        if (result.products.length > 0 && !selectedProductId) {
          setSelectedProductId(result.products[0].id)
        }
      }
    } catch (error) {
      console.error('获取产品列表失败:', error)
    }
  }

  // 生成真实License Key
  const handleGenerateRealLicense = async () => {
    if (!selectedProductId) {
      setRealLicenseError('请选择一个产品')
      return
    }

    if (!user) {
      setRealLicenseError('请先登录后再生成许可证')
      return
    }

    setIsGeneratingReal(true)
    setRealLicenseError('')

    try {
      const response = await fetch('/api/licenses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: selectedProductId,
          user_id: user.id, // 使用真实的登录用户ID
          activation_limit: 3
        }),
      })

      const result = await response.json()

      if (result.success) {
        setRealLicenses(prev => [result.license, ...prev.slice(0, 9)]) // 保留最近10个
        setRealLicenseError('')
      } else {
        setRealLicenseError(result.error || '生成失败')
      }
    } catch (error: any) {
      setRealLicenseError(`生成失败: ${error.message || '未知错误'}`)
      console.error('生成真实密钥失败:', error)
    } finally {
      setIsGeneratingReal(false)
    }
  }

  // 设备激活测试（添加防抖保护）
  const handleDeviceActivation = async () => {
    if (!activationForm.license_key || !activationForm.device_id) {
      setActivationError('请填写License Key和Device ID')
      return
    }

    if (!activationForm.device_info.name) {
      setActivationError('请填写设备名称')
      return
    }

    // 防抖保护：如果正在激活中，直接返回
    if (isActivating) {
      setActivationError('激活请求正在处理中，请稍候...')
      return
    }

    setIsActivating(true)
    setActivationError('')

    try {
      const response = await fetch('/api/licenses/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activationForm),
      })

      const result = await response.json()
      
      const activationResult: ActivationResult = {
        success: response.ok && result.status === 'success',
        status: result.status || 'error',
        message: result.message || '未知错误',
        expires_at: result.expires_at,
        activation_info: result.activation_info
      }

      setActivationResults(prev => [activationResult, ...prev.slice(0, 9)]) // 保留最近10个结果

      if (!activationResult.success) {
        setActivationError(activationResult.message)
      } else {
        // 清除错误信息，显示成功反馈
        setActivationError('')
      }
    } catch (error: any) {
      const errorResult: ActivationResult = {
        success: false,
        status: 'error',
        message: `网络错误: ${error.message || '请求失败'}`
      }
      setActivationResults(prev => [errorResult, ...prev.slice(0, 9)])
      setActivationError(errorResult.message)
      console.error('设备激活失败:', error)
    } finally {
      // 添加延迟以防止用户过快重复点击
      setTimeout(() => {
        setIsActivating(false)
      }, 1000) // 1秒延迟
    }
  }

  // 快速填充测试数据
  const fillTestActivationData = (useValidKey: boolean = true) => {
    const testData = {
      license_key: useValidKey && generatedKeys.length > 0 
        ? generatedKeys[0] 
        : (useValidKey ? generateLicenseKey() : 'TW-INVALID-KEY-TEST'),
      device_id: 'macbook-pro-' + Math.random().toString(36).substr(2, 8),
      device_info: {
        name: 'MacBook Pro (Test Device)',
        type: 'macbook_pro' as const,
        version: '14.0',
        arch: 'arm64' as const
      }
    }
    setActivationForm(testData)
    setActivationError('')
  }

  // API连接测试
  const testDatabaseConnection = async () => {
    setConnectionStatus('testing')
    setConnectionMessage('正在测试数据库连接...')

    try {
      // 测试基本连接
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price')
        .limit(1)

      if (error) {
        throw error
      }

      setConnectionStatus('success')
      setConnectionMessage(`数据库连接成功！找到 ${data?.length || 0} 条产品记录`)
    } catch (error: any) {
      setConnectionStatus('error')
      setConnectionMessage(`连接失败: ${error.message || '未知错误'}`)
      console.error('数据库连接测试失败:', error)
    }
  }

  // 页面加载时自动运行一些测试
  useEffect(() => {
    const initializeTests = async () => {
      // 生成几个有效的License Key作为测试用例
      const validKeys = generateLicenseKeyBatch(3)
      setGeneratedKeys(validKeys)
      
      // 更新测试用例中的有效密钥
      setTestCases(prev => ({
        ...prev,
        validLicenseKeys: validKeys
      }))

      // 获取可用产品列表
      await fetchAvailableProducts()
    }
    
    initializeTests()
  }, [])

  // 当有效密钥更新后运行验证测试
  useEffect(() => {
    if (testCases.validLicenseKeys.length > 0) {
      runValidationTests()
    }
  }, [testCases.validLicenseKeys])

  // 实时格式验证
  useEffect(() => {
    if (testKey.trim()) {
      handleValidateFormat()
    } else {
      setFormatValidationResult(null)
    }
  }, [testKey])

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          License Key 系统测试
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          这是TopWindow License Key管理系统的功能测试页面。
          您可以在这里验证密钥生成、格式验证、输入验证和数据库连接等核心功能。
        </p>
      </div>

      {/* 用户登录状态 */}
      {authLoading ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
            <span className="text-gray-600">检查登录状态...</span>
          </div>
        </div>
      ) : user ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Check className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">已登录</p>
              <p className="text-green-700 text-sm">
                用户: {user.email} | ID: {user.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <LogIn className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="text-yellow-800 font-medium">未登录</p>
              <p className="text-yellow-700 text-sm">
                某些功能需要登录才能使用。
                <a href="/auth/login" className="underline hover:text-yellow-800 ml-1">
                  点击登录
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <TestInstructions />

      {/* License Key 生成器测试 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">License Key 生成器</h2>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>测试密钥</strong>：仅用于格式验证和UI测试，不会保存到数据库。
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleGenerateKey}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Key className="w-4 h-4" />
            )}
            {isGenerating ? '生成中...' : '生成新密钥'}
          </button>

          <button
            onClick={handleBatchGenerate}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            批量生成 (5个)
          </button>
        </div>

        {generatedKeys.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">生成历史</h3>
            {generatedKeys.map((key, index) => (
              <div key={`${key}-${index}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <code className="flex-1 font-mono text-lg text-gray-900 bg-white px-3 py-2 rounded border">
                  {key}
                </code>
                <button
                  onClick={() => handleCopyKey(key)}
                  className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  {copiedKey === key ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copiedKey === key ? '已复制' : '复制'}
                </button>
                <span className="text-sm text-gray-500">
                  {(() => {
                    const validation = validateLicenseKeyComplete(key)
                    return validation.isValid ? '✅ 有效' : `❌ ${validation.reason}`
                  })()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 真实密钥生成器 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-semibold text-gray-900">真实密钥生成器</h2>
        </div>

        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm text-emerald-700">
            <strong>真实密钥</strong>：将保存到数据库，可用于实际的软件激活。生成后会分配给测试用户。
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {availableProducts.length > 0 ? (
            <div>
              <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
                选择产品
              </label>
              <select
                id="product-select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.price} {product.currency} (最多激活 {product.activation_limit} 台设备)
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                暂无可用产品，请先在数据库中添加产品数据。
              </p>
            </div>
          )}

          <button
            onClick={handleGenerateRealLicense}
            disabled={isGeneratingReal || !selectedProductId || !user}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            {isGeneratingReal ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : !user ? (
              <LogIn className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isGeneratingReal ? '生成中...' : !user ? '请先登录' : '生成真实密钥'}
          </button>
          
          {!user && !authLoading && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <LogIn className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">需要登录</p>
                  <p className="text-sm text-blue-700">
                    生成真实许可证需要关联到您的账户。请先 
                    <a href="/auth/login" className="underline hover:text-blue-800 ml-1">
                      登录
                    </a> 或 
                    <a href="/auth/register" className="underline hover:text-blue-800 ml-1">
                      注册账户
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {realLicenseError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{realLicenseError}</p>
            </div>
          )}
        </div>

        {realLicenses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">已生成的真实密钥</h3>
            {realLicenses.map((license, index) => (
              <div key={`real-${license.license_key}-${index}`} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <code className="font-mono text-lg text-gray-900 bg-white px-3 py-2 rounded border">
                      {license.license_key}
                    </code>
                    <button
                      onClick={() => handleCopyKey(license.license_key)}
                      className="ml-3 flex items-center gap-1 px-3 py-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                    >
                      {copiedKey === license.license_key ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copiedKey === license.license_key ? '已复制' : '复制'}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">产品：</span>
                    {license.product_name}
                  </div>
                  <div>
                    <span className="font-medium">状态：</span>
                    <span className="inline-block ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                      {license.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">激活限制：</span>
                    {license.activation_limit} 台设备
                  </div>
                  <div>
                    <span className="font-medium">过期时间：</span>
                    {new Date(license.expires_at).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 格式验证器测试 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-900">格式验证器</h2>
        </div>

        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>功能说明</strong>：验证License Key的格式是否正确，包括长度、字符规则和校验码验证。
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="test-key" className="block text-sm font-medium text-gray-700 mb-2">
              输入要验证的License Key
            </label>
            <div className="flex gap-3">
              <input
                id="test-key"
                type="text"
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                placeholder="例如: TW-A1B2-C3D4-E5F6-G7H8"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {formatValidationResult !== null && (
            <div className={`p-4 rounded-lg border ${
              formatValidationResult.isValid 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {formatValidationResult.isValid ? (
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span className={`font-medium block ${
                    formatValidationResult.isValid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {formatValidationResult.isValid 
                      ? '✅ License Key 有效' 
                      : '❌ License Key 无效'
                    }
                  </span>
                  <p className={`text-sm mt-1 ${
                    formatValidationResult.isValid ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {formatValidationResult.reason}
                  </p>
                  {formatValidationResult.details && (
                    <div className="text-xs mt-2 space-y-1">
                      <div>格式检查: {formatValidationResult.details.formatValid ? '✅ 通过' : '❌ 失败'}</div>
                      {formatValidationResult.details.checksumValid !== undefined && (
                        <div>校验码检查: {formatValidationResult.details.checksumValid ? '✅ 通过' : '❌ 失败'}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 测试用例快速填入 */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">快速测试用例:</p>
            <div className="flex flex-wrap gap-2">
              {/* 有效密钥 */}
              {testCases.validLicenseKeys.slice(0, 2).map((key, index) => (
                <button
                  key={`valid-${index}`}
                  onClick={() => setTestKey(key)}
                  className="text-xs px-3 py-1 rounded-full border bg-green-50 border-green-200 text-green-700 hover:bg-green-100 transition-colors"
                  title="有效的License Key"
                >
                  {key.length > 20 ? `${key.slice(0, 20)}...` : key}
                </button>
              ))}
              {/* 无效密钥 */}
              {testCases.invalidLicenseKeys.slice(0, 3).map((item, index) => (
                <button
                  key={`invalid-${index}`}
                  onClick={() => setTestKey(item.key)}
                  className="text-xs px-3 py-1 rounded-full border bg-red-50 border-red-200 text-red-700 hover:bg-red-100 transition-colors"
                  title={`无效: ${item.reason}`}
                >
                  {item.key.length > 15 ? `${item.key.slice(0, 15)}...` : item.key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 输入验证器测试 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <TestTube className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-900">输入验证器测试</h2>
        </div>

        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-700">
            <strong>功能说明</strong>：测试各种输入数据的格式验证，包括License Key、设备ID、邮箱格式等，确保前后端验证逻辑的一致性。
          </p>
        </div>

        <button
          onClick={runValidationTests}
          className="mb-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          运行验证测试
        </button>

        {Object.keys(validationTests).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(validationTests).map(([key, result]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border ${
                  result.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.message}
                  </span>
                </div>
                {result.data && (
                  <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 设备激活测试 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-semibold text-gray-900">设备激活测试</h2>
        </div>

        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700">
            <strong>功能说明</strong>：测试许可证的设备激活功能，验证License Key、设备ID格式，以及激活限制等业务逻辑。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：激活表单 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">激活表单</h3>
            
            {/* License Key 输入 */}
            <div>
              <label htmlFor="activation-license-key" className="block text-sm font-medium text-gray-700 mb-2">
                License Key *
              </label>
              <div className="flex gap-2">
                <input
                  id="activation-license-key"
                  type="text"
                  value={activationForm.license_key}
                  onChange={(e) => setActivationForm(prev => ({ ...prev, license_key: e.target.value }))}
                  placeholder="TW-XXXX-XXXX-XXXX-XXXX"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {generatedKeys.length > 0 && (
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        setActivationForm(prev => ({ ...prev, license_key: e.target.value }))
                      }
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">选择生成的密钥</option>
                    {generatedKeys.slice(0, 5).map((key, index) => (
                      <option key={index} value={key}>
                        {key.slice(0, 15)}...
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                当前有效性: {activationForm.license_key ? 
                  (validateLicenseKeyComplete(activationForm.license_key).isValid ? '✅ 有效' : '❌ 无效')
                  : '未输入'}
              </p>
            </div>

            {/* Device ID 输入 */}
            <div>
              <label htmlFor="activation-device-id" className="block text-sm font-medium text-gray-700 mb-2">
                Device ID *
              </label>
              <input
                id="activation-device-id"
                type="text"
                value={activationForm.device_id}
                onChange={(e) => setActivationForm(prev => ({ ...prev, device_id: e.target.value }))}
                placeholder="macbook-pro-12345678"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                当前有效性: {activationForm.device_id ? 
                  (validators.deviceId(activationForm.device_id) ? '✅ 有效' : '❌ 无效')
                  : '未输入'}
              </p>
            </div>

            {/* 设备信息 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">设备信息</h4>
              
              {/* 设备名称 */}
              <div>
                <label htmlFor="device-name" className="block text-xs font-medium text-gray-600 mb-1">
                  设备名称 *
                </label>
                <input
                  id="device-name"
                  type="text"
                  value={activationForm.device_info.name}
                  onChange={(e) => setActivationForm(prev => ({
                    ...prev,
                    device_info: { ...prev.device_info, name: e.target.value }
                  }))}
                  placeholder="MacBook Pro"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 设备类型 */}
                <div>
                  <label htmlFor="device-type" className="block text-xs font-medium text-gray-600 mb-1">
                    设备类型
                  </label>
                  <select
                    id="device-type"
                    value={activationForm.device_info.type}
                    onChange={(e) => setActivationForm(prev => ({
                      ...prev,
                      device_info: { ...prev.device_info, type: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="mac">Mac</option>
                    <option value="macbook">MacBook</option>
                    <option value="macbook_pro">MacBook Pro</option>
                    <option value="macbook_air">MacBook Air</option>
                    <option value="imac">iMac</option>
                    <option value="mac_mini">Mac mini</option>
                    <option value="mac_pro">Mac Pro</option>
                    <option value="mac_studio">Mac Studio</option>
                  </select>
                </div>

                {/* 架构 */}
                <div>
                  <label htmlFor="device-arch" className="block text-xs font-medium text-gray-600 mb-1">
                    架构
                  </label>
                  <select
                    id="device-arch"
                    value={activationForm.device_info.arch}
                    onChange={(e) => setActivationForm(prev => ({
                      ...prev,
                      device_info: { ...prev.device_info, arch: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="arm64">Apple Silicon (arm64)</option>
                    <option value="x64">Intel (x64)</option>
                  </select>
                </div>
              </div>

              {/* 系统版本 */}
              <div>
                <label htmlFor="device-version" className="block text-xs font-medium text-gray-600 mb-1">
                  系统版本 (可选)
                </label>
                <input
                  id="device-version"
                  type="text"
                  value={activationForm.device_info.version}
                  onChange={(e) => setActivationForm(prev => ({
                    ...prev,
                    device_info: { ...prev.device_info, version: e.target.value }
                  }))}
                  placeholder="14.0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleDeviceActivation}
                disabled={isActivating || !activationForm.license_key || !activationForm.device_id || !activationForm.device_info.name}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                {isActivating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Smartphone className="w-4 h-4" />
                )}
                {isActivating ? '激活中...' : '开始激活'}
              </button>

              <button
                onClick={() => fillTestActivationData(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                填充有效数据
              </button>

              <button
                onClick={() => fillTestActivationData(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                填充无效数据
              </button>
            </div>

            {activationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{activationError}</p>
              </div>
            )}
          </div>

          {/* 右侧：激活结果 */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">激活结果</h3>
            
            {activationResults.length === 0 ? (
              <div className="p-6 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <Smartphone className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm">暂无激活记录</p>
                <p className="text-xs text-gray-400 mt-1">执行激活测试后结果将显示在这里</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activationResults.map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {result.success ? (
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className={`font-medium ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.success ? 
                            (result.message.includes('already activated') ? '🔄 重复激活' : '✅ 激活成功') 
                            : '❌ 激活失败'
                          }
                        </div>
                        <p className={`text-sm mt-1 ${
                          result.success ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {result.message}
                        </p>
                        {result.activation_info && (
                          <div className="text-xs mt-2 space-y-1">
                            {result.activation_info.device_name && (
                              <div>设备: {result.activation_info.device_name}</div>
                            )}
                            {result.activation_info.remaining_activations !== undefined && (
                              <div>剩余激活次数: {result.activation_info.remaining_activations}</div>
                            )}
                            {result.activation_info.activated_at && (
                              <div>激活时间: {new Date(result.activation_info.activated_at).toLocaleString()}</div>
                            )}
                            {result.expires_at && (
                              <div>过期时间: {new Date(result.expires_at).toLocaleString()}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 数据库连接测试 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-900">数据库连接测试</h2>
        </div>

        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-sm text-indigo-700">
            <strong>功能说明</strong>：测试与Supabase数据库的连接状态，验证读取权限和基本的数据库操作功能。
          </p>
        </div>

        <button
          onClick={testDatabaseConnection}
          disabled={connectionStatus === 'testing'}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          {connectionStatus === 'testing' && (
            <RefreshCw className="w-4 h-4 animate-spin" />
          )}
          测试 Supabase 连接
        </button>

        {connectionMessage && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            connectionStatus === 'success'
              ? 'bg-green-50 border border-green-200'
              : connectionStatus === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            {connectionStatus === 'success' ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : connectionStatus === 'error' ? (
              <X className="w-5 h-5 text-red-600" />
            ) : (
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            )}
            <span className={`font-medium ${
              connectionStatus === 'success'
                ? 'text-green-800'
                : connectionStatus === 'error'
                ? 'text-red-800'
                : 'text-blue-800'
            }`}>
              {connectionMessage}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}