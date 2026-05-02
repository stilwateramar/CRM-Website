import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Website } from '../models/Website';
import { Studio } from '../models/Studio';
import { BlogPost } from '../models/Blog';
import { YogaClass } from '../models/Class';
import { protect, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

const TEMPLATES = [
  { id: 'serene', name: 'Serene', preview: '/templates/serene.png', accent: '#7C3AED' },
  { id: 'flow', name: 'Flow', preview: '/templates/flow.png', accent: '#10B981' },
  { id: 'minimal', name: 'Minimal', preview: '/templates/minimal.png', accent: '#111827' },
  { id: 'wellness', name: 'Wellness', preview: '/templates/wellness.png', accent: '#F59E0B' },
  { id: 'modern', name: 'Modern', preview: '/templates/modern.png', accent: '#EC4899' },
];

router.get('/templates', (_req, res) => {
  res.json(TEMPLATES);
});

router.get(
  '/me',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    let site = await Website.findOne({ studio: req.user!.studio });
    if (!site) site = await Website.create({ studio: req.user!.studio });
    res.json(site);
  })
);

router.put(
  '/me',
  protect,
  requireRole('owner', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const site = await Website.findOneAndUpdate({ studio: req.user!.studio }, req.body, {
      new: true,
      upsert: true,
    });
    res.json(site);
  })
);

router.post(
  '/publish',
  protect,
  requireRole('owner', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const site = await Website.findOneAndUpdate(
      { studio: req.user!.studio },
      { published: true },
      { new: true }
    );
    res.json({ message: 'Published', site });
  })
);

router.get(
  '/public/:slug',
  asyncHandler(async (req, res) => {
    const studio = await Studio.findOne({ slug: req.params.slug });
    if (!studio) {
      res.status(404).json({ message: 'Studio not found' });
      return;
    }
    const site = await Website.findOne({ studio: studio._id, published: true });
    if (!site) {
      res.status(404).json({ message: 'Site not published' });
      return;
    }
    const upcoming = site.showCalendar
      ? await YogaClass.find({ studio: studio._id, startTime: { $gte: new Date() } })
          .sort({ startTime: 1 })
          .limit(20)
          .lean()
      : [];
    const posts = site.showBlog
      ? await BlogPost.find({ studio: studio._id, status: 'published' })
          .sort({ publishedAt: -1 })
          .limit(6)
          .select('title slug excerpt coverImage publishedAt')
          .lean()
      : [];
    res.json({
      studio: { name: studio.name, slug: studio.slug, logo: studio.logo, socialLinks: studio.socialLinks },
      site,
      upcoming,
      posts,
    });
  })
);

export default router;
