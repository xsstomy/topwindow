// 数据库种子数据脚本
import { supabase } from '@/lib/supabase/client'
import { PRODUCT_PRICES } from '@/config/pricing'

export async function seedProducts() {
  // 从价格配置生成种子数据
  const products = Object.values(PRODUCT_PRICES).map(pricing => ({
    id: pricing.id,
    name: pricing.name,
    description: pricing.description,
    price: pricing.price,
    currency: pricing.currency,
    license_type: pricing.id === 'topwindow-basic' ? 'basic' : 'professional',
    activation_limit: pricing.activationLimit,
    features: JSON.stringify(pricing.features),
    is_active: pricing.isActive
  }))

  // 添加额外的团队版产品（如果需要）
  const additionalProducts = [
    {
      id: 'topwindow-team',
      name: 'TopWindow Team',
      description: 'TopWindow 团队版许可证，适合小团队使用',
      price: 99.99,
      currency: 'USD',
      license_type: 'team',
      activation_limit: 10,
      features: JSON.stringify([
        '永久使用权',
        '支持10台设备',
        '免费更新',
        '优先技术支持',
        '团队管理功能',
        '30天退款保证'
      ]),
      is_active: true
    }
  ]

  // 合并所有产品数据
  const allProducts = [...products, ...additionalProducts]

  console.log('🌱 开始插入产品数据...')

  for (const product of allProducts) {
    try {
      // 检查产品是否已存在
      const { data: existing, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('id', product.id)
        .single()

      if (existing) {
        console.log(`⚠️  产品 ${product.id} 已存在，跳过`)
        continue
      }

      // 插入新产品
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

      if (error) {
        console.error(`❌ 插入产品 ${product.id} 失败:`, error)
      } else {
        console.log(`✅ 成功插入产品: ${product.name}`)
      }
    } catch (error) {
      console.error(`❌ 处理产品 ${product.id} 时出错:`, error)
    }
  }

  console.log('🌱 产品数据插入完成')
}

export async function checkProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (error) {
      console.error('❌ 获取产品列表失败:', error)
      return []
    }

    console.log(`✅ 找到 ${data?.length || 0} 个活跃产品`)
    return data || []
  } catch (error) {
    console.error('❌ 检查产品时出错:', error)
    return []
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  async function main() {
    console.log('🚀 开始数据库初始化...')
    await seedProducts()
    const products = await checkProducts()
    console.log('📋 当前产品列表:', products.map(p => ({ id: p.id, name: p.name, price: p.price })))
  }
  
  main().catch(console.error)
}