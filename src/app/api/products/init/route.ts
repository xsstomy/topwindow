// 产品数据初始化 API
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // 检查 TopWindow 产品是否存在
    const { data: existingProduct } = await supabase
      .from('products')
      .select('*')
      .eq('id', 'topwindow-license')
      .single()

    if (existingProduct) {
      return NextResponse.json({
        success: true,
        message: 'TopWindow product already exists',
        product: existingProduct
      })
    }

    // 创建 TopWindow 产品
    const productData = {
      id: 'topwindow-license',
      name: 'TopWindow License',
      description: 'TopWindow 永久使用许可证',
      price: 29.99,
      currency: 'USD',
      activation_limit: 3,
      features: [
        "永久使用权",
        "支持3台设备", 
        "免费更新",
        "优先技术支持",
        "30天退款保证"
      ],
      is_active: true,
      metadata: {
        created_by: 'api_init',
        created_at: new Date().toISOString()
      }
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error('Failed to create product:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create product',
          error: error.message
        },
        { status: 500 }
      )
    }

    console.log('TopWindow product created successfully:', product.id)

    return NextResponse.json({
      success: true,
      message: 'TopWindow product created successfully',
      product: product
    })

  } catch (error) {
    console.error('Product initialization error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Product initialization failed',
        error: error.message
      },
      { status: 500 }
    )
  }
}

// 获取产品信息（用于验证）
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      products: products,
      count: products.length
    })

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}