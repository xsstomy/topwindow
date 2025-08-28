# Trial Analytics Implementation Plan

## 📊 Project Overview

**Goal**: Implement anonymous trial usage analytics system for TopWindow application  
**Approach**: Independent database table with privacy-compliant data collection  
**Scope**: Support both authenticated and anonymous users  

## 🏗️ System Architecture

### Database Design

#### New Table: `trial_analytics`
```sql
CREATE TABLE trial_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trial_id UUID NOT NULL UNIQUE,           -- Trial session unique identifier
    user_id UUID REFERENCES auth.users(id),  -- Nullable (supports anonymous trials)
    device_fingerprint_hash TEXT NOT NULL,   -- SHA-256 hashed device fingerprint
    trial_start_at TIMESTAMPTZ NOT NULL,     -- Trial start time
    trial_end_at TIMESTAMPTZ,                -- Trial end time (nullable)
    trial_duration_seconds INTEGER,          -- Trial duration in seconds
    app_version TEXT NOT NULL,               -- Application version
    system_version TEXT NOT NULL,            -- Operating system version
    install_channel TEXT,                    -- Installation channel/source
    device_type TEXT,                        -- Device type (mac/macbook_pro/etc)
    trial_status TEXT DEFAULT 'active',     -- Status: active/completed/abandoned
    metadata JSONB DEFAULT '{}',             -- Additional metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),    -- Record creation time
    updated_at TIMESTAMPTZ DEFAULT NOW()     -- Record update time
);
```

#### Database Indexes
```sql
-- Performance optimization indexes
CREATE INDEX idx_trial_analytics_trial_id ON trial_analytics(trial_id);
CREATE INDEX idx_trial_analytics_user_id ON trial_analytics(user_id);
CREATE INDEX idx_trial_analytics_device_hash ON trial_analytics(device_fingerprint_hash);
CREATE INDEX idx_trial_analytics_created_at ON trial_analytics(created_at);
CREATE INDEX idx_trial_analytics_status ON trial_analytics(trial_status);
```

#### Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE trial_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous trial data insertion
CREATE POLICY "Allow anonymous trial data insert" ON trial_analytics
  FOR INSERT WITH CHECK (true);

-- Users can view their own trial data
CREATE POLICY "Users can view own trial data" ON trial_analytics
  FOR SELECT USING (auth.uid() = user_id);

-- Allow trial data updates by trial_id
CREATE POLICY "Allow trial data update by trial_id" ON trial_analytics
  FOR UPDATE USING (true);
```

### API Endpoints

#### 1. Trial Start Endpoint
**Route**: `POST /api/analytics/trial/start`

**Request Body**:
```typescript
interface TrialStartRequest {
  deviceFingerprint: string;     // Raw device fingerprint (will be hashed)
  appVersion: string;            // Application version
  systemVersion: string;         // Operating system version
  installChannel?: string;       // Installation channel/source
  deviceType?: string;           // Device type
}
```

**Response**:
```typescript
interface TrialStartResponse {
  trialId: string;               // Trial session UUID for subsequent calls
  success: boolean;
  message?: string;
}
```

**Logic**:
- Hash device fingerprint using SHA-256 + salt
- Generate unique trial_id
- Insert trial start record
- Return trial_id for client to store

#### 2. Trial End Endpoint
**Route**: `POST /api/analytics/trial/end`

**Request Body**:
```typescript
interface TrialEndRequest {
  trialId: string;               // Trial session UUID
  deviceFingerprint: string;     // Device fingerprint for validation
}
```

**Response**:
```typescript
interface TrialEndResponse {
  trialDuration: number;         // Trial duration in seconds
  success: boolean;
  message?: string;
}
```

**Logic**:
- Validate device fingerprint hash matches
- Calculate trial duration
- Update trial record with end time and duration
- Set status to 'completed'

#### 3. Trial Statistics Endpoint (Admin Only)
**Route**: `GET /api/analytics/trial/stats`

**Query Parameters**:
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)
- `channel`: Installation channel filter (optional)

**Response**:
```typescript
interface TrialStatsResponse {
  summary: {
    totalTrials: number;
    activeTrials: number;
    completedTrials: number;
    abandonedTrials: number;
    averageDuration: number;       // In seconds
  };
  channelBreakdown: Array<{
    channel: string;
    count: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;                  // YYYY-MM-DD format
    starts: number;
    completions: number;
    averageDuration: number;
  }>;
  deviceTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}
```

#### 4. Trial Data Export Endpoint (Admin Only)
**Route**: `GET /api/analytics/trial/export`

**Query Parameters**:
- `format`: 'csv' | 'json' (default: 'csv')
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)

**Response**: File download (CSV or JSON format)

## 🛠️ Implementation Details

### Type Definitions

#### File: `src/types/analytics.ts`
```typescript
export interface TrialAnalytics {
  id: string;
  trial_id: string;
  user_id: string | null;
  device_fingerprint_hash: string;
  trial_start_at: string;
  trial_end_at: string | null;
  trial_duration_seconds: number | null;
  app_version: string;
  system_version: string;
  install_channel: string | null;
  device_type: string | null;
  trial_status: 'active' | 'completed' | 'abandoned';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DeviceFingerprint {
  platform: string;              // Operating system
  architecture: string;          // CPU architecture
  locale: string;                // System locale
  timezone: string;              // System timezone
  screenResolution: string;      // Primary display resolution
  appVersion: string;            // Application version
  // Note: Excludes sensitive data like MAC addresses, serial numbers
}

export interface TrialStartRequest {
  deviceFingerprint: string;
  appVersion: string;
  systemVersion: string;
  installChannel?: string;
  deviceType?: string;
}

export interface TrialEndRequest {
  trialId: string;
  deviceFingerprint: string;
}

export interface TrialStartResponse {
  trialId: string;
  success: boolean;
  message?: string;
}

export interface TrialEndResponse {
  trialDuration: number;
  success: boolean;
  message?: string;
}
```

### Service Layer

#### File: `src/lib/analytics/service.ts`
```typescript
import { createHash } from 'crypto';
import { createServerClient } from '@/lib/supabase/server';
import type { TrialAnalytics, TrialStartRequest, TrialEndRequest } from '@/types/analytics';

export class TrialAnalyticsService {
  private static hashDeviceFingerprint(fingerprint: string): string {
    const salt = process.env.DEVICE_FINGERPRINT_SALT!;
    return createHash('sha256')
      .update(fingerprint + salt)
      .digest('hex');
  }

  static async startTrial(data: TrialStartRequest): Promise<string> {
    // Implementation details...
  }

  static async endTrial(data: TrialEndRequest): Promise<number> {
    // Implementation details...
  }

  static async getTrialStats(filters?: any): Promise<any> {
    // Implementation details...
  }

  static async exportTrialData(format: 'csv' | 'json', filters?: any): Promise<any> {
    // Implementation details...
  }
}
```

## 🔒 Privacy and Security

### Data Anonymization
1. **Device Fingerprint Hashing**: Use SHA-256 with application-specific salt
2. **No Personal Data**: Exclude MAC addresses, serial numbers, and other identifying information
3. **Optional User Association**: Link to user_id only if user is authenticated

### GDPR/CCPA Compliance
1. **Data Minimization**: Collect only necessary analytics data
2. **Purpose Limitation**: Use data solely for application improvement analytics
3. **Transparency**: Document data collection in privacy policy
4. **User Rights**: Provide data deletion mechanism if requested
5. **Retention Policy**: Implement data retention guidelines

### Security Measures
1. **Environment Variables**: Store fingerprint salt securely
2. **Input Validation**: Sanitize all input data
3. **Rate Limiting**: Prevent analytics endpoint abuse
4. **Access Control**: Admin-only access to statistics endpoints

## 📁 File Structure

### New Files to Create
```
src/
├── types/
│   └── analytics.ts                    # Analytics type definitions
├── lib/
│   └── analytics/
│       └── service.ts                  # Analytics service layer
└── app/
    └── api/
        └── analytics/
            └── trial/
                ├── start/
                │   └── route.ts        # Trial start API
                ├── end/
                │   └── route.ts        # Trial end API
                ├── stats/
                │   └── route.ts        # Statistics API (admin)
                └── export/
                    └── route.ts        # Export API (admin)
```

### Files to Modify
```
src/
├── types/
│   └── supabase.ts                     # Add trial_analytics table types
└── lib/
    └── supabase/
        └── admin.ts                    # Add analytics database operations
```

### Database Migrations
```
migrations/
├── 001_add_trial_analytics_table.sql   # Create trial_analytics table
└── 002_add_trial_analytics_rls.sql     # Add RLS policies
```

## 🚀 Implementation Phases

### Phase 1: Database Setup
1. Create trial_analytics table
2. Add indexes for performance
3. Configure RLS policies
4. Update Supabase type definitions

### Phase 2: Core API Development
1. Implement trial start endpoint
2. Implement trial end endpoint
3. Add analytics service layer
4. Create type definitions

### Phase 3: Analytics & Reporting
1. Implement statistics endpoint
2. Add data export functionality
3. Create admin dashboard integration
4. Add data visualization components

### Phase 4: Testing & Documentation
1. Write unit tests for analytics service
2. Integration testing for API endpoints
3. Update API documentation
4. Privacy policy updates

## 🧪 Testing Strategy

### Unit Tests
- Analytics service methods
- Device fingerprint hashing
- Data validation functions

### Integration Tests
- API endpoint functionality
- Database operations
- Privacy compliance validation

### Performance Tests
- Analytics endpoint load testing
- Database query performance
- Large dataset export performance

## 📋 Environment Configuration

### Required Environment Variables
```bash
# Device fingerprint salt for hashing
DEVICE_FINGERPRINT_SALT=your_secure_random_salt_here

# Analytics feature toggle
ANALYTICS_ENABLED=true

# Admin access configuration
ANALYTICS_ADMIN_EMAILS=admin@yourcompany.com,analyst@yourcompany.com
```

## 📈 Success Metrics

### Technical Metrics
- API response time < 200ms
- Database query performance
- Zero data privacy violations

### Business Metrics
- Trial conversion rates by channel
- Average trial duration trends
- Device type usage patterns
- Geographic distribution insights

---

**Implementation Timeline**: 2-3 weeks  
**Priority**: Medium  
**Risk Level**: Low (non-breaking changes, new functionality only)  

*This implementation provides comprehensive trial analytics while maintaining user privacy and regulatory compliance.*