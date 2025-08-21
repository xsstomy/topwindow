# Supabase RLS (行级安全) 配置指南

## 🚨 关于 "RLS Disabled in Public" 警告

当您在 Supabase 仪表板中看到 "RLS Disabled in Public" 警告时，这表示您的数据库中有一些表没有启用行级安全保护。这是一个**重要的安全问题**，需要立即解决。

### ⚠️ 风险说明

**RLS 被禁用的风险**：
- 任何知道您的 API 地址的人都可以访问这些表
- 用户可能看到其他用户的私人数据
- 恶意用户可能删除或修改数据库内容
- 违反数据隐私保护原则

**必须启用 RLS 的表**：
- `user_profiles` - 用户个人资料
- `payments` - 支付记录
- `licenses` - 许可证信息  
- `user_devices` - 用户设备信息

**可以暂时不启用 RLS 的表**：
- `products` - 产品信息（公开数据）

---

## 🔍 第一步：检查当前 RLS 状态

### 1.1 在 Supabase 仪表板检查

1. 登录您的 Supabase 项目
2. 在左侧菜单点击 **"Table Editor"** (表编辑器)
3. 查看每个表右侧是否有 🔒 锁定图标
4. 没有锁定图标的表表示 RLS 未启用

### 1.2 使用 SQL 查询检查

在 SQL 编辑器中执行以下查询：

```sql
-- 检查哪些表启用了 RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**结果说明**：
- `rls_enabled = true` ✅ 表示已启用 RLS
- `rls_enabled = false` ❌ 表示未启用 RLS

---

## 🛡️ 第二步：启用 RLS 保护

### 2.1 启用表级 RLS

在 SQL 编辑器中执行以下命令：

```sql
-- 为所有用户相关表启用 RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- 产品表可以保持公开（根据需要决定）
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

### 2.2 创建安全策略

**用户资料表策略**：

```sql
-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- 创建新的安全策略
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = id);
```

**支付记录表策略**：

```sql
-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Users can view own payments" ON payments;

-- 创建支付记录策略
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- 用户不能直接修改支付记录，只能查看
-- 修改支付记录只能通过服务端 API
```

**许可证表策略**：

```sql
-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Users can view own licenses" ON licenses;

-- 创建许可证策略
CREATE POLICY "Users can view own licenses" ON licenses
  FOR SELECT USING (auth.uid() = user_id);

-- 许可证只能查看，不能直接修改
-- 修改许可证状态只能通过服务端 API
```

**用户设备表策略**：

```sql
-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Users can view own devices" ON user_devices;
DROP POLICY IF EXISTS "Users can update own devices" ON user_devices;

-- 创建设备策略
CREATE POLICY "Users can view own devices" ON user_devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own devices" ON user_devices
  FOR UPDATE USING (auth.uid() = user_id);

-- 设备记录通常通过 API 创建，用户不直接插入
```

### 2.3 产品表处理（可选）

如果您希望产品信息完全公开：

```sql
-- 保持产品表公开，不启用 RLS
-- 这样所有用户都可以查看产品信息
```

如果您希望产品表也有保护：

```sql
-- 启用产品表 RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 允许所有认证用户查看产品
CREATE POLICY "Authenticated users can view products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

-- 只允许服务角色修改产品
CREATE POLICY "Service role can manage products" ON products
  USING (auth.role() = 'service_role');
```

---

## ✅ 第三步：验证 RLS 配置

### 3.1 检查策略是否生效

```sql
-- 查看所有 RLS 策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 3.2 测试访问权限

**测试查询**（应该返回空结果，因为没有认证用户）：

```sql
-- 这些查询在 SQL 编辑器中应该返回空结果
-- 因为 auth.uid() 为 null
SELECT * FROM user_profiles;
SELECT * FROM payments;
SELECT * FROM licenses;
SELECT * FROM user_devices;
```

**测试产品表**（应该返回产品数据）：

```sql
-- 这个查询应该返回产品数据
SELECT * FROM products;
```

### 3.3 在应用中测试

1. 启动您的应用：`npm run dev`
2. 尝试注册一个新用户
3. 登录后检查是否能正常访问数据
4. 确认用户只能看到自己的数据

---

## 🔧 常见问题解决

### 问题1：策略创建失败

**错误信息**：`permission denied for table`

**解决方案**：
```sql
-- 确保您使用的是服务角色连接
-- 在 Supabase SQL 编辑器中，默认使用服务角色
-- 如果仍有问题，检查表是否存在
SELECT tablename FROM pg_tables WHERE tablename = 'user_profiles';
```

### 问题2：用户无法访问自己的数据

**症状**：登录后看不到用户数据

**解决方案**：
```sql
-- 检查策略是否正确使用 auth.uid()
-- 确保策略中的列名正确（id vs user_id）
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

### 问题3：仍然显示 RLS 警告

**可能原因**：
1. 某些表仍未启用 RLS
2. 缓存问题

**解决方案**：
```sql
-- 再次检查所有表的 RLS 状态
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- 如果仍有问题，刷新浏览器页面
```

### 问题4：服务端 API 无法访问数据

**症状**：API 路由返回空数据

**解决方案**：
- 确保 API 路由使用 `createRouteHandlerClient`
- 检查 `SUPABASE_SERVICE_ROLE_KEY` 环境变量
- 服务角色可以绕过 RLS 限制

---

## 📋 安全检查清单

完成以下检查，确保 RLS 配置正确：

### 基础检查
- [ ] 所有用户相关表都启用了 RLS
- [ ] 每个表都有相应的安全策略
- [ ] 策略正确使用 `auth.uid()` 函数
- [ ] Supabase 仪表板不再显示 RLS 警告

### 功能测试
- [ ] 未登录用户无法查看私人数据
- [ ] 登录用户只能看到自己的数据
- [ ] 用户可以正常创建和更新自己的数据
- [ ] 产品信息对所有用户可见

### 安全验证
- [ ] 直接 SQL 查询返回空结果（未认证状态）
- [ ] API 路由正常工作
- [ ] 用户注册和登录流程正常
- [ ] 数据隔离正确实施

---

## 🚀 高级 RLS 策略

### 管理员访问策略

如果需要管理员角色：

```sql
-- 创建管理员策略（可以查看所有数据）
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.uid() = id
  );
```

### 基于时间的策略

如果需要基于时间的访问控制：

```sql
-- 只允许访问最近30天的数据
CREATE POLICY "Users can view recent payments" ON payments
  FOR SELECT USING (
    auth.uid() = user_id AND 
    created_at > NOW() - INTERVAL '30 days'
  );
```

### 基于状态的策略

如果需要基于状态的访问控制：

```sql
-- 只允许查看激活状态的许可证
CREATE POLICY "Users can view active licenses" ON licenses
  FOR SELECT USING (
    auth.uid() = user_id AND 
    status = 'active'
  );
```

---

## 📚 进一步学习

### 官方文档
- [Supabase RLS 文档](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS 文档](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

### 最佳实践
1. **默认拒绝**：始终从最严格的策略开始
2. **最小权限**：只给用户访问必需数据的权限
3. **测试策略**：在生产环境前充分测试
4. **监控访问**：定期检查访问日志
5. **文档化**：记录每个策略的目的

---

**文档版本**: v1.0  
**最后更新**: 2024-08-21  
**适用于**: TopWindow SaaS 项目  
**重要性**: 🔴 关键安全配置