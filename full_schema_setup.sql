-- =========================================================================
--                     Peptides Panama / PANAMA PEPTIDES
--                    COMPLETE DATABASE SCHEMA & PERMISSIONS
-- =========================================================================
-- Run this entire script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Guaranteed safe to run on fresh database OR existing database.

-- -------------------------------------------------------------------------
-- 0. EXTENSIONS & SETUP
-- -------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. BASE TABLE CREATIONS
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product TEXT NOT NULL,
    category TEXT NOT NULL,
    price_usd TEXT NOT NULL,
    price_crc TEXT,
    status TEXT NOT NULL DEFAULT 'In Stock',
    coa TEXT,
    image_url TEXT,
    emoji TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    is_superadmin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items JSONB NOT NULL,
    total_usd NUMERIC,
    total_crc NUMERIC,
    currency TEXT NOT NULL DEFAULT 'CRC',
    payment_method TEXT NOT NULL DEFAULT 'whatsapp',
    shipping_address TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customer_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  phone TEXT,
  locale TEXT NOT NULL DEFAULT 'es' CHECK (locale IN ('es', 'en')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  recipient_name TEXT NOT NULL,
  phone TEXT,
  country_code TEXT NOT NULL DEFAULT 'CR',
  province TEXT,
  canton TEXT,
  district TEXT,
  detailed_address TEXT NOT NULL,
  postal_code TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_es TEXT NOT NULL,
    excerpt_en TEXT,
    excerpt_es TEXT,
    content_en TEXT,
    content_es TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.catalog_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_round_robin_state (
  singleton BOOLEAN PRIMARY KEY DEFAULT true CHECK (singleton = true),
  last_agent_user_id UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  lang TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wa_id TEXT NOT NULL,
    display_name TEXT,
    message_text TEXT,
    message_type TEXT DEFAULT 'text',
    direction TEXT DEFAULT 'inbound',
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.live_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    sender_type TEXT DEFAULT 'visitor',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel TEXT DEFAULT 'general',
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    message TEXT NOT NULL,
    attachments JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.abandoned_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    items JSONB NOT NULL,
    total_usd NUMERIC,
    recovered BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customer_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.scheduled_broadcasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audience TEXT NOT NULL,
  custom_contacts TEXT,
  channels JSONB NOT NULL,
  message TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.notification_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'email',
    new_lead BOOLEAN DEFAULT true,
    new_order BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);


-- =========================================================================
-- 2. ENSURE ALL EXTENDED COLUMNS EXIST FOR ALL TABLES
-- =========================================================================

-- Products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price_usd TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price_crc TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_start_time TIMESTAMPTZ;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_end_time TIMESTAMPTZ;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description_es TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS free_bac_water_vials INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS promo_badge_en TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS promo_badge_es TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- Admin Profiles
ALTER TABLE public.admin_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.admin_profiles ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.admin_profiles ADD COLUMN IF NOT EXISTS lead_email_notifications BOOLEAN DEFAULT true;
ALTER TABLE public.admin_profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.admin_profiles ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'staff';
ALTER TABLE public.admin_profiles ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 0;

-- Orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_provider_status TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_authorization TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_descriptor TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_provider_response JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS whatsapp_wa_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id_type TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS sales_agent_id UUID;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;

-- Customer Profiles & Customer Addresses
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'es';

ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS customer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS label TEXT DEFAULT 'Home';
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS recipient_name TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'CR';
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS canton TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS detailed_address TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Product Reviews
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5;
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS comment TEXT;
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending';

-- Catalog Leads
ALTER TABLE public.catalog_leads ADD COLUMN IF NOT EXISTS lead_source TEXT;
ALTER TABLE public.catalog_leads ADD COLUMN IF NOT EXISTS qualification_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.catalog_leads ADD COLUMN IF NOT EXISTS consent_text TEXT;
ALTER TABLE public.catalog_leads ADD COLUMN IF NOT EXISTS consent_version TEXT;
ALTER TABLE public.catalog_leads ADD COLUMN IF NOT EXISTS assigned_agent_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL;
ALTER TABLE public.catalog_leads ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ;
ALTER TABLE public.catalog_leads ADD COLUMN IF NOT EXISTS response_due_at TIMESTAMPTZ;
ALTER TABLE public.catalog_leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- WhatsApp Messages
ALTER TABLE public.whatsapp_messages ADD COLUMN IF NOT EXISTS matched_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL;


-- =========================================================================
-- 3. FUNCTIONS & TRIGGERS
-- =========================================================================

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles profile
    WHERE profile.user_id = auth.uid()
      AND coalesce(lower(to_jsonb(profile)->>'status'), 'active') NOT IN ('pending', 'suspended')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.touch_customer_account_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS customer_profiles_touch_updated_at ON public.customer_profiles;
CREATE TRIGGER customer_profiles_touch_updated_at
BEFORE UPDATE ON public.customer_profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_customer_account_updated_at();

DROP TRIGGER IF EXISTS customer_addresses_touch_updated_at ON public.customer_addresses;
CREATE TRIGGER customer_addresses_touch_updated_at
BEFORE UPDATE ON public.customer_addresses
FOR EACH ROW EXECUTE FUNCTION public.touch_customer_account_updated_at();


-- =========================================================================
-- 4. DYNAMIC INDEXES & POLICIES SETUP (SAFE FROM PARSE ERRORS)
-- =========================================================================

DO $$
BEGIN
    -- Enable RLS on all tables
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.catalog_leads ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.lead_round_robin_state ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.whatsapp_leads ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.team_chat_messages ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.scheduled_broadcasts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;

    -- Drop legacy policies safely
    DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
    DROP POLICY IF EXISTS "Allow authenticated insert to products" ON public.products;
    DROP POLICY IF EXISTS "Allow authenticated update to products" ON public.products;
    DROP POLICY IF EXISTS "Allow authenticated delete to products" ON public.products;
    DROP POLICY IF EXISTS "admin_profiles_active_staff_read" ON public.admin_profiles;
    DROP POLICY IF EXISTS "orders_customer_read_own" ON public.orders;
    DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
    DROP POLICY IF EXISTS "Allow public insert access to orders" ON public.orders;
    DROP POLICY IF EXISTS "customer_profiles_read_own" ON public.customer_profiles;
    DROP POLICY IF EXISTS "customer_profiles_insert_own" ON public.customer_profiles;
    DROP POLICY IF EXISTS "customer_profiles_update_own" ON public.customer_profiles;
    DROP POLICY IF EXISTS "customer_profiles_admin_all" ON public.customer_profiles;
    DROP POLICY IF EXISTS "customer_addresses_own" ON public.customer_addresses;
    DROP POLICY IF EXISTS "customer_addresses_admin_all" ON public.customer_addresses;
    DROP POLICY IF EXISTS "Allow public insert access to reviews" ON public.product_reviews;
    DROP POLICY IF EXISTS "Allow public read access to approved reviews" ON public.product_reviews;
    DROP POLICY IF EXISTS "Allow authenticated read access to all reviews" ON public.product_reviews;
    DROP POLICY IF EXISTS "Allow authenticated update access to reviews" ON public.product_reviews;
    DROP POLICY IF EXISTS "Allow authenticated delete access to reviews" ON public.product_reviews;
    DROP POLICY IF EXISTS "Allow public read access to settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Allow authenticated write access to settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Allow public read access to published blogs" ON public.blogs;
    DROP POLICY IF EXISTS "Allow authenticated write access to blogs" ON public.blogs;
    DROP POLICY IF EXISTS "catalog_leads_anon_insert" ON public.catalog_leads;
    DROP POLICY IF EXISTS "catalog_leads_admin_all" ON public.catalog_leads;
    DROP POLICY IF EXISTS "whatsapp_leads_anon_insert" ON public.whatsapp_leads;
    DROP POLICY IF EXISTS "Allow anon insert to whatsapp_messages" ON public.whatsapp_messages;
    DROP POLICY IF EXISTS "Allow authenticated read access to whatsapp_messages" ON public.whatsapp_messages;
    DROP POLICY IF EXISTS "live_chat_anon_insert" ON public.live_chat_messages;
    DROP POLICY IF EXISTS "live_chat_anon_select" ON public.live_chat_messages;
    DROP POLICY IF EXISTS "live_chat_admin_all" ON public.live_chat_messages;
    DROP POLICY IF EXISTS "team_chat_admin_all" ON public.team_chat_messages;
    DROP POLICY IF EXISTS "abandoned_carts_anon_upsert" ON public.abandoned_carts;
    DROP POLICY IF EXISTS "inquiries_anon_insert" ON public.customer_inquiries;
    DROP POLICY IF EXISTS "inquiries_admin_all" ON public.customer_inquiries;
    DROP POLICY IF EXISTS "scheduled_broadcasts_admin" ON public.scheduled_broadcasts;
    DROP POLICY IF EXISTS "recipients_admin" ON public.notification_recipients;

    -- Products Policies
    EXECUTE 'CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Allow authenticated insert to products" ON public.products FOR INSERT TO authenticated WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Allow authenticated update to products" ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Allow authenticated delete to products" ON public.products FOR DELETE TO authenticated USING (true)';

    -- Admin Profiles Policy
    EXECUTE 'CREATE POLICY "admin_profiles_active_staff_read" ON public.admin_profiles FOR SELECT TO authenticated USING (public.is_admin_user())';

    -- Orders Policies & Index with Column Checks
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'customer_user_id') THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS orders_customer_user_created_idx ON public.orders (customer_user_id, created_at DESC) WHERE customer_user_id IS NOT NULL';
        EXECUTE 'CREATE POLICY "orders_customer_read_own" ON public.orders FOR SELECT TO authenticated USING (customer_user_id = auth.uid())';
    END IF;
    EXECUTE 'CREATE POLICY "orders_admin_all" ON public.orders FOR ALL TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user())';

    -- Customer Profiles Policies with Column Checks
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'customer_profiles' AND column_name = 'user_id') THEN
        EXECUTE 'CREATE POLICY "customer_profiles_read_own" ON public.customer_profiles FOR SELECT TO authenticated USING (user_id = auth.uid())';
        EXECUTE 'CREATE POLICY "customer_profiles_insert_own" ON public.customer_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid())';
        EXECUTE 'CREATE POLICY "customer_profiles_update_own" ON public.customer_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid())';
    END IF;
    EXECUTE 'CREATE POLICY "customer_profiles_admin_all" ON public.customer_profiles FOR ALL TO authenticated USING (public.is_admin_user())';

    -- Customer Addresses Policies with Column Checks
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'customer_addresses' AND column_name = 'customer_user_id') THEN
        EXECUTE 'CREATE POLICY "customer_addresses_own" ON public.customer_addresses FOR ALL TO authenticated USING (customer_user_id = auth.uid())';
    END IF;
    EXECUTE 'CREATE POLICY "customer_addresses_admin_all" ON public.customer_addresses FOR ALL TO authenticated USING (public.is_admin_user())';

    -- Reviews Policies with Column Checks
    EXECUTE 'CREATE POLICY "Allow public insert access to reviews" ON public.product_reviews FOR INSERT WITH CHECK (true)';
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'product_reviews' AND column_name = 'status') THEN
        EXECUTE 'CREATE POLICY "Allow public read access to approved reviews" ON public.product_reviews FOR SELECT USING (status = ''Approved'')';
    ELSE
        EXECUTE 'CREATE POLICY "Allow public read access to approved reviews" ON public.product_reviews FOR SELECT USING (true)';
    END IF;
    EXECUTE 'CREATE POLICY "Allow authenticated read access to all reviews" ON public.product_reviews FOR SELECT TO authenticated USING (true)';
    EXECUTE 'CREATE POLICY "Allow authenticated update access to reviews" ON public.product_reviews FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Allow authenticated delete access to reviews" ON public.product_reviews FOR DELETE TO authenticated USING (true)';

    -- Settings & Blogs Policies
    EXECUTE 'CREATE POLICY "Allow public read access to settings" ON public.site_settings FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Allow authenticated write access to settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true)';

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blogs' AND column_name = 'published') THEN
        EXECUTE 'CREATE POLICY "Allow public read access to published blogs" ON public.blogs FOR SELECT USING (published = true)';
    ELSE
        EXECUTE 'CREATE POLICY "Allow public read access to published blogs" ON public.blogs FOR SELECT USING (true)';
    END IF;
    EXECUTE 'CREATE POLICY "Allow authenticated write access to blogs" ON public.blogs FOR ALL TO authenticated USING (true) WITH CHECK (true)';

    -- Leads & Messages Policies
    EXECUTE 'CREATE POLICY "catalog_leads_anon_insert" ON public.catalog_leads FOR INSERT TO anon, authenticated WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "catalog_leads_admin_all" ON public.catalog_leads FOR ALL TO authenticated USING (public.is_admin_user())';

    EXECUTE 'CREATE POLICY "whatsapp_leads_anon_insert" ON public.whatsapp_leads FOR INSERT TO anon, authenticated WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Allow anon insert to whatsapp_messages" ON public.whatsapp_messages FOR INSERT WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Allow authenticated read access to whatsapp_messages" ON public.whatsapp_messages FOR SELECT TO authenticated USING (true)';

    EXECUTE 'CREATE POLICY "live_chat_anon_insert" ON public.live_chat_messages FOR INSERT TO anon, authenticated WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "live_chat_anon_select" ON public.live_chat_messages FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "live_chat_admin_all" ON public.live_chat_messages FOR ALL TO authenticated USING (public.is_admin_user())';

    EXECUTE 'CREATE POLICY "team_chat_admin_all" ON public.team_chat_messages FOR ALL TO authenticated USING (public.is_admin_user())';
    EXECUTE 'CREATE POLICY "abandoned_carts_anon_upsert" ON public.abandoned_carts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)';

    EXECUTE 'CREATE POLICY "inquiries_anon_insert" ON public.customer_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "inquiries_admin_all" ON public.customer_inquiries FOR ALL TO authenticated USING (public.is_admin_user())';

    EXECUTE 'CREATE POLICY "scheduled_broadcasts_admin" ON public.scheduled_broadcasts FOR ALL TO authenticated USING (public.is_admin_user())';
    EXECUTE 'CREATE POLICY "recipients_admin" ON public.notification_recipients FOR ALL TO authenticated USING (public.is_admin_user())';
END $$;


-- =========================================================================
-- 5. DEFAULT SEED DATA
-- =========================================================================

INSERT INTO public.site_settings (id, value) VALUES 
('landing_page', '{"bannerActive": false, "bannerTextEn": "Flash Sale: 10% Off All Peptides!", "bannerTextEs": "Oferta Relámpago: ¡10% de descuento en todos los péptidos!", "heroTitleEn": "Buy Peptides in panama", "heroTitleEs": "Compra Péptidos en panama", "heroSubEn": "Lab-Tested. High Purity. Fast Local Delivery.", "heroSubEs": "Testados en Laboratorio. Alta Pureza. Entrega Local Rápida.", "heroTextEn": "Your trusted local source for premium, research-grade peptides. Verified quality, transparent pricing, and secure checkout.", "heroTextEs": "Tu fuente local de confianza para péptidos premium de grado investigación. Calidad verificada, precios transparentes y pago seguro."}'::jsonb),
('exchange_rate', '{"base":"USD","quote":"CRC","usd_crc":454.48,"source":"schema-default","fetched_at":"2026-01-01T00:00:00.000Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lead_round_robin_state(singleton) VALUES (true) ON CONFLICT (singleton) DO NOTHING;


-- =========================================================================
-- 6. STORAGE BUCKETS & POLICIES
-- =========================================================================

INSERT INTO storage.buckets (id, name, public) VALUES 
('product-pics', 'product-pics', true),
('avatars', 'avatars', true),
('review-attachments', 'review-attachments', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Product Pics" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Product Pics" ON storage.objects;

CREATE POLICY "Public Read Product Pics" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('product-pics', 'avatars', 'review-attachments'));

CREATE POLICY "Admin Upload Product Pics" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id IN ('product-pics', 'avatars', 'review-attachments'));


-- =========================================================================
-- 7. ENABLE SUPABASE REALTIME REPLICATION
-- =========================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'orders') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'live_chat_messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_messages;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'team_chat_messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.team_chat_messages;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'catalog_leads') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.catalog_leads;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'whatsapp_messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_messages;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END;
$$;
