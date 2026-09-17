-- =============================================================================
-- CARTLY E-COMMERCE COMPLETE DATABASE SCHEMA (PostgreSQL / Supabase)
-- Realtime Order Synchronization, Multi-angle Assets Storage & Member Directory
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & MEMBERS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    gender TEXT DEFAULT 'all' CHECK (gender IN ('men', 'women', 'all')),
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT UNIQUE NOT NULL,
    brand TEXT NOT NULL DEFAULT 'Cartly Brand',
    description TEXT NOT NULL,
    subtitle TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2),
    category TEXT NOT NULL,
    subcategory TEXT,
    gender TEXT DEFAULT 'all',
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    images TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{"S", "M", "L", "XL"}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS (Supports 4 Exact Fulfillment Pipeline Stages + Client Verification Code)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    coupon_code TEXT,
    shipping_cost NUMERIC(10, 2) DEFAULT 0,
    tax_amount NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    -- 4 Exact Pipeline Stages: processing -> confirmed -> shipping -> arrived -> delivered
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'confirmed', 'shipping', 'arrived', 'delivered', 'cancelled')),
    verification_code TEXT NOT NULL DEFAULT ('VFY-' || FLOOR(100000 + RANDOM() * 900000)::TEXT),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_gateway TEXT DEFAULT 'razorpay',
    payment_id TEXT,
    tracking_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER ITEMS (Contains all 5 product photos, brand, and size selection)
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT,
    product_name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT 'Cartly Brand',
    category TEXT,
    subcategory TEXT,
    size TEXT DEFAULT 'M',
    sku TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    images TEXT[] DEFAULT '{}',
    variant_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMER DIRECTORY
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar TEXT,
    address TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    joined_date DATE DEFAULT CURRENT_DATE,
    last_order_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TERMINATED USERS (Permanent Access Revocation List)
CREATE TABLE IF NOT EXISTS public.terminated_users (
    email TEXT PRIMARY KEY,
    reason TEXT DEFAULT 'Permanently terminated by store administrator',
    terminated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    user_email TEXT DEFAULT 'system@cartly.com',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terminated_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access for public clients & store front
CREATE POLICY "Public read access for products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access for reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public read access for orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public read access for order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Public read access for customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Public read access for terminated_users" ON public.terminated_users FOR SELECT USING (true);
CREATE POLICY "Public read access for audit_logs" ON public.audit_logs FOR SELECT USING (true);

-- Allow insert/update for store management & checkout
CREATE POLICY "Public insert access for orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public insert access for order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public manage access for products" ON public.products FOR ALL USING (true);
CREATE POLICY "Public manage access for customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Public manage access for terminated_users" ON public.terminated_users FOR ALL USING (true);
CREATE POLICY "Public insert access for audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- =============================================================================
-- SUPABASE REALTIME CONFIGURATION (Zero-Latency WebSockets)
-- =============================================================================
-- Enable publication for realtime streaming
BEGIN;
  -- Drop existing publications if any to avoid errors
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.orders,
    public.products,
    public.customers;
COMMIT;

-- Set replica identity to full so old records are sent along with updates
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.customers REPLICA IDENTITY FULL;

-- =============================================================================
-- SUPABASE STORAGE BUCKETS (Product photos, Avatars, Banners)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage public policies
CREATE POLICY "Public Access to product-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Public Upload to product-images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public Update to product-images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'product-images');
