# TopWindow SaaS 升级 - 第一天实施计划

## 📋 任务概览

**目标**：完成基础设施搭建，从静态网站转换为支持用户认证的 SaaS 应用基础架构

**预计时间**：3-4 小时  
**风险级别**：低（所有变更可回滚）  
**完成标准**：Next.js 支持 API 路由，Supabase 连接正常，认证基础架构就绪

---

## ⏰ 时间安排

| 时间段 | 任务 | 预计用时 |
|--------|------|----------|
| 09:00-09:15 | 任务1: 修改 Next.js 配置 | 15分钟 |
| 09:15-09:25 | 任务2: 安装 Supabase 依赖 | 10分钟 |
| 09:25-09:55 | 任务3: 创建 Supabase 项目配置 | 30分钟 |
| 09:55-10:40 | 任务4: 设置数据库结构 | 45分钟 |
| 10:40-11:10 | 任务5: 配置 Google OAuth | 30分钟 |
| 11:10-11:40 | 任务6: 创建基础认证组件结构 | 30分钟 |
| 11:40-11:50 | 任务7: 更新技术文档进度 | 10分钟 |

---

## 🔧 详细操作步骤

### 任务1：修改 Next.js 配置 (15分钟)

**目标**：移除静态导出配置，启用服务端功能

**当前问题**：
- `next.config.js` 配置为 `output: 'export'`，这会禁用 API 路由
- 需要启用服务端功能以支持认证和支付 API

**操作步骤**：

1. **修改 `next.config.js`**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     // 移除这行: output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
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
     }
   }
   
   module.exports = nextConfig
   ```

2. **修改 `package.json` 脚本**
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       // 移除这行: "export": "next build && next export",
       "lint": "next lint",
       "type-check": "tsc --noEmit"
     }
   }
   ```

3. **验证**：
   ```bash
   npm run dev
   # 应该能正常启动，没有静态导出相关错误
   ```

---

### 任务2：安装 Supabase 依赖 (10分钟)

**目标**：安装认证和数据库相关依赖包

**操作步骤**：

1. **安装核心依赖**
   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs uuid resend
   ```

2. **安装开发依赖**
   ```bash
   npm install --save-dev @types/uuid
   ```

3. **验证安装**
   ```bash
   npm list @supabase/supabase-js
   # 应该显示已安装的版本
   ```

**依赖说明**：
- `@supabase/supabase-js`: Supabase JavaScript 客户端
- `@supabase/auth-helpers-nextjs`: Next.js 认证助手
- `uuid`: 生成唯一标识符
- `resend`: 邮件服务（用于发送许可证邮件）

---

### 任务3：创建 Supabase 项目配置 (30分钟)

**目标**：建立 Supabase 客户端和服务端配置

**前置条件**：
- 需要在 [supabase.com](https://supabase.com) 创建项目
- 获取项目 URL 和 API Keys

**操作步骤**：

1. **创建 Supabase 客户端配置**
   
   创建 `src/lib/supabase/client.ts`：
   ```typescript
   import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
   import type { Database } from '@/types/supabase'

   export const supabase = createClientComponentClient<Database>()
   ```

2. **创建 Supabase 服务端配置**
   
   创建 `src/lib/supabase/server.ts`：
   ```typescript
   import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
   import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
   import { cookies } from 'next/headers'
   import type { Database } from '@/types/supabase'

   export const createServerClient = () =>
     createServerComponentClient<Database>({ cookies })

   export const createRouteClient = () =>
     createRouteHandlerClient<Database>({ cookies })
   ```

3. **创建类型定义文件**
   
   创建 `src/types/supabase.ts`：
   ```typescript
   export type Json =
     | string
     | number
     | boolean
     | null
     | { [key: string]: Json | undefined }
     | Json[]

   export interface Database {
     public: {
       Tables: {
         user_profiles: {
           Row: {
             id: string
             full_name: string | null
             avatar_url: string | null
             created_at: string
             updated_at: string
           }
           Insert: {
             id: string
             full_name?: string | null
             avatar_url?: string | null
             created_at?: string
             updated_at?: string
           }
           Update: {
             id?: string
             full_name?: string | null
             avatar_url?: string | null
             created_at?: string
             updated_at?: string
           }
         }
         // 其他表类型定义将在后续添加
       }
     }
   }
   ```

4. **创建环境变量模板**
   
   创建 `.env.local`：
   ```bash
   # Supabase 配置
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # 应用配置
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000

   # 支付平台配置（暂时留空）
   CREEM_PUBLIC_KEY=
   CREEM_SECRET_KEY=
   PADDLE_PUBLIC_KEY=
   PADDLE_API_KEY=

   # 邮件服务配置
   RESEND_API_KEY=
   ```

5. **更新 `.gitignore`**
   ```
   # 添加到 .gitignore
   .env.local
   .env.*.local
   ```

---

### 任务4：设置数据库结构 (45分钟)

**目标**：在 Supabase 控制台创建数据库表和安全策略

**操作步骤**：

1. **打开 Supabase SQL 编辑器**
   - 登录 Supabase 控制台
   - 进入项目 > SQL Editor

2. **执行数据库初始化脚本**
   
   复制以下 SQL 并执行：
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
   ```

3. **创建索引**
   ```sql
   -- 创建索引优化查询性能
   CREATE INDEX idx_payments_user_id ON payments(user_id);
   CREATE INDEX idx_payments_provider ON payments(payment_provider);
   CREATE INDEX idx_payments_status ON payments(status);
   CREATE INDEX idx_licenses_user_id ON licenses(user_id);
   CREATE INDEX idx_licenses_status ON licenses(status);
   CREATE INDEX idx_devices_user_id ON user_devices(user_id);
   CREATE INDEX idx_devices_license_key ON user_devices(license_key);
   ```

4. **启用 RLS 并创建安全策略**
   ```sql
   -- 启用 RLS
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
   ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

   -- 用户资料策略
   CREATE POLICY "Users can view own profile" ON user_profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON user_profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can insert own profile" ON user_profiles
     FOR INSERT WITH CHECK (auth.uid() = id);

   -- 支付记录策略
   CREATE POLICY "Users can view own payments" ON payments
     FOR SELECT USING (auth.uid() = user_id);

   -- 许可证策略
   CREATE POLICY "Users can view own licenses" ON licenses
     FOR SELECT USING (auth.uid() = user_id);

   -- 设备策略
   CREATE POLICY "Users can view own devices" ON user_devices
     FOR SELECT USING (auth.uid() = user_id);
   ```

5. **插入默认产品数据**
   ```sql
   -- 插入 TopWindow 产品
   INSERT INTO products (id, name, description, price, currency, activation_limit, features) VALUES 
   ('topwindow-license', 'TopWindow License', 'TopWindow 永久使用许可证', 29.99, 'USD', 3, 
    '["永久使用权", "支持3台设备", "免费更新", "优先技术支持", "30天退款保证"]'::jsonb);
   ```

6. **验证数据库结构**
   ```sql
   -- 检查表是否创建成功
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
   ```

---

### 任务5：配置 Google OAuth (30分钟)

**目标**：在 Google Cloud Console 和 Supabase 中配置 OAuth 登录

**操作步骤**：

1. **Google Cloud Console 配置**
   
   a. 访问 [Google Cloud Console](https://console.cloud.google.com)
   
   b. 创建新项目或选择现有项目
   
   c. 启用 Google+ API：
   - 导航到 "APIs & Services" > "Library"
   - 搜索 "Google+ API" 并启用
   
   d. 创建 OAuth 2.0 客户端：
   - 导航到 "APIs & Services" > "Credentials"
   - 点击 "Create Credentials" > "OAuth client ID"
   - 选择 "Web application"
   - 设置授权重定向 URI：
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
   
   e. 记录 Client ID 和 Client Secret

2. **Supabase 认证配置**
   
   a. 在 Supabase 控制台进入 Authentication > Providers
   
   b. 启用 Google Provider：
   - 开启 "Enable sign in with Google"
   - 输入 Google Client ID
   - 输入 Google Client Secret
   - 设置 Redirect URL（自动生成）
   
   c. 配置认证设置：
   - Site URL: `http://localhost:3000` (开发环境)
   - Additional Redirect URLs: `http://localhost:3000/auth/callback`

3. **验证配置**
   - 在 Supabase 认证页面测试 Google 登录
   - 确认重定向 URL 正确

---

### 任务6：创建基础认证组件结构 (30分钟)

**目标**：创建认证相关的基础文件和组件结构

**操作步骤**：

1. **创建认证上下文**
   
   创建 `src/lib/context/AuthContext.tsx`：
   ```typescript
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

2. **创建认证组件目录结构**
   ```
   mkdir -p src/components/auth
   mkdir -p src/app/auth/login
   mkdir -p src/app/auth/register
   mkdir -p src/app/auth/callback
   mkdir -p src/app/dashboard
   ```

3. **创建中间件**
   
   创建 `middleware.ts`：
   ```typescript
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

4. **创建基础认证页面**
   
   创建 `src/app/auth/login/page.tsx`：
   ```typescript
   export default function LoginPage() {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="max-w-md w-full">
           <h1 className="text-2xl font-bold text-center mb-8">登录 TopWindow</h1>
           {/* 登录表单将在后续添加 */}
           <p className="text-center text-gray-600">登录功能开发中...</p>
         </div>
       </div>
     )
   }
   ```

   创建 `src/app/auth/callback/route.ts`：
   ```typescript
   import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
   import { cookies } from 'next/headers'
   import { NextRequest, NextResponse } from 'next/server'

   export async function GET(request: NextRequest) {
     const requestUrl = new URL(request.url)
     const code = requestUrl.searchParams.get('code')

     if (code) {
       const supabase = createRouteHandlerClient({ cookies })
       await supabase.auth.exchangeCodeForSession(code)
     }

     // 重定向到首页或仪表板
     return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
   }
   ```

5. **更新根布局**
   
   修改 `src/app/layout.tsx` 添加 AuthProvider：
   ```typescript
   import { AuthProvider } from '@/lib/context/AuthContext'
   // ... 其他导入

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="zh-CN">
         <body className={inter.className}>
           <AuthProvider>
             {children}
           </AuthProvider>
         </body>
       </html>
     )
   }
   ```

---

### 任务7：更新技术文档进度 (10分钟)

**目标**：在 TECHNICAL_DOCUMENTATION.md 中标记已完成的任务

**操作步骤**：

1. **更新进度状态**
   在 `TECHNICAL_DOCUMENTATION.md` 的实施计划部分将已完成项目标记为 ✅：

   ```markdown
   #### 第一天：项目配置和 Supabase 设置
   - [✅] 修改 `next.config.js` 移除静态导出
   - [✅] 安装 Supabase 相关依赖
   - [✅] 创建 Supabase 项目和数据库
   - [✅] 运行数据库初始化脚本
   - [✅] 配置 Google OAuth
   ```

2. **添加完成时间戳**
   在文档末尾添加进度日志：
   ```markdown
   ## 📅 实施进度日志

   ### 第一天 (2024-XX-XX)
   ✅ **基础设施搭建完成**
   - Next.js 配置已更新，支持 API 路由
   - Supabase 项目创建完成，数据库表结构就绪
   - Google OAuth 配置完成
   - 认证基础架构已建立
   - 所有依赖包已安装
   ```

---

## 📋 验证检查清单

完成所有任务后，请逐项验证：

### 基础功能验证
- [ ] `npm run dev` 能正常启动，无错误
- [ ] `http://localhost:3000` 可以访问
- [ ] `http://localhost:3000/auth/login` 返回登录页面
- [ ] 浏览器控制台无 Supabase 连接错误

### 环境配置验证
- [ ] `.env.local` 文件已创建并配置
- [ ] Supabase 项目 URL 和 Key 已设置
- [ ] Google OAuth 客户端 ID 已配置

### 数据库验证
- [ ] 在 Supabase 控制台能看到所有表
- [ ] 产品表有默认的 TopWindow 许可证数据
- [ ] RLS 策略已启用

### 代码结构验证
- [ ] `src/lib/supabase/` 目录存在且包含客户端配置
- [ ] `src/lib/context/AuthContext.tsx` 文件存在
- [ ] `middleware.ts` 文件存在
- [ ] 认证相关页面目录结构正确

---

## 🚨 常见问题和解决方案

### 问题1：Supabase 连接失败
**症状**：控制台显示 Supabase 认证错误
**解决**：
1. 检查 `.env.local` 中的 URL 和 Key 是否正确
2. 确认 Supabase 项目状态正常
3. 重启开发服务器

### 问题2：Google OAuth 重定向错误
**症状**：OAuth 登录后出现重定向错误
**解决**：
1. 检查 Google Cloud Console 中的重定向 URI 配置
2. 确认 Supabase 中的 Google Provider 设置
3. 检查本地环境的 Site URL 配置

### 问题3：数据库表创建失败
**症状**：SQL 执行报错
**解决**：
1. 确认有数据库管理员权限
2. 分步执行 SQL，确定具体失败的语句
3. 检查表名和字段是否有冲突

### 问题4：依赖安装失败
**症状**：npm install 报错
**解决**：
1. 清除 npm 缓存：`npm cache clean --force`
2. 删除 `node_modules` 和 `package-lock.json` 重新安装
3. 检查 Node.js 版本兼容性

---

## 🔄 回滚方案

如果遇到严重问题需要回滚：

### 快速回滚到初始状态
1. **恢复 next.config.js**
   ```bash
   git checkout next.config.js
   ```

2. **恢复 package.json**
   ```bash
   git checkout package.json
   rm -rf node_modules
   npm install
   ```

3. **删除新添加的文件**
   ```bash
   rm -rf src/lib/supabase
   rm -rf src/lib/context
   rm -rf src/components/auth
   rm middleware.ts
   rm .env.local
   ```

### 保留部分进度的回滚
- 保留 Supabase 项目和数据库结构
- 仅回滚代码文件
- 保留依赖包安装

---

## 📝 下一步准备

第一天完成后，为第二天做准备：

1. **环境确认**：确保所有配置正确无误
2. **API 测试**：准备测试 Supabase 连接和认证功能
3. **UI 组件**：准备开始开发登录/注册表单组件
4. **许可证系统**：准备实施 License Key 生成和验证逻辑

**关键文件状态检查**：
- ✅ Next.js 支持 API 路由
- ✅ Supabase 连接配置完成
- ✅ 数据库表结构就绪
- ✅ 认证基础架构建立
- ✅ OAuth 配置完成

---

**文档版本**：v1.0  
**最后更新**：2024-XX-XX  
**负责人**：开发团队  
**审核状态**：待执行