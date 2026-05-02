import { Schema, model, Document, Types } from 'mongoose';

export interface IYogaClass extends Document {
  studio: Types.ObjectId;
  teacher: Types.ObjectId;
  title: string;
  description?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  type: 'in-person' | 'online' | 'hybrid';
  startTime: Date;
  durationMinutes: number;
  capacity: number;
  price: number;
  currency: string;
  meetingProvider?: 'zoom' | 'google';
  meetingUrl?: string;
  meetingId?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly';
    until?: Date;
  };
}

const classSchema = new Schema<IYogaClass>(
  {
    studio: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all'], default: 'all' },
    type: { type: String, enum: ['in-person', 'online', 'hybrid'], default: 'in-person' },
    startTime: { type: Date, required: true, index: true },
    durationMinutes: { type: Number, default: 60 },
    capacity: { type: Number, default: 20 },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    meetingProvider: { type: String, enum: ['zoom', 'google'] },
    meetingUrl: String,
    meetingId: String,
    status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
    recurring: {
      pattern: { type: String, enum: ['daily', 'weekly', 'monthly'] },
      until: Date,
    },
  },
  { timestamps: true }
);

export const YogaClass = model<IYogaClass>('YogaClass', classSchema);
