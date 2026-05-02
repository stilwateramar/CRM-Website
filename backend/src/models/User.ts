import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'owner' | 'teacher' | 'student' | 'admin';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  studio?: Types.ObjectId;
  avatar?: string;
  source?: 'manual' | 'whatsapp' | 'csv' | 'import';
  preferences?: {
    reminderEnabled: boolean;
    newsletterEnabled: boolean;
  };
  createdAt: Date;
  comparePassword(plain: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    phone: String,
    role: { type: String, enum: ['owner', 'teacher', 'student', 'admin'], default: 'student' },
    studio: { type: Schema.Types.ObjectId, ref: 'Studio' },
    avatar: String,
    source: { type: String, enum: ['manual', 'whatsapp', 'csv', 'import'], default: 'manual' },
    preferences: {
      reminderEnabled: { type: Boolean, default: true },
      newsletterEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain: string) {
  return bcrypt.compare(plain, this.password);
};

export const User = model<IUser>('User', userSchema);
