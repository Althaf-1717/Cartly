# CARTLY — Production E-Commerce Platform

Cartly is a modern, high-performance commerce platform built with **Next.js (App Router, JavaScript)**, **React**, **Tailwind CSS**, **Framer Motion & GSAP animations**, **Supabase / PostgreSQL**, and **Razorpay** payment gateway integration.

---

## 🌟 Key Features

### 🛍️ Public Storefront & Discovery
- **Brand Intro Reveal**: Smooth animated Cartly logo splash screen using Framer Motion.
- **Hero & Promotional Banners**: Interactive banners and discount alerts with promotional code integration (`CARTLY20`, `WELCOME10`).
- **Interactive Product Catalog**: Real-time faceted filtering by category, price slider, brand, rating, and in-stock status.
- **Instant Search**: Debounced search with dropdown previews.
- **Product Details**: Multi-image hover zoom gallery, variant selector (colors, sizes, SKUs), verified reviews submission, and related recommendations.

### 🛒 Cart & Multi-Step Checkout
- **Animated Cart Drawer**: Slide-over drawer with free shipping progress bar, promo code validation, and instant price breakdown.
- **Persistent Cart & Wishlist**: Syncs across sessions.
- **Razorpay Payment Gateway**: Multi-step checkout with server-side signature verification and sandbox testing mode.
- **Celebration Confirmation**: Confetti animation and live order tracking ID.

### 👤 Customer Experience
- **Order Tracking**: Visual status timeline (`Order Placed` ➔ `Payment Verified` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
- **Address Book & Profile**: Manage saved delivery locations.
- **Role Switcher**: Seamless 1-click switcher between Customer and Admin modes.

### ⚡ Admin Command Center (`/admin`)
- **Executive KPI Analytics**: Total revenue, orders count, AOV, low stock alerts, and interactive Recharts sales velocity graphs.
- **Product Management**: Full CRUD operations with multi-image previews, variant manager, SKU generation, pricing, stock levels, and SEO fields.
- **Category & Brand Architecture**: Manage catalog taxonomy with custom slugs.
- **Order Fulfillment Center**: Update order statuses, assign courier tracking numbers (AWB), and inspect customer line items.
- **Promotions & Coupons**: Create discount codes with percentage or flat deductions, minimum cart spend limits, and toggles.
- **Customer Directory**: View customer spend history and account statuses.
- **Audit & Security Logs**: Real-time log of administrative updates.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to browse the store or `http://localhost:3000/admin` for the admin portal.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🔑 Admin Access
- **Email:** `althafshaik1717@gmail.com`
- **Password:** `Althaf@7727`
- **Phone:** `9398870585`
- **Role:** Administrator (full access to `/admin` console and management features)

---

## 🗄️ Database Schema & Supabase Setup

The complete PostgreSQL DDL schema is located in `lib/db/schema.sql`. You can execute this schema directly in the Supabase SQL Editor to initialize tables, relations, and indexes.
