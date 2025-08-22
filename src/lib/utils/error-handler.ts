// 错误处理和响应工具
import { NextResponse } from 'next/server'

export interface ApiError {
  code: string
  message: string
  statusCode: number
  details?: any
}

export class LicenseError extends Error {
  code: string
  statusCode: number
  details?: any

  constructor(code: string, message: string, statusCode: number = 500, details?: any) {
    super(message)
    this.name = 'LicenseError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

// 预定义的错误类型
export const ErrorCodes = {
  // 认证错误
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // 许可证错误
  LICENSE_NOT_FOUND: 'LICENSE_NOT_FOUND',
  LICENSE_EXPIRED: 'LICENSE_EXPIRED',
  LICENSE_REVOKED: 'LICENSE_REVOKED',
  LICENSE_INVALID_FORMAT: 'LICENSE_INVALID_FORMAT',
  
  // 设备错误
  DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
  DEVICE_INVALID_FORMAT: 'DEVICE_INVALID_FORMAT',
  DEVICE_ACTIVATION_LIMIT: 'DEVICE_ACTIVATION_LIMIT',
  
  // 验证错误
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_INPUT_FORMAT: 'INVALID_INPUT_FORMAT',
  
  // 系统错误
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR'
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

/**
 * 创建标准化的API错误响应
 */
export function createErrorResponse(
  error: LicenseError | Error,
  fallbackMessage: string = 'An error occurred'
): NextResponse {
  let apiError: ApiError

  if (error instanceof LicenseError) {
    apiError = {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details
    }
  } else {
    // 对于未知错误，不暴露具体信息
    console.error('Unexpected error:', error)
    apiError = {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: fallbackMessage,
      statusCode: 500
    }
  }

  return NextResponse.json({
    status: 'error',
    message: apiError.message,
    code: apiError.code,
    ...(process.env.NODE_ENV === 'development' && apiError.details && { details: apiError.details })
  }, { status: apiError.statusCode })
}

/**
 * 处理Supabase错误
 */
export function handleSupabaseError(error: any): LicenseError {
  // Supabase PostgreSQL错误码映射
  switch (error.code) {
    case 'PGRST116': // 记录未找到
      return new LicenseError(
        ErrorCodes.LICENSE_NOT_FOUND,
        'License not found',
        404
      )
    
    case '23505': // 唯一约束违反
      return new LicenseError(
        ErrorCodes.VALIDATION_FAILED,
        'Duplicate entry detected',
        409
      )
    
    case '23503': // 外键约束违反
      return new LicenseError(
        ErrorCodes.VALIDATION_FAILED,
        'Referenced record does not exist',
        400
      )
    
    case '42501': // 权限不足
      return new LicenseError(
        ErrorCodes.FORBIDDEN,
        'Access denied',
        403
      )
    
    default:
      console.error('Unhandled Supabase error:', error)
      return new LicenseError(
        ErrorCodes.DATABASE_ERROR,
        'Database operation failed',
        500,
        { originalError: error.message }
      )
  }
}

/**
 * 验证结果包装器
 */
export function validateAndThrow<T>(
  validation: { isValid: boolean; errors: string[]; cleanData?: T },
  errorCode: ErrorCode = ErrorCodes.VALIDATION_FAILED
): T {
  if (!validation.isValid) {
    throw new LicenseError(
      errorCode,
      validation.errors.join(', '),
      400,
      { errors: validation.errors }
    )
  }
  
  return validation.cleanData!
}

/**
 * 异步错误处理包装器
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      if (error instanceof LicenseError) {
        throw error
      }
      
      // 处理Supabase错误
      if (error && typeof error === 'object' && 'code' in error) {
        throw handleSupabaseError(error)
      }
      
      // 未知错误
      console.error('Unhandled error in withErrorHandling:', error)
      throw new LicenseError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        'An unexpected error occurred',
        500,
        { originalError: error instanceof Error ? error.message : String(error) }
      )
    }
  }
}

/**
 * 限流错误创建器
 */
export function createRateLimitError(
  limit: number,
  resetTime: number
): LicenseError {
  return new LicenseError(
    ErrorCodes.RATE_LIMIT_EXCEEDED,
    `Rate limit exceeded. Maximum ${limit} requests allowed.`,
    429,
    { 
      limit,
      resetTime,
      retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
    }
  )
}

/**
 * 输入验证错误创建器
 */
export function createValidationError(
  field: string,
  message: string
): LicenseError {
  return new LicenseError(
    ErrorCodes.INVALID_INPUT_FORMAT,
    `Invalid ${field}: ${message}`,
    400,
    { field, validation: message }
  )
}

/**
 * 许可证状态相关错误创建器
 */
export const LicenseErrors = {
  notFound: () => new LicenseError(
    ErrorCodes.LICENSE_NOT_FOUND,
    'License key not found',
    404
  ),
  
  expired: () => new LicenseError(
    ErrorCodes.LICENSE_EXPIRED,
    'License key has expired',
    403
  ),
  
  revoked: () => new LicenseError(
    ErrorCodes.LICENSE_REVOKED,
    'License key has been revoked',
    403
  ),
  
  activationLimitReached: (current: number, limit: number) => new LicenseError(
    ErrorCodes.DEVICE_ACTIVATION_LIMIT,
    `Device activation limit reached (${current}/${limit})`,
    403,
    { currentActivations: current, limit }
  ),
  
  deviceNotFound: () => new LicenseError(
    ErrorCodes.DEVICE_NOT_FOUND,
    'Device not found or access denied',
    404
  )
}

/**
 * 日志记录工具
 */
export function logError(
  context: string,
  error: Error,
  metadata?: Record<string, any>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    context,
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    },
    metadata
  }
  
  console.error(`[${context}]`, JSON.stringify(logEntry, null, 2))
}

// TESTING-GUIDE: 需覆盖用例
// 1. LicenseError创建和序列化
// 2. Supabase错误码映射正确性
// 3. withErrorHandling包装器功能
// 4. 错误响应格式一致性
// 5. 开发环境vs生产环境错误详情暴露
// 6. 限流错误和验证错误的正确创建