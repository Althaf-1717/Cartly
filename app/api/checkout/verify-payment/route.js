import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/payments/razorpay';
import { StoreService } from '@/lib/db/storeService';

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = await request.json();

    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Payment signature verification failed' }, { status: 400 });
    }

    // Persist verified order in database
    const savedOrder = await StoreService.createOrder({
      ...orderDetails,
      paymentId: razorpay_payment_id,
      paymentStatus: 'paid',
      status: 'processing',
    });

    return NextResponse.json({
      success: true,
      order: savedOrder,
      message: 'Payment verified and order confirmed successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
