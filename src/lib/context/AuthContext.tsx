'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 获取初始用户状态
    const initUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          // 获取最新的用户数据，包括元数据
          const {
            data: { user: freshUser },
          } = await supabase.auth.getUser();
          console.log('初始化用户数据:', {
            email: freshUser?.email,
            metadata: freshUser?.user_metadata,
            avatar:
              freshUser?.user_metadata?.avatar_url ||
              freshUser?.user_metadata?.picture,
          });
          setUser(freshUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('获取用户数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    initUser();

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('认证状态变化:', event, session?.user ? '已登录' : '未登录');
      setUser(session?.user ?? null);
      setLoading(false);

      // 用户登录成功时的处理
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('用户登录成功，准备跳转到仪表板');
        await ensureUserProfile(session.user);
        // 延迟跳转，确保状态更新完成
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      }

      // 用户登出时跳转到首页
      if (event === 'SIGNED_OUT') {
        console.log('用户已登出');
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // 处理不同类型的错误
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('邮箱或密码错误，请检查后重试');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('请先验证您的邮箱地址');
          } else if (error.message.includes('Too many requests')) {
            throw new Error('登录尝试次数过多，请稍后再试');
          } else if (error.message.includes('Failed to fetch')) {
            // 网络错误，尝试重试
            retryCount++;
            if (retryCount < maxRetries) {
              console.log(`登录重试第 ${retryCount} 次...`);
              await new Promise(resolve =>
                setTimeout(resolve, 1000 * retryCount)
              );
              continue;
            } else {
              throw new Error('网络连接异常，请检查网络后重试');
            }
          } else {
            throw new Error(error.message || '登录失败，请重试');
          }
        }

        // 登录成功，跳出重试循环
        console.log('密码登录成功');
        break;
      } catch (err: any) {
        if (retryCount >= maxRetries - 1) {
          throw err;
        }
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        // 处理不同类型的注册错误
        if (error.message.includes('User already registered')) {
          throw new Error('该邮箱已注册，请直接登录或使用其他邮箱');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('密码至少需要6位字符');
        } else if (
          error.message.includes(
            'For security purposes, you can only request this after'
          )
        ) {
          // 提取等待时间
          const waitMatch = error.message.match(/after (\d+) seconds/);
          const waitTime = waitMatch ? waitMatch[1] : '60';
          throw new Error(`请等待 ${waitTime} 秒后再尝试注册`);
        } else if (error.message.includes('Invalid email')) {
          throw new Error('请输入有效的邮箱地址');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('网络连接异常，请检查网络后重试');
        } else {
          throw new Error(error.message || '注册失败，请重试');
        }
      }
    } catch (err: any) {
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('网络连接异常，请检查网络后重试');
        } else if (error.message.includes('redirect_uri_mismatch')) {
          throw new Error('Google OAuth 配置错误，请联系管理员');
        } else {
          throw new Error(error.message || 'Google 登录失败，请重试');
        }
      }
    } catch (err: any) {
      throw err;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 确保用户资料存在的辅助函数
async function ensureUserProfile(user: User) {
  try {
    // 先检查用户资料是否已存在
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    // 如果不存在，创建新的用户资料
    if (!existingProfile && fetchError?.code === 'PGRST116') {
      const profileData = {
        id: user.id,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          '',
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      };

      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert(profileData);

      if (insertError) {
        console.error('创建用户资料失败:', insertError);
      }
    } else if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('检查用户资料失败:', fetchError);
    }
  } catch (error) {
    console.error('用户资料处理异常:', error);
  }
}
