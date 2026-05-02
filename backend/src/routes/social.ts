import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Studio } from '../models/Studio';
import { SocialPost } from '../models/SocialPost';
import { protect, requireRole, AuthRequest } from '../middleware/auth';
import {
  exchangeMetaCode,
  getInstagramAccount,
  publishInstagramReel,
  publishFacebookPost,
  processReelPlan,
} from '../services/socialService';
import { generateSocialCaption } from '../services/aiService';

const router = Router();

router.get('/meta/connect', protect, (_req, res) => {
  const url =
    `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.META_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.META_REDIRECT_URI || '')}` +
    `&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts` +
    `&response_type=code`;
  res.json({ url });
});

router.get(
  '/meta/callback',
  asyncHandler(async (req, res) => {
    const code = req.query.code as string;
    const studioId = req.query.state as string;
    const tokens = await exchangeMetaCode(code);
    const account = await getInstagramAccount(tokens.access_token);
    if (studioId) {
      await Studio.findByIdAndUpdate(studioId, {
        'integrations.facebook.connected': true,
        'integrations.facebook.accessToken': account?.pageAccessToken || tokens.access_token,
        'integrations.facebook.pageId': account?.pageId,
        'integrations.instagram.connected': !!account?.instagramAccountId,
        'integrations.instagram.accessToken': account?.pageAccessToken,
        'integrations.instagram.accountId': account?.instagramAccountId,
      });
    }
    res.redirect(`${process.env.CORS_ORIGIN || 'http://localhost:5173'}/social?connected=meta`);
  })
);

router.get(
  '/posts',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const posts = await SocialPost.find({ studio: req.user!.studio }).sort({ createdAt: -1 });
    res.json(posts);
  })
);

router.post(
  '/posts',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const studio = await Studio.findById(req.user!.studio);
    if (!studio?.subscription?.socialAddon) {
      res.status(402).json({ message: 'Social add-on subscription required' });
      return;
    }
    const post = await SocialPost.create({ ...req.body, studio: studio._id });
    res.status(201).json(post);
  })
);

router.post(
  '/reels/process',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const studio = await Studio.findById(req.user!.studio);
    if (!studio?.subscription?.socialAddon) {
      res.status(402).json({ message: 'Social add-on subscription required' });
      return;
    }
    const result = await processReelPlan({
      sourceVideoUrl: req.body.sourceVideoUrl,
      trimStart: req.body.trimStart,
      trimEnd: req.body.trimEnd,
      captionsEnabled: req.body.captionsEnabled,
      musicTrack: req.body.musicTrack,
    });
    res.json(result);
  })
);

router.post(
  '/posts/:id/publish',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const post = await SocialPost.findOne({ _id: req.params.id, studio: req.user!.studio });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    const studio = await Studio.findById(req.user!.studio);
    if (!studio) {
      res.status(404).json({ message: 'Studio not found' });
      return;
    }
    const externalIds: any = {};
    try {
      if (post.platforms.includes('instagram') && studio.integrations?.instagram?.accountId) {
        const r = await publishInstagramReel({
          igAccountId: studio.integrations.instagram.accountId!,
          accessToken: studio.integrations.instagram.accessToken!,
          videoUrl: post.mediaUrl,
          caption: post.caption,
        });
        externalIds.instagram = r.id;
      }
      if (post.platforms.includes('facebook') && studio.integrations?.facebook?.pageId) {
        const r = await publishFacebookPost({
          pageId: studio.integrations.facebook.pageId!,
          pageAccessToken: studio.integrations.facebook.accessToken!,
          message: post.caption,
        });
        externalIds.facebook = r.id;
      }
      post.status = 'published';
      post.publishedAt = new Date();
      post.externalIds = externalIds;
      await post.save();
      res.json(post);
    } catch (e: any) {
      post.status = 'failed';
      post.error = e?.message || 'publish failed';
      await post.save();
      res.status(500).json({ message: post.error });
    }
  })
);

router.post(
  '/captions/ai',
  protect,
  asyncHandler(async (req, res) => {
    const caption = await generateSocialCaption({
      topic: req.body.topic,
      hashtags: req.body.hashtags,
    });
    res.json({ caption });
  })
);

export default router;
