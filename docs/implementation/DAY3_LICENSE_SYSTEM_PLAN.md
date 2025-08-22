# 第三天 License Key 系统实施计划 (服务端专注版)

## 📋 目标概览
实现服务端 License Key 管理系统，处理许可证生成、激活验证、设备管理等核心业务逻辑。

## 🔍 职责划分澄清

### 服务端职责（本次实施范围）
- License Key 生成和格式验证
- 处理客户端激活请求
- 管理设备激活记录和限制
- 提供许可证验证服务
- 用户许可证管理界面后端支持

### 客户端职责（不在本次范围）
- 设备ID生成和持久化（macOS Hardware UUID/Keychain等）
- 调用服务端API
- 本地许可证状态管理

## 🗂️ 实施文件结构
```
src/
├── lib/
│   ├── license/
│   │   ├── generator.ts          # License Key 生成器
│   │   ├── service.ts           # 许可证业务逻辑服务
│   │   └── validator.ts         # 许可证格式验证
│   └── utils/
│       └── validators.ts        # 通用验证工具
├── app/api/
│   └── licenses/
│       ├── activate/route.ts    # 许可证激活API (接收客户端请求)
│       ├── validate/route.ts    # 许可证验证API (客户端定期调用)
│       ├── my/route.ts         # 用户许可证查询API (仪表板用)
│       └── devices/route.ts    # 设备管理API (仪表板用)
└── types/
    └── license.ts              # License 相关类型定义
```

## 🔧 核心功能实现

### 1. License Key 生成器 (generator.ts)
- UUID 基础的密钥生成算法
- 校验码计算和验证  
- TW-XXXX-XXXX-XXXX-XXXX 格式化
- 批量生成支持（支付完成后使用）

### 2. 许可证激活 API (activate/route.ts)
**输入**：客户端传来的激活请求
```typescript
{
  license_key: string,      // 用户购买的许可证
  device_id: string,        // 客户端生成的设备ID
  device_info: {           // 客户端收集的设备信息
    name: string,
    type: string,
    version?: string
  }
}
```

**处理逻辑**：
- 验证许可证有效性和状态
- 检查激活设备数量限制
- 记录设备激活信息
- 返回激活结果和到期时间

### 3. 许可证验证 API (validate/route.ts)  
**用途**：客户端定期调用验证许可证状态
- 验证 license_key + device_id 组合
- 更新设备最后活跃时间
- 检查许可证是否过期/撤销
- 返回许可证状态信息

### 4. 用户许可证管理 API (my/route.ts)
**用途**：仪表板显示用户的所有许可证
- 查询用户拥有的许可证列表
- 包含每个许可证的激活设备信息
- 支持分页和筛选

### 5. 设备管理 API (devices/route.ts)
**用途**：仪表板设备管理功能
- 查看许可证已激活的设备列表
- 支持设备重命名
- 设备撤销/停用功能

## ⏱️ 实施时间安排

### 上午 (4小时)
1. **创建类型定义和验证工具** (0.5h)
   - `src/types/license.ts` - License相关类型
   - `src/lib/utils/validators.ts` - 通用验证工具

2. **License Key 生成器实现** (1h)
   - `src/lib/license/generator.ts` - 核心生成算法
   - `src/lib/license/validator.ts` - 格式验证器

3. **许可证服务层基础逻辑** (1.5h)
   - `src/lib/license/service.ts` - 业务逻辑服务

4. **许可证激活 API 开发** (1h)
   - `src/app/api/licenses/activate/route.ts`

### 下午 (4小时)  
1. **许可证验证 API 开发** (1h)
   - `src/app/api/licenses/validate/route.ts`

2. **用户许可证查询 API** (1h)
   - `src/app/api/licenses/my/route.ts`

3. **设备管理 API 开发** (1h)
   - `src/app/api/licenses/devices/route.ts`

4. **API 集成测试和错误处理优化** (1h)
   - 集成测试编写
   - 错误处理完善

## 🔍 关键 API 接口设计

### 激活接口
```
POST /api/licenses/activate
Request: { license_key, device_id, device_info }
Response: { status, message, expires_at, activation_info }
```

### 验证接口  
```
POST /api/licenses/validate
Request: { license_key, device_id }
Response: { status, message, license_info, device_info }
```

### 查询接口
```
GET /api/licenses/my
Response: { licenses: [{ license_key, status, devices, created_at }] }
```

### 设备管理接口
```
GET /api/licenses/devices?license_key=xxx
Response: { devices: [{ device_id, name, type, activated_at, last_seen }] }

PUT /api/licenses/devices/rename
Request: { license_key, device_id, new_name }

DELETE /api/licenses/devices/revoke
Request: { license_key, device_id }
```

## 🧪 测试验证计划

### License Key 生成测试
- 格式正确性验证 (TW-XXXX-XXXX-XXXX-XXXX)
- 校验码算法正确性
- 唯一性保证测试

### 激活流程测试
- 有效许可证正常激活
- 无效许可证被拒绝  
- 设备数量限制生效
- 重复激活同一设备

### 验证流程测试
- 有效组合通过验证
- 无效组合被拒绝
- 过期许可证状态更新
- 设备活跃时间更新

### 边界情况测试
- 并发激活请求处理
- 恶意输入防护
- 数据库连接异常处理
- API 限流测试

## 📊 成功标准

✅ License Key 生成器工作正常，格式符合规范  
✅ 激活API能正确处理客户端请求并返回准确信息  
✅ 验证API响应迅速，状态更新及时  
✅ 设备数量限制严格执行，无法绕过  
✅ 所有API都有完善的错误处理和输入验证  
✅ API响应时间 < 500ms，数据库查询优化  
✅ RLS安全策略正确，用户只能访问自己的数据

## 📝 实施后的准备工作

为第四天支付平台集成做准备：
- License Key 自动生成服务 (支付完成后调用)
- 邮件通知接口 (发送许可证给用户)
- 支付记录关联 (license表payment_id字段)

## 🔗 相关文档
- [技术实施文档](../TECHNICAL_DOCUMENTATION.md) - 完整技术方案
- [第一天实施计划](DAY1_IMPLEMENTATION_PLAN.md) - 基础设施搭建
- [第二天完成报告](DAY2_AUTH_COMPLETION_REPORT.md) - 认证系统实现

---

**创建时间**: 2024-08-21  
**预计完成**: 第三天结束  
**下一步**: 第四天支付平台集成