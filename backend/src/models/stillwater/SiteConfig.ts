import { Schema, model, Document, Types } from 'mongoose';

export interface ISiteConfig extends Document {
  _id: Types.ObjectId;
  provider: Types.ObjectId;
  email: string;
  phone?: string;
  address?: string;
  instagram?: string;
  showSchedule: boolean;
  showBlog: boolean;
  status: 'live' | 'draft';
  createdAt: Date;
}

const siteConfigSchema = new Schema<ISiteConfig>(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'SwProvider', required: true, unique: true, index: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    instagram: String,
    showSchedule: { type: Boolean, default: true },
    showBlog: { type: Boolean, default: true },
    status: { type: String, enum: ['live', 'draft'], default: 'live' },
  },
  { timestamps: true }
);

export const SiteConfig = model<ISiteConfig>('SwSiteConfig', siteConfigSchema);
