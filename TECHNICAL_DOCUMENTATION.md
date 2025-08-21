# TopWindow 技术实施文档

## 📋 项目概览

### 当前状态
- **项目名称**: TopWindow Website
- **技术栈**: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion
- **当前部署**: Cloudflare Pages (静态导出模式)
- **主要功能**: macOS 窗口管理工具的宣传网站

### 升级目标
将静态网站升级为功能完整的 SaaS 产品，包含：
- 用户认证系统 (Supabase Auth)
- License Key 验证和管理系统
- 双支付平台集成 (Creem + Paddle)
- 用户仪表板和设备管理

---

## 🔐 Supabase Auth 认证系统设计

### 认证方式
1. **邮箱 + 密码登录**
2. **Google OAuth 登录**

### 数据库表设计

#### 用户资料表
```sql
-- 用户个人资料表 (扩展 Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 前端认证组件

#### AuthProvider (认证上下文)
```typescript
// src/lib/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取初始用户状态
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        // 用户首次注册时创建资料
        if (event === 'SIGNED_UP' && session?.user) {
          await createUserProfile(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 创建用户资料的辅助函数
async function createUserProfile(user: User) {
  const { error } = await supabase
    .from('user_profiles')
    .insert({
      id: user.id,
      full_name: user.user_metadata.full_name || '',
      avatar_url: user.user_metadata.avatar_url || ''
    })
  
  if (error) {
    console.error('Error creating user profile:', error)
  }
}
```

#### 登录表单组件
```typescript
// src/components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { signIn, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Google 登录失败，请重试')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">登录账户</h2>
          <p className="text-gray-600 mt-2">欢迎回来，请登录您的账户</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              邮箱地址
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="请输入您的邮箱"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="请输入您的密码"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '登录中...' : '登录'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">或</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          使用 Google 登录
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            还没有账户？{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary hover:text-primary-dark font-medium"
            >
              立即注册
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
```

#### 中间件配置
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // 刷新用户会话
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 保护需要认证的路由
  const protectedPaths = ['/dashboard', '/profile', '/licenses']
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !session) {
    // 重定向到登录页面
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/licenses/:path*']
}
```

---

## 🔑 License Key 验证系统

### 系统架构
License Key 验证系统采用四阶段工作流程：
1. **生成与分发阶段**
2. **首次激活验证阶段**
3. **本地状态存储阶段**
4. **定期复验阶段**

### 数据库设计

#### 许可证表
```sql
-- 许可证表
CREATE TABLE licenses (
  license_key TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_id UUID REFERENCES payments(id),
  product_id TEXT NOT NULL DEFAULT 'topwindow-license',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  activation_limit INT DEFAULT 3 NOT NULL,
  activated_devices JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL 表示永久许可
  last_validated_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- 设备信息表
CREATE TABLE user_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  license_key TEXT REFERENCES licenses(license_key),
  device_id TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT, -- 'mac', 'macbook_pro', etc.
  device_info JSONB, -- 存储设备详细信息
  first_activated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'revoked')),
  UNIQUE(license_key, device_id)
);

-- 索引优化
CREATE INDEX idx_licenses_user_id ON licenses(user_id);
CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_devices_user_id ON user_devices(user_id);
CREATE INDEX idx_devices_license_key ON user_devices(license_key);

-- RLS 策略
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的许可证
CREATE POLICY "Users can view own licenses" ON licenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own devices" ON user_devices
  FOR SELECT USING (auth.uid() = user_id);
```

### License Key 生成策略

#### 生成算法
```typescript
// src/lib/license/generator.ts
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

export interface LicenseKeyConfig {
  productPrefix: string
  keyLength: number
  checksumEnabled: boolean
}

export class LicenseKeyGenerator {
  private config: LicenseKeyConfig

  constructor(config: LicenseKeyConfig = {
    productPrefix: 'TW',
    keyLength: 16,
    checksumEnabled: true
  }) {
    this.config = config
  }

  /**
   * 生成许可证密钥
   * 格式: TW-XXXX-XXXX-XXXX-XXXX
   */
  generateLicenseKey(): string {
    const rawKey = uuidv4().replace(/-/g, '').toUpperCase()
    const keyPart = rawKey.slice(0, this.config.keyLength)
    
    // 添加校验码
    const checksum = this.config.checksumEnabled 
      ? this.generateChecksum(keyPart)
      : ''
    
    // 格式化为友好的分组格式
    const formattedKey = this.formatKey(keyPart + checksum)
    
    return `${this.config.productPrefix}-${formattedKey}`
  }

  /**
   * 验证许可证密钥格式
   */
  validateKeyFormat(licenseKey: string): boolean {
    const pattern = new RegExp(`^${this.config.productPrefix}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$`)
    return pattern.test(licenseKey)
  }

  /**
   * 生成校验码
   */
  private generateChecksum(key: string): string {
    const hash = crypto.createHash('sha256').update(key).digest('hex')
    return hash.slice(0, 4).toUpperCase()
  }

  /**
   * 格式化密钥为分组格式
   */
  private formatKey(key: string): string {
    return key.match(/.{1,4}/g)?.join('-') || key
  }
}

// 使用示例
const generator = new LicenseKeyGenerator()
const licenseKey = generator.generateLicenseKey()
// 输出: TW-A1B2-C3D4-E5F6-G7H8
```

### 设备ID生成策略

#### macOS 设备ID方案
```typescript
// src/lib/device/identifier.ts

/**
 * macOS 设备ID生成策略
 * 优先级: Hardware UUID > IDFV + Keychain > 随机UUID
 */
export class DeviceIdentifier {
  private static readonly KEYCHAIN_SERVICE = 'com.topwindow.device-id'
  private static readonly KEYCHAIN_ACCOUNT = 'device-identifier'

  /**
   * 获取稳定的设备ID
   */
  static async getDeviceId(): Promise<string> {
    try {
      // 方案1: 尝试获取硬件UUID (最稳定)
      const hardwareId = await this.getHardwareUUID()
      if (hardwareId) {
        return this.hashDeviceInfo(hardwareId)
      }

      // 方案2: 从 Keychain 获取已保存的ID
      const keychainId = await this.getKeychainDeviceId()
      if (keychainId) {
        return keychainId
      }

      // 方案3: 生成新的ID并保存到 Keychain
      const newId = await this.generateAndSaveDeviceId()
      return newId

    } catch (error) {
      console.error('Error generating device ID:', error)
      // 降级方案：使用IDFV + 时间戳
      return this.getFallbackDeviceId()
    }
  }

  /**
   * 获取硬件UUID (推荐方案)
   */
  private static async getHardwareUUID(): Promise<string | null> {
    try {
      // 调用系统命令获取硬件UUID
      const { exec } = require('child_process')
      const { promisify } = require('util')
      const execAsync = promisify(exec)

      const { stdout } = await execAsync('system_profiler SPHardwareDataType | grep "Hardware UUID"')
      const match = stdout.match(/Hardware UUID:\s*(.+)/)
      
      return match ? match[1].trim() : null
    } catch {
      return null
    }
  }

  /**
   * 从 Keychain 获取设备ID
   */
  private static async getKeychainDeviceId(): Promise<string | null> {
    try {
      // 这里需要调用 macOS Keychain API
      // 在实际应用中，需要使用 Objective-C 或 Swift 代码
      // 通过 Node.js 的 native addon 或者通过 shell 命令调用
      
      const { exec } = require('child_process')
      const { promisify } = require('util')
      const execAsync = promisify(exec)

      const command = `security find-generic-password -s "${this.KEYCHAIN_SERVICE}" -a "${this.KEYCHAIN_ACCOUNT}" -w`
      const { stdout } = await execAsync(command)
      
      return stdout.trim() || null
    } catch {
      return null
    }
  }

  /**
   * 生成新的设备ID并保存到 Keychain
   */
  private static async generateAndSaveDeviceId(): Promise<string> {
    const deviceId = uuidv4()
    
    try {
      // 保存到 Keychain
      const { exec } = require('child_process')
      const { promisify } = require('util')
      const execAsync = promisify(exec)

      const command = `security add-generic-password -s "${this.KEYCHAIN_SERVICE}" -a "${this.KEYCHAIN_ACCOUNT}" -w "${deviceId}"`
      await execAsync(command)
      
    } catch (error) {
      console.warn('Failed to save device ID to keychain:', error)
    }

    return deviceId
  }

  /**
   * 哈希设备信息 (保护隐私)
   */
  private static hashDeviceInfo(info: string): string {
    return crypto
      .createHash('sha256')
      .update(info + 'topwindow-salt')
      .digest('hex')
      .slice(0, 32)
  }

  /**
   * 降级方案：使用 IDFV + 时间戳
   */
  private static getFallbackDeviceId(): string {
    // 在实际应用中，可以使用 IDFV (Identifier for Vendor)
    // 这里使用一个基于机器信息的简单方案
    const os = require('os')
    const machineInfo = `${os.hostname()}-${os.platform()}-${os.arch()}`
    return this.hashDeviceInfo(machineInfo)
  }
}
```

### 激活验证API

#### 许可证激活接口
```typescript
// src/app/api/licenses/activate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { license_key, device_id, device_info } = await request.json()

    if (!license_key || !device_id) {
      return NextResponse.json(
        { status: 'error', message: 'License key and device ID are required.' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // 1. 查询许可证
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', license_key)
      .single()

    if (licenseError || !license) {
      return NextResponse.json(
        { status: 'error', message: 'License key not found.' },
        { status: 404 }
      )
    }

    // 2. 检查许可证状态
    if (license.status !== 'active') {
      return NextResponse.json(
        { status: 'error', message: `License key is ${license.status}.` },
        { status: 403 }
      )
    }

    // 3. 检查过期时间
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      // 更新许可证状态为过期
      await supabase
        .from('licenses')
        .update({ status: 'expired' })
        .eq('license_key', license_key)

      return NextResponse.json(
        { status: 'error', message: 'License key has expired.' },
        { status: 403 }
      )
    }

    // 4. 检查设备是否已激活
    const { data: existingDevice } = await supabase
      .from('user_devices')
      .select('*')
      .eq('license_key', license_key)
      .eq('device_id', device_id)
      .single()

    if (existingDevice) {
      // 更新最后见到时间
      await supabase
        .from('user_devices')
        .update({ 
          last_seen_at: new Date().toISOString(),
          device_info: device_info 
        })
        .eq('id', existingDevice.id)

      return NextResponse.json({
        status: 'success',
        message: 'Device already activated.',
        expires_at: license.expires_at,
        activation_info: {
          activated_at: existingDevice.first_activated_at,
          device_name: existingDevice.device_name
        }
      })
    }

    // 5. 检查激活数量限制
    const { data: activatedDevices } = await supabase
      .from('user_devices')
      .select('id')
      .eq('license_key', license_key)
      .eq('status', 'active')

    if (activatedDevices && activatedDevices.length >= license.activation_limit) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: `Activation limit reached. Maximum ${license.activation_limit} devices allowed.`,
          activated_count: activatedDevices.length,
          activation_limit: license.activation_limit
        },
        { status: 403 }
      )
    }

    // 6. 激活新设备
    const { data: newDevice, error: deviceError } = await supabase
      .from('user_devices')
      .insert({
        user_id: license.user_id,
        license_key: license_key,
        device_id: device_id,
        device_name: device_info?.name || 'Unknown Device',
        device_type: device_info?.type || 'mac',
        device_info: device_info || {},
        status: 'active'
      })
      .select()
      .single()

    if (deviceError) {
      throw deviceError
    }

    // 7. 更新许可证的最后验证时间
    await supabase
      .from('licenses')
      .update({ last_validated_at: new Date().toISOString() })
      .eq('license_key', license_key)

    return NextResponse.json({
      status: 'success',
      message: 'Activation successful.',
      expires_at: license.expires_at,
      activation_info: {
        activated_at: newDevice.first_activated_at,
        device_name: newDevice.device_name,
        remaining_activations: license.activation_limit - (activatedDevices?.length || 0) - 1
      }
    })

  } catch (error) {
    console.error('License activation error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Internal server error.' },
      { status: 500 }
    )
  }
}
```

#### 许可证验证接口
```typescript
// src/app/api/licenses/validate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { license_key, device_id } = await request.json()

    if (!license_key || !device_id) {
      return NextResponse.json(
        { status: 'error', message: 'License key and device ID are required.' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // 1. 查询许可证和设备信息
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select(`
        *,
        user_devices!inner(*)
      `)
      .eq('license_key', license_key)
      .eq('user_devices.device_id', device_id)
      .eq('user_devices.status', 'active')
      .single()

    if (licenseError || !license) {
      return NextResponse.json(
        { status: 'error', message: 'License or device not found.' },
        { status: 404 }
      )
    }

    // 2. 检查许可证状态
    const currentTime = new Date()
    let isValid = true
    let message = 'License is valid.'

    if (license.status !== 'active') {
      isValid = false
      message = `License is ${license.status}.`
    } else if (license.expires_at && new Date(license.expires_at) < currentTime) {
      isValid = false
      message = 'License has expired.'
      
      // 更新许可证状态
      await supabase
        .from('licenses')
        .update({ status: 'expired' })
        .eq('license_key', license_key)
    }

    // 3. 更新设备最后见到时间
    if (isValid) {
      await supabase
        .from('user_devices')
        .update({ last_seen_at: currentTime.toISOString() })
        .eq('license_key', license_key)
        .eq('device_id', device_id)

      // 更新许可证最后验证时间
      await supabase
        .from('licenses')
        .update({ last_validated_at: currentTime.toISOString() })
        .eq('license_key', license_key)
    }

    return NextResponse.json({
      status: isValid ? 'success' : 'error',
      message,
      license_info: {
        expires_at: license.expires_at,
        status: license.status,
        last_validated_at: license.last_validated_at
      },
      device_info: {
        last_seen_at: license.user_devices[0]?.last_seen_at,
        device_name: license.user_devices[0]?.device_name
      }
    })

  } catch (error) {
    console.error('License validation error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Internal server error.' },
      { status: 500 }
    )
  }
}
```

---

## 💳 双支付平台集成方案

### 支付平台对比

#### Creem 支付平台
**优势**：
- ✅ 内置 License Key 管理功能
- ✅ 专为数字产品设计  
- ✅ Next.js 专门支持
- ✅ 简洁的 API 设计
- ✅ TypeScript SDK

**适用场景**：
- 数字产品和软件许可证
- 需要 License Key 管理的产品
- 简单直接的支付流程

#### Paddle 支付平台
**优势**：
- ✅ 全球 200+ 国家支持
- ✅ 自动税务合规处理
- ✅ 成熟的订阅管理
- ✅ 完整的发票系统
- ✅ 企业级功能

**适用场景**：
- 全球化产品
- 需要复杂税务处理
- 订阅制产品

### 数据库设计

#### 支付记录表
```sql
-- 支付记录表
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_provider TEXT NOT NULL CHECK (payment_provider IN ('creem', 'paddle')),
  provider_payment_id TEXT,
  provider_session_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  product_info JSONB NOT NULL,
  customer_info JSONB,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  webhook_received_at TIMESTAMPTZ,
  UNIQUE(payment_provider, provider_payment_id)
);

-- 产品信息表
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  license_type TEXT DEFAULT 'standard',
  activation_limit INT DEFAULT 3,
  features JSONB DEFAULT '[]'::JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认产品
INSERT INTO products (id, name, description, price, currency, activation_limit, features) VALUES 
('topwindow-license', 'TopWindow License', 'TopWindow 永久使用许可证', 29.99, 'USD', 3, 
 '["永久使用权", "支持3台设备", "免费更新", "优先技术支持"]'::jsonb);

-- 索引
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_provider ON payments(payment_provider);
CREATE INDEX idx_payments_status ON payments(status);
```

### 统一支付会话创建

#### 支付会话API
```typescript
// src/app/api/payments/create-session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface CreateSessionRequest {
  provider: 'creem' | 'paddle'
  product_id: string
  success_url: string
  cancel_url: string
  customer_email?: string
}

export async function POST(request: NextRequest) {
  try {
    const { provider, product_id, success_url, cancel_url, customer_email }: CreateSessionRequest = await request.json()

    const supabase = createRouteHandlerClient({ cookies })

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 获取产品信息
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .eq('is_active', true)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { status: 'error', message: 'Product not found' },
        { status: 404 }
      )
    }

    // 创建支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        payment_provider: provider,
        amount: product.price,
        currency: product.currency,
        status: 'pending',
        product_info: {
          product_id: product.id,
          name: product.name,
          price: product.price,
          currency: product.currency
        },
        customer_info: {
          email: customer_email || user.email,
          user_id: user.id
        }
      })
      .select()
      .single()

    if (paymentError) {
      throw paymentError
    }

    let sessionResult

    if (provider === 'creem') {
      sessionResult = await createCreemSession({
        payment,
        product,
        user,
        success_url,
        cancel_url
      })
    } else {
      sessionResult = await createPaddleSession({
        payment,
        product,
        user,
        success_url,
        cancel_url
      })
    }

    // 更新支付记录的会话ID
    await supabase
      .from('payments')
      .update({ 
        provider_session_id: sessionResult.session_id,
        metadata: sessionResult.metadata 
      })
      .eq('id', payment.id)

    return NextResponse.json({
      status: 'success',
      payment_id: payment.id,
      session_url: sessionResult.url,
      session_id: sessionResult.session_id
    })

  } catch (error) {
    console.error('Create payment session error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}

// Creem 支付会话创建
async function createCreemSession({ payment, product, user, success_url, cancel_url }: any) {
  const response = await fetch('https://api.creem.io/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CREEM_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product_id: product.id,
      amount: Math.round(product.price * 100), // Creem 使用分为单位
      currency: product.currency,
      customer: {
        email: user.email,
        name: user.user_metadata?.full_name || user.email
      },
      success_url: `${success_url}?payment_id=${payment.id}&provider=creem`,
      cancel_url: `${cancel_url}?payment_id=${payment.id}&provider=creem`,
      metadata: {
        payment_id: payment.id,
        user_id: user.id,
        product_id: product.id,
        generate_license: 'true'
      }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Creem API error: ${error}`)
  }

  const sessionData = await response.json()

  return {
    url: sessionData.url,
    session_id: sessionData.id,
    metadata: sessionData
  }
}

// Paddle 支付会话创建  
async function createPaddleSession({ payment, product, user, success_url, cancel_url }: any) {
  const response = await fetch('https://api.paddle.com/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{
        price_id: product.paddle_price_id || 'pri_01ha1vkf8x9x9x9x9x9x9x9x9x', // Paddle 价格ID
        quantity: 1
      }],
      customer_email: user.email,
      success_url: `${success_url}?payment_id=${payment.id}&provider=paddle`,
      cancel_url: `${cancel_url}?payment_id=${payment.id}&provider=paddle`,
      custom_data: {
        payment_id: payment.id,
        user_id: user.id,
        product_id: product.id
      }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Paddle API error: ${error}`)
  }

  const sessionData = await response.json()

  return {
    url: sessionData.data.url,
    session_id: sessionData.data.id,
    metadata: sessionData.data
  }
}
```

### Webhook 处理

#### Creem Webhook 处理
```typescript
// src/app/api/payments/creem/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('creem-signature')

    // 验证 Creem Webhook 签名
    if (!verifyCreemWebhook(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    const supabase = createRouteHandlerClient({ cookies })

    switch (event.type) {
      case 'payment.completed':
        await handlePaymentCompleted(event.data, supabase)
        break

      case 'payment.failed':
        await handlePaymentFailed(event.data, supabase)
        break

      case 'payment.refunded':
        await handlePaymentRefunded(event.data, supabase)
        break

      default:
        console.log(`Unhandled Creem webhook event: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Creem webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCompleted(data: any, supabase: any) {
  const { session_id, payment_id, amount, currency, metadata } = data

  // 更新支付状态
  const { data: payment, error: updateError } = await supabase
    .from('payments')
    .update({
      provider_payment_id: payment_id,
      status: 'completed',
      completed_at: new Date().toISOString(),
      webhook_received_at: new Date().toISOString(),
      metadata: { ...metadata, webhook_data: data }
    })
    .eq('provider_session_id', session_id)
    .select()
    .single()

  if (updateError || !payment) {
    throw new Error(`Failed to update payment: ${updateError?.message}`)
  }

  // 生成许可证
  if (metadata.generate_license === 'true') {
    await generateLicense({
      userId: payment.user_id,
      paymentId: payment.id,
      productId: metadata.product_id || 'topwindow-license'
    })
  }

  // 发送确认邮件
  await sendPaymentConfirmationEmail(payment)
}

async function handlePaymentFailed(data: any, supabase: any) {
  const { session_id, reason } = data

  await supabase
    .from('payments')
    .update({
      status: 'failed',
      webhook_received_at: new Date().toISOString(),
      metadata: { failure_reason: reason, webhook_data: data }
    })
    .eq('provider_session_id', session_id)
}

function verifyCreemWebhook(body: string, signature: string | null): boolean {
  if (!signature || !process.env.CREEM_WEBHOOK_SECRET) {
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.CREEM_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

#### 许可证生成服务
```typescript
// src/lib/license/service.ts
import { LicenseKeyGenerator } from './generator'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface GenerateLicenseParams {
  userId: string
  paymentId: string
  productId: string
}

export async function generateLicense({ userId, paymentId, productId }: GenerateLicenseParams) {
  try {
    // 获取产品信息
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      throw new Error(`Product not found: ${productId}`)
    }

    // 生成许可证密钥
    const generator = new LicenseKeyGenerator()
    const licenseKey = generator.generateLicenseKey()

    // 插入许可证记录
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .insert({
        license_key: licenseKey,
        user_id: userId,
        payment_id: paymentId,
        product_id: productId,
        status: 'active',
        activation_limit: product.activation_limit,
        activated_devices: [],
        metadata: {
          generated_at: new Date().toISOString(),
          product_info: product
        }
      })
      .select()
      .single()

    if (licenseError) {
      throw licenseError
    }

    // 获取用户信息
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId)
    
    if (userError || !user) {
      throw new Error(`User not found: ${userId}`)
    }

    // 发送许可证邮件
    await sendLicenseEmail({
      userEmail: user.user.email!,
      userName: user.user.user_metadata?.full_name || user.user.email!,
      licenseKey,
      productName: product.name,
      activationLimit: product.activation_limit
    })

    console.log(`License generated successfully: ${licenseKey} for user ${userId}`)
    
    return license

  } catch (error) {
    console.error('Generate license error:', error)
    throw error
  }
}

async function sendLicenseEmail({ userEmail, userName, licenseKey, productName, activationLimit }: {
  userEmail: string
  userName: string
  licenseKey: string
  productName: string
  activationLimit: number
}) {
  // 这里可以集成邮件服务，如 Resend, SendGrid 等
  // 示例使用 Resend
  
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>🎉 感谢您购买 ${productName}！</h2>
      
      <p>亲爱的 ${userName}，</p>
      
      <p>您的购买已完成，以下是您的许可证信息：</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>许可证密钥</h3>
        <code style="font-size: 18px; font-weight: bold; color: #0066cc;">${licenseKey}</code>
      </div>
      
      <div style="background-color: #e8f4fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4>许可证信息</h4>
        <ul>
          <li><strong>产品：</strong>${productName}</li>
          <li><strong>设备限制：</strong>最多 ${activationLimit} 台设备</li>
          <li><strong>有效期：</strong>永久</li>
          <li><strong>更新：</strong>免费更新</li>
        </ul>
      </div>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4>📱 如何激活</h4>
        <ol>
          <li>下载并安装 TopWindow</li>
          <li>打开应用，进入"激活"页面</li>
          <li>输入您的许可证密钥</li>
          <li>点击"激活"完成激活</li>
        </ol>
      </div>
      
      <p>如果您有任何问题，请随时联系我们的技术支持。</p>
      
      <p>再次感谢您的支持！</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 14px;">
        此邮件由 TopWindow 自动发送，请勿回复。<br>
        如需帮助，请访问我们的支持中心。
      </p>
    </div>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'TopWindow <noreply@topwindow.app>',
        to: [userEmail],
        subject: `🎉 您的 ${productName} 许可证已激活`,
        html: emailContent
      })
    })

    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`)
    }

    console.log(`License email sent to: ${userEmail}`)
    
  } catch (error) {
    console.error('Send license email error:', error)
    // 邮件发送失败不应该阻止许可证生成
  }
}
```

---

## 🎨 前端界面设计

### 支付组件设计

#### 支付选择器组件
```typescript
// src/components/payments/PaymentSelector.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { CreditCard, Zap, Shield, Check } from 'lucide-react'

interface PaymentSelectorProps {
  productId: string
  onPaymentStart?: () => void
  onPaymentSuccess?: () => void
  onPaymentCancel?: () => void
}

export default function PaymentSelector({ 
  productId, 
  onPaymentStart, 
  onPaymentSuccess, 
  onPaymentCancel 
}: PaymentSelectorProps) {
  const { user } = useAuth()
  const [selectedProvider, setSelectedProvider] = useState<'creem' | 'paddle'>('creem')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePurchase = async () => {
    if (!user) {
      setError('请先登录后再购买')
      return
    }

    setLoading(true)
    setError('')
    onPaymentStart?.()

    try {
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: selectedProvider,
          product_id: productId,
          success_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`,
          customer_email: user.email
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '创建支付会话失败')
      }

      // 重定向到支付页面
      window.location.href = data.session_url

    } catch (err: any) {
      setError(err.message || '支付初始化失败，请重试')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 产品信息 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">TopWindow License</h3>
          <div className="text-3xl font-bold text-primary mb-4">$29.99</div>
          <p className="text-gray-600">一次性购买，永久使用</p>
        </div>

        {/* 功能列表 */}
        <div className="space-y-3 mb-6">
          {[
            '✅ 永久使用权',
            '✅ 支持 3 台设备',
            '✅ 免费更新',
            '✅ 优先技术支持',
            '✅ 30天退款保证'
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* 支付方式选择 */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">选择支付方式</h4>
          
          <div className="space-y-3">
            {/* Creem 选项 */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedProvider === 'creem' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedProvider('creem')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedProvider === 'creem' 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                  }`}>
                    {selectedProvider === 'creem' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Creem Pay</div>
                    <div className="text-sm text-gray-600">推荐 • 专为数字产品设计</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>

            {/* Paddle 选项 */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedProvider === 'paddle' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedProvider('paddle')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedProvider === 'paddle' 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                  }`}>
                    {selectedProvider === 'paddle' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Paddle</div>
                    <div className="text-sm text-gray-600">全球支付 • 自动税务处理</div>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 购买按钮 */}
        <button
          onClick={handlePurchase}
          disabled={loading || !user}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              处理中...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              立即购买
            </>
          )}
        </button>

        {!user && (
          <p className="text-center text-gray-600 text-sm mt-3">
            请先登录后再购买
          </p>
        )}

        <p className="text-center text-gray-500 text-xs mt-4">
          点击购买即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  )
}
```

### 用户仪表板设计

#### 许可证管理组件
```typescript
// src/components/dashboard/LicenseManager.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { Key, Smartphone, Monitor, Calendar, Shield, AlertCircle } from 'lucide-react'

interface License {
  license_key: string
  product_id: string
  status: string
  activation_limit: number
  activated_devices: any[]
  created_at: string
  expires_at: string | null
  user_devices: Array<{
    device_name: string
    device_type: string
    first_activated_at: string
    last_seen_at: string
    status: string
  }>
}

export default function LicenseManager() {
  const { user } = useAuth()
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchLicenses()
    }
  }, [user])

  const fetchLicenses = async () => {
    try {
      const response = await fetch('/api/licenses/my')
      const data = await response.json()

      if (response.ok) {
        setLicenses(data.licenses || [])
      } else {
        setError(data.message || '获取许可证失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'expired':
        return 'text-red-600 bg-red-100'
      case 'revoked':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '激活'
      case 'expired':
        return '已过期'
      case 'revoked':
        return '已撤销'
      default:
        return '未知'
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'macbook':
      case 'macbook_pro':
      case 'macbook_air':
        return <Smartphone className="w-5 h-5" />
      default:
        return <Monitor className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">加载失败</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchLicenses}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    )
  }

  if (licenses.length === 0) {
    return (
      <div className="text-center py-12">
        <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无许可证</h3>
        <p className="text-gray-600 mb-6">
          您还没有购买任何许可证，购买后将在这里显示。
        </p>
        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors">
          立即购买
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">我的许可证</h2>
        <span className="text-gray-600">{licenses.length} 个许可证</span>
      </div>

      {licenses.map((license) => (
        <div key={license.license_key} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* 许可证头部 */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Key className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">TopWindow License</h3>
                  <p className="text-gray-600">永久许可证</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(license.status)}`}>
                {getStatusText(license.status)}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">许可证密钥</span>
              </div>
              <code className="text-lg font-mono text-gray-900 bg-white px-3 py-2 rounded border">
                {license.license_key}
              </code>
            </div>
          </div>

          {/* 许可证详情 */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">购买日期</span>
                </div>
                <p className="text-gray-900">{formatDate(license.created_at)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Monitor className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">设备限制</span>
                </div>
                <p className="text-gray-900">
                  {license.user_devices?.length || 0} / {license.activation_limit} 台设备
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">有效期</span>
                </div>
                <p className="text-gray-900">
                  {license.expires_at ? formatDate(license.expires_at) : '永久'}
                </p>
              </div>
            </div>

            {/* 已激活设备列表 */}
            {license.user_devices && license.user_devices.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">已激活设备</h4>
                <div className="space-y-3">
                  {license.user_devices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          {getDeviceIcon(device.device_type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{device.device_name}</p>
                          <p className="text-sm text-gray-600">
                            激活于 {formatDate(device.first_activated_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">最后活跃</p>
                        <p className="text-sm text-gray-900">
                          {formatDate(device.last_seen_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 剩余激活次数 */}
            {license.status === 'active' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    还可以在 {license.activation_limit - (license.user_devices?.length || 0)} 台设备上激活
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## ⚙️ 部署和配置

### Vercel 部署配置

#### 环境变量配置
```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Creem 配置
CREEM_PUBLIC_KEY=pk_test_...
CREEM_SECRET_KEY=sk_test_...
CREEM_WEBHOOK_SECRET=whsec_...

# Paddle 配置  
PADDLE_PUBLIC_KEY=pk_test_...
PADDLE_API_KEY=sk_test_...
PADDLE_WEBHOOK_SECRET=whsec_...

# 邮件服务配置
RESEND_API_KEY=re_...

# 应用配置
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com
```

#### Next.js 配置更新
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除静态导出配置，启用服务端功能
  // output: 'export', // 删除这行
  
  trailingSlash: true,
  images: {
    unoptimized: true // 如果需要的话保留
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  },
  
  // 添加重定向规则
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/login',
        permanent: true
      }
    ]
  },

  // 添加环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
}

module.exports = nextConfig
```

### Supabase 项目配置

#### 数据库初始化脚本
```sql
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户资料表
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建产品表
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  license_type TEXT DEFAULT 'standard',
  activation_limit INT DEFAULT 3,
  features JSONB DEFAULT '[]'::JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建支付记录表
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_provider TEXT NOT NULL CHECK (payment_provider IN ('creem', 'paddle')),
  provider_payment_id TEXT,
  provider_session_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  product_info JSONB NOT NULL,
  customer_info JSONB,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  webhook_received_at TIMESTAMPTZ,
  UNIQUE(payment_provider, provider_payment_id)
);

-- 创建许可证表
CREATE TABLE licenses (
  license_key TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_id UUID REFERENCES payments(id),
  product_id TEXT REFERENCES products(id) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  activation_limit INT DEFAULT 3 NOT NULL,
  activated_devices JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  last_validated_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- 创建设备信息表
CREATE TABLE user_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  license_key TEXT REFERENCES licenses(license_key),
  device_id TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT,
  device_info JSONB,
  first_activated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'revoked')),
  UNIQUE(license_key, device_id)
);

-- 创建索引
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_provider ON payments(payment_provider);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_licenses_user_id ON licenses(user_id);
CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_devices_user_id ON user_devices(user_id);
CREATE INDEX idx_devices_license_key ON user_devices(license_key);

-- 启用 RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own licenses" ON licenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own devices" ON user_devices
  FOR SELECT USING (auth.uid() = user_id);

-- 插入默认产品数据
INSERT INTO products (id, name, description, price, currency, activation_limit, features) VALUES 
('topwindow-license', 'TopWindow License', 'TopWindow 永久使用许可证', 29.99, 'USD', 3, 
 '["永久使用权", "支持3台设备", "免费更新", "优先技术支持", "30天退款保证"]'::jsonb);

-- 创建自动更新 updated_at 的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新触发器
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Google OAuth 配置
1. 在 Google Cloud Console 创建 OAuth 2.0 客户端
2. 配置授权重定向 URI：`https://your-project.supabase.co/auth/v1/callback`
3. 在 Supabase Dashboard → Authentication → Providers → Google 中配置：
   - 启用 Google provider
   - 输入 Client ID 和 Client Secret
   - 设置重定向 URL

---

## 📋 开发实施计划

### 阶段一：基础设施搭建 (3-4 天)

#### 第一天：项目配置和 Supabase 设置
- [✅] 修改 `next.config.js` 移除静态导出
- [✅] 安装 Supabase 相关依赖
- [🔄] 创建 Supabase 项目和数据库 (配置文件已完成，需要外部服务设置)
- [🔄] 运行数据库初始化脚本 (需要在 Supabase 控制台执行)
- [🔄] 配置 Google OAuth (需要在 Google Cloud Console 配置)

#### 第二天：认证系统基础
- [✅] 创建 Supabase 客户端配置
- [✅] 实现 AuthProvider 和 useAuth Hook
- [✅] 创建中间件认证保护
- [✅] 实现基本的登录/注册组件 (基础结构已完成)

#### 第三天：License Key 系统
- [ ] 实现 License Key 生成器
- [ ] 创建许可证激活 API
- [ ] 实现许可证验证 API
- [ ] 创建设备管理逻辑

#### 第四天：支付平台集成
- [ ] 注册 Creem 和 Paddle 账户
- [ ] 实现支付会话创建 API
- [ ] 配置 Webhook 处理
- [ ] 测试支付流程

### 阶段二：前端界面开发 (3-4 天)

#### 第五天：导航和认证界面
- [ ] 创建 Header 组件
- [ ] 实现登录/注册表单
- [ ] 创建用户下拉菜单
- [ ] 集成到现有页面布局

#### 第六天：支付界面
- [ ] 创建 PaymentSelector 组件
- [ ] 实现支付成功/失败页面
- [ ] 集成到 CallToActionSection
- [ ] 添加支付状态跟踪

#### 第七天：用户仪表板
- [ ] 创建仪表板布局
- [ ] 实现 LicenseManager 组件
- [ ] 创建设备管理界面
- [ ] 实现个人资料管理

#### 第八天：界面优化
- [ ] 响应式设计适配
- [ ] 动画效果集成
- [ ] 错误处理完善
- [ ] 加载状态优化

### 阶段三：集成测试和优化 (2-3 天)

#### 第九天：端到端测试
- [ ] 用户注册流程测试
- [ ] 支付购买流程测试
- [ ] 许可证激活测试
- [ ] 设备管理测试

#### 第十天：错误处理和边界情况
- [ ] 支付失败处理
- [ ] 网络错误处理
- [ ] 许可证状态异常处理
- [ ] 设备激活限制测试

#### 第十一天：性能优化和部署
- [ ] 代码分割优化
- [ ] 图片和资源优化
- [ ] SEO 配置更新
- [ ] Vercel 部署配置

### 阶段四：上线和监控 (1-2 天)

#### 第十二天：生产环境配置
- [ ] 生产环境变量配置
- [ ] 域名和 SSL 配置
- [ ] 支付平台生产环境切换
- [ ] 邮件服务配置

#### 第十三天：监控和文档
- [ ] 错误监控配置 (Sentry)
- [ ] 分析工具集成 (Google Analytics)
- [ ] 用户文档编写
- [ ] 运维文档完善

---

## 🔧 开发工具和最佳实践

### 依赖包管理
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "uuid": "^9.0.0",
    "resend": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/uuid": "^9.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0"
  }
}
```

### 代码质量工具

#### ESLint 配置
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "prefer-const": "warn"
  }
}
```

#### TypeScript 配置
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 安全最佳实践

#### API 路由安全
```typescript
// 通用的 API 错误处理
export function handleApiError(error: any, context: string) {
  console.error(`${context}:`, error)
  
  // 不向客户端暴露敏感错误信息
  const clientError = error.code === 'PGRST116' 
    ? 'Resource not found'
    : 'Internal server error'
    
  return new Response(
    JSON.stringify({ error: clientError }),
    { status: error.code === 'PGRST116' ? 404 : 500 }
  )
}

// API 限流
const rateLimitMap = new Map()

export function rateLimit(identifier: string, limit: number = 10, window: number = 60000) {
  const now = Date.now()
  const key = `${identifier}-${Math.floor(now / window)}`
  
  const current = rateLimitMap.get(key) || 0
  if (current >= limit) {
    return false
  }
  
  rateLimitMap.set(key, current + 1)
  return true
}
```

#### 输入验证
```typescript
// 数据验证工具
export const validators = {
  email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  licenseKey: (key: string) => /^TW-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key),
  deviceId: (id: string) => id.length >= 8 && id.length <= 64,
  uuid: (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

// 清理用户输入
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}
```

---

## 📊 监控和分析

### 错误监控配置 (Sentry)
```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  debug: false,
  environment: process.env.NODE_ENV,
  
  beforeSend(event) {
    // 过滤敏感信息
    if (event.request?.data) {
      delete event.request.data.password
      delete event.request.data.license_key
    }
    return event
  },

  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", /^https:\/\/yourapp\.com\/api/],
    }),
  ],
  
  tracesSampleRate: 0.1,
})
```

### 分析工具集成
```typescript
// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const gtag = {
  pageview: (url: string) => {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  },
  
  event: ({ action, category, label, value }: {
    action: string
    category: string
    label?: string
    value?: number
  }) => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  },
}

// 关键事件跟踪
export const trackEvents = {
  userRegistered: () => gtag.event({
    action: 'user_registered',
    category: 'auth'
  }),
  
  purchaseStarted: (provider: string) => gtag.event({
    action: 'purchase_started',
    category: 'payment',
    label: provider
  }),
  
  purchaseCompleted: (amount: number, currency: string) => gtag.event({
    action: 'purchase_completed',
    category: 'payment',
    value: amount
  }),
  
  licenseActivated: () => gtag.event({
    action: 'license_activated',
    category: 'license'
  })
}
```

---

## 🚀 总结

这份技术文档涵盖了将 TopWindow 网站从静态展示升级为功能完整的 SaaS 产品的完整方案：

### 核心功能
✅ **用户认证系统** - 基于 Supabase Auth 的邮箱和 Google OAuth 登录  
✅ **License Key 管理** - 完整的四阶段验证流程和设备管理  
✅ **双支付平台** - Creem (主要) + Paddle (备用) 的灵活支付方案  
✅ **用户仪表板** - 许可证管理、设备控制、支付历史

### 技术优势
✅ **现代化架构** - Next.js 14 + TypeScript + Supabase  
✅ **安全可靠** - RLS 权限控制、Webhook 签名验证、输入验证  
✅ **用户体验** - 无缝支付流程、实时状态更新、响应式设计  
✅ **可扩展性** - 模块化设计、双支付平台支持、监控完善

### 开发时间线
预计 **10-13 天** 完成完整开发和部署：
- 基础设施搭建：3-4 天
- 前端界面开发：3-4 天  
- 集成测试优化：2-3 天
- 上线部署监控：1-2 天

这个方案为 TopWindow 提供了一个商业化就绪的完整解决方案，支持用户管理、许可证销售、设备激活等核心 SaaS 功能，同时保持了良好的用户体验和技术可维护性。

---

## 📅 实施进度日志

### 第一天 (2024-08-21)
✅ **基础设施搭建部分完成**
- Next.js 配置已更新，支持 API 路由
- Supabase 相关依赖包安装完成
- Supabase 项目配置文件创建完成，包含完整类型定义
- 认证基础架构已建立 (AuthContext, 中间件, 基础页面)
- 环境变量模板已创建

🔄 **待完成任务 (需要外部服务配置)**
- Supabase 项目创建和数据库表结构设置
- Google OAuth 在 Google Cloud Console 的配置
- 环境变量的实际值配置

📋 **已创建的文件**
- `src/lib/supabase/client.ts` - Supabase 客户端配置
- `src/lib/supabase/server.ts` - Supabase 服务端配置
- `src/types/supabase.ts` - 完整数据库类型定义
- `src/lib/context/AuthContext.tsx` - 认证上下文
- `middleware.ts` - 路由保护中间件
- `src/app/auth/login/page.tsx` - 登录页面
- `src/app/auth/callback/route.ts` - OAuth 回调处理
- `src/app/dashboard/page.tsx` - 用户仪表板
- `.env.local` - 环境变量模板

**下一步行动**：
1. 在 [supabase.com](https://supabase.com) 创建项目并获取 URL 和 API Keys
2. 在 Supabase SQL 编辑器中执行数据库初始化脚本
3. 在 Google Cloud Console 配置 OAuth 2.0 客户端
4. 更新 `.env.local` 文件中的实际配置值
5. 测试认证流程并开始第二天的任务