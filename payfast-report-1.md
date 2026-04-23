# PayFast Integration Audit Report

**Project:** MD Brothers eCommerce (Next.js 14 App Router)  
**Audit Date:** 5 April 2026  
**Audit Type:** Full Payment Integration Analysis  

---

## 1. Integration Status Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **Overall PayFast Integration** | ⚠️ **~75% Complete** | Code is well-written but NOT functional due to missing environment configuration |
| **Production Readiness** | ❌ **No** | Cannot process payments without `.env` vars |
| **Security** | ✅ **Good** | Signature generation & verification implemented correctly |
| **Code Quality** | ✅ **Good** | Clean API routes, proper error handling, idempotency |

---

## 2. Current Implementation Details

### ✅ What Exists

| Component | File | Status |
|-----------|------|--------|
| **PayFast Initiate API** | `src/app/api/payfast/initiate/route.ts` | ✅ Complete |
| **PayFast ITN Webhook** | `src/app/api/payfast/notify/route.ts` | ✅ Complete |
| **Checkout Page (PayFast UI)** | `src/app/checkout/page.tsx` | ✅ Complete |
| **Success Page (Status Polling)** | `src/app/checkout/success/page.tsx` | ✅ Complete |
| **Cancel Page** | `src/app/checkout/cancel/page.tsx` | ✅ Exists |
| **Payment Cancelled Page** | `src/app/checkout/payment-cancelled/page.tsx` | ✅ Exists |
| **Order Creation API** | `src/app/api/checkout/route.ts` | ✅ Complete |
| **Env Utilities** | `src/lib/env.ts` | ✅ Complete |
| **Order Schema** | `src/sanity/schemaTypes/order.ts` | ✅ Has PayFast fields |
| **Admin Orders UI** | `src/app/admin/orders/page.tsx` | ✅ Complete |

### Implementation Quality Assessment

**PayFast Initiate API** (`/api/payfast/initiate`):
- ✅ Accepts `{ orderId, amount, customerData }`
- ✅ Validates all required params
- ✅ Checks `isPayFastConfigured()` guard
- ✅ Reads env: `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`
- ✅ Builds complete PayFast payload (`merchant_id`, `merchant_key`, `return_url`, `cancel_url`, `notify_url`, `name_first`, `name_last`, `email_address`, `m_payment_id`, `amount`, `item_name`)
- ✅ MD5 signature generation per PayFast spec (sorted keys, URL-encoded, passphrase appended)
- ✅ Returns signed payload to client

**PayFast ITN Webhook** (`/api/payfast/notify`):
- ✅ Reads raw URL-encoded form data (PayFast ITN format)
- ✅ Extracts & removes `signature` field
- ✅ Re-generates MD5 signature and compares (returns 400 on mismatch)
- ✅ Processes `payment_status === 'COMPLETE'`
- ✅ Fetches order from Sanity by `m_payment_id`
- ✅ Idempotency check (skips if already `completed`)
- ✅ Updates order: `paymentStatus: 'completed'`, `status: 'confirmed'`, `payfastTransactionId`, `payfastSignature`
- ✅ Returns `200 OK` per PayFast ITN spec

**Checkout Page**:
- ✅ Radio button for PayFast vs COD
- ✅ Hidden form auto-submit via `useEffect` when payload received
- ✅ Correct sandbox/live URL routing via `NEXT_PUBLIC_PAYFAST_MODE`
- ✅ Graceful degradation when PayFast unavailable

**Order Creation API**:
- ✅ Strict payment method validation (only COD/PAYFAST)
- ✅ Guards on `isPayFastConfigured()` - returns 503 if disabled
- ✅ Creates order with `paymentStatus: 'pending'`
- ✅ Idempotency key support

---

## 3. Missing Components & Bugs

### 🔴 CRITICAL

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| **1** | **No PayFast env vars in `.env.local`** | PayFast completely non-functional - `isPayFastConfigured()` always returns `false` | `.env.local` |
| **2** | **No PayFast entries in `.env.example`** | Developers have no template for required vars | `.env.example` |
| **3** | **`/api/shipping/settings` does NOT return `isPayFastConfigured`** | Checkout page always shows PayFast as "Temporarily Unavailable" even when configured | `src/app/api/shipping/settings/route.ts` |
| **4** | **`/api/payment/cancel` route DOES NOT EXIST** | `payment-cancelled` page calls non-existent endpoint | Referenced in `src/app/checkout/payment-cancelled/page.tsx` |

### 🟠 HIGH

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| **5** | **Race condition: success page may show before webhook fires** | User sees "pending" status on return even after successful payment | `src/app/checkout/success/page.tsx` |
| **6** | **No PayFast-specific cancel handling in checkout flow** | Cancelled payments don't update order status to `cancelled` | Missing `/api/payment/cancel` |
| **7** | **Order schema has PayFast fields but checkout doesn't set `gateway`/`transactionId`** | Inconsistent data model - fields exist but not populated | `src/app/api/checkout/route.ts` |
| **8** | **No failed payment status handling in webhook** | Only processes `COMPLETE` - `FAILED` status gets logged but order stays `pending` forever | `src/app/api/payfast/notify/route.ts` |

### 🟡 MEDIUM

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| **9** | **`paymentLogs` array defined in schema but never populated** | Audit trail field exists but unused | `src/sanity/schemaTypes/order.ts` |
| **10** | **No server-side amount validation** | Could accept manipulated amounts from frontend | `src/app/api/payfast/initiate/route.ts` |
| **11** | **`NEXT_PUBLIC_PAYFAST_MODE` not in `.env.example`** | Cannot toggle sandbox/live without guessing var name | `.env.example` |
| **12** | **Fallback URLs in initiate route may be wrong** | If `PAYFAST_*_URL` env vars missing, uses `NEXT_PUBLIC_BASE_URL` which may also be unset | `src/app/api/payfast/initiate/route.ts` |

---

## 4. Step-by-Step Completion Guide

### 🔧 BACKEND TASKS

#### Task 1: Add PayFast Environment Variables

**Create `.env` file with:**
```env
# PayFast Configuration
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_RETURN_URL=http://localhost:3000/checkout/success
PAYFAST_CANCEL_URL=http://localhost:3000/checkout/payment-cancelled
PAYFAST_NOTIFY_URL=http://localhost:3000/api/payfast/notify
PAYFAST_MODE=sandbox
NEXT_PUBLIC_PAYFAST_MODE=sandbox
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Update `.env.example` to include PayFast section:**
```env
# PayFast Configuration
PAYFAST_MERCHANT_ID=your_payfast_merchant_id
PAYFAST_MERCHANT_KEY=your_payfast_merchant_key
PAYFAST_PASSPHRASE=your_payfast_passphrase
PAYFAST_RETURN_URL=http://localhost:3000/checkout/success
PAYFAST_CANCEL_URL=http://localhost:3000/checkout/payment-cancelled
PAYFAST_NOTIFY_URL=http://localhost:3000/api/payfast/notify
PAYFAST_MODE=sandbox
NEXT_PUBLIC_PAYFAST_MODE=sandbox
```

#### Task 2: Fix `/api/shipping/settings` to Return PayFast Config Status

```typescript
// src/app/api/shipping/settings/route.ts
import { NextResponse } from 'next/server';
import { getSanityClient } from '@/sanity/lib/client';
import { isPayFastConfigured } from '@/lib/env';

export async function GET() {
  const client = getSanityClient();
  if (!client) {
    return NextResponse.json({ settings: null, zones: [], isPayFastConfigured: false });
  }

  try {
    const settings = await client.fetch(`*[_type == "shippingSettings"][0]`);
    const zones = await client.fetch(`*[_type == "shippingZone"]`);

    return NextResponse.json({ 
      settings, 
      zones,
      isPayFastConfigured: isPayFastConfigured()
    });
  } catch (error) {
    console.error('Error fetching shipping settings:', error);
    return NextResponse.json({ settings: null, zones: [], isPayFastConfigured: false });
  }
}
```

#### Task 3: Create `/api/payment/cancel` Route

```typescript
// src/app/api/payment/cancel/route.ts
import { NextResponse } from 'next/server';
import { getAdminClient } from '@/sanity/lib/adminClient';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Missing orderId' }, { status: 400 });
    }

    const client = getAdminClient();
    if (!client) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
    }

    const order = await client.fetch(`*[_type == "order" && _id == $orderId][0]`, { orderId });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentStatus === 'completed') {
      return NextResponse.json({ success: false, error: 'Order already completed' }, { status: 400 });
    }

    await client.patch(orderId)
      .set({
        paymentStatus: 'failed',
        status: 'cancelled',
        lastUpdated: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({ success: true, message: 'Order cancelled' });
  } catch (error: any) {
    console.error('Payment cancel error:', error);
    return NextResponse.json({ success: false, error: 'Failed to cancel order' }, { status: 500 });
  }
}
```

#### Task 4: Handle Failed Payments in Webhook

Update `src/app/api/payfast/notify/route.ts` to handle failed payments:

```typescript
// Add after the 'COMPLETE' block (around line 72):
} else if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
    const adminClient = getAdminClient();
    if (!adminClient) {
        console.error('Failed to get admin client for PayFast webhook');
        return new Response('Database Error', { status: 500 });
    }

    const existingOrder = await adminClient.fetch(`*[_type == "order" && _id == $orderId][0]`, { orderId });

    if (existingOrder && existingOrder.paymentStatus !== 'completed') {
        await adminClient.patch(orderId)
            .set({
                paymentStatus: 'failed',
                status: 'cancelled',
                payfastTransactionId: pfPaymentId,
                payfastSignature: signatureFromPayFast,
                lastUpdated: new Date().toISOString()
            })
            .commit();
    }
}
```

#### Task 5: Set `gateway` and `transactionId` Fields in Order Creation

Update `src/app/api/checkout/route.ts` to populate the generic payment fields:

```typescript
// In sanityPayload object (around line 115), add:
gateway: finalPaymentMethod === 'PAYFAST' ? 'PayFast' : 'COD',
transactionId: '', // Will be populated by webhook
```

### 🎨 FRONTEND TASKS

#### Task 6: Pass Payment Method to Success Page

Update `src/app/checkout/page.tsx` success redirect to include payment method:

```typescript
// In handlePlaceOrder, COD success redirect:
router.push(`/checkout/success?order_id=${data.orderId}&payment_method=COD`);

// After PayFast initiate (before form submit):
router.push(`/checkout/success?order_id=${data.orderId}&payment_method=PAYFAST`);
```

#### Task 7: Verify Success Page Handles Polling Correctly

The current success page already polls for PayFast status (every 3s, up to 10 retries). This is adequate but could be improved:
- Add visual indicator of retry attempts remaining
- After timeout, show clearer messaging about checking order status manually

### 🔐 ENVIRONMENT SETUP

#### Required Credentials

| Variable | Where to Get | Sandbox | Live |
|----------|-------------|---------|------|
| `PAYFAST_MERCHANT_ID` | PayFast Dashboard → Settings | Sandbox merchant ID | Live merchant ID |
| `PAYFAST_MERCHANT_KEY` | PayFast Dashboard → Settings | Sandbox merchant key | Live merchant key |
| `PAYFAST_PASSPHRASE` | PayFast Dashboard → Security | Sandbox passphrase | Live passphrase |
| `PAYFAST_MODE` | Manual toggle | `sandbox` | `live` |
| `NEXT_PUBLIC_PAYFAST_MODE` | Manual toggle | `sandbox` | `live` |

#### Sandbox Testing URLs
- **Sandbox Payment:** `https://sandbox.payfast.co.za/eng/process`
- **Live Payment:** `https://www.payfast.co.za/eng/process`
- **Sandbox Dashboard:** `https://sandbox.payfast.co.za`
- **Live Dashboard:** `https://www.payfast.co.za`

---

## 5. Security Issues

### ✅ Secure Practices Already Implemented

| Practice | Status |
|----------|--------|
| MD5 signature generation per PayFast spec | ✅ |
| Server-side signature verification in webhook | ✅ |
| No sensitive env vars exposed to client (except `NEXT_PUBLIC_PAYFAST_MODE`) | ✅ |
| Idempotency check in webhook (duplicate payment protection) | ✅ |
| Order creation idempotency key | ✅ |
| Clerk authentication on order retrieval | ✅ |
| 200 OK response for ITN (prevents PayFast retries) | ✅ |

### ⚠️ Security Concerns

| Issue | Risk | Recommendation |
|-------|------|----------------|
| **No server-side amount validation** | Frontend could send manipulated amount to PayFast | Verify amount against cart total server-side before generating payload |
| **No ITN data logging** | Cannot audit/trace payment issues | Log all ITN data to `paymentLogs` array |
| **Webhook has no IP verification** | Could accept fake ITN requests | Optionally verify PayFast source IP (though signature verification mitigates this) |
| **Completed orders still return 200 but don't update** | Could miss logging of duplicate attempts | Add a log entry to `paymentLogs` even when skipping |

---

## 6. Testing Checklist

### Sandbox Testing

- [ ] **Environment Setup**
  - [ ] All 7 PayFast env vars set correctly
  - [ ] `PAYFAST_MODE=sandbox`
  - [ ] `NEXT_PUBLIC_PAYFAST_MODE=sandbox`

- [ ] **Happy Path (Successful Payment)**
  - [ ] Order created with `paymentStatus: 'pending'`
  - [ ] Redirected to PayFast sandbox
  - [ ] Complete payment with sandbox test card
  - [ ] Redirected back to `/checkout/success`
  - [ ] Webhook fires and updates order to `paymentStatus: 'completed'`
  - [ ] Success page shows confirmed order after polling

- [ ] **Cancelled Payment**
  - [ ] Click "Cancel" on PayFast sandbox
  - [ ] Redirected to `/checkout/payment-cancelled`
  - [ ] Order status updated to `cancelled`
  - [ ] `paymentStatus` set to `failed`

- [ ] **Failed Payment**
  - [ ] Use PayFast sandbox test card that simulates failure
  - [ ] Webhook receives `payment_status=FAILED`
  - [ ] Order updated to `paymentStatus: 'failed'`

- [ ] **Duplicate Callback Handling**
  - [ ] Send same ITN request twice to `/api/payfast/notify`
  - [ ] Second request returns 200 but doesn't duplicate update

- [ ] **Signature Tampering**
  - [ ] Send ITN with modified `signature` field
  - [ ] Webhook returns 400 "Invalid Signature"

- [ ] **Missing Configuration**
  - [ ] Remove PayFast env vars
  - [ ] Attempt PayFast checkout → get 503 error
  - [ ] UI shows "Temporarily Unavailable"

### Production Readiness Checklist

- [ ] Switch `PAYFAST_MODE=live` and `NEXT_PUBLIC_PAYFAST_MODE=live`
- [ ] Replace sandbox credentials with live credentials
- [ ] Update all URLs in env vars to production domain
- [ ] Verify webhook endpoint accessible publicly (no firewall blocking)
- [ ] Test live payment with real card
- [ ] Set up monitoring/alerting for webhook failures
- [ ] Verify HTTPS on all endpoints

---

## 7. Summary & Priority Actions

### Immediate (Must Fix Before Going Live)

1. **Add PayFast env vars** to `.env.local` and `.env.example`
2. **Fix `/api/shipping/settings`** to return `isPayFastConfigured`
3. **Create `/api/payment/cancel`** route
4. **Handle failed payments** in webhook

### Short-Term (Improve Reliability)

5. Add server-side amount validation in initiate API
6. Populate `paymentLogs` on webhook events
7. Set `gateway` and `transactionId` fields on order creation

### Long-Term (Future Enhancements)

8. Add ITN IP verification (optional, signature already protects)
9. Add webhook retry monitoring/alerting
10. Consider adding PayFast email confirmation integration

---

**Bottom Line:** The PayFast code implementation is **well-architected and secure**. The primary blocker is **missing environment configuration**. Fix the 4 critical issues above and the integration will be production-ready.
