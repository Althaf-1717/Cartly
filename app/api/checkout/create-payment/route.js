import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/payments/razorpay';
import { generateOrderNumber } from '@/lib/utils/formatters';

export async function POST(request) {
  try {
    const { amount, currency = 'INR' } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    const receipt = generateOrderNumber();
    const paymentOrder = await createRazorpayOrder({ amount, currency, receipt });

    return NextResponse.json({
      success: true,
      order: paymentOrder.order,
      mode: paymentOrder.mode,
      keyId: paymentOrder.keyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_cartly_demo',
      receipt,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
