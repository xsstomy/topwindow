// 许可证验证API
import { NextRequest, NextResponse } from 'next/server'
import { LicenseService } from '@/lib/license/service'
import { validateValidationRequest } from '@/lib/license/validator'
import { checkRateLimit } from '@/lib/utils/validators'
import type { ValidationResponse } from '@/types/license'

// Edge Runtime configuration for Cloudflare compatibility
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP进行限流
    const clientIp = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0] ||
                    request.headers.get('x-real-ip') || 
                    'unknown'

    // 限流检查 - 每分钟最多20次验证请求（比激活更宽松，因为客户端会定期验证）
    const rateLimitResult = checkRateLimit(`validate-${clientIp}`, 20, 60000)
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        status: 'error',
        message: 'Too many validation attempts. Please try again later.'
      } satisfies ValidationResponse, { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      })
    }

    // 解析请求体
    const body = await request.json()

    // 验证请求格式
    const validation = validateValidationRequest(body)
    if (!validation.isValid) {
      return NextResponse.json({
        status: 'error',
        message: validation.errors.join(', ')
      } satisfies ValidationResponse, { status: 400 })
    }

    const { license_key, device_id } = validation.cleanData!

    // 执行许可证和设备验证
    const validationResult = await LicenseService.validateLicenseAndDevice(
      license_key,
      device_id
    )

    if (!validationResult.isValid) {
      return NextResponse.json({
        status: 'error',
        message: validationResult.message
      } satisfies ValidationResponse, { 
        status: validationResult.message.includes('not found') ? 404 : 403 
      })
    }

    // 返回成功响应
    const response: ValidationResponse = {
      status: 'success',
      message: validationResult.message,
      license_info: validationResult.licenseData,
      device_info: validationResult.deviceData
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': '20',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        // 添加缓存头，建议客户端缓存验证结果5分钟
        'Cache-Control': 'private, max-age=300'
      }
    })

  } catch (error) {
    console.error('License validation error:', error)
    
    // 不向客户端暴露内部错误详情
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error. Please try again later.'
    } satisfies ValidationResponse, { status: 500 })
  }
}

// 只允许POST请求
export async function GET() {
  return NextResponse.json({
    status: 'error',
    message: 'Method not allowed. Use POST to validate a license.'
  }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({
    status: 'error',
    message: 'Method not allowed. Use POST to validate a license.'
  }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({
    status: 'error',
    message: 'Method not allowed. Use POST to validate a license.'
  }, { status: 405 })
}

// TESTING-GUIDE: 需覆盖用例
// 1. 有效许可证验证 - 返回正确的许可证和设备信息
// 2. 无效许可证验证 - license_key不存在或device_id不匹配
// 3. 过期许可证验证 - 自动更新status为expired
// 4. 撤销许可证验证 - 返回相应的错误信息
// 5. 设备状态更新 - 验证成功时更新last_seen_at
// 6. 限流测试 - 超过每分钟20次请求限制
// 7. 格式验证 - 无效的license_key或device_id格式
// 8. 缓存行为 - 验证Cache-Control头的正确设置
