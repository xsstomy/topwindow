// 服务端管理员权限 Supabase 客户端
// 使用 SERVICE_ROLE_KEY，用于API路由中的数据库操作
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// 创建具有管理员权限的Supabase客户端
// 此客户端可以绕过RLS策略，用于服务端操作
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 便捷导出（向后兼容）
export default supabaseAdmin