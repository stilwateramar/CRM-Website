import { Schema, model, Document, Types } from 'mongoose';

export interface IChangeRequest extends Document {
  _id: Types.ObjectId;
  provider: Types.ObjectId;
  title: string;
  category: string;
  priority: string;
  details: string;
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
  createdAt: Date;
}

const changeRequestSchema = new Schema<IChangeRequest>(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'SwProvider', required: true, index: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Content' },
    priority: { type: String, default: 'Normal' },
    details: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    date: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) },
  },
  { timestamps: true }
);

export const ChangeRequest = model<IChangeRequest>('SwChangeRequest', changeRequestSchema);
