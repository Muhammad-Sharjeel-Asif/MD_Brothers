# Sanity CMS Integration Analysis Report

**Project:** MD Brothers eCommerce  
**Analysis Date:** March 16, 2026  
**Report Type:** Sanity CMS Integration Audit

---

## Executive Summary

This report documents the findings of a comprehensive analysis of the Sanity CMS integration in the MD Brothers eCommerce project. The investigation was triggered by confusion over products still appearing on the website after creating a new Sanity project and updating environment variables.

**Key Finding:** The website frontend is connected to the **OLD Sanity project** via hardcoded credentials, while the admin panel connects to the **NEW Sanity project** via environment variables. This dual-configuration explains why products added through the admin panel do not appear on the website.

---

## 1. Current Sanity Connection Status

### Dual Configuration Detected

The project has **TWO separate Sanity configurations** operating simultaneously:

| Configuration | Location | Project ID | Dataset | API Token Source | Status |
|--------------|----------|------------|---------|------------------|--------|
| **Environment-based** | `src/sanity/env.ts`, `sanity.config.ts`, `sanity.cli.ts` | From `.env.local` | From `.env.local` | `SANITY_API_TOKEN` env var | ✅ Used by Admin Panel & Studio |
| **Hardcoded** | Multiple product query components | `2srh4ekv` | `productions` | Hardcoded string | ❌ Used by Website Frontend |

### Environment Variables Configuration

Expected configuration in `.env.local`:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
```

### Hardcoded Credentials Found

The following hardcoded values were discovered in multiple frontend components:

```javascript
projectId: '2srh4ekv'
dataset: 'productions'
token: 'skz6lWFJkAgpfrjXgwK8Tb6UBsTpRcSwzsQawON5Qps118XQdODrtVLdyXySTgJqC7rhPUKAOzb9prGs2aORcV0IICFN6pLKCLW2G0P7u5rExc8E92fzYp0UMuro6VpCzm51svtpWMCniHWaEiZAeJApDrYyIXgO5Uar4GLM2QPxFsswwZnU'
```

> ⚠️ **Security Warning:** The API token is exposed in client-side code, which is a significant security vulnerability.

---

## 2. Reason Products Are Still Visible

### ⚠️ ROOT CAUSE IDENTIFIED

**Products still appear because the website frontend is NOT using your new Sanity project configuration.** Instead, it uses **hardcoded credentials** pointing to the OLD Sanity project (`2srh4ekv`).

When you updated the environment variables, you only changed the configuration for:
- Sanity Studio (`sanity.config.ts`)
- Sanity CLI (`sanity.cli.ts`)
- Admin Panel API routes (`src/sanity/lib/adminClient.ts`)
- Product detail page (`src/app/[slug]/page.tsx`)

The following frontend components **still connect to the OLD project**:

| File | Component | Lines | Purpose |
|------|-----------|-------|---------|
| `src/app/query/Homeproducts/page.tsx` | Homepage products | 9-14 | Displays 8 products on homepage |
| `src/app/query/Products/page.tsx` | Shop page products | 10-15 | Displays all products on shop page |
| `src/app/query/Asgaardproduct/page.tsx` | Related products | 8-13 | Displays 4 related products |
| `src/app/search/page.tsx` | Search functionality | 15-20 | Product search feature |

### Why This Matters

1. Products added via the Admin Panel are saved to the **NEW** Sanity project (via environment variables)
2. The website homepage and shop page fetch from the **OLD** Sanity project (via hardcoded credentials)
3. Result: New products never appear on the website

---

## 3. Data Source Being Used by the Website

### Current Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEBSITE FRONTEND                              │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Homeproducts│  │  Products   │  │   Asgaardproduct        │  │
│  │   (Home)    │  │   (Shop)    │  │  (Related Products)     │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                      │                │
│         └────────────────┼──────────────────────┘                │
│                          │                                       │
│                          ▼                                       │
│         ┌────────────────────────────────┐                       │
│         │  HARDCODED Sanity Client       │                       │
│         │  Project ID: 2srh4ekv          │                       │
│         │  Dataset: productions          │                       │
│         │  Token: skz6lWFJkAgp...        │                       │
│         │  useCdn: true                  │                       │
│         └────────────────┬───────────────┘                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │   OLD Sanity Project            │
         │   (2srh4ekv / productions)      │
         │   Contains existing products    │
         │   Products visible on website   │
         └─────────────────────────────────┘
```

### Admin Panel Data Flow (Separate Pipeline)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN PANEL                                   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  /api/admin/products                                    │    │
│  │  /api/admin/products/[id]                               │    │
│  │  /api/admin/reports                                     │    │
│  │  /admin/products/new                                    │    │
│  │  /admin/products/[id]/edit                              │    │
│  └─────────────────────┬───────────────────────────────────┘    │
│                        │                                        │
│                        ▼                                        │
│         ┌────────────────────────────────┐                      │
│         │  adminClient.ts                │                      │
│         │  Uses: process.env variables   │                      │
│         │  Project ID: From .env.local   │                      │
│         │  Dataset: From .env.local      │                      │
│         │  Token: SANITY_API_TOKEN       │                      │
│         │  useCdn: false                 │                      │
│         └────────────────┬───────────────┘                      │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │   NEW Sanity Project            │
         │   (From .env.local)             │
         │   Your newly created project    │
         │   Products NOT visible on site  │
         └─────────────────────────────────┘
```

### Product Detail Page (Hybrid Behavior)

The product detail page (`src/app/[slug]/page.tsx`) uses the **correct** client:

```typescript
import { client } from '../../sanity/lib/client';  // ✅ Uses environment variables
```

This means:
- Products from the NEW project CAN be viewed if you navigate directly to their slug
- But they will never appear in the homepage or shop product listings

---

## 4. Product Data Flow Analysis

### Complete Data Flow Trace

```
Sanity CMS → API → Query → Data Fetch → Product Components → Website
```

### Sanity Schema Files

| File | Path | Purpose |
|------|------|---------|
| Product Schema | `src/sanity/schemaTypes/product.ts` | Defines product document structure with fields: title, slug, description, productImage, price, tags, discountPercentage, isNew, category, sku |
| Category Schema | `src/sanity/schemaTypes/category.ts` | Defines category document structure |
| Order Schema | `src/sanity/schemaTypes/order.ts` | Defines order document structure |
| Discount Schema | `src/sanity/schemaTypes/discount.ts` | Defines discount document structure |
| Schema Index | `src/sanity/schemaTypes/index.ts` | Exports all schema types |

### Sanity Client Configuration Files

| File | Purpose | Configuration Source | Used By |
|------|---------|---------------------|---------|
| `src/sanity/lib/client.ts` | Public read-only client | Environment variables | Product detail page |
| `src/sanity/lib/adminClient.ts` | Admin client with write permissions | Environment variables + SANITY_API_TOKEN | Admin panel API routes |
| `src/sanity/lib/live.ts` | Live content API for real-time updates | Environment variables | Not actively used |
| `src/sanity/env.ts` | Environment variable validation | `process.env` | All client configurations |

### GROQ Queries Used

#### Homepage Products (8 items)
```groq
*[_type == "product"] [0...8] {
  _id,
  title,
  price,
  description,
  discountPercentage,
  "imageUrl": productImage.asset->url,
  tags,
  "categoryName": category->name
}
```

#### Shop Products (All with pagination)
```groq
*[_type == "product"] | order(_createdAt desc) {
  _id, title, price, description, discountPercentage,
  "imageUrl": productImage.asset->url,
  tags,
  "categoryName": category->name,
  "slug": slug.current,
  _createdAt
}
```

#### Related Products (4 items)
```groq
*[_type == "product"] [0...4] {
  _id,
  title,
  price,
  description,
  discountPercentage,
  "imageUrl": productImage.asset->url,
  tags
}
```

#### Product Detail (Single by slug)
```groq
*[_type=='product' && slug.current=="${slug}"]{
  _id,
  title,
  price,
  description,
  "imageUrl": productImage.asset->url,
}[0]
```

#### Admin Products (All with full details)
```groq
*[_type == "product"] | order(_createdAt desc) {
  _id,
  title,
  price,
  description,
  "imageUrl": productImage.asset->url,
  tags,
  dicountPercentage,
  isNew,
  "categoryName": category->name,
  "categoryId": category->_id,
  sku,
  "slug": slug.current,
  _createdAt
}
```

### Product Fetching Components

#### Using Hardcoded Credentials (❌ Problem)

| File | Component | Query Type | Impact |
|------|-----------|------------|--------|
| `src/app/query/Homeproducts/page.tsx` | Homepage | `*[_type == "product"][0...8]` | Homepage shows old products |
| `src/app/query/Products/page.tsx` | Shop | `*[_type == "product"] \| order(_createdAt desc)` | Shop shows old products |
| `src/app/query/Asgaardproduct/page.tsx` | Related | `*[_type == "product"][0...4]` | Related products from old project |
| `src/app/search/page.tsx` | Search | Custom search queries | Search queries old project |

#### Using Environment Variables (✅ Correct)

| File | Component | Query Type | Impact |
|------|-----------|------------|--------|
| `src/app/[slug]/page.tsx` | Product Detail | Single product by slug | Detail page uses new project |
| `src/app/api/admin/products/route.ts` | Admin API | All products | Admin panel uses new project |

### API Routes Using Sanity

| Route | Method | Purpose | Client Used | Data Source |
|-------|--------|---------|-------------|-------------|
| `GET /api/admin/products` | GET | List all products | `adminClient` | NEW project |
| `POST /api/admin/products` | POST | Create product | `adminClient` | NEW project |
| `GET /api/admin/products/[id]` | GET | Get single product | `adminClient` | NEW project |
| `PUT /api/admin/products/[id]` | PUT | Update product | `adminClient` | NEW project |
| `DELETE /api/admin/products/[id]` | DELETE | Delete product | `adminClient` | NEW project |
| `GET /api/admin/reports` | GET | Analytics data | `adminClient` | NEW project |
| `POST /api/checkout/stripe` | POST | Stripe payment | `adminClient` | NEW project |
| `POST /api/payment/jazzcash/initiate` | POST | JazzCash payment | `adminClient` | NEW project |
| `POST /api/payment/easypaisa/initiate` | POST | EasyPaisa payment | `adminClient` | NEW project |

---

## 5. Admin Panel → Website Integration Status

### Pipeline Implementation Status

```
Admin Panel → Sanity CMS → Website Product Listing
     │              │              │
     │              │              │
     ▼              ▼              ▼
  ✅ Working   ✅ Working    ⚠️ PARTIALLY BROKEN
 (adminClient) (new project)  (hardcoded client)
```

### Component-by-Component Status

| Component | Status | Details |
|-----------|--------|---------|
| **Sanity Studio** | ✅ Complete | Available at `/studio`, uses environment variables |
| **Admin Panel UI** | ✅ Complete | Available at `/admin`, full CRUD interface |
| **Admin API Routes** | ✅ Complete | RESTful API for product management |
| **Product Schema** | ✅ Complete | All required fields defined |
| **Category Schema** | ✅ Complete | Reference relationships working |
| **Order Schema** | ✅ Complete | Order tracking implemented |
| **Discount Schema** | ✅ Complete | Discount management available |
| **Admin → Sanity (Write)** | ✅ Complete | Uses `adminClient` with environment variables |
| **Website → Sanity (Read)** | ⚠️ Split | Mixed: some use env vars, most use hardcoded credentials |

### What Works ✅

1. **Sanity Studio Access**
   - Studio is mounted at `/studio`
   - Connects to NEW Sanity project
   - Full content management capabilities

2. **Admin Panel Operations**
   - Create products at `/admin/products/new`
   - Edit products at `/admin/products/[id]/edit`
   - Delete products
   - View all products at `/admin/products`
   - Manage categories, orders, discounts
   - View reports at `/admin/reports`

3. **Data Persistence**
   - Products are correctly saved to NEW Sanity project
   - All CRUD operations functional
   - Image uploads working
   - Category references working

4. **Product Detail Page**
   - Individual product pages fetch from NEW project
   - Direct navigation to product slugs works

### What Does NOT Work ❌

1. **Homepage Product Display**
   - Products added via admin panel do NOT appear on homepage
   - Homepage fetches from OLD project (`2srh4ekv`)

2. **Shop Page Product Display**
   - Products added via admin panel do NOT appear on shop page
   - Shop page fetches from OLD project (`2srh4ekv`)

3. **Search Functionality**
   - Search queries OLD project only
   - New products are not searchable

4. **Related Products**
   - Related products section shows products from OLD project
   - No connection to newly added products

### Integration Gap Summary

| Integration Point | Status | Gap Description |
|-------------------|--------|-----------------|
| Admin → Sanity CMS | ✅ Working | Products saved correctly to new project |
| Sanity CMS → Homepage | ❌ Broken | Homepage uses hardcoded old project |
| Sanity CMS → Shop Page | ❌ Broken | Shop page uses hardcoded old project |
| Sanity CMS → Search | ❌ Broken | Search uses hardcoded old project |
| Sanity CMS → Product Detail | ✅ Working | Detail page uses correct client |
| Sanity CMS → Related Products | ❌ Broken | Related products use hardcoded old project |

---

## 6. Missing Implementation / Issues

### Critical Issues

| Issue | Severity | Files Affected | Security Risk |
|-------|----------|----------------|---------------|
| Hardcoded Sanity credentials | 🔴 Critical | 4 files | High |
| Dual Sanity project connection | 🔴 Critical | Entire frontend | Medium |
| Environment variables ignored by frontend | 🔴 Critical | Product listing pages | Low |
| API token exposed in client code | 🔴 Critical | 4 files | **Critical** |

### Files Requiring Attention

#### 1. `src/app/query/Homeproducts/page.tsx` (Lines 9-14)

**Current Code:**
```typescript
const sanity = sanityClient({
  projectId: '2srh4ekv',
  dataset: 'productions',
  token: 'skz6lWFJkAgpfrjXgwK8Tb6UBsTpRcSwzsQawON5Qps118XQdODrtVLdyXySTgJqC7rhPUKAOzb9prGs2aORcV0IICFN6pLKCLW2G0P7u5rExc8E92fzYp0UMuro6VpCzm51svtpWMCniHWaEiZAeJApDrYyIXgO5Uar4GLM2QPxFsswwZnU',
  useCdn: true,
});
```

**Problem:** Creates separate Sanity client with hardcoded credentials instead of importing from `src/sanity/lib/client.ts`

**Impact:** Homepage displays products from OLD Sanity project

---

#### 2. `src/app/query/Products/page.tsx` (Lines 10-15)

**Current Code:**
```typescript
const sanity = sanityClient({
  projectId: "2srh4ekv",
  dataset: "productions",
  token: "skz6lWFJkAgpfrjXgwK8Tb6UBsTpRcSwzsQawON5Qps118XQdODrtVLdyXySTgJqC7rhPUKAOzb9prGs2aORcV0IICFN6pLKCLW2G0P7u5rExc8E92fzYp0UMuro6VpCzm51svtpWMCniHWaEiZAeJApDrYyIXgO5Uar4GLM2QPxFsswwZnU",
  useCdn: true,
});
```

**Problem:** Creates separate Sanity client with hardcoded credentials instead of importing from `src/sanity/lib/client.ts`

**Impact:** Shop page displays products from OLD Sanity project

---

#### 3. `src/app/query/Asgaardproduct/page.tsx` (Lines 8-13)

**Current Code:**
```typescript
const sanity = sanityClient({
    projectId: '2srh4ekv',
    dataset: 'productions',
    token: 'skz6lWFJkAgpfrjXgwK8Tb6UBsTpRcSwzsQawON5Qps118XQdODrtVLdyXySTgJqC7rhPUKAOzb9prGs2aORcV0IICFN6pLKCLW2G0P7u5rExc8E92fzYp0UMuro6VpCzm51svtpWMCniHWaEiZAeJApDrYyIXgO5Uar4GLM2QPxFsswwZnU',
    useCdn: true,
});
```

**Problem:** Creates separate Sanity client with hardcoded credentials instead of importing from `src/sanity/lib/client.ts`

**Impact:** Related products section displays products from OLD Sanity project

---

#### 4. `src/app/search/page.tsx` (Lines 15-20)

**Current Code:**
```typescript
const client = sanityClient({
  projectId: "2srh4ekv",
  dataset: "productions",
  token: "skz6lWFJkAgpfrjXgwK8Tb6UBsTpRcSwzsQawON5Qps118XQdODrtVLdyXySTgJqC7rhPUKAOzb9prGs2aORcV0IICFN6pLKCLW2G0P7u5rExc8E92fzYp0UMuro6VpCzm51svtpWMCniHWaEiZAeJApDrYyIXgO5Uar4GLM2QPxFsswwZnU",
  useCdn: true,
});
```

**Problem:** Creates separate Sanity client with hardcoded credentials instead of importing from `src/sanity/lib/client.ts`

**Impact:** Search functionality queries OLD Sanity project

---

### Architecture Issues

#### 1. Inconsistent Client Usage

The project has a properly configured client at `src/sanity/lib/client.ts`:

```typescript
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
```

However, this centralized client is **not being used** by the product listing components.

#### 2. Security Vulnerability

The Sanity API token with **write permissions** is exposed in client-side code:
- Token is visible in browser DevTools
- Token is included in client-side JavaScript bundles
- Anyone can extract this token and potentially modify content

**Best Practice:** API tokens should only be used server-side (API routes, server components)

#### 3. No Centralized Configuration

Each component creates its own Sanity client instance:
- Code duplication
- Maintenance overhead
- Inconsistent behavior
- Configuration drift risk

#### 4. Missing Environment Variable Usage

The `src/sanity/env.ts` file properly validates and exports environment variables:

```typescript
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-18'
export const dataset = assertValue(process.env.NEXT_PUBLIC_SANITY_DATASET, 'Missing...')
export const projectId = assertValue(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 'Missing...')
```

But these are only used by:
- `src/sanity/lib/client.ts`
- `src/sanity/lib/adminClient.ts`
- `sanity.config.ts`
- `sanity.cli.ts`

---

## 7. Conclusion

### Summary

**The website IS connected to Sanity CMS, but NOT to your NEW Sanity project.**

The products you see on the website are coming from your **OLD Sanity project** (`2srh4ekv` / `productions`) because the frontend product-listing components have **hardcoded credentials** that bypass the environment variable configuration.

### Why Products Still Appear After Switching Projects

1. ✅ You created a NEW Sanity project and updated `.env.local`
2. ✅ The environment variables are correctly configured
3. ✅ Sanity Studio and Admin Panel use the NEW project
4. ❌ The main product listing pages (Home, Shop, Search) use **hardcoded credentials** pointing to the OLD project
5. ❌ Therefore, products added to the NEW Sanity project via the admin panel will NOT appear on the website homepage or shop page

### Data Source Summary Table

| Page/Component | Client Used | Data Source | Sanity Project |
|----------------|-------------|-------------|----------------|
| Homepage (`/`) | Hardcoded inline client | `src/app/query/Homeproducts/page.tsx` | OLD (`2srh4ekv`) |
| Shop (`/shop`) | Hardcoded inline client | `src/app/query/Products/page.tsx` | OLD (`2srh4ekv`) |
| Search (`/search`) | Hardcoded inline client | `src/app/search/page.tsx` | OLD (`2srh4ekv`) |
| Product Detail (`/[slug]`) | `client.ts` | `src/sanity/lib/client.ts` | NEW (from `.env.local`) |
| Admin Panel (`/admin`) | `adminClient.ts` | `src/sanity/lib/adminClient.ts` | NEW (from `.env.local`) |
| Sanity Studio (`/studio`) | `sanity.config.ts` | Environment variables | NEW (from `.env.local`) |
| Related Products | Hardcoded inline client | `src/app/query/Asgaardproduct/page.tsx` | OLD (`2srh4ekv`) |
| API Routes | `adminClient.ts` | `src/sanity/lib/adminClient.ts` | NEW (from `.env.local`) |

### Verification Steps

To verify which Sanity project is being used:

1. **Check Homepage/Shop:**
   - Open browser DevTools → Network tab
   - Navigate to homepage or shop
   - Look for Sanity API requests
   - Check the `projectId` in the request URL

2. **Check Admin Panel:**
   - Open `/admin/products`
   - Add a new test product
   - Check which Sanity project contains the new product (use Sanity Vision tool or manage.sanity.io)
   - Refresh homepage/shop
   - New product will NOT appear (proves different data sources)

3. **Check Product Detail:**
   - Navigate to a product detail page from the admin panel
   - The product will display correctly (uses NEW project)
   - But it won't appear in related products (uses OLD project)

### Recommendations

#### Immediate Actions Required

1. **Replace hardcoded clients** in the four identified files with imports from `src/sanity/lib/client.ts`

2. **Remove exposed API token** from client-side code (tokens should only be used server-side)

3. **Update all Sanity queries** to use the centralized client

#### Long-term Improvements

1. **Implement TypeScript interfaces** for all Sanity document types

2. **Add Sanity webhook** for ISR revalidation when content changes

3. **Consider using Live Content API** (`sanityFetch` from `next-sanity`) for real-time updates

4. **Add environment variable validation** at application startup

5. **Document Sanity schema** for future maintenance

---

## Appendix A: File Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `.env.example` | Template for environment variables |
| `sanity.config.ts` | Sanity Studio configuration |
| `sanity.cli.ts` | Sanity CLI configuration |
| `src/sanity/env.ts` | Environment variable validation and exports |
| `src/sanity/lib/client.ts` | Public read-only Sanity client |
| `src/sanity/lib/adminClient.ts` | Admin Sanity client with write permissions |
| `src/sanity/lib/live.ts` | Live Content API configuration |

### Schema Files

| File | Purpose |
|------|---------|
| `src/sanity/schemaTypes/product.ts` | Product document schema |
| `src/sanity/schemaTypes/category.ts` | Category document schema |
| `src/sanity/schemaTypes/order.ts` | Order document schema |
| `src/sanity/schemaTypes/discount.ts` | Discount document schema |
| `src/sanity/schemaTypes/index.ts` | Schema type exports |

### Component Files (Hardcoded - Need Fix)

| File | Purpose |
|------|---------|
| `src/app/query/Homeproducts/page.tsx` | Homepage product listing |
| `src/app/query/Products/page.tsx` | Shop page product listing |
| `src/app/query/Asgaardproduct/page.tsx` | Related products component |
| `src/app/search/page.tsx` | Search functionality |

### Component Files (Correct - Using Env Vars)

| File | Purpose |
|------|---------|
| `src/app/[slug]/page.tsx` | Product detail page |
| `src/app/api/admin/products/route.ts` | Admin products API |
| `src/app/api/admin/products/[id]/route.ts` | Admin single product API |
| `src/app/api/admin/reports/route.ts` | Admin reports API |

---

## Appendix B: Sanity Project Comparison

| Attribute | OLD Project | NEW Project |
|-----------|-------------|-------------|
| Project ID | `2srh4ekv` | From `.env.local` |
| Dataset | `productions` | `production` (note: singular) |
| Used By | Homepage, Shop, Search, Related Products | Admin Panel, Studio, Product Detail |
| Contains | Existing products visible on website | New products (not visible on website) |
| API Token | Hardcoded in source | From `SANITY_API_TOKEN` env var |

---

**Report End**

---

*This report was generated through automated analysis of the codebase. No code modifications were made during this analysis.*
