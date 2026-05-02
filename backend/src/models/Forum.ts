import { Schema, model, Document, Types } from 'mongoose';

export interface ISubCommunity extends Document {
  studio: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  memberCount: number;
}

const subCommunitySchema = new Schema<ISubCommunity>(
  {
    studio: { type: Schema.Types.ObjectId, ref: 'Studio', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, lowercase: true },
    description: String,
    coverImage: String,
    memberCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

subCommunitySchema.index({ studio: 1, slug: 1 }, { unique: true });

export const SubCommunity = model<ISubCommunity>('SubCommunity', subCommunitySchema);

export interface IForumPost extends Document {
  studio: Types.ObjectId;
  community?: Types.ObjectId;
  author: Types.ObjectId;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  isAIAnswered: boolean;
}

const forumPostSchema = new Schema<IForumPost>(
  {
    studio: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    community: { type: Schema.Types.ObjectId, ref: 'SubCommunity' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: { type: [String], default: [] },
    upvotes: { type: Number, default: 0 },
    isAIAnswered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ForumPost = model<IForumPost>('ForumPost', forumPostSchema);

export interface IForumReply extends Document {
  post: Types.ObjectId;
  author?: Types.ObjectId;
  authorType: 'user' | 'ai';
  body: string;
  upvotes: number;
}

const forumReplySchema = new Schema<IForumReply>(
  {
    post: { type: Schema.Types.ObjectId, ref: 'ForumPost', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    authorType: { type: String, enum: ['user', 'ai'], default: 'user' },
    body: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ForumReply = model<IForumReply>('ForumReply', forumReplySchema);
