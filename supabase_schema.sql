-- Supabase SQL Schema for GeeGee Designs

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  details TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  is_handmade BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Categories Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON categories;
DROP POLICY IF EXISTS "Only authenticated users can modify categories" ON categories;
DROP POLICY IF EXISTS "Public categories are viewable by everyone." ON categories;
DROP POLICY IF EXISTS "Enable all operations for development" ON categories;

CREATE POLICY "Public categories are viewable by everyone." 
ON categories FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can modify categories" 
ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Products Policies
DROP POLICY IF EXISTS "Public products are viewable by everyone." ON products;
DROP POLICY IF EXISTS "Authenticated users can view all products." ON products;
DROP POLICY IF EXISTS "Only authenticated users can modify products" ON products;
DROP POLICY IF EXISTS "Enable all operations for development" ON products;

CREATE POLICY "Public products are viewable by everyone." 
ON products FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can modify products" 
ON products FOR ALL USING (auth.role() = 'authenticated');

-- 4. Create Storage Bucket (Optional, run these to enable file uploads)
-- Note: You can also create this manually in the Supabase Dashboard under Storage.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for product-media bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Only authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Only authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Only authenticated users can delete" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-media');

CREATE POLICY "Only authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-media' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-media' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-media' AND auth.role() = 'authenticated');

-- 5. Create Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Shop Collection',
  cta_link TEXT DEFAULT '/shop',
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Banners Table
CREATE TABLE IF NOT EXISTS site_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cta_link TEXT DEFAULT '/shop',
  position TEXT DEFAULT 'middle',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. RLS for new tables
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_banners ENABLE ROW LEVEL SECURITY;

-- Hero Slides Policies
DROP POLICY IF EXISTS "Public hero_slides are viewable by everyone." ON hero_slides;
CREATE POLICY "Public hero_slides are viewable by everyone." ON hero_slides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only authenticated users can modify hero_slides" ON hero_slides;
CREATE POLICY "Only authenticated users can modify hero_slides" ON hero_slides FOR ALL USING (auth.role() = 'authenticated');

-- Site Banners Policies
DROP POLICY IF EXISTS "Public site_banners are viewable by everyone." ON site_banners;
CREATE POLICY "Public site_banners are viewable by everyone." ON site_banners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only authenticated users can modify site_banners" ON site_banners;
CREATE POLICY "Only authenticated users can modify site_banners" ON site_banners FOR ALL USING (auth.role() = 'authenticated');

-- 8. Create Seed Data (Optional)
-- INSERT INTO categories (name, slug) VALUES 
--   ('Wedding Gowns', 'wedding-gowns'),
--   ('Brides Traditional Wears', 'brides-traditional-wears'),
--   ('Wedding Guests', 'wedding-guests');
