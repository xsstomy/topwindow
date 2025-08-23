import { supabase } from './client'

// Supabase 连接诊断工具
export async function diagnoseLabelSupabaseConnection() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    connection: false,
    auth: false,
    database: false,
    errors: [] as string[],
    details: {} as Record<string, any>
  }

  try {
    // 1. 测试基本连接
    console.log('🔍 测试 Supabase 基本连接...')

    // 检查环境变量
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      diagnostics.errors.push('环境变量未配置')
      return diagnostics
    }

    diagnostics.details.supabaseUrl = supabaseUrl
    diagnostics.details.keyPrefix = supabaseKey.substring(0, 20) + '...'

    // 2. 测试认证服务连接
    console.log('🔑 测试认证服务连接...')
    const { data: authData, error: authError } = await supabase.auth.getSession()

    if (authError) {
      diagnostics.errors.push(`认证服务错误: ${authError.message}`)
    } else {
      diagnostics.auth = true
      diagnostics.details.session = authData.session ? '已登录' : '未登录'
    }

    // 3. 测试数据库连接
    console.log('🗄️ 测试数据库连接...')
    const { data: dbData, error: dbError } = await supabase
      .from('user_profiles')
      .select('count(*)')
      .limit(1)

    if (dbError) {
      diagnostics.errors.push(`数据库错误: ${dbError.message}`)
    } else {
      diagnostics.database = true
      diagnostics.details.databaseAccess = '正常'
    }

    // 4. 整体连接状态
    diagnostics.connection = diagnostics.auth && diagnostics.database

  } catch (error: any) {
    diagnostics.errors.push(`连接异常: ${error.message}`)
  }

  // 输出诊断结果
  console.log('📊 Supabase 连接诊断结果:', diagnostics)

  if (diagnostics.connection) {
    console.log('✅ Supabase 连接正常')
  } else {
    console.log('❌ Supabase 连接异常:', diagnostics.errors)
  }

  return diagnostics
}

// 测试特定认证操作
export async function testAuthOperations() {
  console.log('🧪 测试认证操作...')

  try {
    // 测试获取用户信息
    const { data: userData, error: userError } = await supabase.auth.getUser()
    console.log('用户信息获取:', userData, userError?.message)

    // 测试会话状态
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    console.log('会话状态:', sessionData, sessionError?.message)

    return {
      userTest: !userError,
      sessionTest: !sessionError,
      errors: [userError?.message, sessionError?.message].filter(Boolean)
    }

  } catch (error: any) {
    console.error('认证操作测试失败:', error)
    return { userTest: false, sessionTest: false, errors: [error.message] }
  }
}