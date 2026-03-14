# Payment Gateway Configuration Guide

This guide details how to configure the newly integrated payment gateways for your eCommerce store.

## 1. Environment Variables

Add the following keys to your `.env` or `.env.local` file in the root of your project:

```env
# Stripe Setup
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# JazzCash API Setup (For future explicit integration)
JAZZCASH_MERCHANT_ID=your_merchant_id
JAZZCASH_PASSWORD=your_password
JAZZCASH_INTEGRITY_SALT=your_integrity_salt

# Easypaisa API Setup (For future explicit integration)
EASYPAISA_STORE_ID=your_store_id
EASYPAISA_HASH_KEY=your_hash_key
```

## 2. Setting Up Each Payment Method

### Stripe (Credit / Debit Cards)
1. Sign up / Log in to your [Stripe Dashboard](https://dashboard.stripe.com/).
2. Navigate to **Developers > API keys**.
3. Copy your "Publishable key" and "Secret key" into your `.env.local` file.
4. If you wish to handle webhooks for confirming successful payments automatically, you'll need to set up a webhook endpoint to listen for `checkout.session.completed` events and update the Sanity order `paymentStatus` to `completed`.

### JazzCash & Easypaisa
Right now, the front-end allows the user to select **JazzCash** or **Easypaisa** during checkout. The order is created in Sanity with status `"Pending Payment"`. 
To fully implement the direct mobile wallet API, you need:
1. Register for merchant portals for [JazzCash](https://sandbox.jazzcash.com.pk/) and [Easypaisa](https://easypay.easypaisa.com.pk/).
2. Request API credentials from their respective support teams.
3. Integrate real-time payment redirects using their APIs similar to how we configured the Stripe API route ([api/checkout/stripe/route.ts](file:///d:/MD%20Brothers/src/app/api/checkout/stripe/route.ts)). You can then mark the `paymentStatus` as `completed` automatically.

### Cash on Delivery (COD) & Direct Bank Transfer
No external APIs are required. 
- **Bank Transfer:** Ensure you provide your users to your actual bank account details on the checkout page or the order confirmation email.
- The order status in Sanity is captured appropriately:
  - COD: "Pending Payment"
  - Bank Transfer: "Awaiting Bank Transfer"

## 3. Testing Flow

1. **Credit Card Payments:** Use Stripe's generic test card numbers (e.g. `4242 4242 4242 4242`) in Test Mode on the Stripe Checkout page to test end-to-end functionality.
2. Verify that orders successfully appear in the Sanity Studio dashboard.
3. Check the `status`, `paymentMethod`, and `paymentStatus` fields in the order details to ensure accurate logging.
