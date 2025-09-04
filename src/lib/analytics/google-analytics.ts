// Google Analytics 4 integration for TopWindow
// Provides comprehensive tracking for user behavior, conversions, and custom dimensions

// Google Analytics configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// User types for custom dimensions
export type UserType = 'anonymous' | 'trial' | 'registered' | 'paid';
export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'expired';

// Enhanced e-commerce event parameters
interface PurchaseEventParams {
  transaction_id: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    price: number;
    quantity: number;
  }>;
}

interface ViewItemEventParams {
  currency: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    price: number;
  }>;
}

// Custom event parameters
interface CustomEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  user_type?: UserType;
  subscription_status?: SubscriptionStatus;
  [key: string]: any;
}

class GoogleAnalytics {
  private isInitialized = false;
  private currentUserType: UserType = 'anonymous';
  private currentSubscriptionStatus: SubscriptionStatus = 'none';

  /**
   * Initialize Google Analytics
   */
  initialize(): void {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
      console.warn(
        'Google Analytics: Missing measurement ID or running on server'
      );
      return;
    }

    if (this.isInitialized) {
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    // Configure GA4
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      // Enhanced measurement settings
      send_page_view: true,
      page_title: document.title,
      page_location: window.location.href,
      // Privacy settings
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    this.isInitialized = true;
    console.log('Google Analytics initialized:', GA_MEASUREMENT_ID);
  }

  /**
   * Track page views
   */
  trackPageView(url: string, title?: string): void {
    if (!this.isGtagAvailable()) return;

    window.gtag('config', GA_MEASUREMENT_ID!, {
      page_path: url,
      page_title: title,
      custom_map: {
        custom_user_type: this.currentUserType,
        custom_subscription_status: this.currentSubscriptionStatus,
      },
    });

    console.log('GA: Page view tracked', {
      url,
      title,
      userType: this.currentUserType,
    });
  }

  /**
   * Set user properties for custom dimensions
   */
  setUserProperties(
    userType: UserType,
    subscriptionStatus: SubscriptionStatus
  ): void {
    if (!this.isGtagAvailable()) return;

    this.currentUserType = userType;
    this.currentSubscriptionStatus = subscriptionStatus;

    window.gtag('config', GA_MEASUREMENT_ID!, {
      custom_map: {
        custom_user_type: userType,
        custom_subscription_status: subscriptionStatus,
      },
    });

    // Set user properties
    window.gtag('set', 'user_properties', {
      user_type: userType,
      subscription_status: subscriptionStatus,
    });

    console.log('GA: User properties updated', {
      userType,
      subscriptionStatus,
    });
  }

  /**
   * Track custom events
   */
  trackEvent(eventName: string, parameters: CustomEventParams = {}): void {
    if (!this.isGtagAvailable()) return;

    // Add default user context
    const eventParams = {
      ...parameters,
      user_type: this.currentUserType,
      subscription_status: this.currentSubscriptionStatus,
    };

    window.gtag('event', eventName, eventParams);
    console.log('GA: Event tracked', { eventName, parameters: eventParams });
  }

  /**
   * Track download events
   */
  trackDownload(version: string, fileSize?: number): void {
    this.trackEvent('file_download', {
      event_category: 'engagement',
      event_label: `TopWindow-${version}`,
      file_name: `TopWindow-${version}.dmg`,
      file_extension: 'dmg',
      file_size: fileSize,
      value: 1,
    });
  }

  /**
   * Track user registration
   */
  trackRegistration(method: 'email' | 'google' = 'email'): void {
    this.trackEvent('sign_up', {
      event_category: 'engagement',
      method: method,
      value: 1,
    });
  }

  /**
   * Track login events
   */
  trackLogin(method: 'email' | 'google' = 'email'): void {
    this.trackEvent('login', {
      event_category: 'engagement',
      method: method,
      value: 1,
    });
  }

  /**
   * Track pricing page views
   */
  trackViewPricing(): void {
    this.trackEvent('view_promotion', {
      event_category: 'ecommerce',
      promotion_id: 'topwindow_pricing',
      promotion_name: 'TopWindow Pricing Plans',
      creative_name: 'pricing_page',
      creative_slot: 'main_content',
    });
  }

  /**
   * Track item view (pricing plan selection)
   */
  trackViewItem(params: ViewItemEventParams): void {
    if (!this.isGtagAvailable()) return;

    window.gtag('event', 'view_item', {
      ...params,
      user_type: this.currentUserType,
      subscription_status: this.currentSubscriptionStatus,
    });

    console.log('GA: View item tracked', params);
  }

  /**
   * Track add to cart (pricing plan selection)
   */
  trackAddToCart(itemId: string, itemName: string, price: number): void {
    this.trackEvent('add_to_cart', {
      event_category: 'ecommerce',
      currency: 'USD',
      value: price,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          category: 'software_license',
          price: price,
          quantity: 1,
        },
      ],
    });
  }

  /**
   * Track begin checkout
   */
  trackBeginCheckout(itemId: string, itemName: string, price: number): void {
    this.trackEvent('begin_checkout', {
      event_category: 'ecommerce',
      currency: 'USD',
      value: price,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          category: 'software_license',
          price: price,
          quantity: 1,
        },
      ],
    });
  }

  /**
   * Track purchase completion
   */
  trackPurchase(params: PurchaseEventParams): void {
    if (!this.isGtagAvailable()) return;

    window.gtag('event', 'purchase', {
      ...params,
      user_type: this.currentUserType,
      subscription_status: this.currentSubscriptionStatus,
      event_category: 'ecommerce',
    });

    console.log('GA: Purchase tracked', params);
  }

  /**
   * Track trial start
   */
  trackTrialStart(): void {
    this.trackEvent('begin_trial', {
      event_category: 'engagement',
      trial_type: 'topwindow_trial',
      value: 1,
    });
  }

  /**
   * Track trial conversion to paid
   */
  trackTrialConversion(transactionId: string, value: number): void {
    this.trackEvent('trial_conversion', {
      event_category: 'conversion',
      transaction_id: transactionId,
      value: value,
      currency: 'USD',
    });
  }

  /**
   * Check if gtag is available
   */
  private isGtagAvailable(): boolean {
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics: Measurement ID not configured');
      return false;
    }

    if (typeof window === 'undefined' || !window.gtag) {
      console.warn('Google Analytics: gtag not available');
      return false;
    }

    return true;
  }

  /**
   * Get current user context
   */
  getCurrentUserContext() {
    return {
      userType: this.currentUserType,
      subscriptionStatus: this.currentSubscriptionStatus,
      isInitialized: this.isInitialized,
    };
  }
}

// Export singleton instance
export const googleAnalytics = new GoogleAnalytics();

// Convenience functions for common tracking scenarios
export const trackPageView = (url: string, title?: string) =>
  googleAnalytics.trackPageView(url, title);

export const trackEvent = (eventName: string, parameters?: CustomEventParams) =>
  googleAnalytics.trackEvent(eventName, parameters);

export const setUserProperties = (
  userType: UserType,
  subscriptionStatus: SubscriptionStatus
) => googleAnalytics.setUserProperties(userType, subscriptionStatus);

// Export for testing
export { GoogleAnalytics };
