import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-09-30.acacia' as any })
  : null;

export async function createRazorpayOrder(opts: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}) {
  if (!razorpay) throw new Error('Razorpay not configured');
  return razorpay.orders.create({
    amount: Math.round(opts.amount * 100),
    currency: opts.currency || 'INR',
    receipt: opts.receipt,
    notes: opts.notes,
  });
}

export function verifyRazorpaySignature(opts: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${opts.orderId}|${opts.paymentId}`)
    .digest('hex');
  return expected === opts.signature;
}

export async function createStripeCheckoutSession(opts: {
  amount: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
  description?: string;
  metadata?: Record<string, string>;
}) {
  if (!stripe) throw new Error('Stripe not configured');
  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: opts.currency || 'usd',
          product_data: { name: opts.description || 'Yoga class' },
          unit_amount: Math.round(opts.amount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: opts.metadata,
  });
}

export function verifyStripeWebhook(rawBody: Buffer, signature: string) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe webhook not configured');
  }
  return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
}
