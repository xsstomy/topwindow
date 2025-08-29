# OpenNext + Cloudflare Workers 问题排查指南

## 概述

本文档提供 OpenNext + Cloudflare Workers 部署过程中常见问题的排查和解决方案。包括构建错误、运行时错误、性能问题和配置问题。

---

## 构建阶段问题

### 问题 1：TypeScript 类型错误

#### 症状
```
Type error: Argument of type '{ ... }' is not assignable to parameter of type 'never'
```

#### 原因
- Supabase 自动生成的类型与手动定义的接口不兼容
- TypeScript 严格模式下的类型推断问题

#### 解决方案
```javascript
// next.config.js 中添加
typescript: {
  ignoreBuildErrors: true,
}
```

#### 根本解决
```typescript
// 使用类型断言替代 satisfies
.update(updateData as any)

// 或者重新定义兼容的接口
interface CompatibleUpdateData {
  [key: string]: any
}
```

### 问题 2：OpenNext 构建失败

#### 症状
```
Error: Cannot find module '@opennextjs/cloudflare'
```

#### 解决方案
```bash
# 确保安装正确的包名和版本
npm install @opennextjs/cloudflare@latest --save-dev

# 清理 npm 缓存
npm cache clean --force

# 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题 3：Webpack 配置冲突

#### 症状
```
Module not found: Can't resolve 'fs' in...
Module not found: Can't resolve 'path' in...
```

#### 解决方案
```javascript
// next.config.js
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals.push({
      'fs': 'commonjs fs',
      'path': 'commonjs path',
      'crypto': 'commonjs crypto'
    })
  }
  return config
}
```

### 问题 4：静态资源处理错误

#### 症状
```
Error: Static files not found after build
```

#### 解决方案
```javascript
// opennext.config.js
cloudflare: {
  assets: {
    inline: true,
    inlineLimit: 4096
  }
}
```

---

## 部署阶段问题

### 问题 5：Wrangler 部署失败

#### 症状
```
✘ [ERROR] Could not resolve "..."
```

#### 诊断步骤
```bash
# 检查 wrangler 版本（要求 3.99.0+）
wrangler --version

# 检查登录状态
wrangler whoami

# 检查配置文件
wrangler config list
```

#### 解决方案
```bash
# 重新登录 Cloudflare
wrangler logout
wrangler login

# 更新到最新版本（至少 3.99.0）
npm install -g wrangler@latest
```

### 问题 6：环境变量未生效

#### 症状
- API 返回 undefined 环境变量错误
- 数据库连接失败

#### 解决方案
```bash
# 设置敏感环境变量
wrangler secret put NEXT_PUBLIC_SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# 检查变量是否设置成功
wrangler secret list
```

#### 配置验证
```javascript
// 在 worker.js 中添加调试
console.log('Environment check:', {
  supabaseUrl: !!env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey: !!env.SUPABASE_SERVICE_ROLE_KEY
})
```

### 问题 7：KV 命名空间错误

#### 症状
```
Error: KV namespace not found
```

#### 解决方案
```bash
# 创建 KV 命名空间
wrangler kv:namespace create "CACHE"
wrangler kv:namespace create "CACHE" --preview

# 更新 wrangler.toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

---

## 运行时问题

### 问题 8：CPU 时间超限

#### 症状
```
Error: Script exceeded CPU time limit
```

#### 诊断代码
```javascript
// 添加性能监控
const startTime = performance.now()
// ... 你的代码
const duration = performance.now() - startTime
console.log(`Execution time: ${duration}ms`)
```

#### 优化方案
```javascript
// 1. 优化数据库查询
const { data } = await supabase
  .from('table')
  .select('id, name') // 只选择需要的字段
  .limit(100) // 限制结果数量
  .range(0, 99) // 使用分页

// 2. 使用缓存减少重复计算
const cacheKey = `data:${userId}`
let result = await env.CACHE.get(cacheKey)
if (!result) {
  result = await expensiveOperation()
  await env.CACHE.put(cacheKey, JSON.stringify(result), {
    expirationTtl: 300 // 5分钟缓存
  })
}

// 3. 异步操作优化
const results = await Promise.all([
  operation1(),
  operation2(),
  operation3()
])
```

### 问题 9：内存限制错误

#### 症状
```
Error: Script exceeded memory limit
```

#### 解决方案
```javascript
// 1. 避免大对象存储
// 错误做法
const bigArray = new Array(1000000).fill(data)

// 正确做法
function* processDataInChunks(data) {
  const chunkSize = 1000
  for (let i = 0; i < data.length; i += chunkSize) {
    yield data.slice(i, i + chunkSize)
  }
}

// 2. 及时清理变量
function processData() {
  let result = heavyComputation()
  // 使用后立即清理
  const output = result.summary
  result = null // 帮助垃圾回收
  return output
}
```

### 问题 10：Supabase 连接问题

#### 症状
```
Error: Failed to fetch from Supabase
CORS error
```

#### 解决方案
```typescript
// 1. 检查 Supabase 客户端配置
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false // Workers 中禁用会话持久化
    },
    fetch: globalThis.fetch // 使用全局 fetch
  }
)

// 2. 添加错误重试机制
async function withRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}

// 使用示例
const result = await withRetry(async () => {
  return await supabase.from('users').select('*').limit(10)
})
```

---

## 性能问题

### 问题 11：冷启动时间过长

#### 症状
- 首次请求响应时间 > 1000ms
- 间歇性超时错误

#### 优化方案
```javascript
// 1. 减少依赖包大小
// package.json - 移除不必要的包
"dependencies": {
  // 只保留运行时必需的包
}

// 2. 代码分割优化
// next.config.js
webpack: (config) => {
  config.optimization.splitChunks = {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      }
    }
  }
  return config
}

// 3. 预热策略
// 在 worker.js 中添加
let isWarmedUp = false

export default {
  async fetch(request, env, ctx) {
    if (!isWarmedUp) {
      // 预热关键服务
      await Promise.all([
        createSupabaseClient(env),
        env.CACHE?.get('warmup-key')
      ])
      isWarmedUp = true
    }
    
    // 处理请求...
  }
}
```

### 问题 12：响应时间不一致

#### 症状
- 相同请求响应时间差异很大
- 某些地区访问特别慢

#### 诊断工具
```javascript
// 添加详细的性能监控
const perfMetrics = {
  start: performance.now(),
  dbQuery: 0,
  processing: 0,
  response: 0
}

// 数据库查询时间
const dbStart = performance.now()
const data = await supabase.from('table').select('*')
perfMetrics.dbQuery = performance.now() - dbStart

// 处理时间
const processStart = performance.now()
const result = processData(data)
perfMetrics.processing = performance.now() - processStart

// 总响应时间
perfMetrics.response = performance.now() - perfMetrics.start

// 记录性能数据
console.log('Performance metrics:', perfMetrics)
```

#### 优化策略
```javascript
// 1. 智能缓存策略
const cacheStrategy = {
  static: 86400,    // 24小时
  dynamic: 300,     // 5分钟
  user: 60          // 1分钟
}

function getCacheKey(request, type) {
  const url = new URL(request.url)
  const userId = request.headers.get('x-user-id')
  
  switch (type) {
    case 'static':
      return `static:${url.pathname}`
    case 'user':
      return `user:${userId}:${url.pathname}`
    default:
      return `dynamic:${url.pathname}:${url.search}`
  }
}

// 2. 地理位置优化
function getOptimalEndpoint(request) {
  const country = request.cf?.country
  const continent = request.cf?.continent
  
  // 根据地理位置选择最近的数据中心
  const endpoints = {
    'NA': 'https://api-us.example.com',
    'EU': 'https://api-eu.example.com',
    'AS': 'https://api-asia.example.com'
  }
  
  return endpoints[continent] || endpoints['NA']
}
```

---

## 调试工具和技巧

### 本地调试

#### 设置本地开发环境
```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 启动本地开发服务器
wrangler dev

# 使用特定端口
wrangler dev --port 8787

# 启用详细日志
wrangler dev --log-level debug
```

#### 调试配置
```javascript
// wrangler.toml 开发环境配置
[env.development]
vars = { 
  DEBUG = "true",
  LOG_LEVEL = "debug"
}
```

### 生产环境调试

#### 实时日志查看
```bash
# 查看实时日志
wrangler tail

# 过滤特定日志
wrangler tail --grep "ERROR"

# 查看特定时间段日志
wrangler tail --since 1h
```

#### 结构化日志记录
```javascript
// 创建日志工具
function createLogger(level = 'info') {
  return {
    info: (message, meta = {}) => {
      if (shouldLog('info', level)) {
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'info',
          message,
          ...meta
        }))
      }
    },
    error: (message, error = {}) => {
      console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        message,
        error: {
          message: error.message,
          stack: error.stack
        }
      }))
    },
    debug: (message, data = {}) => {
      if (shouldLog('debug', level)) {
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'debug',
          message,
          data
        }))
      }
    }
  }
}

function shouldLog(messageLevel, configLevel) {
  const levels = { error: 0, info: 1, debug: 2 }
  return levels[messageLevel] <= levels[configLevel]
}
```

### 错误追踪

#### 错误报告系统
```javascript
// 集成 Sentry 或其他错误追踪服务
import * as Sentry from '@sentry/browser'

// 在 worker.js 中初始化
if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.ENVIRONMENT,
    beforeSend(event) {
      // 过滤敏感信息
      if (event.request?.headers?.authorization) {
        delete event.request.headers.authorization
      }
      return event
    }
  })
}

// 错误处理包装器
function withErrorHandling(fn) {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
```

---

## 监控和告警

### 关键指标监控

#### 自定义指标收集
```javascript
// 性能指标收集器
class MetricsCollector {
  constructor(env) {
    this.env = env
    this.metrics = new Map()
  }
  
  increment(name, value = 1, tags = {}) {
    const key = `${name}:${JSON.stringify(tags)}`
    this.metrics.set(key, (this.metrics.get(key) || 0) + value)
  }
  
  timing(name, duration, tags = {}) {
    this.increment(`${name}.duration`, duration, tags)
    this.increment(`${name}.count`, 1, tags)
  }
  
  async flush() {
    // 发送指标到监控系统
    const data = Array.from(this.metrics.entries()).map(([key, value]) => ({
      metric: key,
      value,
      timestamp: Date.now()
    }))
    
    // 可以发送到 Cloudflare Analytics、Datadog 等
    if (this.env.METRICS_ENDPOINT) {
      await fetch(this.env.METRICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: data })
      })
    }
  }
}
```

### 健康检查

#### 自动化健康检查
```javascript
// 健康检查端点
async function healthCheck(env) {
  const checks = []
  
  // 数据库连接检查
  try {
    const supabase = createSupabaseClient(env)
    await supabase.from('health_check').select('1').limit(1)
    checks.push({ name: 'database', status: 'healthy' })
  } catch (error) {
    checks.push({ 
      name: 'database', 
      status: 'unhealthy', 
      error: error.message 
    })
  }
  
  // KV 存储检查
  try {
    await env.CACHE?.put('health_check', Date.now().toString(), { expirationTtl: 60 })
    const value = await env.CACHE?.get('health_check')
    checks.push({ 
      name: 'kv_storage', 
      status: value ? 'healthy' : 'unhealthy' 
    })
  } catch (error) {
    checks.push({ 
      name: 'kv_storage', 
      status: 'unhealthy', 
      error: error.message 
    })
  }
  
  const overallStatus = checks.every(c => c.status === 'healthy') ? 'healthy' : 'unhealthy'
  
  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks,
    version: env.VERSION || '1.0.0'
  }
}
```

---

## 常用命令速查

### 开发命令
```bash
# 本地开发
npm run dev:workers
wrangler dev --local

# 构建
npm run build:workers

# 预览
npm run preview

# 清理
npm run clean
```

### 部署命令
```bash
# 部署到不同环境
npm run deploy
wrangler deploy --env development
wrangler deploy --env staging  
wrangler deploy --env production

# 回滚到上一版本
wrangler rollback
```

### 调试命令
```bash
# 查看日志
wrangler tail
wrangler tail --env production

# 查看 KV 数据
wrangler kv:key list --binding CACHE
wrangler kv:key get "key-name" --binding CACHE

# 查看部署状态
wrangler deployments list
```

### 配置命令
```bash
# 环境变量管理
wrangler secret put SECRET_NAME
wrangler secret list
wrangler secret delete SECRET_NAME

# KV 命名空间管理
wrangler kv:namespace create "CACHE"
wrangler kv:namespace list
wrangler kv:namespace delete namespace-id
```

---

## 最佳实践总结

### 性能优化
1. ✅ 使用缓存减少数据库查询
2. ✅ 优化数据库查询语句
3. ✅ 实现智能预热机制
4. ✅ 合理使用代码分割

### 错误处理
1. ✅ 实现全局错误处理
2. ✅ 添加详细的错误日志
3. ✅ 设置合理的重试机制
4. ✅ 建立错误监控系统

### 监控运维
1. ✅ 设置关键指标监控
2. ✅ 配置自动化告警
3. ✅ 定期进行健康检查
4. ✅ 建立故障恢复流程

### 安全考虑
1. ✅ 妥善管理敏感环境变量
2. ✅ 实现访问控制和限流
3. ✅ 定期更新依赖包
4. ✅ 配置适当的 CORS 策略

---

*本文档将持续更新，如遇到新问题请及时补充。*
*最后更新：2025-08-29*