import { Schema, model, Document, Types } from 'mongoose';

export interface IBlogPost extends Document {
  studio: Types.ObjectId;
  author: Types.ObjectId;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: 'draft' | 'published';
  aiGenerated: boolean;
  publishedAt?: Date;
  views: number;
}

const blogSchema = new Schema<IBlogPost>(
  {
    studio: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, lowercase: true, index: true },
    excerpt: String,
    content: { type: String, required: true },
    coverImage: String,
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    aiGenerated: { type: Boolean, default: false },
    publishedAt: Date,
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ studio: 1, slug: 1 }, { unique: true });

export const BlogPost = model<IBlogPost>('BlogPost', blogSchema);
