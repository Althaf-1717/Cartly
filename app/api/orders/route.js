import { NextResponse } from 'next/server';
import { StoreService } from '@/lib/db/storeService';

export async function GET() {
  const orders = await StoreService.getOrders();
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const order = await StoreService.createOrder(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
