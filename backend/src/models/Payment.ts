import { Schema, model, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  studio: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  currency: string;
  provider: 'razorpay' | 'stripe';
  providerOrderId?: string;
  providerPaymentId?: string;
  status: 'created' | 'pending' | 'success' | 'failed' | 'refunded';
  purpose: 'class' | 'package' | 'subscription' | 'addon';
  reference?: Types.ObjectId;
  metadata?: Record<string, any>;
}

const paymentSchema = new Schema<IPayment>(
  {
    studio: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    provider: { type: String, enum: ['razorpay', 'stripe'], required: true },
    providerOrderId: String,
    providerPaymentId: String,
    status: { type: String, enum: ['created', 'pending', 'success', 'failed', 'refunded'], default: 'created' },
    purpose: { type: String, enum: ['class', 'package', 'subscription', 'addon'], default: 'class' },
    reference: Schema.Types.ObjectId,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
