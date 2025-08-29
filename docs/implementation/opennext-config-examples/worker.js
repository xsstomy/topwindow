/**
 * Cloudflare Workers 入口文件
 * 处理所有传入的 HTTP 请求，并转发给 Next.js 应用
 * 
 * 这个文件通常由 OpenNext 自动生成，但可以根据需要自定义
 */

import { handler } from './.open-next/server-function/index.js'

export default {
  async fetch(request, env, ctx) {
    // 性能监控开始
    const startTime = performance.now()
    
    try {
      // 环境变量注入到 process.env（兼容 Node.js 代码）
      process.env = {
        ...process.env,
        ...env
      }
      
      // 请求日志记录
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Request received',
        method: request.method,
        url: request.url,
        userAgent: request.headers.get('User-Agent'),
        cf: request.cf
      }))
      
      // 健康检查端点
      if (request.url.endsWith('/health') || request.url.endsWith('/ping')) {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: env.VERSION || '1.0.0'
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        })
      }
      
      // CORS 预检请求处理
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Max-Age': '86400'
          }
        })
      }
      
      // 速率限制检查（可选）
      const clientIP = request.headers.get('CF-Connecting-IP')
      if (env.RATE_LIMITING && clientIP) {
        const rateLimitKey = `rate_limit:${clientIP}`
        const current = await env.CACHE?.get(rateLimitKey)
        
        if (current && parseInt(current) > 100) { // 每分钟100次请求限制
          return new Response('Rate limit exceeded', { 
            status: 429,
            headers: {
              'Retry-After': '60'
            }
          })
        }
        
        await env.CACHE?.put(rateLimitKey, (parseInt(current || '0') + 1).toString(), {
          expirationTtl: 60
        })
      }
      
      // 安全头部设置
      const securityHeaders = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      }
      
      // 调用 Next.js 处理函数
      const response = await handler(request, {
        // Cloudflare 绑定传递给应用
        KV: env.CACHE,
        SESSIONS: env.SESSIONS,
        DB: env.DB,
        ASSETS: env.ASSETS,
        // 其他环境变量
        ...env
      })
      
      // 添加安全头部到响应
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      // 添加 CORS 头部（如需要）
      if (env.CORS_ENABLED === 'true') {
        response.headers.set('Access-Control-Allow-Origin', env.CORS_ORIGIN || '*')
        response.headers.set('Access-Control-Allow-Credentials', 'true')
      }
      
      // 性能监控结束
      const duration = performance.now() - startTime
      
      // 响应日志记录
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Request completed',
        status: response.status,
        duration: Math.round(duration * 100) / 100,
        cf: {
          colo: request.cf?.colo,
          country: request.cf?.country,
          city: request.cf?.city
        }
      }))
      
      // 添加性能头部
      response.headers.set('X-Response-Time', `${Math.round(duration)}ms`)
      response.headers.set('X-Worker-Version', env.VERSION || '1.0.0')
      
      return response
      
    } catch (error) {
      // 错误日志记录
      console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        message: 'Worker error',
        error: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method
      }))
      
      // 返回通用错误响应
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID()
      }), { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Error': 'true'
        }
      })
    }
  }
}

/**
 * 定时任务处理器（可选）
 * 用于执行定期维护任务
 */
export async function scheduled(event, env, ctx) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Scheduled event triggered',
    cron: event.cron
  }))
  
  // 执行定时任务，比如：
  // - 清理过期缓存
  // - 发送统计报告
  // - 健康检查
  
  try {
    // 清理过期的 rate limit 记录
    if (env.CACHE) {
      // 这里可以添加清理逻辑
    }
    
    console.log('Scheduled task completed successfully')
  } catch (error) {
    console.error('Scheduled task failed:', error)
  }
}

/**
 * Durable Object 绑定处理器（可选）
 * 用于状态管理和实时功能
 */
export class Counter {
  constructor(state, env) {
    this.state = state
    this.env = env
  }
  
  async fetch(request) {
    // 实现 Durable Object 逻辑
    const url = new URL(request.url)
    
    if (url.pathname === '/increment') {
      let value = await this.state.storage.get('counter') || 0
      value++
      await this.state.storage.put('counter', value)
      
      return new Response(JSON.stringify({ value }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return new Response('Not found', { status: 404 })
  }
}