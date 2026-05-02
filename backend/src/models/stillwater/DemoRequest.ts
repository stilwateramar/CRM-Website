import { Schema, model, Document, Types } from 'mongoose';

export interface IDemoRequest extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  practice: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
}

const demoRequestSchema = new Schema<IDemoRequest>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    practice: { type: String, required: true },
    message: String,
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

export const DemoRequest = model<IDemoRequest>('SwDemoRequest', demoRequestSchema);
