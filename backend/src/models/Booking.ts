import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  yogaClass: Types.ObjectId;
  student: Types.ObjectId;
  studio: Types.ObjectId;
  status: 'pending' | 'confirmed' | 'attended' | 'cancelled' | 'no-show';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  payment?: Types.ObjectId;
  reminderSent?: boolean;
  feedback?: { rating: number; comment?: string; createdAt: Date };
}

const bookingSchema = new Schema<IBooking>(
  {
    yogaClass: { type: Schema.Types.ObjectId, ref: 'YogaClass', required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studio: { type: Schema.Types.ObjectId, ref: 'Studio', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'attended', 'cancelled', 'no-show'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    reminderSent: { type: Boolean, default: false },
    feedback: {
      rating: Number,
      comment: String,
      createdAt: Date,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ yogaClass: 1, student: 1 }, { unique: true });

export const Booking = model<IBooking>('Booking', bookingSchema);
