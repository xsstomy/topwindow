import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateLicenseKey } from '@/lib/license/generator'
import { validateRequiredFields } from '@/lib/utils/validators'
import type { LicenseInsertData } from '@/types/database-insert-update'

// Edge Runtime configuration for Cloudflare compatibility
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证必要字段
    const validation = validateRequiredFields(body, [
      'product_id',
      'user_id'
    ])
    
    if (!validation.isValid) {
      return NextResponse.json(
        { error: '缺少必要字段', missingFields: validation.missingFields },
        { status: 400 }
      )
    }

    const { product_id, user_id, activation_limit = 1 } = body

    // 验证产品是否存在
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, name, activation_limit')
      .eq('id', product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: '产品不存在或已删除' },
        { status: 404 }
      )
    }

    // 生成新的License Key
    let licenseKey: string
    let attempts = 0
    const maxAttempts = 5

    // 确保生成的密钥是唯一的
    do {
      licenseKey = generateLicenseKey()
      attempts++
      
      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: '生成密钥失败，请重试' },
          { status: 500 }
        )
      }

      // 检查密钥是否已存在
      const { data: existingLicense } = await supabaseAdmin
        .from('licenses')
        .select('license_key')
        .eq('license_key', licenseKey)
        .single()

      if (!existingLicense) break
    } while (true)

    // 计算过期时间（默认1年）
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    // 插入新的许可证记录
    const licenseData: LicenseInsertData = {
      license_key: licenseKey,
      user_id,
      product_id,
      status: 'active',
      activation_limit: activation_limit || product.activation_limit,
      activated_devices: [],
      expires_at: expiresAt.toISOString(),
      metadata: {
        generated_at: new Date().toISOString(),
        generated_by: 'api',
        product_name: product.name
      }
    }

    const { data: license, error: licenseError } = await supabaseAdmin
      .from('licenses')
      .insert(licenseData)
      .select()
      .single()

    if (licenseError) {
      console.error('创建许可证失败:', licenseError)
      return NextResponse.json(
        { error: '创建许可证失败', details: licenseError.message },
        { status: 500 }
      )
    }

    // 返回成功结果
    return NextResponse.json({
      success: true,
      license: {
        license_key: license.license_key,
        product_id: license.product_id,
        product_name: product.name,
        status: license.status,
        activation_limit: license.activation_limit,
        expires_at: license.expires_at,
        created_at: license.created_at
      }
    })

  } catch (error: any) {
    console.error('生成许可证 API 错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误', details: error.message },
      { status: 500 }
    )
  }
}

// GET 方法：获取生成许可证的可用产品列表
export async function GET() {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, price, currency, license_type, activation_limit')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('获取产品列表失败:', error)
      return NextResponse.json(
        { error: '获取产品列表失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      products: products || []
    })

  } catch (error: any) {
    console.error('获取产品列表 API 错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误', details: error.message },
      { status: 500 }
    )
  }
}