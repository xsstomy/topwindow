# Supabase 项目配置详细指南

## 📋 概述

本指南将帮助您完成 Supabase 项目的完整设置，包括账户注册、项目创建、数据库配置等。所有步骤都有详细的中文说明。

**预计时间**: 30-45分钟  
**难度等级**: 初级  
**前置条件**: 有效的邮箱地址

---

## 🔐 第一步：注册 Supabase 账户 (5分钟)

### 1.1 访问 Supabase 官网

1. 打开浏览器，访问：https://supabase.com
2. 页面加载后，您会看到 Supabase 的主页
3. 点击右上角的 **"Start your project"** (开始您的项目) 按钮

### 1.2 选择注册方式

页面会显示登录/注册选项：

**方式一：使用 GitHub 账户注册 (推荐)**
- 点击 **"Continue with GitHub"** (继续使用 GitHub)
- 如果您有 GitHub 账户，这是最快的方式
- 按提示登录您的 GitHub 账户并授权

**方式二：使用邮箱注册**
- 点击 **"Sign up with email"** (使用邮箱注册)
- 输入您的邮箱地址
- 输入安全密码 (至少8位，包含大小写字母和数字)
- 点击 **"Sign Up"** (注册) 按钮

### 1.3 验证邮箱

1. 注册后，检查您的邮箱
2. 找到来自 Supabase 的验证邮件
3. 点击邮件中的 **"Confirm your mail"** (确认邮箱) 链接
4. 页面会跳转回 Supabase，显示验证成功

---

## 🏗️ 第二步：创建新项目 (10分钟)

### 2.1 进入项目创建页面

1. 登录成功后，您会看到 Supabase 仪表板
2. 点击 **"New project"** (新建项目) 按钮
3. 如果这是您的第一个项目，页面会显示创建项目的表单

### 2.2 填写项目信息

**项目名称 (Name)**：
- 输入：`topwindow-saas`
- 这个名称仅供您识别，可以使用中文

**数据库密码 (Database Password)**：
- 🚨 **重要**：这个密码非常重要，请妥善保存
- 建议使用强密码，包含大小写字母、数字和特殊字符
- 示例：`TopWindow2024!@#`
- 📝 **立即记录这个密码到安全的地方**

**区域选择 (Region)**：
- 选择 **"Northeast Asia (Tokyo)"** - 东北亚（东京）
- 这是距离中国最近的服务器，访问速度最快

**定价计划 (Pricing Plan)**：
- 选择 **"Free"** (免费计划)
- 免费计划足够开发和测试使用

### 2.3 创建项目

1. 确认所有信息无误后，点击 **"Create new project"** (创建新项目) 按钮
2. 等待项目创建，通常需要1-2分钟
3. 创建完成后，您会看到项目仪表板

---

## 🔑 第三步：获取 API 密钥 (5分钟)

### 3.1 进入项目设置

1. 在项目仪表板左侧菜单中，找到 **"Settings"** (设置)
2. 点击设置下的 **"API"** 子菜单

### 3.2 复制必要的密钥

您需要复制以下三个重要信息：

**项目 URL (Project URL)**：
- 在页面顶部找到 **"Project URL"**
- 格式类似：`https://abcdefghijk.supabase.co`
- 点击旁边的复制按钮 📋
- 📝 **保存到记事本，标记为：NEXT_PUBLIC_SUPABASE_URL**

**匿名密钥 (anon public)**：
- 找到 **"Project API keys"** 部分
- 复制 **"anon"** **"public"** 密钥
- 这是一个很长的字符串，以 `eyJ` 开头
- 📝 **保存到记事本，标记为：NEXT_PUBLIC_SUPABASE_ANON_KEY**

**服务角色密钥 (service_role secret)**：
- 在同一部分找到 **"service_role"** **"secret"** 密钥
- ⚠️ **警告**：这个密钥具有完全权限，绝不能泄露
- 同样以 `eyJ` 开头，但比 anon 密钥更长
- 📝 **保存到记事本，标记为：SUPABASE_SERVICE_ROLE_KEY**

### 3.3 记录信息模板

请将获取的信息按以下格式记录：

```
TopWindow Supabase 配置信息
================================
项目名称: topwindow-saas
数据库密码: [您设置的密码]
项目 URL: https://[您的项目ID].supabase.co
匿名密钥: eyJ[很长的字符串]
服务密钥: eyJ[很长的字符串]
创建日期: [今天的日期]
```

---

## 🗄️ 第四步：配置数据库 (15分钟)

### 4.1 进入 SQL 编辑器

1. 在左侧菜单中找到 **"SQL Editor"** (SQL 编辑器)
2. 点击进入 SQL 编辑器页面
3. 您会看到一个代码编辑器界面

### 4.2 执行数据库初始化脚本

**第一部分：基础表结构**

1. 点击 **"New query"** (新建查询) 按钮
2. 在编辑器中粘贴以下 SQL 代码：

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

3. 点击右下角的 **"RUN"** (运行) 按钮
4. 等待执行完成，您应该看到绿色的成功消息

**第二部分：索引优化**

1. 清空编辑器，粘贴以下代码：

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

2. 点击 **"RUN"** (运行) 按钮执行

**第三部分：安全策略**

1. 清空编辑器，粘贴以下代码：

```sql
-- 启用 RLS (行级安全)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- 用户资料安全策略
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 支付记录安全策略
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- 许可证安全策略
CREATE POLICY "Users can view own licenses" ON licenses
  FOR SELECT USING (auth.uid() = user_id);

-- 设备安全策略
CREATE POLICY "Users can view own devices" ON user_devices
  FOR SELECT USING (auth.uid() = user_id);
```

3. 点击 **"RUN"** (运行) 按钮执行

**第四部分：插入默认数据**

1. 清空编辑器，粘贴以下代码：

```sql
-- 插入 TopWindow 产品
INSERT INTO products (id, name, description, price, currency, activation_limit, features) VALUES 
('topwindow-license', 'TopWindow License', 'TopWindow 永久使用许可证', 29.99, 'USD', 3, 
 '["永久使用权", "支持3台设备", "免费更新", "优先技术支持", "30天退款保证"]'::jsonb);
```

2. 点击 **"RUN"** (运行) 按钮执行

### 4.3 验证数据库设置

1. 在 SQL 编辑器中执行以下查询：

```sql
-- 检查所有表是否创建成功
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
```

2. 您应该看到以下5个表：
   - `user_profiles`
   - `products`
   - `payments`
   - `licenses`
   - `user_devices`

3. 检查产品数据：

```sql
-- 检查产品数据是否插入成功
SELECT * FROM products;
```

4. 您应该看到一条 TopWindow 产品记录

---

## ⚙️ 第五步：更新环境变量 (5分钟)

### 5.1 打开项目中的环境变量文件

1. 回到您的代码编辑器
2. 打开项目根目录下的 `.env.local` 文件

### 5.2 填入实际配置信息

将之前记录的信息填入对应位置：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://您的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=您的匿名密钥
SUPABASE_SERVICE_ROLE_KEY=您的服务角色密钥

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

### 5.3 保存文件

1. 确保所有 Supabase 相关的配置都已正确填入
2. 保存 `.env.local` 文件
3. **重要**：重启您的开发服务器以使新配置生效

---

## ✅ 第六步：测试连接 (5分钟)

### 6.1 启动开发服务器

在项目根目录运行：

```bash
npm run dev
```

### 6.2 检查连接状态

1. 打开浏览器访问：http://localhost:3000
2. 打开浏览器开发者工具 (F12)
3. 查看 Console (控制台) 是否有 Supabase 相关错误
4. 如果没有错误，说明连接成功

### 6.3 测试认证页面

1. 访问：http://localhost:3000/auth/login
2. 应该能看到登录页面，表示路由配置正确

---

## 🔧 常见问题解决

### 问题1：找不到 API 密钥页面

**症状**：在设置中找不到 API 选项
**解决方案**：
1. 确保项目创建完成 (等待1-2分钟)
2. 刷新页面
3. 确认您在正确的项目中

### 问题2：SQL 执行失败

**症状**：运行 SQL 时出现错误
**解决方案**：
1. 检查 SQL 语法是否完整
2. 确保一次只执行一个部分
3. 如果某个表已存在，先删除再重新创建：
   ```sql
   DROP TABLE IF EXISTS 表名 CASCADE;
   ```

### 问题3：环境变量不生效

**症状**：代码中 Supabase 连接失败
**解决方案**：
1. 确认 `.env.local` 文件在项目根目录
2. 检查变量名拼写是否正确
3. 重启开发服务器
4. 确认密钥没有额外的空格

### 问题4：无法访问 Supabase 网站

**症状**：网站加载缓慢或无法访问
**解决方案**：
1. 检查网络连接
2. 尝试使用 VPN
3. 清除浏览器缓存
4. 尝试其他浏览器

---

## 📋 完成检查清单

完成以下检查，确认配置正确：

### Supabase 项目检查
- [ ] 账户注册成功
- [ ] 项目创建完成
- [ ] 获得项目 URL 和 API 密钥
- [ ] 数据库密码已安全保存

### 数据库检查
- [ ] 5个表都创建成功
- [ ] 索引创建完成
- [ ] RLS 策略启用
- [ ] 默认产品数据插入成功

### 本地环境检查
- [ ] `.env.local` 文件更新完成
- [ ] 开发服务器启动正常
- [ ] 浏览器控制台无错误
- [ ] 认证页面可以访问

---

## 🎉 恭喜完成！

您已经成功完成了 Supabase 项目的完整配置！现在您的 TopWindow SaaS 应用已经具备了：

✅ **用户认证基础**：Supabase Auth 配置完成  
✅ **数据库结构**：完整的表结构和安全策略  
✅ **开发环境**：本地开发环境连接就绪  
✅ **安全保护**：行级安全策略已启用

### 下一步

现在您可以继续进行：
1. Google OAuth 配置 (如需要)
2. 开始第二天的开发任务
3. 测试用户注册和登录功能

如果在配置过程中遇到任何问题，请参考常见问题部分，或者查看项目的技术文档。

---

**文档版本**: v1.0  
**最后更新**: 2024-08-21  
**适用于**: TopWindow SaaS 项目  
**支持语言**: 中文