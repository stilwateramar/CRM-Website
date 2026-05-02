import { Schema, model, Document, Types } from 'mongoose';

export interface IBlogPost extends Document {
  _id: Types.ObjectId;
  provider: Types.ObjectId;
  title: string;
  excerpt: string;
  body: string;
  status: 'published' | 'draft';
  date: string;
  author: string;
  createdAt: Date;
}

const blogSchema = new Schema<IBlogPost>(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'SwProvider', required: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    body: { type: String, default: '' },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    date: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) },
    author: { type: String, default: '' },
  },
  { timestamps: true }
);

export const BlogPost = model<IBlogPost>('SwBlogPost', blogSchema);
