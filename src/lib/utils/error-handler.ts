// Error handling and response utilities
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

// Predefined error types
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // License errors
  LICENSE_NOT_FOUND: 'LICENSE_NOT_FOUND',
  LICENSE_EXPIRED: 'LICENSE_EXPIRED',
  LICENSE_REVOKED: 'LICENSE_REVOKED',
  LICENSE_INVALID_FORMAT: 'LICENSE_INVALID_FORMAT',
  
  // Device errors
  DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
  DEVICE_INVALID_FORMAT: 'DEVICE_INVALID_FORMAT',
  DEVICE_ACTIVATION_LIMIT: 'DEVICE_ACTIVATION_LIMIT',
  
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_INPUT_FORMAT: 'INVALID_INPUT_FORMAT',
  
  // System errors
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR'
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

/**
 * Create standardized API error response
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
    // For unknown errors, don't expose specific information
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
 * Handle Supabase errors
 */
export function handleSupabaseError(error: any): LicenseError {
  // Supabase PostgreSQL error code mapping
  switch (error.code) {
    case 'PGRST116': // Record not found
      return new LicenseError(
        ErrorCodes.LICENSE_NOT_FOUND,
        'License not found',
        404
      )
    
    case '23505': // Unique constraint violation
      return new LicenseError(
        ErrorCodes.VALIDATION_FAILED,
        'Duplicate entry detected',
        409
      )
    
    case '23503': // Foreign key constraint violation
      return new LicenseError(
        ErrorCodes.VALIDATION_FAILED,
        'Referenced record does not exist',
        400
      )
    
    case '42501': // Insufficient privileges
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
 * Validation result wrapper
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
 * Async error handling wrapper
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
      
      // Handle Supabase errors
      if (error && typeof error === 'object' && 'code' in error) {
        throw handleSupabaseError(error)
      }
      
      // Unknown error
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
 * Rate limit error creator
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
 * Input validation error creator
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
 * License status related error creator
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
 * Logging utility
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

// TESTING-GUIDE: Test cases to cover
// 1. LicenseError creation and serialization
// 2. Supabase error code mapping correctness
// 3. withErrorHandling wrapper functionality
// 4. Error response format consistency
// 5. Development vs production environment error details exposure
// 6. Rate limit and validation error creation correctness