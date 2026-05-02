import { Schema, model, Document, Types } from 'mongoose';

export interface ISocialPost extends Document {
  studio: Types.ObjectId;
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'reel';
  platforms: ('instagram' | 'facebook')[];
  scheduledAt?: Date;
  publishedAt?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  externalIds?: { instagram?: string; facebook?: string };
  sourceVideo?: string;
  reelOptions?: {
    trimStart?: number;
    trimEnd?: number;
    captionsEnabled?: boolean;
    musicTrack?: string;
  };
  error?: string;
}

const socialPostSchema = new Schema<ISocialPost>(
  {
    studio: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    caption: { type: String, default: '' },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video', 'reel'], default: 'image' },
    platforms: [{ type: String, enum: ['instagram', 'facebook'] }],
    scheduledAt: Date,
    publishedAt: Date,
    status: { type: String, enum: ['draft', 'scheduled', 'published', 'failed'], default: 'draft' },
    externalIds: {
      instagram: String,
      facebook: String,
    },
    sourceVideo: String,
    reelOptions: {
      trimStart: Number,
      trimEnd: Number,
      captionsEnabled: Boolean,
      musicTrack: String,
    },
    error: String,
  },
  { timestamps: true }
);

export const SocialPost = model<ISocialPost>('SocialPost', socialPostSchema);
