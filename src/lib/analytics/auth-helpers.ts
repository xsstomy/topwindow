import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase/server';
import { TrialAnalyticsService } from './service';

/**
 * Verify admin access for analytics endpoints
 * Returns admin email if authorized, null otherwise
 */
export async function verifyAdminAccess(request: NextRequest): Promise<string | null> {
  try {
    const supabase = createRouteClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user?.email) {
      return null;
    }

    const isAdmin = await TrialAnalyticsService.isAdmin(user.email);
    return isAdmin ? user.email : null;
  } catch (error) {
    console.error('Admin verification error:', error);
    return null;
  }
}

/**
 * Check if analytics feature is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return process.env.ANALYTICS_ENABLED === 'true';
}

/**
 * Validate date string format
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validate date range (startDate must be before endDate)
 */
export function isValidDateRange(startDate: string, endDate: string): boolean {
  return new Date(startDate) <= new Date(endDate);
}

/**
 * Rate limiting helper (basic implementation)
 * In production, consider using Redis or dedicated rate limiting service
 */
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();
  
  static isAllowed(
    identifier: string, 
    maxRequests: number = 100, 
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier);
    
    if (!userRequests || now > userRequests.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (userRequests.count >= maxRequests) {
      return false;
    }
    
    userRequests.count++;
    return true;
  }
  
  static getRemainingRequests(identifier: string, maxRequests: number = 100): number {
    const userRequests = this.requests.get(identifier);
    if (!userRequests) return maxRequests;
    return Math.max(0, maxRequests - userRequests.count);
  }
  
  static getResetTime(identifier: string): number {
    const userRequests = this.requests.get(identifier);
    return userRequests?.resetTime || 0;
  }
}

/**
 * Common error responses for analytics APIs
 */
export const AnalyticsErrors = {
  ANALYTICS_DISABLED: {
    error: 'Analytics is disabled',
    code: 'ANALYTICS_DISABLED'
  },
  UNAUTHORIZED: {
    error: 'Unauthorized. Admin access required.',
    code: 'UNAUTHORIZED'
  },
  RATE_LIMITED: {
    error: 'Rate limit exceeded. Please try again later.',
    code: 'RATE_LIMITED'
  },
  INVALID_DATE_FORMAT: {
    error: 'Invalid date format. Use ISO date string.',
    code: 'INVALID_DATE_FORMAT'
  },
  INVALID_DATE_RANGE: {
    error: 'startDate must be before or equal to endDate',
    code: 'INVALID_DATE_RANGE'
  },
  INTERNAL_ERROR: {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  }
} as const;