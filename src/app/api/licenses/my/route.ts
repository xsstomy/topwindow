// 用户许可证查询API
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { LicenseService } from '@/lib/license/service'
import { checkRateLimit } from '@/lib/utils/validators'
import type { UserLicensesResponse } from '@/types/license'

export async function GET(request: NextRequest) {
  try {
    // 创建Supabase客户端
    const supabase = createRouteHandlerClient({ cookies })

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({
        status: 'error',
        message: 'Unauthorized. Please login first.'
      } satisfies UserLicensesResponse, { status: 401 })
    }

    // 获取客户端IP进行限流
    const clientIp = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0] ||
                    request.headers.get('x-real-ip') || 
                    'unknown'

    // 限流检查 - 每分钟最多10次查询请求
    const rateLimitResult = checkRateLimit(`my-licenses-${user.id}`, 10, 60000)
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        status: 'error',
        message: 'Too many requests. Please try again later.'
      } satisfies UserLicensesResponse, { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      })
    }

    // 获取用户的所有许可证
    const licenses = await LicenseService.getUserLicenses(user.id)

    // 返回成功响应
    const response: UserLicensesResponse = {
      status: 'success',
      licenses: licenses.map(license => ({
        ...license,
        // 对于客户端响应，不暴露敏感信息
        user_devices: license.user_devices.map(device => ({
          ...device,
          // 不返回完整的device_info，只返回必要信息
          device_info: {
            name: device.device_info?.name || device.device_name,
            type: device.device_info?.type || device.device_type
          }
        }))
      }))
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        // 缓存用户许可证信息1分钟
        'Cache-Control': 'private, max-age=60'
      }
    })

  } catch (error) {
    console.error('Get user licenses error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to retrieve licenses. Please try again later.'
    } satisfies UserLicensesResponse, { status: 500 })
  }
}

// 不允许其他HTTP方法
export async function POST() {
  return NextResponse.json({
    status: 'error',
    message: 'Method not allowed. Use GET to retrieve licenses.'
  }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({
    status: 'error',
    message: 'Method not allowed. Use GET to retrieve licenses.'
  }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({
    status: 'error',
    message: 'Method not allowed. Use GET to retrieve licenses.'
  }, { status: 405 })
}

// TESTING-GUIDE: 需覆盖用例
// 1. 认证用户查询 - 返回用户拥有的所有许可证和设备信息
// 2. 未认证用户 - 返回401未授权错误
// 3. 空许可证列表 - 新用户或无许可证用户
// 4. 设备信息过滤 - 验证敏感信息不被暴露
// 5. 限流测试 - 超过每分钟10次请求限制
// 6. 许可证状态 - 包含active/expired/revoked等不同状态
// 7. 设备状态 - 包含active/inactive/revoked设备
// 8. 缓存行为 - 验证Cache-Control头设置