import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IProvider extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  studioName: string;
  slug: string;
  domain?: string;
  practice?: string;
  phone?: string;
  createdAt: Date;
  comparePassword(plain: string): Promise<boolean>;
}

const providerSchema = new Schema<IProvider>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    studioName: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    domain: String,
    practice: String,
    phone: String,
  },
  { timestamps: true }
);

providerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

providerSchema.methods.comparePassword = function (plain: string) {
  return bcrypt.compare(plain, this.password);
};

export const Provider = model<IProvider>('SwProvider', providerSchema);
