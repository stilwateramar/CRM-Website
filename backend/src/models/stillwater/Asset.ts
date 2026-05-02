import { Schema, model, Document, Types } from 'mongoose';

export interface IAsset extends Document {
  _id: Types.ObjectId;
  provider: Types.ObjectId;
  name: string;
  url: string;
  size: string;
  uploadedAt: string;
  usedIn?: string;
  createdAt: Date;
}

const assetSchema = new Schema<IAsset>(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'SwProvider', required: true, index: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: String, default: '0 KB' },
    uploadedAt: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) },
    usedIn: { type: String, default: '—' },
  },
  { timestamps: true }
);

export const Asset = model<IAsset>('SwAsset', assetSchema);
