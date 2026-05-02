import { Schema, model, Document } from 'mongoose';

export interface IOtp extends Document {
  identifier: string;
  channel: 'mobile' | 'email';
  code: string;
  expiresAt: Date;
  consumed: boolean;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    identifier: { type: String, required: true, index: true },
    channel: { type: String, enum: ['mobile', 'email'], required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = model<IOtp>('SwOtp', otpSchema);
