/**
 * Seed script — populates the DB with a demo studio, owner, teacher,
 * students, classes, blog posts, and learning materials.
 *
 *   cd backend
 *   npx ts-node src/scripts/seed.ts
 *
 * Login afterward as: owner@demo.com / password123
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Studio } from '../models/Studio';
import { Website } from '../models/Website';
import { YogaClass } from '../models/Class';
import { BlogPost } from '../models/Blog';
import { LearningMaterial } from '../models/Learning';
import { SubCommunity } from '../models/Forum';
import { slugify } from '../utils/jwt';

async function run() {
  await connectDB();
  if (mongoose.connection.readyState !== 1) {
    console.error('DB not connected. Aborting.');
    process.exit(1);
  }

  console.log('🧹  Clearing demo data…');
  await Promise.all([
    User.deleteMany({ email: /@demo\.com$/ }),
    Studio.deleteMany({ slug: 'lotus-yoga' }),
  ]);

  console.log('👤  Creating owner & teacher…');
  const owner = await User.create({
    name: 'Aarav Sharma',
    email: 'owner@demo.com',
    password: 'password123',
    phone: '+919876500001',
    role: 'owner',
  });
  const teacher = await User.create({
    name: 'Priya Iyer',
    email: 'teacher@demo.com',
    password: 'password123',
    phone: '+919876500002',
    role: 'teacher',
  });

  console.log('🏢  Creating studio + website…');
  const studio = await Studio.create({
    name: 'Lotus Yoga Studio',
    owner: owner._id,
    slug: 'lotus-yoga',
    description: 'A peaceful yoga sanctuary in the heart of the city.',
    address: 'Indiranagar, Bengaluru',
    email: 'hello@lotusyoga.com',
    phone: '+919876500001',
    socialLinks: {
      instagram: 'https://instagram.com/lotusyoga',
      facebook: 'https://facebook.com/lotusyoga',
    },
    subscription: { plan: 'pro', socialAddon: true },
  });
  owner.studio = studio._id;
  teacher.studio = studio._id;
  await Promise.all([owner.save(), teacher.save()]);

  await Website.create({
    studio: studio._id,
    template: 'serene',
    published: true,
    content: {
      hero: {
        heading: 'Find Your Flow at Lotus',
        subheading: 'Hatha, Vinyasa, and Yin classes for every level.',
        ctaText: 'Book Your First Class',
      },
      about: {
        heading: 'About Lotus Yoga',
        body: 'We believe yoga is for every body. Our certified teachers guide you through mindful movement and breathwork in a warm, inclusive space.',
      },
      services: [
        { title: 'Hatha Yoga', description: 'Slow, grounding flows for beginners.' },
        { title: 'Vinyasa Flow', description: 'Dynamic classes that link breath to movement.' },
        { title: 'Yin Yoga', description: 'Deep, meditative stretching.' },
      ],
      testimonials: [
        { author: 'Riya M.', quote: 'My back pain melted away in 6 weeks.', rating: 5 },
        { author: 'Karan T.', quote: 'Best teachers in Bangalore, hands down.', rating: 5 },
      ],
      gallery: [],
      contact: { email: 'hello@lotusyoga.com', phone: '+919876500001', address: 'Indiranagar, Bengaluru' },
    },
  });

  console.log('🧘  Creating students…');
  const students = await User.insertMany(
    [
      { name: 'Maya Patel', email: 'maya@demo.com', phone: '+919876510001' },
      { name: 'Rohan Das', email: 'rohan@demo.com', phone: '+919876510002' },
      { name: 'Sara Ali', email: 'sara@demo.com', phone: '+919876510003' },
      { name: 'Vikram Rao', email: 'vikram@demo.com', phone: '+919876510004' },
    ].map((s) => ({
      ...s,
      password: 'password123',
      role: 'student',
      studio: studio._id,
      source: 'manual',
    }))
  );

  console.log('📅  Creating classes (next 7 days)…');
  const titles = [
    { title: 'Morning Hatha', level: 'beginner', type: 'in-person', hour: 7 },
    { title: 'Vinyasa Power Hour', level: 'intermediate', type: 'online', hour: 18 },
    { title: 'Yin Yoga & Meditation', level: 'all', type: 'hybrid', hour: 19 },
    { title: 'Sunset Flow', level: 'all', type: 'in-person', hour: 17 },
  ];
  const now = new Date();
  for (let day = 1; day <= 7; day++) {
    for (const t of titles) {
      const start = new Date(now);
      start.setDate(start.getDate() + day);
      start.setHours(t.hour, 0, 0, 0);
      await YogaClass.create({
        studio: studio._id,
        teacher: teacher._id,
        title: t.title,
        description: `${t.title} with Priya — ${t.level} level.`,
        level: t.level,
        type: t.type,
        startTime: start,
        durationMinutes: 60,
        capacity: 20,
        price: t.type === 'online' ? 299 : 500,
        currency: 'INR',
      });
    }
  }

  console.log('📝  Creating blog posts…');
  await BlogPost.insertMany([
    {
      studio: studio._id,
      author: teacher._id,
      title: '5 Poses to Start Your Morning',
      slug: '5-poses-to-start-your-morning',
      excerpt: 'A gentle sequence to wake up body and mind.',
      content: '# Morning sequence\n\nTry these five poses every morning…',
      tags: ['morning', 'beginner', 'sequence'],
      status: 'published',
      publishedAt: new Date(),
    },
    {
      studio: studio._id,
      author: teacher._id,
      title: 'Why Breathwork Matters',
      slug: 'why-breathwork-matters',
      excerpt: 'Pranayama is the bridge between body and mind.',
      content: '# The power of breath\n\nIn yogic philosophy…',
      tags: ['pranayama', 'philosophy'],
      status: 'published',
      publishedAt: new Date(),
    },
  ]);

  console.log('📚  Creating learning materials…');
  await LearningMaterial.insertMany([
    {
      studio: studio._id,
      title: 'Sun Salutation Tutorial',
      description: 'Step-by-step guide to Surya Namaskar.',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=73sjOuOEDZA',
      level: 'beginner',
      durationMinutes: 12,
      category: 'asana',
    },
    {
      studio: studio._id,
      title: 'Intro to Pranayama',
      description: 'Three foundational breathing techniques.',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=EoLLI4E25aw',
      level: 'beginner',
      durationMinutes: 18,
      category: 'pranayama',
    },
  ]);

  console.log('💬  Creating forum communities…');
  await SubCommunity.insertMany([
    { studio: studio._id, name: 'Beginners', slug: 'beginners', description: 'New to yoga? Start here.' },
    { studio: studio._id, name: 'Pose Help', slug: 'pose-help', description: 'Get feedback on your alignment.' },
    { studio: studio._id, name: 'Philosophy', slug: 'philosophy', description: 'Discuss yogic philosophy.' },
  ]);

  console.log('\n✅  Seed complete!');
  console.log('   Owner login:    owner@demo.com / password123');
  console.log('   Teacher login:  teacher@demo.com / password123');
  console.log('   Student login:  maya@demo.com / password123');
  console.log('   Public site:    http://localhost:5173/site/lotus-yoga\n');

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
