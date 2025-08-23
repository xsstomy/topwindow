# TopWindow 许可证系统测试指南

> **文档版本**: 1.0  
> **创建时间**: 2025-01-23  
> **更新时间**: 2025-01-23  
> **适用范围**: 许可证生成、激活、验证功能测试

## 📋 概述

本文档提供了在支付功能未完成的情况下，如何测试TopWindow许可证系统核心功能的完整指南。通过绕过支付流程，直接测试许可证的生成、激活和验证功能。

## 🎯 测试目标

- ✅ 验证许可证密钥生成功能
- ✅ 验证设备激活流程
- ✅ 验证激活数量限制
- ✅ 验证许可证验证逻辑
- ✅ 验证数据库存储和查询
- ✅ 验证API接口功能

## 📊 当前系统状态

### 已实现的功能
✅ **License Key 生成器** (`/src/lib/license/generator.ts`)
- 支持TW-XXXX-XXXX-XXXX-XXXX格式
- 内置校验码验证
- 批量生成功能

✅ **许可证服务层** (`/src/lib/license/service.ts`)  
- 完整的业务逻辑实现
- 设备管理功能
- 邮件通知功能（可选）

✅ **API接口**
- `/api/licenses/generate` - 许可证生成
- `/api/licenses/activate` - 设备激活  
- `/api/licenses/validate` - 许可证验证
- `/api/database/seed` - 数据库初始化

✅ **测试界面** (`/test-license`)
- 可视化测试工具
- 实时格式验证
- 数据库连接测试

### 缺少的功能
❌ **支付集成** - 使用mock配置，无实际支付处理

## 🛠️ 测试环境准备

### 前置条件
1. **Supabase 数据库已配置** - 环境变量已设置
2. **Node.js 环境就绪** - 项目依赖已安装
3. **开发服务器可启动** - 端口3000可用

### 环境变量检查
确保以下环境变量已正确配置：
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ezfgnejqvxsabpxckvos.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## 🚀 测试执行步骤

### 步骤 1: 启动开发环境

```bash
# 启动开发服务器
npm run dev

# 验证服务器启动
# 访问: http://localhost:3000
```

### 步骤 2: 数据库初始化

#### 方法 A: 使用API接口
```bash
curl -X POST http://localhost:3000/api/database/seed \
  -H "Content-Type: application/json"
```

#### 方法 B: 使用测试页面
1. 访问 `http://localhost:3000/test-license`
2. 找到"数据库连接测试"部分
3. 点击"测试 Supabase 连接"按钮
4. 确认连接成功

#### 预期结果
```json
{
  "success": true,
  "message": "数据库初始化成功",
  "productsCount": 3,
  "products": [
    {
      "id": "topwindow-license",
      "name": "TopWindow License", 
      "price": 29.99,
      "currency": "USD",
      "activation_limit": 3
    }
  ]
}
```

### 步骤 3: 许可证生成测试

#### 3.1 测试密钥生成（仅格式验证）
1. 访问 `http://localhost:3000/test-license`
2. 在"License Key 生成器"部分
3. 点击"生成新密钥"或"批量生成"
4. 验证生成的密钥格式：`TW-XXXX-XXXX-XXXX-XXXX`

#### 3.2 真实许可证生成（保存到数据库）
1. 在测试页面找到"真实密钥生成器"部分
2. 选择产品："TopWindow License"
3. 点击"生成真实密钥"
4. 记录生成的许可证密钥，用于后续测试

#### API方式生成
```bash
curl -X POST http://localhost:3000/api/licenses/generate \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "topwindow-license",
    "user_id": "test-user-123",
    "activation_limit": 3
  }'
```

#### 预期结果
```json
{
  "success": true,
  "license": {
    "license_key": "TW-A1B2-C3D4-E5F6-G7H8",
    "product_id": "topwindow-license",
    "product_name": "TopWindow License",
    "status": "active",
    "activation_limit": 3,
    "expires_at": "2026-01-23T10:00:00.000Z",
    "created_at": "2025-01-23T10:00:00.000Z"
  }
}
```

### 步骤 4: 设备激活测试

使用步骤3生成的许可证密钥进行激活测试。

#### 4.1 首次设备激活
```bash
curl -X POST http://localhost:3000/api/licenses/activate \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "TW-A1B2-C3D4-E5F6-G7H8",
    "device_id": "macbook-pro-001", 
    "device_info": {
      "name": "MacBook Pro (Test Device 1)",
      "type": "macbook_pro",
      "version": "14.0",
      "arch": "arm64"
    }
  }'
```

#### 预期结果
```json
{
  "status": "success",
  "message": "Activation successful.",
  "expires_at": "2026-01-23T10:00:00.000Z",
  "activation_info": {
    "activated_at": "2025-01-23T10:05:00.000Z",
    "device_name": "MacBook Pro (Test Device 1)",
    "remaining_activations": 2
  }
}
```

#### 4.2 重复激活测试
使用相同的`device_id`再次调用激活API。

#### 预期结果
```json
{
  "status": "success", 
  "message": "Device already activated, information updated",
  "activation_info": {
    "activated_at": "2025-01-23T10:05:00.000Z",
    "device_name": "MacBook Pro (Test Device 1)"
  }
}
```

#### 4.3 激活限制测试
激活第4台设备（超出3台限制）：

```bash
# 激活第2台设备
curl -X POST http://localhost:3000/api/licenses/activate \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "TW-A1B2-C3D4-E5F6-G7H8",
    "device_id": "macbook-air-002",
    "device_info": {"name": "MacBook Air (Test Device 2)", "type": "macbook_air"}
  }'

# 激活第3台设备  
curl -X POST http://localhost:3000/api/licenses/activate \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "TW-A1B2-C3D4-E5F6-G7H8",
    "device_id": "imac-003", 
    "device_info": {"name": "iMac (Test Device 3)", "type": "imac"}
  }'

# 尝试激活第4台设备（应该失败）
curl -X POST http://localhost:3000/api/licenses/activate \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "TW-A1B2-C3D4-E5F6-G7H8",
    "device_id": "mac-mini-004",
    "device_info": {"name": "Mac Mini (Test Device 4)", "type": "mac_mini"}
  }'
```

#### 预期结果（第4台设备）
```json
{
  "status": "error",
  "message": "Activation limit reached (3/3)",
  "activation_info": {
    "activated_count": 3,
    "activation_limit": 3, 
    "remaining_activations": 0
  }
}
```

### 步骤 5: 许可证验证测试

#### 5.1 验证已激活设备
```bash
curl -X POST http://localhost:3000/api/licenses/validate \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "TW-A1B2-C3D4-E5F6-G7H8",
    "device_id": "macbook-pro-001"
  }'
```

#### 预期结果
```json
{
  "status": "success",
  "message": "License and device are valid",
  "license_info": {
    "expires_at": "2026-01-23T10:00:00.000Z",
    "status": "active",
    "last_validated_at": "2025-01-23T10:10:00.000Z"
  },
  "device_info": {
    "last_seen_at": "2025-01-23T10:10:00.000Z",
    "device_name": "MacBook Pro (Test Device 1)"
  }
}
```

#### 5.2 验证未激活设备
```bash
curl -X POST http://localhost:3000/api/licenses/validate \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "TW-A1B2-C3D4-E5F6-G7H8", 
    "device_id": "unknown-device-999"
  }'
```

#### 预期结果
```json
{
  "status": "error",
  "message": "License or device not found"
}
```

#### 5.3 验证无效许可证
```bash
curl -X POST http://localhost:3000/api/licenses/validate \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "TW-INVALID-KEY-HERE",
    "device_id": "macbook-pro-001"
  }'
```

#### 预期结果
```json
{
  "status": "error", 
  "message": "License or device not found"
}
```

## 📋 测试检查清单

### 生成功能测试 ✅
- [ ] 测试密钥生成格式正确 (`TW-XXXX-XXXX-XXXX-XXXX`)
- [ ] 校验码验证功能正常
- [ ] 批量生成唯一性保证
- [ ] 数据库存储许可证记录
- [ ] 产品信息关联正确

### 激活功能测试 ✅  
- [ ] 首次激活成功
- [ ] 重复激活更新设备信息
- [ ] 激活限制执行正确（3台设备）
- [ ] 设备信息正确存储
- [ ] 剩余激活次数计算正确

### 验证功能测试 ✅
- [ ] 已激活设备验证成功
- [ ] 未激活设备验证失败
- [ ] 无效许可证验证失败
- [ ] 设备活跃时间更新
- [ ] 许可证验证时间更新

### 错误处理测试 ✅
- [ ] 无效输入格式处理
- [ ] 数据库连接错误处理  
- [ ] 限流机制测试
- [ ] 异常状态恢复

## 🐛 常见问题排查

### 问题1: 数据库连接失败
**症状**: 测试页面显示连接错误  
**排查步骤**:
1. 检查环境变量配置
2. 验证Supabase项目状态
3. 检查网络连接
4. 查看控制台错误日志

### 问题2: 许可证生成失败
**症状**: API返回500错误  
**排查步骤**:
1. 确认产品数据已初始化
2. 检查数据库表结构
3. 验证用户ID格式
4. 查看服务器日志

### 问题3: 激活请求被拒绝
**症状**: 返回400或403错误  
**排查步骤**:
1. 验证许可证密钥格式
2. 检查设备ID长度和字符
3. 确认许可证状态为活跃
4. 验证激活限制未超出

## 📊 测试数据参考

### 有效的测试数据
```javascript
// 有效的设备ID示例
const validDeviceIds = [
  'macbook-pro-12345678',
  'test-device-abcdef12', 
  'imac-pro-87654321'
]

// 有效的设备信息示例
const validDeviceInfo = {
  name: 'MacBook Pro 16" 2023',
  type: 'macbook_pro',
  version: '14.2.1',
  arch: 'arm64',
  serial: 'C02YX123LVDN'
}
```

### 无效的测试数据
```javascript
// 无效的许可证密钥示例
const invalidLicenseKeys = [
  'TW-INVALID',           // 格式不完整
  'INVALID-KEY-FORMAT',   // 前缀错误
  'TW-123-456-789-012',   // 段长度错误
  ''                      // 空字符串
]

// 无效的设备ID示例  
const invalidDeviceIds = [
  'abc',                  // 长度不足
  'device-with-invalid-chars-!@#', // 无效字符
  'a'.repeat(65)          // 超过最大长度
]
```

## 🔧 进阶测试场景

### 并发测试
```bash
# 使用多个终端同时激活相同许可证
# 测试数据库锁和并发处理
```

### 性能测试  
```bash
# 批量生成1000个许可证
# 测量生成和验证的响应时间
```

### 边界测试
```bash  
# 测试超长输入
# 测试特殊字符处理
# 测试数据库连接池
```

## 📝 测试报告模板

```markdown
# 许可证系统测试报告

## 测试环境
- 测试时间: YYYY-MM-DD HH:mm:ss
- 测试人员: [姓名]
- 环境版本: [版本号]

## 测试结果
- 生成功能: ✅/❌ 
- 激活功能: ✅/❌
- 验证功能: ✅/❌
- 错误处理: ✅/❌

## 发现的问题
1. [问题描述]
2. [问题描述]

## 改进建议  
1. [建议内容]
2. [建议内容]
```

---

**下一步**: 在支付功能完成后，可以将此测试流程扩展为端到端的完整测试，包括支付→许可证生成→激活→验证的完整流程。