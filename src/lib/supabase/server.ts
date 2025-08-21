import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export const createServerClient = () =>
  createServerComponentClient<Database>({ cookies })

export const createRouteClient = () =>
  createRouteHandlerClient<Database>({ cookies })