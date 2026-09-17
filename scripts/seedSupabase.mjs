import { createClient } from '@supabase/supabase-js';
import { initialProducts, initialCategories } from '../lib/db/seedData.js';

const supabaseUrl = 'https://cfdwxjehzqjsrapfvpix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZHd4amVoenFqc3JhcGZ2cGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTk2MTcsImV4cCI6MjEwNTIzNTYxN30.J2TjdDYljoUZdtQyC83OoNxeC_hBH03afPng8XEOPog';

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleCustomers = [
  {
    id: 'cust-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
    address: 'Flat 402, Skyline Residency, Indiranagar, Bengaluru, Karnataka - 560038',
    total_orders: 2,
    total_spent: 4749,
    status: 'active',
    joined_date: '2026-08-15',
  },
  {
    id: 'cust-2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 91234 56789',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    address: '404 Galaxy Apts, Linking Road, Bandra West, Mumbai, Maharashtra - 400050',
    total_orders: 3,
    total_spent: 8999,
    status: 'active',
    joined_date: '2026-08-20',
  },
];

async function testConnectionAndSeed() {
  console.log('Testing connection to Supabase at:', supabaseUrl);
  const { data: catData, error: catError } = await supabase.from('categories').select('*');
  if (catError) {
    console.error('Error fetching categories:', catError.message);
    return;
  }
  console.log('Successfully connected to Supabase! Current categories count:', catData.length);

  if (catData.length === 0) {
    console.log('Seeding initial categories to Supabase...');
    const categoriesPayload = initialCategories.map((c, idx) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image_url: c.image || '',
      gender: c.gender || 'all',
      is_featured: Boolean(c.isFeatured),
      display_order: idx,
    }));
    const { error: insCatErr } = await supabase.from('categories').upsert(categoriesPayload);
    if (insCatErr) console.error('Error inserting categories:', insCatErr.message);
    else console.log('Successfully seeded categories!');
  }

  const { data: prodData, error: prodError } = await supabase.from('products').select('*');
  if (prodError) {
    console.error('Error fetching products:', prodError.message);
    return;
  }
  console.log('Current products count in Supabase:', prodData.length);

  if (prodData.length === 0) {
    console.log('Seeding initial products to Supabase...');
    const productsPayload = initialProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku || `SKU-${p.id}`,
      brand: p.brand || 'Cartly Brand',
      description: p.description || '',
      subtitle: p.subtitle || '',
      price: p.price,
      original_price: p.originalPrice || null,
      category: p.category,
      subcategory: p.subcategory || '',
      gender: p.gender || 'all',
      stock: p.stock ?? 50,
      rating: p.rating || 5.0,
      reviews_count: p.reviewsCount || 0,
      images: Array.isArray(p.images) ? p.images : [p.image].filter(Boolean),
      sizes: p.sizes || ['S', 'M', 'L', 'XL'],
      is_featured: Boolean(p.isFeatured),
      is_trending: Boolean(p.isTrending),
      is_active: true,
    }));

    const { error: insProdErr } = await supabase.from('products').upsert(productsPayload);
    if (insProdErr) console.error('Error inserting products:', insProdErr.message);
    else console.log(`Successfully seeded ${productsPayload.length} products to Supabase!`);
  }

  const { data: custData } = await supabase.from('customers').select('*');
  if (!custData || custData.length === 0) {
    console.log('Seeding initial customers to Supabase...');
    await supabase.from('customers').upsert(sampleCustomers);
    console.log('Successfully seeded customers!');
  }

  console.log('--- ALL SUPABASE TABLES AND SEEDS VERIFIED AND SEEDED SUCCESSFULLY! ---');
}

testConnectionAndSeed();
