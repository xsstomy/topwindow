import { NextRequest, NextResponse } from 'next/server'
import { getProductPricing, PRICING_CONFIG } from '@/config/pricing'

// Edge Runtime configuration for Cloudflare compatibility
export const runtime = 'edge'

// 产品数据现在从统一的价格配置获取
function getProductData(productId: string) {
  const pricing = getProductPricing(productId)
  
  if (!pricing) {
    return null
  }
  
  return {
    id: pricing.id,
    name: pricing.name,
    description: pricing.description,
    price: pricing.price,
    currency: pricing.currency,
    features: pricing.features,
    activationLimit: pricing.activationLimit,
    isActive: pricing.isActive,
    created_at: '2024-08-22T00:00:00Z',
    updated_at: PRICING_CONFIG.LAST_UPDATED
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    // 验证产品ID
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // 获取产品信息
    const product = getProductData(productId)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // 检查产品是否激活
    if (!product.isActive) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 404 }
      )
    }

    // 返回产品信息
    return NextResponse.json(product)

  } catch (error) {
    console.error('Product API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 支持 HEAD 请求用于健康检查
export async function HEAD(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id
  const product = getProductData(productId)
  
  if (!product || !product.isActive) {
    return new NextResponse(null, { status: 404 })
  }
  
  return new NextResponse(null, { status: 200 })
}

// 支持 OPTIONS 请求用于 CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
