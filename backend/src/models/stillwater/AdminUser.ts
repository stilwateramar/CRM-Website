import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  totpSecret?: string;
  createdAt: Date;
  comparePassword(plain: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    totpSecret: String,
  },
  { timestamps: true }
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = function (plain: string) {
  return bcrypt.compare(plain, this.password);
};

export const AdminUser = model<IAdminUser>('SwAdmin', adminSchema);
