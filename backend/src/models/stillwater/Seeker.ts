import { Schema, model, Document, Types } from 'mongoose';

export interface ISeeker extends Document {
  _id: Types.ObjectId;
  name?: string;
  mobile?: string;
  email?: string;
  createdAt: Date;
}

const seekerSchema = new Schema<ISeeker>(
  {
    name: String,
    mobile: { type: String, index: true, sparse: true },
    email: { type: String, lowercase: true, index: true, sparse: true },
  },
  { timestamps: true }
);

export const Seeker = model<ISeeker>('SwSeeker', seekerSchema);
