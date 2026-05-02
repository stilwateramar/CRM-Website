import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { BlogPost } from '../models/Blog';
import { protect, requireRole, AuthRequest } from '../middleware/auth';
import { generateBlogPost } from '../services/aiService';
import { slugify } from '../utils/jwt';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const posts = await BlogPost.find({ studio: req.user!.studio })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');
    res.json(posts);
  })
);

router.post(
  '/',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const post = await BlogPost.create({
      ...req.body,
      slug: slugify(req.body.slug || req.body.title),
      studio: req.user!.studio,
      author: req.user!._id,
      publishedAt: req.body.status === 'published' ? new Date() : undefined,
    });
    res.status(201).json(post);
  })
);

router.put(
  '/:id',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const update: any = { ...req.body };
    if (req.body.title && !req.body.slug) update.slug = slugify(req.body.title);
    if (req.body.status === 'published') update.publishedAt = new Date();
    const post = await BlogPost.findOneAndUpdate(
      { _id: req.params.id, studio: req.user!.studio },
      update,
      { new: true }
    );
    res.json(post);
  })
);

router.delete(
  '/:id',
  protect,
  requireRole('owner', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    await BlogPost.deleteOne({ _id: req.params.id, studio: req.user!.studio });
    res.json({ message: 'Deleted' });
  })
);

router.post(
  '/ai/draft',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const draft = await generateBlogPost({
      topic: req.body.topic,
      tone: req.body.tone,
      keywords: req.body.keywords,
      studioName: req.body.studioName,
    });
    res.json({ ...draft, aiGenerated: true });
  })
);

router.get(
  '/public/:slug/:postSlug',
  asyncHandler(async (req, res) => {
    const post = await BlogPost.findOne({ slug: req.params.postSlug, status: 'published' })
      .populate('studio', 'name slug')
      .populate('author', 'name avatar');
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    post.views += 1;
    await post.save();
    res.json(post);
  })
);

export default router;
