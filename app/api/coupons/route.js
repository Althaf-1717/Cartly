import { NextResponse } from 'next/server';
import { StoreService } from '@/lib/db/storeService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const amount = Number(searchParams.get('amount') || 0);

  if (code) {
    const res = await StoreService.validateCoupon(code, amount);
    return NextResponse.json(res);
  }

  const coupons = await StoreService.getCoupons();
  return NextResponse.json({ success: true, data: coupons });
}
