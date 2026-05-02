import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Payment } from '../models/Payment';
import { Booking } from '../models/Booking';
import { protect, requireRole, AuthRequest } from '../middleware/auth';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  createStripeCheckoutSession,
} from '../services/paymentService';

const router = Router();

router.post(
  '/razorpay/order',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const { amount, currency, purpose, reference } = req.body;
    const order = await createRazorpayOrder({ amount, currency });
    const payment = await Payment.create({
      studio: req.user!.studio,
      user: req.user!._id,
      amount,
      currency: currency || 'INR',
      provider: 'razorpay',
      providerOrderId: order.id,
      purpose: purpose || 'class',
      reference,
      status: 'created',
    });
    res.json({ order, paymentId: payment._id, key: process.env.RAZORPAY_KEY_ID });
  })
);

router.post(
  '/razorpay/verify',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const { orderId, paymentId, signature } = req.body;
    const ok = verifyRazorpaySignature({ orderId, paymentId, signature });
    if (!ok) {
      res.status(400).json({ message: 'Invalid signature' });
      return;
    }
    const payment = await Payment.findOneAndUpdate(
      { providerOrderId: orderId, user: req.user!._id },
      { providerPaymentId: paymentId, status: 'success' },
      { new: true }
    );
    if (payment?.purpose === 'class' && payment.reference) {
      await Booking.findByIdAndUpdate(payment.reference, {
        paymentStatus: 'paid',
        status: 'confirmed',
        payment: payment._id,
      });
    }
    res.json(payment);
  })
);

router.post(
  '/stripe/checkout',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const { amount, currency, purpose, reference } = req.body;
    const origin = process.env.CORS_ORIGIN || 'http://localhost:5173';
    const session = await createStripeCheckoutSession({
      amount,
      currency,
      successUrl: `${origin}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/payments/cancel`,
      description: req.body.description,
      metadata: { userId: req.user!._id.toString(), purpose, reference: reference || '' },
    });
    await Payment.create({
      studio: req.user!.studio,
      user: req.user!._id,
      amount,
      currency: currency || 'usd',
      provider: 'stripe',
      providerOrderId: session.id,
      purpose: purpose || 'class',
      reference,
      status: 'created',
    });
    res.json({ url: session.url, sessionId: session.id });
  })
);

router.get(
  '/',
  protect,
  requireRole('owner', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const payments = await Payment.find({ studio: req.user!.studio })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(payments);
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const payments = await Payment.find({ user: req.user!._id }).sort({ createdAt: -1 });
    res.json(payments);
  })
);

router.get(
  '/stats',
  protect,
  requireRole('owner', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const studioId = req.user!.studio;
    const [totalRevenue, monthRevenue, count] = await Promise.all([
      Payment.aggregate([
        { $match: { studio: studioId, status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.aggregate([
        {
          $match: {
            studio: studioId,
            status: 'success',
            createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.countDocuments({ studio: studioId, status: 'success' }),
    ]);
    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      successfulPayments: count,
    });
  })
);

export default router;
