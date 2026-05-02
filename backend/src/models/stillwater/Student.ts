import { Schema, model, Document, Types } from 'mongoose';

export interface IStudent extends Document {
  _id: Types.ObjectId;
  name: string;
  provider: Types.ObjectId;
  accessCode: string;
  email?: string;
  phone?: string;
  createdAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true, trim: true },
    provider: { type: Schema.Types.ObjectId, ref: 'SwProvider', required: true, index: true },
    accessCode: { type: String, required: true, uppercase: true, index: true },
    email: String,
    phone: String,
  },
  { timestamps: true }
);

studentSchema.index({ provider: 1, accessCode: 1 }, { unique: true });

export const Student = model<IStudent>('SwStudent', studentSchema);
