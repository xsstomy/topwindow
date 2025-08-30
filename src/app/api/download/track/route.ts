// Download Analytics API
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export interface DownloadEvent {
  platform: 'macos'
  version: string
  userAgent: string
  timestamp: string
  referrer?: string
  ipAddress?: string
  country?: string
}

/**
 * POST /api/download/track
 * Track download events for analytics
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, version, userAgent, timestamp, referrer } = body

    // Validate required fields
    if (!platform || !version || !userAgent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      )
    }

    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const country = request.headers.get('cf-ipcountry') || 'unknown'

    const downloadEvent: DownloadEvent = {
      platform,
      version,
      userAgent,
      timestamp: timestamp || new Date().toISOString(),
      referrer: referrer || '',
      ipAddress,
      country
    }

    // Log to console for now (later can save to database)
    console.log('Download tracked:', {
      platform,
      version,
      timestamp: downloadEvent.timestamp,
      country,
      userAgent: userAgent.substring(0, 100) // Truncate for logging
    })

    // TODO: Save to Supabase analytics table when ready
    // const supabase = createRouteHandlerClient({ cookies })
    // const { error } = await supabase
    //   .from('download_analytics')
    //   .insert(downloadEvent)

    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Download tracked successfully'
    })

  } catch (error) {
    console.error('Download tracking error:', error)
    
    // Don't fail the download if tracking fails
    return NextResponse.json({
      success: true,
      message: 'Tracking failed but download can continue'
    })
  }
}

/**
 * GET /api/download/track/stats
 * Get download statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication
    
    // Mock stats for now
    const stats = {
      totalDownloads: 1247,
      platformBreakdown: {
        macos: 892,
        windows: 355
      },
      recentDownloads: [
        {
          platform: 'macos',
          version: '1.0.0-beta',
          timestamp: new Date().toISOString(),
          country: 'US'
        }
      ],
      topCountries: [
        { country: 'US', downloads: 524 },
        { country: 'CA', downloads: 183 },
        { country: 'GB', downloads: 167 },
        { country: 'DE', downloads: 145 }
      ]
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats'
      },
      { status: 500 }
    )
  }
}