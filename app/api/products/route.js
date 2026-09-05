import { NextResponse } from 'next/server';
import { StoreService } from '@/lib/db/storeService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const inStock = searchParams.get('inStock') === 'true';
  const featured = searchParams.get('featured') === 'true';

  const products = await StoreService.getProducts({
    category,
    search,
    sort,
    minPrice,
    maxPrice,
    inStock,
    featured,
  });

  return NextResponse.json({ success: true, count: products.length, data: products });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newProduct = await StoreService.createProduct(body);
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
