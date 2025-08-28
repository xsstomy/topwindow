# Creem Payment Integration Testing Checklist

## Quick Start (5 minutes)

### 1. Setup Environment

```bash
# Install ngrok
npm install -g ngrok

# Start your app
npm run dev

# In new terminal, create tunnel
ngrok http 3000
# Copy the https URL (e.g., https://abc123.ngrok.io)
```

### 2. Configure Creem Dashboard

**In Creem test environment, set these URLs:**

- **Success URL**: `https://abc123.ngrok.io/payment/success?payment_id={PAYMENT_ID}&provider=creem`
- **Cancel URL**: `https://abc123.ngrok.io/payment/cancel?payment_id={PAYMENT_ID}&provider=creem`
- **Webhook URL**: `https://abc123.ngrok.io/api/payments/creem/webhook`

### 3. Update .env.local

```env
# Set test mode (should already be set)
CREEM_MODE=test

# Replace with your real Creem test keys
CREEM_SECRET_KEY_TEST=sk_test_your_actual_key
CREEM_WEBHOOK_SECRET_TEST=whsec_your_actual_secret
```

**Configuration Check:**
When you start the app, you should see:
```
Payment Configuration Status (Mode: test)
CREEM:
  Mode: test
  ✅ Configuration complete
```

## Testing Scenarios

### ✅ Test 1: Successful Payment

1. **Navigate**: `http://localhost:3000/pricing`
2. **Click**: "Buy Now" button
3. **Pay with test card**: `4242424242424242`
4. **Verify**: Redirected to success page with license key
5. **Check**: Auto-redirect to dashboard after 10s

**Expected Results:**
- ✅ Payment success page shows
- ✅ License key is visible and copyable  
- ✅ Payment record created in database
- ✅ License record created in database
- ✅ Webhook received and processed

### ✅ Test 2: Payment Cancellation

1. **Navigate**: `http://localhost:3000/pricing`
2. **Click**: "Buy Now" button
3. **On Creem page**: Click browser back or close tab
4. **Verify**: Redirected to cancel page

**Expected Results:**
- ✅ Payment cancel page shows
- ✅ Clear explanation of cancellation
- ✅ "Try Again" button works

### ✅ Test 3: Payment Failure

1. **Navigate**: `http://localhost:3000/pricing`
2. **Click**: "Buy Now" button  
3. **Pay with declined card**: `4000000000000002`
4. **Verify**: Proper error handling

**Expected Results:**
- ✅ Error page or message shown
- ✅ User guided to retry
- ✅ No license generated

### ✅ Test 4: Webhook Processing

1. **Monitor ngrok**: Open `http://127.0.0.1:4040`
2. **Complete test payment**
3. **Check webhook received**: Look for POST to `/api/payments/creem/webhook`
4. **Verify response**: Should be 200 OK

**Expected Results:**
- ✅ Webhook POST request visible in ngrok
- ✅ Server logs show "Creem webhook received"
- ✅ Payment status updated to "completed"
- ✅ License generated successfully

### ✅ Test 5: Database Verification

After successful payment, check Supabase:

**Payments Table:**
```sql
SELECT * FROM payments WHERE payment_provider = 'creem' ORDER BY created_at DESC LIMIT 1;
```

**Licenses Table:**
```sql
SELECT * FROM licenses ORDER BY created_at DESC LIMIT 1;
```

**Expected Results:**
- ✅ Payment record with status "completed"
- ✅ License record with valid license_key
- ✅ Correct payment_id linkage

## Debug Commands

```bash
# Test webhook endpoint
curl https://your-ngrok-url.ngrok.io/api/payments/creem/webhook

# Check payment status  
curl "http://localhost:3000/api/payments/status?payment_id=PAYMENT_ID"

# Test payment session creation (requires auth)
curl -X POST http://localhost:3000/api/payments/create-session \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "creem",
    "product_id": "topwindow-license", 
    "success_url": "http://localhost:3000/payment/success",
    "cancel_url": "http://localhost:3000/payment/cancel"
  }'
```

## Common Issues & Solutions

### ❌ "Missing signature header"
**Fix**: Ensure webhook URL is exactly `https://your-ngrok-url.ngrok.io/api/payments/creem/webhook`

### ❌ "Payment not found" 
**Fix**: Check if payment session was created before webhook. Check database connectivity.

### ❌ ngrok tunnel not accessible
**Fix**: Run `ngrok authtoken YOUR_TOKEN` first, then `ngrok http 3000`

### ❌ License not generated
**Fix**: Check server logs for license generation errors. Verify `LicenseService` is properly configured.

## Log Monitoring

Watch for these log messages:

```bash
# Success indicators
✅ "Payment session created successfully"
✅ "Creem webhook received: payment.completed"  
✅ "License generated for payment"
✅ "Payment completed successfully"

# Error indicators  
❌ "Creem webhook: Invalid signature"
❌ "Payment not found for Creem session"
❌ "Failed to generate license"
```

## Pre-Production Checklist

Before going live:

- [ ] All tests passing
- [ ] Webhook signature verification working
- [ ] License generation working
- [ ] Email notifications working (if enabled)
- [ ] Database properly configured
- [ ] Production Creem keys configured
- [ ] SSL certificate valid for production domain
- [ ] Rate limiting tested
- [ ] Error monitoring setup

## Test Card Numbers

**Creem Test Cards:**
- **Success**: `4242424242424242`
- **Declined**: `4000000000000002`  
- **Insufficient funds**: `4000000000009995`
- **Expired**: `4000000000000069`

Use any future expiry date and any 3-digit CVC.

---

**Quick Test Command:**
```bash
# One-liner to start everything
npm run dev & sleep 2 && ngrok http 3000
```

This checklist ensures your Creem integration works correctly before production deployment!