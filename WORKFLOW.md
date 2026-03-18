# eCommerce Ordering Process - Complete Workflow Report

**Project:** MD Brothers eCommerce Platform  
**Technology Stack:** Next.js 14, Sanity CMS, Stripe, JazzCash, Easypaisa, Clerk Authentication  
**Last Updated:** March 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Step 1: User Browsing and Product Selection](#step-1-user-browsing-and-product-selection)
3. [Step 2: Cart and Checkout](#step-2-cart-and-checkout)
4. [Step 3: Payment Handling](#step-3-payment-handling)
5. [Step 4: Order Creation and Persistence](#step-4-order-creation-and-persistence)
6. [Step 5: Post-Payment / Confirmation Flow](#step-5-post-payment--confirmation-flow)
7. [Step 6: Admin Panel Updates](#step-6-admin-panel-updates)
8. [Step 7: Error Handling and Edge Cases](#step-7-error-handling-and-edge-cases)
9. [Step 8: Visual Workflow Diagrams](#step-8-visual-workflow-diagrams)
10. [API Reference](#api-reference)
11. [Database Schema Reference](#database-schema-reference)

---

## Overview

This document provides a comprehensive, step-by-step explanation of the entire eCommerce ordering process in the MD Brothers platform. The workflow covers:

- **Frontend interactions** (product browsing, cart management, checkout forms)
- **Backend processing** (order creation, payment handling, data persistence)
- **Payment gateway integrations** (Stripe, JazzCash, Easypaisa, Bank Transfer, COD)
- **Sanity CMS involvement** (product catalog, order storage, admin management)
- **Admin panel operations** (order management, status updates, payment verification)

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js)                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Home    │  │  Shop    │  │  Product │  │   Cart   │  │   Checkout   │  │
│  │  Page    │  │  Page    │  │  Detail  │  │   Page   │  │     Page     │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│       │             │             │             │                │          │
│       └─────────────┴─────────────┴─────────────┴────────────────┘          │
│                                    │                                         │
│                            CartContext (localStorage)                        │
│                            Clerk Authentication                              │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API LAYER (Next.js API)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  /checkout   │  │ /checkout/   │  │  /payment/   │  │  /admin/       │   │
│  │              │  │   stripe     │  │   jazzcash   │  │    orders      │   │
│  │              │  │              │  │   easypaisa  │  │                │   │
│  │              │  │              │  │   bank-      │  │                │   │
│  │              │  │              │  │   transfer   │  │                │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘   │
└─────────┼─────────────────┼─────────────────┼──────────────────┼────────────┘
          │                 │                 │                  │
          ▼                 ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES & DATA STORE                       │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Sanity CMS    │  │    Stripe    │  │   JazzCash   │  │  Easypaisa  │  │
│  │   (Database)    │  │   Gateway    │  │   Gateway    │  │   Gateway   │  │
│  └─────────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Step 1: User Browsing and Product Selection

### 1.1 User Access Points

Users can access the eCommerce website through multiple entry points:

| Entry Point | Route | Description |
|-------------|-------|-------------|
| Homepage | `/` | Landing page with featured products, promotions, and navigation |
| Shop Page | `/shop` | Full product catalog with filtering and sorting |
| Category Page | `/shop?category=X` | Filtered products by category |
| Product Detail | `/[slug]` | Individual product page (dynamic route) |
| Search Results | `/search?q=query` | Search results page |

### 1.2 Product Data Fetching from Sanity CMS

**Products are fetched from Sanity CMS** using GROQ queries via the Sanity client.

#### Client Configuration

```typescript
// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,        // Sanity project ID
  dataset,          // Dataset name (production)
  apiVersion,       // API version date
  useCdn: true,     // CDN enabled for faster reads
})
```

#### Product Query (Shop Page)

```typescript
// src/app/query/Products/page.tsx
const query = `*[_type == "product"] | order(_createdAt desc) {
  _id, 
  title, 
  price, 
  description, 
  discountPercentage,
  "imageUrl": productImage.asset->url,
  tags,
  "categoryName": category->name,
  "slug": slug.current,
  _createdAt
}`;

const data: Product[] = await sanity.fetch(query);
```

**Key Points:**
- Products are ordered by creation date (newest first)
- Category names are resolved via reference join (`category->name`)
- Product images are resolved via asset reference (`productImage.asset->url`)
- CDN is enabled for cached responses (useCdn: true)

### 1.3 Product Detail Page

**Route:** `/[slug]` (dynamic route matching product slug)

#### Product Fetch

```typescript
// src/app/[slug]/page.tsx
const query = `*[_type=='product' && slug.current=="${slug}"]{
  _id,
  title,
  price,
  description,
  "imageUrl": productImage.asset->url,
}[0]`;

const fetchedProduct: Product | null = await client.fetch(query);
```

#### User Interactions on Product Page

| Interaction | Description | State Management |
|-------------|-------------|------------------|
| **Quantity Selection** | Increment/decrement buttons (+/-) | `useState<number>(1)` |
| **Size Selection** | Size buttons (L, XL, XS) | Visual selection only |
| **Color Selection** | Color swatches | `useState<string>('color')` |
| **Description Toggle** | Read More / Read Less | `useState<boolean>` |
| **Add to Cart** | Adds product with selected quantity | `CartContext.addToCart()` |
| **Compare** | Add to comparison list | Visual button only |

#### Add to Cart Flow

```typescript
// src/app/[slug]/page.tsx
const handleAddToCart = (product: any) => {
  if (addingToCart) return;
  
  setAddingToCart(true);
  addToCart({ ...product, quantity: quantity });
  
  setTimeout(() => {
    setAddingToCart(false);
    setAddedToCart(true);
    
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  }, 300);
};
```

**Button States:**
1. **Default:** "Add To Cart" (black background)
2. **Adding:** Spinner animation, "Adding..." text (gray background, disabled)
3. **Added:** Checkmark icon, "Added!" text (green background)
4. **Reset:** Returns to default after 2 seconds

### 1.4 Cart Context Management

**File:** `src/context/CartContext.tsx`

#### Cart Structure

```typescript
interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
```

#### Cart Operations

| Operation | Function | Description |
|-----------|----------|-------------|
| Add Item | `addToCart(product)` | Adds product or increments quantity if exists |
| Update Quantity | `updateQuantity(id, quantity)` | Updates item quantity (min: 1) |
| Remove Item | `removeFromCart(id)` | Removes item from cart |
| Get Total | `cartTotal` | Computed total (sum of price × quantity) |
| Clear Cart | `clearCart()` | Empties cart and clears localStorage |

#### LocalStorage Persistence

```typescript
// Load cart on mount
useEffect(() => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    setCart(JSON.parse(storedCart));
  }
}, []);

// Save cart on change
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
```

---

## Step 2: Cart and Checkout

### 2.1 Cart Overview Page

**Route:** `/cart`

#### Cart Display Components

1. **Carts Component** (`src/components/Carts.tsx`)
   - Displays cart items in a table format (desktop) or list (mobile)
   - Shows product image, title, price, quantity selector, subtotal
   - Provides remove button (trash icon)

2. **Cart Totals Section**
   - Subtotal calculation
   - Total display (same as subtotal, no taxes/shipping calculated)
   - Checkout button

#### Cart Page Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Cart Page (/cart)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌─────────────────────────┐   │
│  │    Cart Items List      │  │    Cart Totals Box      │   │
│  │                         │  │                         │   │
│  │  [Image] Product Title  │  │  Subtotal    $XXX.XX    │   │
│  │  Price: $XX.XX          │  │  ─────────────────────  │   │
│  │  Qty: [-] 2 [+]  🗑️    │  │  Total       $XXX.XX    │   │
│  │  Subtotal: $XX.XX       │  │                         │   │
│  │                         │  │  [Proceed to Checkout]  │   │
│  └─────────────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Authentication Check

Before proceeding to checkout, the system verifies user authentication:

```typescript
// src/components/Carts.tsx
{isLoaded && isSignedIn ? (
  <Link href="/checkout">
    <button>Proceed to Checkout</button>
  </Link>
) : (
  <SignInButton mode="modal">
    <button>Sign In to Checkout</button>
  </SignInButton>
)}
```

### 2.2 Checkout Page

**Route:** `/checkout`

**Authentication Required:** Yes (Clerk `useUser` hook)

#### Checkout Form Fields

| Field | Name | Required | Validation |
|-------|------|----------|------------|
| First Name | `firstName` | Yes | Non-empty |
| Last Name | `lastName` | No | - |
| Company Name | `companyName` | No | Optional |
| Country/Region | `country` | Yes | Default: "Pakistan" |
| Street Address | `streetAddress` | Yes | Non-empty |
| Town/City | `city` | Yes | Non-empty |
| Province | `province` | Yes | Default: "Western Province" |
| ZIP Code | `zipCode` | Yes | Non-empty |
| Phone | `phone` | Yes | Non-empty |
| Email | `email` | Yes | Non-empty |
| Additional Info | `additionalInfo` | No | Optional |

#### Payment Method Options

| Payment Method | Internal Value | Description |
|----------------|----------------|-------------|
| Direct Bank Transfer | `Direct Bank Transfer` | Manual bank transfer with proof upload |
| Cash On Delivery | `Cash On Delivery` | Pay upon delivery |
| JazzCash | `JazzCash` | Pakistani mobile wallet |
| Easypaisa | `Easypaisa` | Pakistani mobile wallet |
| Credit / Debit Card | `Credit / Debit Card` | Stripe-powered card processing |

#### "Proceed to Payment" Flow (handlePlaceOrder)

When the user clicks "Place order", the following sequence occurs:

```typescript
// src/app/checkout/page.tsx
const handlePlaceOrder = async () => {
  // 1. Validate required fields
  if (!formData.firstName || !formData.email || !formData.phone || !formData.streetAddress) {
    alert("Please fill in all required fields.");
    return;
  }

  setIsSubmitting(true);

  // 2. Generate idempotency key (prevents duplicate orders)
  const idempotencyKey = crypto.randomUUID();

  try {
    // 3. Create order in Sanity via API
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { /* form data */ },
        items: cart,
        totalPrice: cartTotal,
        paymentMethod: paymentMethod,
        idempotencyKey: idempotencyKey,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // 4. Route to payment gateway based on selection
      if (paymentMethod === 'Credit / Debit Card') {
        // Stripe Checkout
        const stripeResponse = await fetch('/api/checkout/stripe', { ... });
        window.location.href = stripeData.url; // Redirect to Stripe
      } else if (paymentMethod === 'JazzCash') {
        // JazzCash initiation
        const jazzResponse = await fetch('/api/payment/jazzcash/initiate', { ... });
        setJazzCashPayload(jazzData.payload); // Auto-submit hidden form
      } else if (paymentMethod === 'Easypaisa') {
        // Easypaisa initiation
        const easypaisaResponse = await fetch('/api/payment/easypaisa/initiate', { ... });
        setEasypaisaPayload(easypaisaData.payload); // Auto-submit hidden form
      } else if (paymentMethod === 'Direct Bank Transfer') {
        clearCart();
        router.push(`/checkout/bank-transfer?order_id=${data.orderId}`);
      } else {
        // COD or fallback
        clearCart();
        router.push(`/checkout/success?order_id=${data.orderId}`);
      }
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while placing your order.");
    setIsSubmitting(false);
  }
};
```

---

## Step 3: Payment Handling

### 3.1 Payment Methods Overview

| Method | API Endpoint | Callback URL | Verification |
|--------|--------------|--------------|--------------|
| Stripe | `/api/checkout/stripe` | `/api/stripe/webhook` | Webhook signature |
| JazzCash | `/api/payment/jazzcash/initiate` | `/api/payment/jazzcash/callback` | HMAC SHA256 hash |
| Easypaisa | `/api/payment/easypaisa/initiate` | `/api/payment/easypaisa/callback` | AES-128-ECB decryption |
| Bank Transfer | `/api/payment/bank-transfer/submit` | N/A | Manual admin verification |
| COD | N/A | N/A | No payment required |

### 3.2 Cash on Delivery (COD)

**Flow:** Simplest payment method - no external gateway involved.

```
User selects COD → Order created with status "pending_payment" → 
Order confirmed immediately → Admin processes order → 
Customer pays cash on delivery → Admin marks payment complete
```

**Order Status Flow:**
1. `pending_payment` - Order created, awaiting payment
2. `processing` - Admin begins processing
3. `dispatched` - Order shipped
4. `delivered` - Order delivered, payment collected
5. `completed` - Payment marked complete

### 3.3 Stripe / Credit/Debit Card

#### Step 1: Initiate Stripe Checkout

**Endpoint:** `POST /api/checkout/stripe`

```typescript
// src/app/api/checkout/stripe/route.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

// 1. Fetch product prices from Sanity (security measure)
const products = await adminClient.fetch(
  `*[_type == "product" && _id in $ids]`, 
  { ids: itemIds }
);

// 2. Build line items with verified prices
const secureItems = items.map((item: any) => ({
  price_data: {
    currency: 'pkr',
    product_data: { name: product.title },
    unit_amount: Math.round(product.price * 100), // Convert to cents
  },
  quantity: item.quantity,
}));

// 3. Create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: secureItems,
  mode: 'payment',
  success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
  cancel_url: `${origin}/checkout/payment-cancelled?order_id=${orderId}`,
  metadata: { orderId, customerEmail },
});

// 4. Log payment initiation in Sanity
await adminClient.patch(orderId).append('paymentLogs', [{
  gateway: 'Stripe',
  eventType: 'payment initiated',
  transactionId: session.id,
  status: 'pending',
  timestamp: new Date().toISOString()
}]).commit();

return NextResponse.json({ id: session.id, url: session.url });
```

#### Step 2: User Completes Payment on Stripe

User is redirected to Stripe's hosted checkout page:
- Enters card details
- Stripe processes payment
- User redirected to success/cancel URL

#### Step 3: Stripe Webhook Processing

**Endpoint:** `POST /api/stripe/webhook`

```typescript
// src/app/api/stripe/webhook/route.ts
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  // 1. Verify webhook signature (skip if no secret configured)
  let event: Stripe.Event;
  if (!endpointSecret) {
    event = JSON.parse(body); // Development mode
  } else {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  }

  // 2. Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const paymentIntentId = session.payment_intent as string;

      // Duplicate protection
      const existingOrder = await adminClient.getDocument(orderId);
      if (existingOrder && existingOrder.paymentStatus === 'completed') {
        break; // Already processed
      }

      // Update order in Sanity
      await adminClient.patch(orderId).set({
        paymentStatus: 'completed',
        transactionId: paymentIntentId,
        status: 'processing',
        stripeSessionId: session.id,
        gateway: 'Stripe',
        paymentTimestamp: new Date().toISOString(),
      }).append('paymentLogs', [
        { gateway: 'Stripe', eventType: 'webhook received', ... },
        { gateway: 'Stripe', eventType: 'payment completed', ... }
      ]).commit();
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        await adminClient.patch(orderId).set({
          paymentStatus: 'failed',
        }).append('paymentLogs', [
          { gateway: 'Stripe', eventType: 'payment failed', ... }
        ]).commit();
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

#### Success Flow
```
Stripe Success → Redirect to /checkout/success → 
Display order confirmation → Show order ID and payment reference
```

#### Failure Flow
```
Stripe Cancel → Redirect to /checkout/payment-cancelled → 
Order marked as cancelled → User can retry or return to cart
```

### 3.4 JazzCash

#### Step 1: Initiate JazzCash Payment

**Endpoint:** `POST /api/payment/jazzcash/initiate`

```typescript
// src/app/api/payment/jazzcash/initiate/route.ts
export async function POST(request: Request) {
  const { items, orderId, customerData } = body;

  // 1. Calculate total amount from Sanity prices
  const products = await adminClient.fetch(`*[_type == "product" && _id in $ids]`, { ids: itemIds });
  let totalAmount = 0;
  items.forEach((item: any) => {
    const product = products.find((p: any) => p._id === item._id);
    totalAmount += product.price * item.quantity;
  });

  const amount = Math.round(totalAmount * 100).toString(); // In paisas

  // 2. Generate transaction reference
  const date = new Date();
  const txnRefNo = 'T' + date.getTime().toString();
  const txnDateTime = `${date.getFullYear()}...`; // YYYYMMDDHHMMSS format
  const txnExpiryDateTime = /* 1 hour later */;

  // 3. Build payload
  const payload: Record<string, string> = {
    "pp_Language": "EN",
    "pp_MerchantID": merchantId,
    "pp_Password": password,
    "pp_BankID": "TBANK",
    "pp_ProductID": "RETL",
    "pp_TxnRefNo": txnRefNo,
    "pp_Amount": amount,
    "pp_TxnCurrency": "PKR",
    "pp_TxnDateTime": txnDateTime,
    "pp_BillReference": orderId,
    "pp_Description": `Payment for Order ${orderId}`,
    "pp_TxnExpiryDateTime": txnExpiryDateTime,
    "pp_ReturnURL": returnUrl,
    "pp_SecureHash": "",
    "ppmpf_1": "1", // Custom fields
    // ... ppmpf_2 through ppmpf_5
  };

  // 4. Compute Secure Hash (HMAC SHA256)
  const sortedKeys = Object.keys(payload).sort();
  let hashString = integritySalt;
  sortedKeys.forEach((key) => {
    if (key !== 'pp_SecureHash' && payload[key] !== '' && payload[key] !== null) {
      hashString += '&' + payload[key];
    }
  });

  const secureHash = crypto
    .createHmac('sha256', integritySalt)
    .update(hashString)
    .digest('hex')
    .toUpperCase();

  payload.pp_SecureHash = secureHash;

  // 5. Log initiation in Sanity
  await adminClient.patch(orderId).append('paymentLogs', [{
    gateway: 'JazzCash',
    eventType: 'payment initiated',
    transactionId: txnRefNo,
    status: 'pending',
    timestamp: new Date().toISOString()
  }]).commit();

  return NextResponse.json({ success: true, payload });
}
```

#### Step 2: User Redirected to JazzCash

The checkout page auto-submits a hidden form:

```typescript
// src/app/checkout/page.tsx
{jazzCashPayload && (
  <form
    ref={jazzCashFormRef}
    action="https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/"
    method="POST"
    style={{ display: 'none' }}
  >
    {Object.entries(jazzCashPayload).map(([key, value]) => (
      <input key={key} type="hidden" name={key} value={value as string} />
    ))}
  </form>
)}

// Effect triggers form submission
useEffect(() => {
  if (jazzCashPayload && jazzCashFormRef.current) {
    jazzCashFormRef.current.submit();
  }
}, [jazzCashPayload]);
```

#### Step 3: JazzCash Callback Processing

**Endpoint:** `POST /api/payment/jazzcash/callback`

```typescript
// src/app/api/payment/jazzcash/callback/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const payload: Record<string, string> = {};
  formData.forEach((value, key) => {
    payload[key] = value.toString();
  });

  // 1. Verify hash authenticity
  const sortedKeys = Object.keys(payload).sort();
  let hashString = integritySalt;
  sortedKeys.forEach((key) => {
    if (key !== 'pp_SecureHash' && payload[key] !== '' && payload[key] !== null) {
      hashString += '&' + payload[key];
    }
  });

  const calculatedHash = crypto
    .createHmac('sha256', integritySalt)
    .update(hashString)
    .digest('hex')
    .toUpperCase();

  const receivedHash = (payload['pp_SecureHash'] || '').toUpperCase();

  if (calculatedHash !== receivedHash) {
    console.error('JazzCash Hash verification failed.');
    return redirect('/checkout/success?status=error&message=PaymentVerificationFailed');
  }

  // 2. Check payment status
  const orderId = payload['pp_BillReference'];
  const responseCode = payload['pp_ResponseCode'];
  const transactionId = payload['pp_TxnRefNo'];

  if (responseCode === '000') {
    // SUCCESS
    // Duplicate protection
    const existingOrder = await adminClient.getDocument(orderId);
    if (existingOrder && existingOrder.paymentStatus === 'completed') {
      return redirect(`/checkout/success?order_id=${orderId}&session_id=${transactionId}`);
    }

    // Update order
    await adminClient.patch(orderId).set({
      paymentStatus: 'completed',
      transactionId: transactionId,
      status: 'processing',
      gateway: 'JazzCash',
      paymentTimestamp: new Date().toISOString(),
    }).append('paymentLogs', [
      { gateway: 'JazzCash', eventType: 'payment completed', ... }
    ]).commit();

    return redirect(`/checkout/success?order_id=${orderId}&session_id=${transactionId}`);
  } else {
    // FAILED
    await adminClient.patch(orderId).set({
      paymentStatus: 'failed',
    }).append('paymentLogs', [
      { gateway: 'JazzCash', eventType: 'payment failed', ... }
    ]).commit();

    return redirect(`/checkout/success?order_id=${orderId}&status=failed`);
  }
}
```

### 3.5 Easypaisa

#### Step 1: Initiate Easypaisa Payment

**Endpoint:** `POST /api/payment/easypaisa/initiate`

```typescript
// src/app/api/payment/easypaisa/initiate/route.ts
export async function POST(request: Request) {
  const { items, orderId } = body;

  // 1. Calculate total amount
  const products = await adminClient.fetch(`*[_type == "product" && _id in $ids]`, { ids: itemIds });
  let totalAmount = 0;
  items.forEach((item: any) => {
    const product = products.find((p: any) => p._id === item._id);
    totalAmount += product.price * item.quantity;
  });

  const amount = totalAmount.toFixed(1); // Format: "100.0"

  // 2. Generate transaction reference
  const date = new Date();
  const orderRefNum = 'EP' + date.getTime().toString().substring(5);
  const expiryDate = /* 1 hour later in YYYYMMDD HHMMSS format */;

  // 3. Build hash string for encryption
  const hashString = `amount=${amount}&orderRefNum=${orderRefNum}&postBackURL=${returnUrl}&storeId=${storeId}`;

  // 4. Encrypt with AES-128-ECB
  const keyBuffer = Buffer.from(hashKey, 'utf8');
  const cipher = crypto.createCipheriv('aes-128-ecb', keyBuffer, null);
  let encrypted = cipher.update(hashString, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const encryptedHash = encrypted;

  // 5. Build payload
  const payload: Record<string, string> = {
    "storeId": storeId,
    "orderId": orderId,
    "transactionAmount": amount,
    "transactionType": "MA", // Masterpass/Accounts
    "mobileAmount": "account",
    "emailAddress": "customer@example.com",
    "orderRefNum": orderRefNum,
    "merchantHashedReq": encryptedHash,
    "autoRedirect": "0",
    "paymentMethod": "InitialRequest",
    "postBackURL": returnUrl,
    "bankIdentificationNumber": "",
  };

  // 6. Log initiation
  await adminClient.patch(orderId).append('paymentLogs', [{
    gateway: 'Easypaisa',
    eventType: 'payment initiated',
    transactionId: orderRefNum,
    status: 'pending',
    timestamp: new Date().toISOString()
  }]).commit();

  return NextResponse.json({ success: true, payload });
}
```

#### Step 2: User Redirected to Easypaisa

Similar to JazzCash, a hidden form is auto-submitted:

```typescript
// src/app/checkout/page.tsx
{easypaisaPayload && (
  <form
    ref={easypaisaFormRef}
    action="https://easypay.easypaisa.com.pk/easypay/Index.jsf"
    method="POST"
    style={{ display: 'none' }}
  >
    {Object.entries(easypaisaPayload).map(([key, value]) => (
      <input key={key} type="hidden" name={key} value={value as string} />
    ))}
  </form>
)}
```

#### Step 3: Easypaisa Callback Processing

**Endpoint:** `POST /api/payment/easypaisa/callback`

```typescript
// src/app/api/payment/easypaisa/callback/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const payload: Record<string, string> = {};
  formData.forEach((value, key) => {
    payload[key] = value.toString();
  });

  const storeId = process.env.EASYPAISA_STORE_ID || '';
  const orderId = payload['orderRefNum'] || payload['orderId'];
  const transactionId = payload['transactionId'];
  const responseCode = payload['responseCode'];

  // 1. Verify Store ID
  if (payload['storeId'] !== storeId) {
    console.error('Store ID mismatch');
    return redirect('/checkout/success?status=error&message=InvalidStoreId');
  }

  // 2. Check response code (0000 = success)
  if (responseCode === '0000') {
    // SUCCESS - Duplicate protection
    const existingOrder = await adminClient.getDocument(orderId);
    if (existingOrder && existingOrder.paymentStatus === 'completed') {
      return redirect(`/checkout/success?order_id=${orderId}&session_id=${transactionId}`);
    }

    // Update order
    await adminClient.patch(orderId).set({
      paymentStatus: 'completed',
      transactionId: transactionId,
      status: 'processing',
      gateway: 'Easypaisa',
      paymentTimestamp: new Date().toISOString(),
    }).append('paymentLogs', [
      { gateway: 'Easypaisa', eventType: 'payment completed', ... }
    ]).commit();

    return redirect(`/checkout/success?order_id=${orderId}&session_id=${transactionId}`);
  } else {
    // FAILED
    await adminClient.patch(orderId).set({
      paymentStatus: 'failed',
    }).append('paymentLogs', [
      { gateway: 'Easypaisa', eventType: 'payment failed', ... }
    ]).commit();

    return redirect(`/checkout/success?order_id=${orderId}&status=failed`);
  }
}
```

### 3.6 Direct Bank Transfer

#### Step 1: Redirect to Bank Transfer Page

After order creation, user is redirected:

```typescript
// src/app/checkout/page.tsx
if (paymentMethod === 'Direct Bank Transfer') {
  clearCart();
  router.push(`/checkout/bank-transfer?order_id=${data.orderId}`);
}
```

#### Step 2: Display Bank Details

**Route:** `/checkout/bank-transfer`

Bank details are displayed from environment variables:

```typescript
// src/config/paymentConfig.ts
export const paymentConfig = {
  bankTransfer: {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || 'Unknown Bank',
    accountTitle: process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE,
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER,
    iban: process.env.NEXT_PUBLIC_BANK_IBAN,
    branch: process.env.NEXT_PUBLIC_BANK_BRANCH,
  },
};
```

**Displayed Information:**
- Bank Name (e.g., "Meezan Bank Limited")
- Account Title (e.g., "MD Brothers eCommerce")
- Account Number
- IBAN
- Branch Location

#### Step 3: User Submits Payment Proof

User must provide:
1. **Transaction Reference ID** - From bank receipt/SMS
2. **Payment Screenshot** - Image file (PNG, JPG, WEBP, max 5MB)

#### Step 4: Submit Proof to API

**Endpoint:** `POST /api/payment/bank-transfer/submit`

```typescript
// src/app/api/payment/bank-transfer/submit/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const orderId = formData.get('orderId') as string;
  const transactionReference = formData.get('transactionReference') as string;
  const proofImage = formData.get('proofImage') as File;

  // 1. Convert image to buffer
  const arrayBuffer = await proofImage.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 2. Upload image to Sanity Assets
  const asset = await adminClient.assets.upload('image', buffer, {
    filename: proofImage.name || 'payment_proof.jpg',
    contentType: proofImage.type || 'image/jpeg',
  });

  // 3. Update order with transaction ID and proof image
  await adminClient.patch(orderId).set({
    transactionId: transactionReference,
    proofImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      }
    }
  }).commit();

  return NextResponse.json({ success: true });
}
```

#### Step 5: Admin Verification

Admin manually verifies the payment:
1. Views proof image in admin panel
2. Confirms funds received in bank account
3. Updates order status to `processing` or `paid`

### 3.7 Payment Comparison Table

| Aspect | Stripe | JazzCash | Easypaisa | Bank Transfer | COD |
|--------|--------|----------|-----------|---------------|-----|
| **Processing Time** | Instant | Instant | Instant | Manual (1-2 days) | On delivery |
| **Verification** | Webhook | Hash | Encrypted hash | Admin review | Cash collection |
| **Success URL** | `/checkout/success` | `/checkout/success` | `/checkout/success` | `/checkout/success` | `/checkout/success` |
| **Cancel URL** | `/checkout/payment-cancelled` | N/A | N/A | N/A | N/A |
| **Transaction ID** | Stripe Payment Intent ID | T + timestamp | EP + timestamp | User-provided reference | N/A |
| **Currency** | PKR | PKR | PKR | PKR | PKR |
| **Duplicate Protection** | Webhook idempotency | Order status check | Order status check | N/A | N/A |

---

## Step 4: Order Creation and Persistence

### 4.1 Order Creation API

**Endpoint:** `POST /api/checkout`

```typescript
// src/app/api/checkout/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const { customer, items, totalPrice, paymentMethod, idempotencyKey } = body;

  // 1. Validate idempotency key
  if (!idempotencyKey) {
    return NextResponse.json(
      { success: false, error: 'Idempotency Key required' }, 
      { status: 400 }
    );
  }

  // 2. Check for existing order (duplicate prevention)
  const existingOrder = await adminClient.fetch(
    `*[_type == "order" && idempotencyKey == $idempotencyKey][0]`, 
    { idempotencyKey }
  );
  
  if (existingOrder) {
    console.log(`Idempotency check intercepted duplicate: ${existingOrder._id}`);
    return NextResponse.json({ success: true, orderId: existingOrder._id });
  }

  // 3. Determine initial status based on payment method
  let orderStatus = 'pending';
  let paymentStatus = 'pending';

  if (paymentMethod === 'Cash On Delivery') {
    orderStatus = 'pending_payment';
    paymentStatus = 'pending';
  } else if (paymentMethod === 'Direct Bank Transfer') {
    orderStatus = 'awaiting_bank_transfer';
    paymentStatus = 'pending';
  } else if (paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa') {
    orderStatus = 'pending_payment';
    paymentStatus = 'pending';
  }

  // 4. Create order document in Sanity
  const order = await adminClient.create({
    _type: 'order',
    customer,
    items: items.map((item: any) => ({
      _key: Math.random().toString(36).substring(2, 9),
      product: {
        _type: 'reference',
        _ref: item._id,
      },
      quantity: item.quantity,
      price: item.price,
    })),
    totalPrice,
    paymentMethod,
    paymentStatus,
    transactionId: '',
    status: orderStatus,
    orderDate: new Date().toISOString(),
    idempotencyKey,
  });

  return NextResponse.json({ success: true, orderId: order._id });
}
```

### 4.2 Sanity Order Schema

**File:** `src/sanity/schemaTypes/order.ts`

```typescript
export const order = defineType({
  name: 'order',
  type: 'document',
  title: 'Order',
  fields: [
    // Customer Details
    {
      name: 'customer',
      type: 'object',
      title: 'Customer Details',
      fields: [
        { name: 'firstName', type: 'string', title: 'First Name' },
        { name: 'lastName', type: 'string', title: 'Last Name' },
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'address', type: 'string', title: 'Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'zipCode', type: 'string', title: 'ZIP Code' },
      ]
    },
    
    // Order Items
    {
      name: 'items',
      type: 'array',
      title: 'Order Items',
      of: [{
        type: 'object',
        fields: [
          { name: 'product', type: 'reference', to: [{ type: 'product' }] },
          { name: 'quantity', type: 'number' },
          { name: 'price', type: 'number' }
        ]
      }]
    },
    
    // Pricing
    { name: 'totalPrice', type: 'number', title: 'Total Price' },
    
    // Order Status
    {
      name: 'status',
      type: 'string',
      title: 'Order Status',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Pending Payment', value: 'pending_payment' },
          { title: 'Awaiting Bank Transfer', value: 'awaiting_bank_transfer' },
          { title: 'Processing', value: 'processing' },
          { title: 'Paid', value: 'paid' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Dispatched', value: 'dispatched' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio'
      },
      initialValue: 'pending'
    },
    
    // Payment Information
    { name: 'paymentMethod', type: 'string', title: 'Payment Method' },
    {
      name: 'paymentStatus',
      type: 'string',
      title: 'Payment Status',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' },
        ],
        layout: 'radio'
      },
      initialValue: 'pending'
    },
    { name: 'transactionId', type: 'string', title: 'Transaction ID' },
    { name: 'gateway', type: 'string', title: 'Payment Gateway Used' },
    { name: 'paymentTimestamp', type: 'datetime', title: 'Payment Timestamp' },
    { name: 'stripeSessionId', type: 'string', title: 'Stripe Session ID' },
    { name: 'proofImage', type: 'image', title: 'Payment Proof Image' },
    
    // Delivery Information
    { name: 'deliveryConfirmedAt', type: 'datetime', title: 'Delivery Confirmed At' },
    { name: 'deliveryAgent', type: 'string', title: 'Delivery Agent / Rider' },
    
    // Timestamps
    { name: 'orderDate', type: 'datetime', title: 'Order Date', initialValue: () => new Date().toISOString() },
    { name: 'createdAt', type: 'datetime', title: 'Created At', initialValue: () => new Date().toISOString() },
  ]
});
```

### 4.3 Payment Logs Schema (Dynamic Field)

Orders include a `paymentLogs` array for tracking payment events:

```typescript
{
  paymentLogs: [
    {
      _key: string;        // Unique key
      gateway: string;     // e.g., "Stripe", "JazzCash"
      eventType: string;   // e.g., "payment initiated", "webhook received"
      transactionId: string;
      status: string;      // "pending", "success", "failed"
      timestamp: string;   // ISO 8601 datetime
    }
  ]
}
```

### 4.4 Stored Order Data Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `_id` | string | Sanity document ID | `order-123-abc` |
| `customer.firstName` | string | Customer first name | `John` |
| `customer.lastName` | string | Customer last name | `Doe` |
| `customer.email` | string | Customer email | `john@example.com` |
| `customer.phone` | string | Customer phone | `+923001234567` |
| `customer.address` | string | Full address | `123 Main St, Lahore` |
| `customer.city` | string | City | `Lahore` |
| `customer.zipCode` | string | ZIP/Postal code | `54000` |
| `items[]` | array | Order line items | `[...]` |
| `items[].product` | reference | Product reference | `{_ref: "prod-123"}` |
| `items[].quantity` | number | Quantity ordered | `2` |
| `items[].price` | number | Unit price | `1500` |
| `totalPrice` | number | Total order value | `3000` |
| `status` | string | Order status | `processing` |
| `paymentMethod` | string | Payment method | `Stripe` |
| `paymentStatus` | string | Payment status | `completed` |
| `transactionId` | string | Gateway transaction ID | `pi_123456` |
| `gateway` | string | Payment gateway | `Stripe` |
| `paymentTimestamp` | datetime | Payment time | `2026-03-18T10:30:00Z` |
| `stripeSessionId` | string | Stripe session ID | `cs_123456` |
| `proofImage` | image | Bank transfer proof | `{asset: {_ref: "image-123"}}` |
| `deliveryAgent` | string | Delivery person/courier | `TCS Courier` |
| `deliveryConfirmedAt` | datetime | Delivery confirmation time | `2026-03-20T14:00:00Z` |
| `orderDate` | datetime | Order placement time | `2026-03-18T10:25:00Z` |
| `idempotencyKey` | string | Unique order key | `uuid-v4-string` |
| `paymentLogs[]` | array | Payment event timeline | `[...]` |

---

## Step 5: Post-Payment / Confirmation Flow

### 5.1 Payment Success Flow

#### Success Page

**Route:** `/checkout/success`

```typescript
// src/app/checkout/success/page.tsx
export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const order_id = searchParams.get('order_id');

  // Determine validity
  useEffect(() => {
    if (session_id) {
      setStatus('success'); // Stripe payment
    } else if (order_id) {
      setStatus('success'); // Other payment methods
    } else {
      setStatus('invalid');
    }
  }, [session_id, order_id]);

  // Render success page
  return (
    <div className="min-h-screen bg-[#F9F1E7] flex items-center justify-center px-4 py-20">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Order Summary
          </h2>
          {order_id && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Order ID</span>
              <span className="text-gray-900 font-medium font-mono text-sm">{order_id}</span>
            </div>
          )}
          {session_id && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Ref</span>
              <span className="text-gray-900 font-medium font-mono text-sm break-all">
                {session_id.substring(0, 16)}...
              </span>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              We will send a confirmation email with order details shortly.
            </p>
          </div>
        </div>

        <Link href="/" className="inline-block w-full bg-[#B88E2F] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#a37d2a] transition-colors duration-300 shadow-md hover:shadow-lg">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
```

#### Success Page Display

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ✓  Order Confirmed!                      │
│                                                             │
│   Thank you for your purchase. Your order has been placed   │
│   successfully.                                             │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Order Summary                                       │   │
│   │  ─────────────────────────────────────────────────  │   │
│   │  Order ID         order-abc-123-xyz                 │   │
│   │  Payment Ref      cs_live_1234567890...             │   │
│   │                                                       │   │
│   │  We will send a confirmation email with order        │   │
│   │  details shortly.                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│              [     Continue Shopping     ]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Payment Failure / Cancellation Flow

#### Cancelled Payment Page

**Route:** `/checkout/payment-cancelled`

```typescript
// src/app/checkout/payment-cancelled/page.tsx
export default function PaymentCancelled() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const order_id = searchParams.get('order_id');
  const [status, setStatus] = useState<'cancelling' | 'cancelled' | 'error'>('cancelling');

  useEffect(() => {
    if (!order_id) return;

    const terminateOrder = async () => {
      try {
        const response = await fetch('/api/payment/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order_id }),
        });

        if (response.ok) {
          setStatus('cancelled');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    terminateOrder();
  }, [order_id]);

  // Render cancelled page
  return (
    <div className="min-h-screen bg-[#F9F1E7] flex items-center justify-center px-4 py-16">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg max-w-lg w-full text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 mb-6">
          <svg className="h-10 w-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Cancelled</h1>
        <p className="text-base text-gray-600 mb-8">
          Your checkout process for order #{order_id} has been cleanly interrupted.
          You can easily retry your payment when you are ready.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-[#B88E2F] hover:bg-[#a37d2a] text-white font-bold py-3.5 px-4 rounded-xl"
          >
            Retry Payment
          </button>
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200"
          >
            Return to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### Cancel API

**Endpoint:** `POST /api/payment/cancel`

```typescript
// src/app/api/payment/cancel/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const { orderId } = body;

  if (!orderId) {
    return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
  }

  // Validate order exists
  const existingOrder = await adminClient.getDocument(orderId);
  if (!existingOrder) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  // Check if already completed (race condition protection)
  if (existingOrder.paymentStatus === 'completed') {
    return NextResponse.json({ success: true, message: 'Order already completed' });
  }

  // Mark as cancelled
  await adminClient.patch(orderId).set({
    paymentStatus: 'cancelled',
    status: 'cancelled'
  }).commit();

  return NextResponse.json({ success: true });
}
```

### 5.3 Email Notifications

**Current Implementation:** The system displays an on-screen message indicating that a confirmation email will be sent:

```typescript
// src/app/checkout/success/page.tsx
<p className="text-xs text-gray-500 text-center">
  We will send a confirmation email with order details shortly.
</p>
```

**Note:** As of the current implementation, email notifications are mentioned but not explicitly implemented in the codebase. To add email functionality, you would need to:

1. Integrate an email service (SendGrid, Resend, AWS SES)
2. Create email templates for order confirmation
3. Trigger emails from the webhook handlers or order creation API

---

## Step 6: Admin Panel Updates

### 6.1 Admin Panel Overview

**Route:** `/admin`

The admin panel provides a comprehensive interface for managing orders, products, categories, and discounts.

**Authentication:** Admin routes should be protected (implementation depends on deployment configuration)

### 6.2 Orders Management Page

**Route:** `/admin/orders`

**File:** `src/app/admin/orders/page.tsx`

#### Orders Fetch

```typescript
// src/app/api/admin/orders/route.ts
export async function GET() {
  const orders = await adminClient.fetch(`*[_type == "order"] | order(orderDate desc) {
    _id, 
    customer, 
    items, 
    totalPrice, 
    status, 
    paymentStatus, 
    paymentMethod, 
    orderDate, 
    deliveryAgent, 
    deliveryConfirmedAt,
    gateway, 
    transactionId, 
    paymentTimestamp, 
    stripeSessionId, 
    paymentLogs,
    "proofImageUrl": proofImage.asset->url
  }`);
  
  return NextResponse.json(orders);
}
```

#### Order Display Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Orders                                          156 total orders           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Order Status                                                               │
│  [All] [pending] [pending_payment] [awaiting_bank_transfer] [processing]    │
│  [paid] [shipped] [dispatched] [delivered] [completed] [cancelled]          │
│                                                                             │
│  Payment Status                                                             │
│  [All] [pending] [completed] [failed]                                       │
│                                                                             │
│  Payment Method                                                             │
│  [All] [Cash On Delivery] [Direct Bank Transfer] [Stripe] [JazzCash]        │
│  [Easypaisa]                                                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  John Doe                              $150.00   [processing]    ▼  │   │
│  │  john@example.com                                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  [Expanded Details - Visible when row is clicked]                   │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────┐  ┌───────────────────────────────┐    │   │
│  │  │ Customer Details         │  │ Payment Details               │    │   │
│  │  │ ──────────────────────── │  │ ───────────────────────────── │    │   │
│  │  │ Phone: +923001234567     │  │ Method: Stripe                │    │   │
│  │  │ Address: 123 Main St     │  │ Status: completed             │    │   │
│  │  │ City: Lahore             │  │ Gateway: Stripe               │    │   │
│  │  │ ZIP: 54000               │  │ Transaction ID: pi_123456     │    │   │
│  │  │ Date: 3/18/2026 10:30 AM │  │ Stripe Session: cs_live_...   │    │   │
│  │  │ Delivery Agent: TCS      │  │ Logged At: 3/18/2026 10:31 AM │    │   │
│  │  └──────────────────────────┘  └───────────────────────────────┘    │   │
│  │                                                                      │   │
│  │  Payment Timeline                                                    │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │ Time           │ Gateway  │ Event            │ Status        │   │   │
│  │  │ ────────────── │ ──────── │ ──────────────── │ ───────────── │   │   │
│  │  │ 3/18 10:30 AM  │ Stripe   │ payment initiated│ pending       │   │   │
│  │  │ 3/18 10:31 AM  │ Stripe   │ webhook received │ processing    │   │   │
│  │  │ 3/18 10:31 AM  │ Stripe   │ payment completed│ success       │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  │  Update Order Status                                                 │   │
│  │  [pending] [pending_payment] [processing] [paid] [shipped]          │   │
│  │  [dispatched] [delivered] [completed] [cancelled]                   │   │
│  │                                                                      │   │
│  │  Set Delivery Agent (Optional)                                       │   │
│  │  [________________________________]                                 │   │
│  │                                                                      │   │
│  │  Override Payment Status                                             │   │
│  │  [pending] [completed] [failed]                                     │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Order Status Management

#### Available Statuses

| Status | Value | Description |
|--------|-------|-------------|
| Pending | `pending` | Initial order state |
| Pending Payment | `pending_payment` | Awaiting payment confirmation |
| Awaiting Bank Transfer | `awaiting_bank_transfer` | Waiting for bank transfer proof |
| Processing | `processing` | Order being prepared |
| Paid | `paid` | Payment confirmed |
| Shipped | `shipped` | Order shipped |
| Dispatched | `dispatched` | Out for delivery |
| Delivered | `delivered` | Delivered to customer |
| Completed | `completed` | Order fully completed |
| Cancelled | `cancelled` | Order cancelled |

#### Status Update API

**Endpoint:** `PATCH /api/admin/orders`

```typescript
// src/app/api/admin/orders/route.ts
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status, paymentStatus, deliveryAgent } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  const updates: any = {};
  if (status) updates.status = status;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (deliveryAgent) updates.deliveryAgent = deliveryAgent;

  // Automated hooks
  if (status === 'delivered') {
    updates.paymentStatus = 'completed';
    updates.deliveryConfirmedAt = new Date().toISOString();
  } else if (status === 'dispatched' && deliveryAgent) {
    updates.deliveryAgent = deliveryAgent;
  }

  const result = await adminClient.patch(id).set(updates).commit();
  return NextResponse.json(result);
}
```

### 6.4 Payment Status Override

Admin can manually override payment status:

| Action | Effect |
|--------|--------|
| Mark as Completed | Sets `paymentStatus: 'completed'` |
| Mark as Failed | Sets `paymentStatus: 'failed'` |
| Mark as Pending | Sets `paymentStatus: 'pending'` |

**Use Cases:**
- Bank transfer verification
- COD payment confirmation
- Manual payment adjustments
- Refund processing

### 6.5 Payment Proof Review

For bank transfer orders, admin can view uploaded proof images:

```typescript
// Admin panel displays proof image with zoom on hover
{order.proofImageUrl && (
  <div className="mt-4">
    <h4 className="text-sm font-semibold text-gray-700 mb-2">
      Bank Transfer Proof
    </h4>
    <div className="border border-gray-200 p-2 rounded-xl bg-white relative group overflow-hidden">
      <img 
        src={order.proofImageUrl} 
        alt="Payment Proof" 
        className="w-full h-auto max-h-48 object-contain rounded-lg" 
      />
      <a 
        href={order.proofImageUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl"
      >
        <span className="text-white text-sm font-medium">
          View Full Screen
        </span>
      </a>
    </div>
  </div>
)}
```

### 6.6 Payment Timeline

Admin can view complete payment event history:

```typescript
// Payment logs displayed in table format
<table className="min-w-full divide-y divide-gray-200 text-sm">
  <thead className="bg-[#B88E2F]/10">
    <tr>
      <th>Time</th>
      <th>Gateway</th>
      <th>Event</th>
      <th>Status</th>
      <th>Trx ID</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-100 bg-white">
    {order.paymentLogs.map(log => (
      <tr key={log._key}>
        <td>{new Date(log.timestamp).toLocaleString()}</td>
        <td>{log.gateway}</td>
        <td className="capitalize">{log.eventType}</td>
        <td>
          <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
            log.status === 'success' ? 'bg-green-100 text-green-700' :
            log.status === 'failed' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {log.status}
          </span>
        </td>
        <td className="font-mono text-xs">{log.transactionId || '—'}</td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## Step 7: Error Handling and Edge Cases

### 7.1 Payment Failure Scenarios

#### Stripe Payment Failed

**Trigger:** `payment_intent.payment_failed` webhook event

```typescript
// src/app/api/stripe/webhook/route.ts
case 'payment_intent.payment_failed': {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderId = paymentIntent.metadata?.orderId;

  if (orderId) {
    await adminClient.patch(orderId).set({
      paymentStatus: 'failed',
    }).append('paymentLogs', [
      { 
        gateway: 'Stripe', 
        eventType: 'payment failed', 
        transactionId: paymentIntent.id, 
        status: 'failed', 
        timestamp: new Date().toISOString() 
      }
    ]).commit();
  }
  break;
}
```

**User Experience:**
- User remains on Stripe checkout page
- Stripe displays error message
- User can retry payment
- Order status updated to `failed`

#### JazzCash/Easypaisa Payment Failed

**Trigger:** Callback with non-success response code

```typescript
// JazzCash: responseCode !== '000'
// Easypaisa: responseCode !== '0000'

if (responseCode !== '000') {
  await adminClient.patch(orderId).set({
    paymentStatus: 'failed',
  }).append('paymentLogs', [
    { gateway: 'JazzCash', eventType: 'payment failed', ... }
  ]).commit();

  return redirect(`/checkout/success?order_id=${orderId}&status=failed`);
}
```

### 7.2 Network Issues

#### Timeout During Order Creation

**Protection:** Idempotency key prevents duplicate orders

```typescript
// src/app/api/checkout/route.ts
const existingOrder = await adminClient.fetch(
  `*[_type == "order" && idempotencyKey == $idempotencyKey][0]`, 
  { idempotencyKey }
);

if (existingOrder) {
  return NextResponse.json({ success: true, orderId: existingOrder._id });
}
```

**Behavior:**
- If network timeout occurs after order creation but before response
- Retry with same idempotency key returns existing order ID
- No duplicate orders created

#### Timeout During Payment Gateway Redirect

**Scenario:** Form submission to JazzCash/Easypaisa times out

**Handling:**
- Gateway typically has its own timeout handling
- User may see gateway error page
- Callback may not fire
- Order remains in `pending_payment` status
- Admin can manually investigate

### 7.3 Invalid Data Submission

#### Missing Required Fields

```typescript
// src/app/checkout/page.tsx
if (!formData.firstName || !formData.email || !formData.phone || !formData.streetAddress) {
  alert("Please fill in all required fields.");
  return;
}
```

#### Invalid Payment Gateway Configuration

```typescript
// JazzCash initiation - missing integrity salt
if (!integritySalt) {
  console.error('Missing JAZZCASH_INTEGERITY_SALT');
  return redirect('/checkout/success?status=error&message=ServerConfigurationError');
}
```

### 7.4 Duplicate Order Prevention

#### Idempotency Key Mechanism

```typescript
// Generate unique key per checkout attempt
const idempotencyKey = crypto.randomUUID();

// Check for existing order with same key
const existingOrder = await adminClient.fetch(
  `*[_type == "order" && idempotencyKey == $idempotencyKey][0]`, 
  { idempotencyKey }
);

if (existingOrder) {
  // Return existing order instead of creating duplicate
  return NextResponse.json({ success: true, orderId: existingOrder._id });
}
```

#### Webhook Duplicate Protection

```typescript
// Stripe webhook
const existingOrder = await adminClient.getDocument(orderId);
if (existingOrder && existingOrder.paymentStatus === 'completed') {
  console.log(`Order ${orderId} already completed. Ignoring webhook duplicate.`);
  break;
}

// JazzCash callback
if (existingOrder && existingOrder.paymentStatus === 'completed') {
  console.log(`JazzCash Order ${orderId} already completed. Skipping.`);
  return redirect(`/checkout/success?order_id=${orderId}&session_id=${transactionId}`);
}
```

### 7.5 Race Conditions

#### Webhook vs User Action Race

**Scenario:** User cancels payment while webhook is processing success

**Resolution:** Check order status before applying changes

```typescript
// src/app/api/payment/cancel/route.ts
if (existingOrder.paymentStatus === 'completed') {
  // Webhook already marked complete
  return NextResponse.json({ success: true, message: 'Order already completed' });
}
```

#### Concurrent Status Updates

**Scenario:** Admin updates status while webhook also updates

**Resolution:** Last write wins; payment logs provide audit trail

### 7.6 Caching and Real-Time Updates

#### Sanity CDN Caching

```typescript
// Product fetch uses CDN
export const client = createClient({
  useCdn: true, // Cached for performance
});

// Admin writes bypass CDN
export const adminClient = createClient({
  useCdn: false, // Always fresh for writes
  token: process.env.SANITY_API_TOKEN,
});
```

#### ISR (Incremental Static Regeneration)

**Current Implementation:** Pages use client-side fetching with `useEffect`, avoiding ISR caching issues.

**Potential Issues:**
- Product price changes may not reflect immediately on static pages
- Solution: Use `useCdn: false` for critical data or implement revalidation

#### Real-Time Order Updates

**Current Implementation:** Admin panel requires manual refresh to see updates.

**Recommended Enhancement:**
```typescript
// Poll for updates every 30 seconds
useEffect(() => {
  const interval = setInterval(fetchOrders, 30000);
  return () => clearInterval(interval);
}, []);
```

### 7.7 Error Summary Table

| Error Type | Detection | Handling | User Message |
|------------|-----------|----------|--------------|
| Missing fields | Frontend validation | Block submission | "Please fill in all required fields" |
| Network timeout | Fetch timeout | Idempotency retry | "An error occurred while placing your order" |
| Payment failed | Gateway response | Update order status | Redirect to failed state |
| Duplicate order | Idempotency key check | Return existing order | Silent (no error shown) |
| Hash mismatch | Cryptographic verification | Reject callback | "Payment verification failed" |
| Missing config | Environment variable check | Log error, redirect | "Server configuration error" |
| Order not found | Document lookup | Return 404 | "Invalid order reference" |

---

## Step 8: Visual Workflow Diagrams

### 8.1 Complete Order Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           COMPLETE ORDER WORKFLOW                                │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  HOME    │
    │   PAGE   │
    └────┬─────┘
         │
         ▼
    ┌──────────┐     ┌──────────┐
    │   SHOP   │────▶│ PRODUCT  │
    │   PAGE   │     │  DETAIL  │
    └────┬─────┘     └────┬─────┘
         │                 │
         │    Add to Cart  │
         │◀────────────────┘
         │
         ▼
    ┌──────────┐
    │   CART   │
    │   PAGE   │
    └────┬─────┘
         │
         │ Proceed to Checkout
         │ (Authentication Required)
         ▼
    ┌──────────┐
    │ CHECKOUT │
    │   PAGE   │
    └────┬─────┘
         │
         │ Place Order
         │ (POST /api/checkout)
         ▼
    ┌──────────────────────────────────────────────────────────────────────────┐
    │                         ORDER CREATED IN SANITY                           │
    │  Status: pending / pending_payment / awaiting_bank_transfer              │
    │  Payment Status: pending                                                  │
    │  Idempotency Key: UUID                                                    │
    └────┬─────────────────────────────────────────────────────────────────────┘
         │
         │ Payment Method Selection
         ├─────────────────┬─────────────────┬─────────────────┬──────────────┐
         ▼                 ▼                 ▼                 ▼              ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   ┌────────┐
    │  Stripe  │    │ JazzCash │    │Easypaisa │    │   Bank   │   │  COD   │
    │  / Card  │    │  Wallet  │    │  Wallet  │    │ Transfer │   │        │
    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘   └───┬────┘
         │               │               │               │             │
         ▼               ▼               ▼               ▼             │
    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐       │
    │  Stripe  │    │JazzCash  │    │Easypaisa │    │  Upload  │       │
    │ Checkout │    │ Redirect │    │ Redirect │    │   Proof  │       │
    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘       │
         │               │               │               │             │
         ▼               ▼               ▼               ▼             │
    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐       │
    │  Stripe  │    │JazzCash  │    │Easypaisa │    │  Admin   │       │
    │  Webhook │    │ Callback │    │ Callback │    │  Verify  │       │
    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘       │
         │               │               │               │             │
         │ Success       │ Success       │ Success       │ Approved    │
         ▼               ▼               ▼               ▼             │
    ┌──────────────────────────────────────────────────────────────────┘
    │                        ORDER CONFIRMED                            │
    │  Status: processing                                               │
    │  Payment Status: completed                                        │
    └───────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │                     ADMIN PANEL MANAGEMENT                        │
    │  - View order details                                             │
    │  - Update status (processing → dispatched → delivered)           │
    │  - Verify payment (for bank transfer)                             │
    │  - Set delivery agent                                             │
    └───────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │                       ORDER COMPLETED                             │
    │  Status: completed                                                │
    │  Payment Status: completed                                        │
    │  Delivery Confirmed At: [timestamp]                               │
    └───────────────────────────────────────────────────────────────────┘
```

### 8.2 Payment Gateway Flow Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PAYMENT GATEWAY FLOWS                                 │
└─────────────────────────────────────────────────────────────────────────────┘

STRIPE FLOW:
────────────
  Checkout Page
       │
       │ POST /api/checkout/stripe
       ▼
  Create Stripe Session
       │
       │ Redirect to Stripe
       ▼
  ┌─────────────────┐
  │  Stripe Hosted  │
  │  Checkout Page  │
  └────────┬────────┘
           │
           │ Payment Success
           ▼
  ┌─────────────────┐
  │  Stripe Webhook │
  │  /api/stripe/   │
  │     webhook     │
  └────────┬────────┘
           │
           │ PATCH Order in Sanity
           ▼
  Update Order: paymentStatus = completed
       │
       │ Redirect to /checkout/success
       ▼
  Success Page


JAZZCASH / EASYPAISA FLOW:
──────────────────────────
  Checkout Page
       │
       │ POST /api/payment/{gateway}/initiate
       ▼
  Generate Payment Payload
  (with cryptographic hash)
       │
       │ Auto-submit Hidden Form
       ▼
  ┌─────────────────┐
  │  Gateway        │
  │  Payment Page   │
  └────────┬────────┘
           │
           │ POST to Callback URL
           ▼
  ┌─────────────────┐
  │  Callback API   │
  │  /api/payment/  │
  │  {gateway}/     │
  │  callback       │
  └────────┬────────┘
           │
           │ Verify Hash & Response Code
           ▼
  Update Order in Sanity
       │
       │ Redirect to /checkout/success
       ▼
  Success Page


BANK TRANSFER FLOW:
───────────────────
  Checkout Page
       │
       │ Order Created
       ▼
  Redirect to /checkout/bank-transfer
       │
       │ Display Bank Details
       ▼
  User Makes Bank Transfer
       │
       │ Upload Proof + Transaction ID
       ▼
  POST /api/payment/bank-transfer/submit
       │
       │ Upload Image to Sanity Assets
       ▼
  Update Order with Proof Image
       │
       │ Admin Manual Verification
       ▼
  Admin Reviews & Approves
       │
       │ Admin Updates Status
       ▼
  Order Marked as Paid


COD FLOW:
─────────
  Checkout Page
       │
       │ Order Created
       ▼
  Status: pending_payment
       │
       │ Admin Processes Order
       ▼
  Order Shipped
       │
       │ Cash Collection on Delivery
       ▼
  Admin Marks Payment Complete
       │
       ▼
  Order Completed
```

### 8.3 Admin Order Management Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ADMIN ORDER MANAGEMENT FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  Admin   │
    │  Login   │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │  Admin   │
    │Dashboard │
    └────┬─────┘
         │
         │ Navigate to Orders
         ▼
    ┌──────────────────────────────────────────────────────────────────────┐
    │                        ORDERS LIST VIEW                               │
    │                                                                       │
    │  Filters:                                                             │
    │  - Order Status (pending, processing, shipped, etc.)                 │
    │  - Payment Status (pending, completed, failed)                       │
    │  - Payment Method (Stripe, JazzCash, COD, etc.)                      │
    │                                                                       │
    │  Order Cards:                                                         │
    │  ┌─────────────────────────────────────────────────────────────────┐ │
    │  │ Customer Name | Total | Status Badge | Expand ▼                │ │
    │  └─────────────────────────────────────────────────────────────────┘ │
    └──────────────────────────────────────────────────────────────────────┘
         │
         │ Click to Expand
         ▼
    ┌──────────────────────────────────────────────────────────────────────┐
    │                      EXPANDED ORDER DETAILS                           │
    │                                                                       │
    │  ┌─────────────────────┐  ┌─────────────────────┐                    │
    │  │  Customer Details   │  │   Payment Details   │                    │
    │  │  - Name, Email      │  │   - Method          │                    │
    │  │  - Phone, Address   │  │   - Status          │                    │
    │  │  - City, ZIP        │  │   - Transaction ID  │                    │
    │  │  - Order Date       │  │   - Gateway         │                    │
    │  └─────────────────────┘  └─────────────────────┘                    │
    │                                                                       │
    │  Payment Timeline (if applicable):                                    │
    │  ┌─────────────────────────────────────────────────────────────────┐ │
    │  │ [Payment event logs in chronological order]                     │ │
    │  └─────────────────────────────────────────────────────────────────┘ │
    │                                                                       │
    │  Bank Transfer Proof (if applicable):                                 │
    │  ┌─────────────────────────────────────────────────────────────────┐ │
    │  │ [Screenshot of payment receipt]                                 │ │
    │  └─────────────────────────────────────────────────────────────────┘ │
    │                                                                       │
    │  Action Buttons:                                                      │
    │  ┌─────────────────────────────────────────────────────────────────┐ │
    │  │ [pending] [processing] [shipped] [dispatched] [delivered] ...   │ │
    │  └─────────────────────────────────────────────────────────────────┘ │
    │                                                                       │
    │  Delivery Agent Input:                                                │
    │  [________________________________] (Set when status = dispatched)   │
    │                                                                       │
    │  Payment Status Override:                                             │
    │  [pending] [completed] [failed]                                      │
    └──────────────────────────────────────────────────────────────────────┘
         │
         │ Click Status Button
         │
         ▼
    ┌──────────────────────────────────────────────────────────────────────┐
    │                      PATCH /api/admin/orders                         │
    │                                                                       │
    │  Request:                                                            │
    │  {                                                                   │
    │    "id": "order-123",                                                │
    │    "status": "dispatched",                                           │
    │    "deliveryAgent": "TCS Courier"                                    │
    │  }                                                                   │
    │                                                                       │
    │  Automated Hooks:                                                     │
    │  - If status = 'delivered':                                          │
    │      → paymentStatus = 'completed'                                   │
    │      → deliveryConfirmedAt = now                                     │
    │  - If status = 'dispatched' + deliveryAgent:                         │
    │      → deliveryAgent = provided value                                │
    └──────────────────────────────────────────────────────────────────────┘
         │
         │ Sanity Updated
         ▼
    ┌──────────────────────────────────────────────────────────────────────┐
    │                        ORDER REFRESHED                                │
    │                                                                       │
    │  Admin panel re-fetches orders to show updated state                 │
    └──────────────────────────────────────────────────────────────────────┘
```

---

## API Reference

### Checkout APIs

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/checkout` | POST | Create order in Sanity | No |
| `/api/checkout/stripe` | POST | Initiate Stripe checkout | No |
| `/api/stripe/webhook` | POST | Handle Stripe webhook events | No (signature verified) |

### Payment APIs

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/payment/jazzcash/initiate` | POST | Generate JazzCash payment payload | No |
| `/api/payment/jazzcash/callback` | POST | Handle JazzCash callback | No |
| `/api/payment/easypaisa/initiate` | POST | Generate Easypaisa payment payload | No |
| `/api/payment/easypaisa/callback` | POST | Handle Easypaisa callback | No |
| `/api/payment/bank-transfer/submit` | POST | Submit bank transfer proof | No |
| `/api/payment/cancel` | POST | Cancel order payment | No |

### Admin APIs

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/admin/orders` | GET | Fetch all orders | Yes (admin only) |
| `/api/admin/orders` | PATCH | Update order status | Yes (admin only) |
| `/api/admin/products` | GET | Fetch all products | Yes (admin only) |
| `/api/admin/products` | POST | Create product | Yes (admin only) |
| `/api/admin/products` | PATCH | Update product | Yes (admin only) |
| `/api/admin/categories` | GET | Fetch categories | Yes (admin only) |
| `/api/admin/discounts` | GET | Fetch discounts | Yes (admin only) |

---

## Database Schema Reference

### Order Schema

```typescript
{
  _type: 'order',
  _id: string,
  customer: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    zipCode: string
  },
  items: [{
    _key: string,
    product: { _ref: string }, // Reference to product document
    quantity: number,
    price: number
  }],
  totalPrice: number,
  status: 'pending' | 'pending_payment' | 'awaiting_bank_transfer' | 
          'processing' | 'paid' | 'shipped' | 'dispatched' | 
          'delivered' | 'completed' | 'cancelled',
  paymentMethod: string,
  paymentStatus: 'pending' | 'completed' | 'failed',
  transactionId: string,
  gateway: string,
  paymentTimestamp: string, // ISO 8601 datetime
  stripeSessionId: string,
  proofImage: {
    _type: 'image',
    asset: { _ref: string }
  },
  deliveryAgent: string,
  deliveryConfirmedAt: string, // ISO 8601 datetime
  orderDate: string, // ISO 8601 datetime
  createdAt: string, // ISO 8601 datetime
  idempotencyKey: string,
  paymentLogs: [{
    _key: string,
    gateway: string,
    eventType: string,
    transactionId: string,
    status: string,
    timestamp: string // ISO 8601 datetime
  }]
}
```

### Product Schema

```typescript
{
  _type: 'product',
  _id: string,
  title: string,
  slug: { current: string },
  description: string,
  productImage: {
    asset: { _ref: string }
  },
  price: number,
  tags: string[],
  discountPercentage: number,
  isNew: boolean,
  category: { _ref: string }, // Reference to category document
  sku: string
}
```

### Category Schema

```typescript
{
  _type: 'category',
  _id: string,
  name: string,
  slug: { current: string },
  image: {
    asset: { _ref: string }
  },
  description: string
}
```

### Discount Schema

```typescript
{
  _type: 'discount',
  _id: string,
  title: string,
  type: 'percentage' | 'fixed' | 'bulk',
  value: number,
  bulkThreshold: number, // Only for bulk type
  appliesTo: [{ _ref: string }], // References to products or categories
  activeRange: {
    startDate: string,
    endDate: string
  },
  isActive: boolean
}
```

---

## Appendix: Environment Variables

### Required Environment Variables

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JazzCash Configuration
JAZZCASH_MERCHANT_ID=MC12345
JAZZCASH_PASSWORD=your_password
JAZZCASH_INTEGERITY_SALT=your_salt
JAZZCASH_RETURN_URL=https://yourdomain.com/api/payment/jazzcash/callback

# Easypaisa Configuration
EASYPAISA_STORE_ID=store_id
EASYPAISA_HASH_KEY=hash_key
EASYPAISA_RETURN_URL=https://yourdomain.com/api/payment/easypaisa/callback

# Bank Transfer Configuration
NEXT_PUBLIC_BANK_NAME=Bank Name
NEXT_PUBLIC_BANK_ACCOUNT_TITLE=Account Title
NEXT_PUBLIC_BANK_ACCOUNT_NUMBER=1234567890
NEXT_PUBLIC_BANK_IBAN=PK00BANK00000000000000
NEXT_PUBLIC_BANK_BRANCH=Branch Name

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_admin_token

# Clerk Authentication (if used)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

---

**Document End**

This workflow report covers the complete eCommerce ordering process from user browsing through admin management. For implementation details, refer to the source code files mentioned throughout this document.
