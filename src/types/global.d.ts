// Global type declarations for TopWindow application
// Extends Window interface to include custom global variables and analytics

declare global {
  interface Window {
    // Google Analytics gtag function and dataLayer
    gtag: (command: string, targetId: string | Date, parameters?: any) => void;
    dataLayer: any[];

    // User ID for analytics tracking
    __USER_ID__?: string;

    // Google Analytics configuration
    __GA_MEASUREMENT_ID__?: string;
  }

  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
      ANALYTICS_ENABLED?: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      NEXT_PUBLIC_APP_URL: string;
    }
  }
}

// Google Analytics event parameter types
export interface GAEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameter?: string;
  user_type?: 'anonymous' | 'trial' | 'registered' | 'paid';
  subscription_status?: 'none' | 'trial' | 'active' | 'expired';
  [key: string]: any;
}

// Enhanced e-commerce types for GA4
export interface GAItem {
  item_id: string;
  item_name: string;
  category: string;
  price: number;
  quantity?: number;
}

export interface GAPurchaseEvent {
  transaction_id: string;
  value: number;
  currency: string;
  items: GAItem[];
}

// Export empty object to make this file a module
export {};
