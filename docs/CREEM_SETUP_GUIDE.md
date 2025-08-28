# Creem Payment Integration Setup Guide

## Overview

This guide helps you set up Creem payment integration for TopWindow, including testing with ngrok tunnels and production deployment.

## Prerequisites

- Node.js 18+ installed
- Creem account and test API keys
- ngrok account (free tier works for testing)

## Setup Steps

### 1. Install ngrok

```bash
# Option 1: Install globally via npm
npm install -g ngrok

# Option 2: Download from https://ngrok.com/download
# Or via Homebrew on macOS
brew install ngrok

# Authenticate with your ngrok token (get from https://dashboard.ngrok.com/get-started/your-authtoken)
ngrok authtoken YOUR_NGROK_TOKEN
```

### 2. Configure Environment Variables

Update your `.env.local` file with the new dual-environment configuration:

```env
# Environment mode control (test | production)
CREEM_MODE=test

# Creem Test Environment Configuration
CREEM_PUBLIC_KEY_TEST=prod_6pCR1fo402Umzod8ENwsoY
CREEM_SECRET_KEY_TEST=sk_test_your_real_secret_key_here  
CREEM_WEBHOOK_SECRET_TEST=whsec_4W7x5Rrauo491E9uBASftB
CREEM_API_URL_TEST=https://test-api.creem.io
CREEM_PRODUCT_ID_TEST=prod_6pCR1fo402Umzod8ENwsoY

# Creem Production Environment Configuration (for later)
CREEM_PUBLIC_KEY_PROD=pk_live_your_production_key_here
CREEM_SECRET_KEY_PROD=sk_live_your_production_key_here
CREEM_WEBHOOK_SECRET_PROD=whsec_your_production_secret_here
CREEM_API_URL_PROD=https://api.creem.io
CREEM_PRODUCT_ID_PROD=your_production_product_id_here

# Keep these unchanged for local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
PAYMENT_SUCCESS_URL=http://localhost:3000/payment/success
PAYMENT_CANCEL_URL=http://localhost:3000/payment/cancel
PAYMENT_ERROR_URL=http://localhost:3000/payment/error
```

**Key Benefits:**
- ✅ One codebase supports both test and production
- ✅ Easy environment switching with `CREEM_MODE`
- ✅ All credentials organized by environment
- ✅ Ready for production deployment

### 3. Start Development Server

```bash
# Terminal 1: Start the Next.js development server
npm run dev
```

Your application will be running on `http://localhost:3000`

### 4. Create ngrok Tunnel

```bash
# Terminal 2: Create ngrok tunnel to expose localhost:3000
ngrok http 3000
```

You'll see output like:
```
ngrok by @inconshreveable

Session Status                online
Account                       Your Account (Plan: Free)
Version                       3.1.0
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

**Important**: Copy the `https://abc123.ngrok.io` URL - this is your ngrok tunnel URL.

### 5. Configure Creem Dashboard

1. Log into your [Creem Dashboard](https://dashboard.creem.io)
2. Go to your test environment settings
3. Set up your webhook and redirect URLs:

#### Product Configuration
- **Success URL**: `https://abc123.ngrok.io/payment/success?payment_id={PAYMENT_ID}&provider=creem`
- **Cancel URL**: `https://abc123.ngrok.io/payment/cancel?payment_id={PAYMENT_ID}&provider=creem`
- **Webhook URL**: `https://abc123.ngrok.io/api/payments/creem/webhook`

Replace `abc123.ngrok.io` with your actual ngrok URL.

#### Webhook Configuration
- **Events to Subscribe**: 
  - `payment.completed`
  - `payment.failed` 
  - `payment.refunded`

### 6. Test the Integration

#### Test Payment Flow

1. **Navigate to Payment Page**
   ```
   http://localhost:3000/pricing
   ```

2. **Initiate Payment**
   - Click "Buy Now" for TopWindow License
   - You should be redirected to Creem's checkout page

3. **Complete Test Payment**
   - Use Creem's test card numbers:
     - **Success**: `4242424242424242`
     - **Decline**: `4000000000000002`
   - Any future expiry date
   - Any 3-digit CVC

4. **Verify Success Flow**
   - After successful payment, you should be redirected to:
   ```
   https://abc123.ngrok.io/payment/success?payment_id=pay_xxx&provider=creem
   ```
   - Check that license key is displayed
   - Verify auto-redirect to dashboard after 10 seconds

#### Test Webhook Reception

1. **Monitor Webhook Logs**
   ```bash
   # In your development server terminal, watch for:
   # "Creem webhook received: payment.completed"
   ```

2. **Check ngrok Web Interface**
   - Open `http://127.0.0.1:4040` in browser
   - View webhook requests in real-time
   - Inspect request/response details

3. **Database Verification**
   - Check Supabase dashboard
   - Verify payment record created in `payments` table
   - Verify license record created in `licenses` table

## Troubleshooting

### Common Issues

#### 1. "Missing signature header" Error
**Problem**: Webhook signature validation failing
**Solution**: 
- Ensure `CREEM_WEBHOOK_SECRET` is correctly set
- Check ngrok is forwarding requests properly
- Verify webhook endpoint URL in Creem dashboard

#### 2. "Payment not found" Error
**Problem**: Payment record not found during webhook processing
**Solution**:
- Check if payment session was created successfully
- Verify `provider_session_id` matches between payment record and webhook
- Check database connection and permissions

#### 3. ngrok Connection Issues
**Problem**: ngrok tunnel not accessible
**Solution**:
- Ensure ngrok auth token is set: `ngrok authtoken YOUR_TOKEN`
- Try different region: `ngrok http 3000 --region=us`
- Check firewall settings

#### 4. License Generation Failure
**Problem**: Payment successful but license not generated
**Solution**:
- Check `LicenseService` implementation
- Verify database schema includes `licenses` table
- Check environment variables for license generation

### Debug Commands

```bash
# Check ngrok tunnel status
curl https://your-ngrok-url.ngrok.io/api/payments/creem/webhook

# Test webhook endpoint health
curl https://your-ngrok-url.ngrok.io/api/payments/creem/webhook

# Check payment status
curl "http://localhost:3000/api/payments/status?payment_id=YOUR_PAYMENT_ID"
```

### Log Monitoring

Monitor these logs during testing:

```bash
# Payment session creation
# "Payment session created successfully"

# Webhook reception  
# "Creem webhook received: payment.completed"

# License generation
# "License generated for payment pay_xxx"

# Email sending
# "License email sent for payment pay_xxx"
```

## Production Deployment

When ready for production:

1. **Switch to Production Mode**
   ```env
   # Simply change the mode - all production credentials are already configured
   CREEM_MODE=production
   
   # Update URLs to your production domain
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   PAYMENT_SUCCESS_URL=https://yourdomain.com/payment/success
   PAYMENT_CANCEL_URL=https://yourdomain.com/payment/cancel
   ```

2. **Verify Production Configuration**
   The application will automatically log configuration status on startup:
   ```
   Payment Configuration Status (Mode: production)
   =====================================
   
   CREEM:
     Mode: production
     API URL: https://api.creem.io
     Has Secret Key: true
     Has Public Key: true
     Has Webhook Secret: true
     Product ID: your_production_product_id
     ✅ Configuration complete
   ```

2. **Configure Creem Production Environment**
   - **Success URL**: `https://yourdomain.com/payment/success?payment_id={PAYMENT_ID}&provider=creem`
   - **Cancel URL**: `https://yourdomain.com/payment/cancel?payment_id={PAYMENT_ID}&provider=creem`  
   - **Webhook URL**: `https://yourdomain.com/api/payments/creem/webhook`

3. **Enable Production Features**
   ```env
   # Enable email sending and payment processing
   ENABLE_EMAIL_SENDING=true
   ENABLE_PAYMENT_PROCESSING=true
   ```

## Security Considerations

- ✅ Webhook signature verification is enabled
- ✅ User authentication required for payment sessions
- ✅ Payment records are user-scoped
- ✅ Sensitive data is not logged in production
- ✅ Rate limiting is implemented on payment endpoints

## Support

If you encounter issues:

1. Check the [Creem Documentation](https://docs.creem.io)
2. Review webhook logs in ngrok web interface (`http://127.0.0.1:4040`)
3. Monitor Next.js server logs for errors
4. Contact support with payment IDs and error messages