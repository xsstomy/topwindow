# TopWindow API 交互顺序图

## 🔄 关键API调用序列图

### 用户注册API序列
```mermaid
sequenceDiagram
    participant User as 用户
    participant Frontend as 前端应用
    participant AuthAPI as 认证API
    participant Supabase as Supabase Auth
    participant DB as 数据库

    User->>Frontend: 提交注册表单
    Frontend->>AuthAPI: POST /api/auth/register
    AuthAPI->>Supabase: createUser()
    Supabase-->>AuthAPI: 用户创建成功
    AuthAPI->>DB: 插入用户资料到profiles表
    DB-->>AuthAPI: 插入成功
    AuthAPI-->>Frontend: 注册成功响应
    Frontend-->>User: 显示注册成功消息
    Supabase->>User: 发送验证邮件
```

### 用户登录API序列
```mermaid
sequenceDiagram
    participant User as 用户
    participant Frontend as 前端应用
    participant AuthAPI as 认证API
    participant Supabase as Supabase Auth
    participant DB as 数据库

    User->>Frontend: 提交登录表单
    Frontend->>AuthAPI: POST /api/auth/login
    AuthAPI->>Supabase: signInWithPassword()
    Supabase-->>AuthAPI: 认证成功
    AuthAPI->>DB: 查询用户资料和许可证状态
    DB-->>AuthAPI: 返回用户数据
    AuthAPI-->>Frontend: 登录成功响应 + 用户数据
    Frontend-->>User: 重定向到仪表板
```

### License Key激活API序列
```mermaid
sequenceDiagram
    participant User as 用户
    participant App as 桌面应用
    participant ValidationAPI as 验证API
    participant DB as 数据库
    participant LicenseService as 许可证服务

    User->>App: 输入License Key
    App->>ValidationAPI: POST /api/license/validate
    ValidationAPI->>DB: 查询许可证信息
    DB-->>ValidationAPI: 返回许可证数据
    
    alt 许可证有效且未激活
        ValidationAPI->>LicenseService: 验证许可证状态
        LicenseService-->>ValidationAPI: 验证通过
        ValidationAPI->>DB: 更新许可证激活状态
        DB-->>ValidationAPI: 更新成功
        ValidationAPI->>DB: 记录设备激活信息
        DB-->>ValidationAPI: 记录成功
        ValidationAPI-->>App: 激活成功响应
        App-->>User: 显示激活成功消息
        
    else 许可证无效或已激活
        ValidationAPI-->>App: 错误响应
        App-->>User: 显示错误消息
    end
```

### 支付处理API序列
```mermaid
sequenceDiagram
    participant User as 用户
    participant Frontend as 前端应用
    participant PaymentAPI as 支付API
    participant PaymentGateway as 支付网关
    participant WebhookHandler as Webhook处理器
    participant LicenseService as 许可证服务
    participant EmailService as 邮件服务
    participant DB as 数据库

    User->>Frontend: 选择支付方案
    Frontend->>PaymentAPI: POST /api/payment/create
    PaymentAPI->>PaymentGateway: 创建支付会话
    PaymentGateway-->>PaymentAPI: 返回支付链接
    PaymentAPI-->>Frontend: 返回支付链接
    Frontend-->>User: 重定向到支付页面
    
    User->>PaymentGateway: 完成支付
    PaymentGateway->>WebhookHandler: POST /api/webhook/payment
    WebhookHandler->>DB: 验证webhook签名
    DB-->>WebhookHandler: 签名验证通过
    
    WebhookHandler->>LicenseService: 生成许可证
    LicenseService-->>WebhookHandler: 许可证生成成功
    WebhookHandler->>DB: 存储许可证信息
    DB-->>WebhookHandler: 存储成功
    
    WebhookHandler->>EmailService: 发送许可证邮件
    EmailService-->>WebhookHandler: 邮件发送成功
    WebhookHandler->>DB: 更新支付状态
    DB-->>WebhookHandler: 更新成功
```

### 定期验证API序列
```mermaid
sequenceDiagram
    participant App as 桌面应用
    participant ValidationAPI as 验证API
    participant DB as 数据库
    participant LicenseService as 许可证服务

    App->>ValidationAPI: GET /api/license/status (定期)
    ValidationAPI->>DB: 查询许可证状态
    DB-->>ValidationAPI: 返回状态信息
    
    alt 需要重新验证
        ValidationAPI->>LicenseService: 验证当前状态
        LicenseService-->>ValidationAPI: 验证结果
        ValidationAPI->>DB: 更新验证时间戳
        DB-->>ValidationAPI: 更新成功
        ValidationAPI-->>App: 返回验证状态
        
    else 状态正常
        ValidationAPI-->>App: 返回正常状态
    end
```

### 设备管理API序列
```mermaid
sequenceDiagram
    participant User as 用户
    participant Frontend as 前端应用
    participant DeviceAPI as 设备API
    participant DB as 数据库
    participant ValidationAPI as 验证API

    User->>Frontend: 查看设备列表
    Frontend->>DeviceAPI: GET /api/devices
    DeviceAPI->>DB: 查询用户设备
    DB-->>DeviceAPI: 返回设备列表
    DeviceAPI-->>Frontend: 返回设备数据
    Frontend-->>User: 显示设备列表
    
    User->>Frontend: 移除设备
    Frontend->>DeviceAPI: DELETE /api/devices/{id}
    DeviceAPI->>DB: 删除设备记录
    DB-->>DeviceAPI: 删除成功
    DeviceAPI->>ValidationAPI: 通知设备移除
    ValidationAPI-->>DeviceAPI: 确认接收
    DeviceAPI-->>Frontend: 移除成功响应
    Frontend-->>User: 显示移除成功消息
```

## 🏗️ API架构概览

### 核心API端点

#### 认证API (`/api/auth/*`)
```typescript
// 认证相关端点
POST /api/auth/register     // 用户注册
POST /api/auth/login        // 用户登录  
POST /api/auth/logout       // 用户登出
GET /api/auth/session       // 获取会话信息
POST /api/auth/reset-password // 重置密码
```

#### 许可证API (`/api/license/*`)
```typescript
// 许可证管理端点
POST /api/license/validate  // 验证许可证
GET /api/license/status     // 获取许可证状态
GET /api/license/details    // 获取许可证详情
POST /api/license/transfer  // 转移许可证
```

#### 支付API (`/api/payment/*`)
```typescript
// 支付处理端点
POST /api/payment/create    // 创建支付会话
GET /api/payment/status     // 获取支付状态
POST /api/payment/webhook   // 支付webhook处理
```

#### 设备API (`/api/devices/*`)
```typescript
// 设备管理端点
GET /api/devices           // 获取设备列表
POST /api/devices          // 添加新设备
DELETE /api/devices/{id}   // 移除设备
GET /api/devices/{id}      // 获取设备详情
```

#### Webhook端点 (`/api/webhook/*`)
```typescript
// Webhook处理端点
POST /api/webhook/payment   // 支付webhook
POST /api/webhook/license   // 许可证webhook
```

## 🔐 API安全机制

### 认证和授权
```mermaid
flowchart LR
    Request[API请求] --> AuthCheck{认证检查}
    AuthCheck -->|未认证| Reject[返回401错误]
    AuthCheck -->|已认证| PermissionCheck{权限检查}
    
    PermissionCheck -->|无权限| RejectPermission[返回403错误]
    PermissionCheck -->|有权限| Process[处理请求]
    
    Process --> RateLimit{频率限制检查}
    RateLimit -->|超过限制| RejectRateLimit[返回429错误]
    RateLimit -->|正常| Execute[执行操作]
    
    Execute --> Validation{输入验证}
    Validation -->|无效输入| RejectValidation[返回400错误]
    Validation -->|有效输入| Success[返回成功响应]
```

### Webhook安全验证
```mermaid
sequenceDiagram
    participant Gateway as 支付网关
    participant WebhookAPI as Webhook API
    participant Validator as 签名验证器
    participant DB as 数据库

    Gateway->>WebhookAPI: POST /api/webhook/payment
    WebhookAPI->>Validator: 验证请求签名
    Validator->>DB: 查询验证密钥
    DB-->>Validator: 返回密钥信息
    
    alt 签名有效
        Validator-->>WebhookAPI: 验证通过
        WebhookAPI->>WebhookAPI: 处理webhook数据
        WebhookAPI-->>Gateway: 返回200 OK
        
    else 签名无效
        Validator-->>WebhookAPI: 验证失败
        WebhookAPI-->>Gateway: 返回401错误
    end
```

## 📊 API性能优化

### 缓存策略
```mermaid
flowchart TD
    Request[API请求] --> CacheCheck{检查缓存}
    CacheCheck -->|缓存命中| ReturnCache[返回缓存数据]
    CacheCheck -->|缓存未命中| ProcessDB[查询数据库]
    
    ProcessDB --> StoreCache[存储到缓存]
    StoreCache --> ReturnData[返回数据]
    
    subgraph CacheInvalidation [缓存失效机制]
        DataChange[数据变更] --> InvalidateCache[失效相关缓存]
        InvalidateCache --> UpdateCache[更新缓存]
    end
```

### 数据库查询优化
```typescript
// 优化前的查询
const user = await db.user.findUnique({
  where: { id: userId },
  include: {
    licenses: true,
    devices: true,
    payments: true
  }
});

// 优化后的查询 - 按需加载
const user = await db.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    licenses: {
      select: {
        id: true,
        key: true,
        status: true
      }
    }
  }
});
```

## 🚨 错误处理机制

### API错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "许可证格式无效",
    "details": {
      "field": "licenseKey",
      "reason": "必须为24位字符"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 重试机制
```mermaid
flowchart LR
    Request[API请求] --> Attempt[尝试执行]
    Attempt --> Success{成功?}
    Success -->|是| Complete[完成]
    Success -->|否| CheckRetry{可重试错误?}
    
    CheckRetry -->|是| Wait[等待重试间隔]
    Wait --> Retry[重试请求]
    Retry --> Attempt
    
    CheckRetry -->|否| Fail[最终失败]
```

## 📈 API监控和日志

### 监控指标
- **响应时间**: P50, P90, P99 延迟
- **错误率**: 4xx和5xx错误比例
- **吞吐量**: 请求每秒 (RPS)
- **缓存命中率**: 缓存效率指标

### 日志结构
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "method": "POST",
  "path": "/api/license/validate",
  "status": 200,
  "responseTime": 150,
  "userId": "user_123",
  "licenseKey": "LIC-XXX-XXX-XXX",
  "ip": "192.168.1.1"
}
```

---

*此API交互顺序图详细展示了TopWindow系统中关键的业务流程API调用序列，包括认证、许可证验证、支付处理、设备管理等核心功能的API交互模式，为系统开发和维护提供了清晰的架构参考。*