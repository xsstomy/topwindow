export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          currency: string
          license_type: string
          activation_limit: number
          features: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          price: number
          currency?: string
          license_type?: string
          activation_limit?: number
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          license_type?: string
          activation_limit?: number
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          payment_provider: string
          provider_payment_id: string | null
          provider_session_id: string | null
          amount: number
          currency: string
          status: string
          product_info: Json
          customer_info: Json | null
          metadata: Json
          created_at: string
          completed_at: string | null
          webhook_received_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          payment_provider: string
          provider_payment_id?: string | null
          provider_session_id?: string | null
          amount: number
          currency?: string
          status?: string
          product_info: Json
          customer_info?: Json | null
          metadata?: Json
          created_at?: string
          completed_at?: string | null
          webhook_received_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          payment_provider?: string
          provider_payment_id?: string | null
          provider_session_id?: string | null
          amount?: number
          currency?: string
          status?: string
          product_info?: Json
          customer_info?: Json | null
          metadata?: Json
          created_at?: string
          completed_at?: string | null
          webhook_received_at?: string | null
        }
      }
      licenses: {
        Row: {
          license_key: string
          user_id: string
          payment_id: string | null
          product_id: string
          status: string
          activation_limit: number
          activated_devices: Json
          created_at: string
          expires_at: string | null
          last_validated_at: string | null
          metadata: Json
        }
        Insert: {
          license_key: string
          user_id: string
          payment_id?: string | null
          product_id: string
          status?: string
          activation_limit?: number
          activated_devices?: Json
          created_at?: string
          expires_at?: string | null
          last_validated_at?: string | null
          metadata?: Json
        }
        Update: {
          license_key?: string
          user_id?: string
          payment_id?: string | null
          product_id?: string
          status?: string
          activation_limit?: number
          activated_devices?: Json
          created_at?: string
          expires_at?: string | null
          last_validated_at?: string | null
          metadata?: Json
        }
      }
      user_devices: {
        Row: {
          id: string
          user_id: string
          license_key: string | null
          device_id: string
          device_name: string | null
          device_type: string | null
          device_info: Json | null
          first_activated_at: string
          last_seen_at: string
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          license_key?: string | null
          device_id: string
          device_name?: string | null
          device_type?: string | null
          device_info?: Json | null
          first_activated_at?: string
          last_seen_at?: string
          status?: string
        }
        Update: {
          id?: string
          user_id?: string
          license_key?: string | null
          device_id?: string
          device_name?: string | null
          device_type?: string | null
          device_info?: Json | null
          first_activated_at?: string
          last_seen_at?: string
          status?: string
        }
      }
      trial_analytics: {
        Row: {
          id: string
          trial_id: string
          user_id: string | null
          device_fingerprint_hash: string
          trial_start_at: string
          trial_end_at: string | null
          trial_duration_seconds: number | null
          app_version: string
          system_version: string
          install_channel: string | null
          device_type: string | null
          trial_status: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trial_id: string
          user_id?: string | null
          device_fingerprint_hash: string
          trial_start_at: string
          trial_end_at?: string | null
          trial_duration_seconds?: number | null
          app_version: string
          system_version: string
          install_channel?: string | null
          device_type?: string | null
          trial_status?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trial_id?: string
          user_id?: string | null
          device_fingerprint_hash?: string
          trial_start_at?: string
          trial_end_at?: string | null
          trial_duration_seconds?: number | null
          app_version?: string
          system_version?: string
          install_channel?: string | null
          device_type?: string | null
          trial_status?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}