// 设备管理API
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { LicenseService } from '@/lib/license/service'
import { LicenseValidator } from '@/lib/license/validator'
import { checkRateLimit, validators } from '@/lib/utils/validators'
import type { DeviceListResponse } from '@/types/license'

// Edge Runtime configuration for Cloudflare compatibility
export const runtime = 'edge'

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
      } satisfies DeviceListResponse, { status: 401 })
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const licenseKey = searchParams.get('license_key')

    if (!licenseKey) {
      return NextResponse.json({
        status: 'error',
        message: 'License key parameter is required.'
      } satisfies DeviceListResponse, { status: 400 })
    }

    if (!validators.licenseKey(licenseKey)) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid license key format.'
      } satisfies DeviceListResponse, { status: 400 })
    }

    // 限流检查
    const rateLimitResult = checkRateLimit(`devices-${user.id}`, 15, 60000)
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        status: 'error',
        message: 'Too many requests. Please try again later.'
      } satisfies DeviceListResponse, { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '15',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      })
    }

    // 获取设备列表
    const devices = await LicenseService.getLicenseDevices(licenseKey, user.id)

    const response: DeviceListResponse = {
      status: 'success',
      devices: devices.map(device => ({
        ...device,
        // 为前端显示清理设备信息
        device_info: {
          name: device.device_info?.name || device.device_name,
          type: device.device_info?.type || device.device_type,
          version: device.device_info?.version,
          platform: device.device_info?.platform
        }
      }))
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': '15',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        'Cache-Control': 'private, max-age=30'
      }
    })

  } catch (error) {
    console.error('Get devices error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to retrieve devices. Please try again later.'
    } satisfies DeviceListResponse, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 创建Supabase客户端
    const supabase = createRouteHandlerClient({ cookies })

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({
        status: 'error',
        message: 'Unauthorized. Please login first.'
      }, { status: 401 })
    }

    // 限流检查
    const rateLimitResult = checkRateLimit(`device-rename-${user.id}`, 5, 60000)
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        status: 'error',
        message: 'Too many rename attempts. Please try again later.'
      }, { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      })
    }

    // 解析请求体
    const body = await request.json()

    // 验证重命名请求
    const validation = LicenseValidator.validateDeviceManagementRequest(body, 'rename')
    if (!validation.isValid) {
      return NextResponse.json({
        status: 'error',
        message: validation.errors.join(', ')
      }, { status: 400 })
    }

    const { license_key, device_id, new_name } = validation.cleanData

    // 执行设备重命名
    const result = await LicenseService.renameDevice(
      license_key,
      device_id,
      new_name,
      user.id
    )

    if (!result.success) {
      return NextResponse.json({
        status: 'error',
        message: result.message
      }, { status: result.message.includes('not found') ? 404 : 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: result.message
    }, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
      }
    })

  } catch (error) {
    console.error('Rename device error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to rename device. Please try again later.'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 创建Supabase客户端
    const supabase = createRouteHandlerClient({ cookies })

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({
        status: 'error',
        message: 'Unauthorized. Please login first.'
      }, { status: 401 })
    }

    // 限流检查
    const rateLimitResult = checkRateLimit(`device-revoke-${user.id}`, 3, 60000)
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        status: 'error',
        message: 'Too many revoke attempts. Please try again later.'
      }, { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      })
    }

    // 解析请求体
    const body = await request.json()

    // 验证撤销请求
    const validation = LicenseValidator.validateDeviceManagementRequest(body, 'revoke')
    if (!validation.isValid) {
      return NextResponse.json({
        status: 'error',
        message: validation.errors.join(', ')
      }, { status: 400 })
    }

    const { license_key, device_id } = validation.cleanData

    // 执行设备撤销
    const result = await LicenseService.revokeDevice(
      license_key,
      device_id,
      user.id
    )

    if (!result.success) {
      return NextResponse.json({
        status: 'error',
        message: result.message
      }, { status: result.message.includes('not found') ? 404 : 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: result.message
    }, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
      }
    })

  } catch (error) {
    console.error('Revoke device error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to revoke device. Please try again later.'
    }, { status: 500 })
  }
}

// 不允许POST方法
export async function POST() {
  return NextResponse.json({
    status: 'error',
    message: 'Method not allowed. Use GET to list devices, PUT to rename, or DELETE to revoke.'
  }, { status: 405 })
}

// TESTING-GUIDE: 需覆盖用例
// 1. GET设备列表 - 返回许可证的所有设备
// 2. PUT设备重命名 - 成功重命名设备
// 3. DELETE设备撤销 - 成功撤销设备激活
// 4. 权限验证 - 用户只能管理自己的设备
// 5. 参数验证 - license_key格式验证
// 6. 限流测试 - GET(15次/分钟)、PUT(5次/分钟)、DELETE(3次/分钟)
// 7. 未认证用户 - 返回401错误
// 8. 不存在的设备 - 返回404错误
