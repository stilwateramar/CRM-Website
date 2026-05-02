import { Schema, model, Document, Types } from 'mongoose';

export interface IWebsite extends Document {
  studio: Types.ObjectId;
  template: 'serene' | 'flow' | 'minimal' | 'wellness' | 'modern';
  customDomain?: string;
  published: boolean;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  content: {
    hero: { heading: string; subheading: string; ctaText: string; image?: string };
    about: { heading: string; body: string; image?: string };
    services: { title: string; description: string; icon?: string }[];
    testimonials: { author: string; quote: string; rating: number }[];
    gallery: string[];
    contact: { email: string; phone: string; address: string };
  };
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  showCalendar: boolean;
  showBlog: boolean;
}

const websiteSchema = new Schema<IWebsite>(
  {
    studio: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, unique: true },
    template: { type: String, enum: ['serene', 'flow', 'minimal', 'wellness', 'modern'], default: 'serene' },
    customDomain: String,
    published: { type: Boolean, default: false },
    theme: {
      primaryColor: { type: String, default: '#7C3AED' },
      secondaryColor: { type: String, default: '#F59E0B' },
      fontFamily: { type: String, default: 'Inter' },
    },
    content: {
      hero: {
        heading: { type: String, default: 'Find Your Flow' },
        subheading: { type: String, default: 'Yoga classes for every body, every level.' },
        ctaText: { type: String, default: 'Book a Class' },
        image: String,
      },
      about: {
        heading: { type: String, default: 'About Us' },
        body: { type: String, default: 'Welcome to our studio.' },
        image: String,
      },
      services: { type: [{ title: String, description: String, icon: String }], default: [] },
      testimonials: { type: [{ author: String, quote: String, rating: Number }], default: [] },
      gallery: { type: [String], default: [] },
      contact: {
        email: String,
        phone: String,
        address: String,
      },
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    showCalendar: { type: Boolean, default: true },
    showBlog: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Website = model<IWebsite>('Website', websiteSchema);
