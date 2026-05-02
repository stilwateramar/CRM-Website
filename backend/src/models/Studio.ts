import { Schema, model, Document, Types } from 'mongoose';

export interface IStudio extends Document {
  _id: Types.ObjectId;
  name: string;
  owner: Types.ObjectId;
  slug: string;
  description?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  integrations?: {
    instagram?: { connected: boolean; accessToken?: string; accountId?: string };
    facebook?: { connected: boolean; accessToken?: string; pageId?: string };
    zoom?: { connected: boolean; accessToken?: string; refreshToken?: string };
    google?: { connected: boolean; accessToken?: string; refreshToken?: string };
    razorpay?: { connected: boolean; accountId?: string };
    stripe?: { connected: boolean; accountId?: string };
    whatsapp?: { connected: boolean; phoneNumberId?: string };
  };
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    socialAddon: boolean;
    renewsAt?: Date;
  };
  createdAt: Date;
}

const studioSchema = new Schema<IStudio>(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: String,
    logo: String,
    address: String,
    phone: String,
    email: String,
    socialLinks: {
      instagram: String,
      facebook: String,
      youtube: String,
      twitter: String,
    },
    integrations: {
      instagram: { connected: { type: Boolean, default: false }, accessToken: String, accountId: String },
      facebook: { connected: { type: Boolean, default: false }, accessToken: String, pageId: String },
      zoom: { connected: { type: Boolean, default: false }, accessToken: String, refreshToken: String },
      google: { connected: { type: Boolean, default: false }, accessToken: String, refreshToken: String },
      razorpay: { connected: { type: Boolean, default: false }, accountId: String },
      stripe: { connected: { type: Boolean, default: false }, accountId: String },
      whatsapp: { connected: { type: Boolean, default: false }, phoneNumberId: String },
    },
    subscription: {
      plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
      socialAddon: { type: Boolean, default: false },
      renewsAt: Date,
    },
  },
  { timestamps: true }
);

export const Studio = model<IStudio>('Studio', studioSchema);
