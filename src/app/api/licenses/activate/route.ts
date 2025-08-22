// 许可证激活API
import { NextRequest, NextResponse } from 'next/server'
import { LicenseService } from '@/lib/license/service'
import { validateActivationRequest, validateLicenseStatus, validateActivationLimit } from '@/lib/license/validator'
import { checkRateLimit } from '@/lib/utils/validators'
import { 
  createErrorResponse, 
  createRateLimitError, 
  validateAndThrow, 
  withErrorHandling,
  LicenseErrors,
  logError
} from '@/lib/utils/error-handler'
import type { ActivationResponse } from '@/types/license'

export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP进行限流
    const clientIp = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0] ||
                    request.headers.get('x-real-ip') || 
                    'unknown'

    // 限流检查 - 每分钟最多5次激活请求
    const rateLimitResult = checkRateLimit(`activate-${clientIp}`, 5, 60000)
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        status: 'error',
        message: 'Too many activation attempts. Please try again later.'
      } satisfies ActivationResponse, { 
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

    // 验证请求格式
    const validation = validateActivationRequest(body)
    if (!validation.isValid) {
      return NextResponse.json({
        status: 'error',
        message: validation.errors.join(', ')
      } satisfies ActivationResponse, { status: 400 })
    }

    const { license_key, device_id, device_info } = validation.cleanData!

    // 获取许可证详细信息
    const license = await LicenseService.getLicenseDetails(license_key)
    if (!license) {
      return NextResponse.json({
        status: 'error',
        message: 'License key not found.'
      } satisfies ActivationResponse, { status: 404 })
    }

    // 验证许可证状态
    const statusValidation = validateLicenseStatus(license)
    if (!statusValidation.isValid) {
      return NextResponse.json({
        status: 'error',
        message: statusValidation.reason!
      } satisfies ActivationResponse, { status: 403 })
    }

    // 获取已激活设备列表
    const activatedDevices = await LicenseService.getLicenseDevices(license_key, license.user_id)

    // 验证激活限制
    const limitValidation = validateActivationLimit(license, device_id, activatedDevices)
    if (!limitValidation.canActivate) {
      return NextResponse.json({
        status: 'error',
        message: limitValidation.reason!,
        activation_info: {
          activated_count: activatedDevices.filter(d => d.status === 'active').length,
          activation_limit: license.activation_limit,
          remaining_activations: limitValidation.remainingSlots || 0
        }
      } satisfies ActivationResponse, { status: 403 })
    }

    // 执行设备激活
    const activationResult = await LicenseService.activateDevice(
      license_key,
      device_id,
      device_info
    )

    if (!activationResult.success) {
      return NextResponse.json({
        status: 'error',
        message: activationResult.message
      } satisfies ActivationResponse, { status: 500 })
    }

    // 计算剩余激活次数
    const currentActiveCount = activatedDevices.filter(d => d.status === 'active').length
    const remainingActivations = Math.max(0, license.activation_limit - currentActiveCount - 1)

    // 返回成功响应
    const response: ActivationResponse = {
      status: 'success',
      message: 'Activation successful.',
      expires_at: license.expires_at || undefined,
      activation_info: {
        activated_at: activationResult.deviceData!.first_activated_at,
        device_name: activationResult.deviceData!.device_name,
        remaining_activations: remainingActivations
      }
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
      }
    })

  } catch (error) {
    console.error('License activation error:', error)
    
    // 不向客户端暴露内部错误详情
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error. Please try again later.'
    } satisfies ActivationResponse, { status: 500 })
  }
}

// 只允许POST请求
export async function GET() {
  return NextResponse.json({
    status: 'error',
    message: 'Method not allowed. Use POST to activate a license.'
  }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({
    status: 'error',
    message: 'Method not allowed. Use POST to activate a license.'
  }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({
    status: 'error',
    message: 'Method not allowed. Use POST to activate a license.'
  }, { status: 405 })
}

// TESTING-GUIDE: 需覆盖用例
// 1. 正常激活流程 - 有效许可证首次激活设备
// 2. 重复激活 - 同一设备多次激活请求
// 3. 激活限制 - 超过许可证设备数量限制
// 4. 无效输入 - 格式错误的license_key或device_id
// 5. 许可证状态 - 过期/撤销/不存在的许可证
// 6. 限流测试 - 超过每分钟5次请求限制
// 7. 错误处理 - 数据库连接失败等异常情况