import { NextRequest, NextResponse } from 'next/server'
import { seedProducts, checkProducts } from '@/lib/database/seed'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 开始数据库种子数据初始化...')
    
    // 插入产品数据
    await seedProducts()
    
    // 检查插入结果
    const products = await checkProducts()
    
    return NextResponse.json({
      success: true,
      message: '数据库初始化成功',
      productsCount: products.length,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        currency: p.currency,
        activation_limit: p.activation_limit
      }))
    })

  } catch (error: any) {
    console.error('❌ 数据库初始化失败:', error)
    return NextResponse.json(
      { 
        error: '数据库初始化失败', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const products = await checkProducts()
    
    return NextResponse.json({
      success: true,
      productsCount: products.length,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        currency: p.currency,
        activation_limit: p.activation_limit,
        is_active: p.is_active
      }))
    })

  } catch (error: any) {
    console.error('❌ 获取产品列表失败:', error)
    return NextResponse.json(
      { 
        error: '获取产品列表失败', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}