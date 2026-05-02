import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { SubCommunity, ForumPost, ForumReply } from '../models/Forum';
import { protect, requireRole, AuthRequest } from '../middleware/auth';
import { chatbotAnswer } from '../services/aiService';
import { slugify } from '../utils/jwt';

const router = Router();

router.get(
  '/communities',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const list = await SubCommunity.find({ studio: req.user!.studio }).sort({ memberCount: -1 });
    res.json(list);
  })
);

router.post(
  '/communities',
  protect,
  requireRole('owner', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const c = await SubCommunity.create({
      ...req.body,
      slug: slugify(req.body.slug || req.body.name),
      studio: req.user!.studio,
    });
    res.status(201).json(c);
  })
);

router.get(
  '/posts',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const filter: any = { studio: req.user!.studio };
    if (req.query.community) filter.community = req.query.community;
    const posts = await ForumPost.find(filter)
      .populate('author', 'name avatar')
      .populate('community', 'name slug')
      .sort({ createdAt: -1 });
    res.json(posts);
  })
);

router.post(
  '/posts',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const post = await ForumPost.create({
      ...req.body,
      studio: req.user!.studio,
      author: req.user!._id,
    });
    res.status(201).json(post);
  })
);

router.get(
  '/posts/:id/replies',
  protect,
  asyncHandler(async (req, res) => {
    const replies = await ForumReply.find({ post: req.params.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(replies);
  })
);

router.post(
  '/posts/:id/replies',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const reply = await ForumReply.create({
      post: req.params.id,
      author: req.user!._id,
      authorType: 'user',
      body: req.body.body,
    });
    res.status(201).json(reply);
  })
);

router.post(
  '/posts/:id/ai-answer',
  protect,
  asyncHandler(async (req, res) => {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    const answer = await chatbotAnswer({
      question: `${post.title}\n\n${post.body}`,
    });
    const reply = await ForumReply.create({
      post: post._id,
      authorType: 'ai',
      body: answer,
    });
    post.isAIAnswered = true;
    await post.save();
    res.json(reply);
  })
);

router.post(
  '/chatbot',
  protect,
  asyncHandler(async (req, res) => {
    const answer = await chatbotAnswer({
      question: req.body.question,
      context: req.body.context,
    });
    res.json({ answer });
  })
);

export default router;
