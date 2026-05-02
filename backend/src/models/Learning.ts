import { Schema, model, Document, Types } from 'mongoose';

export interface ILearningMaterial extends Document {
  studio: Types.ObjectId;
  title: string;
  description?: string;
  type: 'video' | 'article' | 'pdf' | 'tutorial';
  url: string;
  thumbnail?: string;
  category?: string;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes?: number;
  isPublic: boolean;
}

const learningSchema = new Schema<ILearningMaterial>(
  {
    studio: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: ['video', 'article', 'pdf', 'tutorial'], default: 'video' },
    url: { type: String, required: true },
    thumbnail: String,
    category: String,
    tags: { type: [String], default: [] },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    durationMinutes: Number,
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const LearningMaterial = model<ILearningMaterial>('LearningMaterial', learningSchema);
