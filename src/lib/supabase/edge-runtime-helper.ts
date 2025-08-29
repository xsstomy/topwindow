/**
 * Edge Runtime Type Helper for Supabase
 * 
 * This module provides type-safe wrappers for Supabase operations
 * in Edge Runtime environments where TypeScript type inference fails.
 */

import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * Type-safe wrapper for Supabase insert operations in Edge Runtime
 */
export function edgeInsert<T extends keyof Database['public']['Tables']>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  data: Database['public']['Tables'][T]['Insert']
) {
  return (supabase.from(tableName) as any).insert(data)
}

/**
 * Type-safe wrapper for Supabase update operations in Edge Runtime
 */
export function edgeUpdate<T extends keyof Database['public']['Tables']>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  data: Database['public']['Tables'][T]['Update']
) {
  return (supabase.from(tableName) as any).update(data)
}

/**
 * Type-safe wrapper for Supabase select operations in Edge Runtime
 */
export function edgeSelect<T extends keyof Database['public']['Tables']>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  columns: string = '*'
) {
  return (supabase.from(tableName) as any).select(columns)
}

/**
 * Type-safe wrapper for Supabase upsert operations in Edge Runtime
 */
export function edgeUpsert<T extends keyof Database['public']['Tables']>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  data: Database['public']['Tables'][T]['Insert']
) {
  return (supabase.from(tableName) as any).upsert(data)
}

/**
 * Type-safe wrapper for Supabase delete operations in Edge Runtime
 */
export function edgeDelete<T extends keyof Database['public']['Tables']>(
  supabase: SupabaseClient<Database>,
  tableName: T
) {
  return (supabase.from(tableName) as any).delete()
}