# 许可证激活次数限制修复计划

## 概述

本文档详细说明了修复TopWindow许可证系统中激活次数限制问题的完整计划。

### 当前问题

**问题描述：**
- 当前系统允许每个产品无限制生成许可证
- 每个许可证可以激活多台设备（目前是每个许可证3台设备）
- 用户期望：无论许可证数量多少，总设备激活数量受产品限制

**期望行为：**
- `topwindow-basic`：可生成多个许可证，但总设备激活数量限制为1台
- `topwindow-license`：可生成多个许可证，但总设备激活数量限制为3台
- `topwindow-team`：可生成多个许可证，但总设备激活数量限制为10台
- 每个单独的许可证只激活1台设备

## 技术解决方案（方案B）

### 核心逻辑变更

**从：** 检查每个许可证的设备数量
**到：** 检查用户在每个产品下的总设备数量

### 方案B的优势
1. **用户友好**：丢失的许可证可以重新生成
2. **灵活性强**：用户可以在不同时间获取备用许可证
3. **容错性好**：技术问题不会导致使用权丢失
4. **现代化方法**：遵循SaaS最佳实践

## 实施计划

### 阶段1：配置更新

#### 文件：`src/config/pricing.ts`

**变更内容：**
- 明确说明 `activationLimit` 代表每个产品的总设备激活限制
- 更新产品描述以反映新的逻辑
- 确保产品定义的一致性

**影响程度：** 低 - 主要是文档和清晰度改进

### 阶段2：核心业务逻辑更新

#### 文件：`src/lib/license/service.ts`

**主要变更：**

1. **更新 `activateDevice` 方法：**
```typescript
// 旧逻辑：检查单个许可证的设备数量
const { data: activeDevices } = await supabase
  .from('user_devices')
  .select('*')
  .eq('license_key', licenseKey)
  .eq('status', 'active')

// 新逻辑：检查用户在该产品下的总设备数量
const { data: userProductDevices } = await supabase
  .from('user_devices')
  .select('*, licenses!inner(*)')
  .eq('licenses.user_id', userId)
  .eq('licenses.product_id', productId)  
  .eq('status', 'active')
```

2. **添加辅助方法 `getUserProductDeviceCount`：**
```typescript
static async getUserProductDeviceCount(userId: string, productId: string): Promise<number> {
  const { data, error } = await supabase
    .from('user_devices')
    .select('id, licenses!inner(product_id)')
    .eq('licenses.user_id', userId)
    .eq('licenses.product_id', productId)
    .eq('status', 'active')
  
  return data?.length || 0
}
```

**影响程度：** 中等 - 核心激活逻辑修改

### 阶段3：API端点更新

#### 文件：`src/app/api/licenses/activate/route.ts`

**变更内容：**
- 更新错误消息以反映产品级别的限制
- 确保新验证逻辑的正确错误处理

**影响程度：** 低 - 主要是错误消息更新

### 阶段4：邮件模板更新

#### 文件：`src/lib/email/service.ts`

**变更内容：**
- 更新许可证邮件模板以明确激活限制
- 将设备限制描述从"每个许可证"改为"每个产品"

**影响程度：** 低 - 模板文本更新

### 阶段5：类型定义更新（如需要）

#### 文件：`src/types/license.ts`, `src/types/payment.ts`

**可能的变更：**
- 添加产品级别设备计数的辅助类型
- 更新JSDoc注释以提高清晰度

**影响程度：** 最小 - 文档改进

## 数据库影响分析

### 好消息：不需要数据库结构变更

**原因：** 当前的数据库结构已经支持新的逻辑：
- `licenses` 表有 `user_id` 和 `product_id` 用于用户产品分组
- `user_devices` 表有 `status` 字段用于过滤活跃设备
- 所有必要的关系都已存在

### 仅需变更查询逻辑

**新的SQL模式：**
```sql
-- 计算用户在特定产品下的总活跃设备数量
SELECT COUNT(*) 
FROM user_devices ud
JOIN licenses l ON ud.license_key = l.license_key
WHERE l.user_id = $1 
  AND l.product_id = $2 
  AND ud.status = 'active'
```

## 实施步骤

### 步骤1：备份和准备工作
1. 创建数据库备份（如需要）
2. 记录当前系统行为
3. 准备测试用例

### 步骤2：配置更新
1. 更新 `src/config/pricing.ts`
2. 验证产品配置一致性
3. 更新产品描述

### 步骤3：核心逻辑实现
1. 添加 `getUserProductDeviceCount` 辅助方法
2. 更新 `activateDevice` 方法逻辑
3. 测试单个方法功能

### 步骤4：API集成
1. 更新激活API端点
2. 测试API响应和错误处理
3. 验证错误消息

### 步骤5：支持更新
1. 更新邮件模板
2. 更新类型定义（如需要）
3. 更新内联文档

### 步骤6：测试和验证
1. 新辅助方法的单元测试
2. 激活流程的集成测试
3. 端到端用户场景测试

## 测试策略

### 单元测试

**测试用例：**
1. `getUserProductDeviceCount` 返回正确的计数
2. 设备激活遵循产品限制
3. 同一产品的多个许可证正常工作
4. 边界情况（零设备、达到限制、超过限制）

### 集成测试

**测试场景：**
1. 拥有 `topwindow-basic` 的用户总共可以激活1台设备
2. 拥有 `topwindow-license` 的用户总共可以激活3台设备
3. 拥有 `topwindow-team` 的用户总共可以激活10台设备
4. 同一产品的多个许可证共享设备限制
5. 不同产品有独立的限制

### 用户验收测试

**测试场景：**
1. 为同一产品生成多个许可证
2. 激活设备直到达到限制
3. 尝试超过限制（应该失败）
4. 验证错误消息是否清晰

## 风险评估

### 低风险区域
- 配置变更
- 邮件模板更新
- 类型定义改进

### 中等风险区域
- 核心激活逻辑变更
- 数据库查询修改

### 风险缓解
- 部署前进行充分测试
- 逐步发布并监控
- 明确的回滚程序

## 回滚计划

### 如果出现问题：
1. **立即操作：** 从git恢复代码变更
2. **数据库：** 无需回滚（无结构变更）
3. **监控：** 观察激活失败情况
4. **沟通：** 必要时通知用户

## 成功标准

### 功能需求已满足：
- ✅ 一个许可证激活一台设备
- ✅ 产品级别的设备限制得到执行
- ✅ 每个产品可以生成多个许可证
- ✅ 总设备数量遵循产品限制

### 质量需求已满足：
- ✅ 无数据丢失或损坏
- ✅ 保持向后兼容性
- ✅ 性能没有显著影响
- ✅ 为用户提供清晰的错误消息

## 预估时间

- **配置更新：** 0.5小时
- **核心逻辑实现：** 2-3小时
- **API和模板更新：** 1小时
- **测试和验证：** 2小时
- **文档更新：** 0.5小时

**总预估时间：** 6-7小时

## 依赖关系

### 技术依赖：
- Supabase数据库访问
- 邮件服务功能
- 现有用户认证系统

### 业务依赖：
- 产品配置决策
- 用户沟通策略
- 支持团队意识

## 实施后工作

### 监控：
- 跟踪激活成功/失败率
- 监控设备计数准确性
- 关注用户困惑或支持请求

### 文档更新：
- 更新用户指南
- 更新API文档
- 更新支持材料

---

**文档版本：** 1.0  
**创建时间：** 2024-08-23  
**状态：** 准备实施