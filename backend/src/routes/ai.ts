import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth';
import { chatbotAnswer, generateBlogPost, generateSocialCaption } from '../services/aiService';

const router = Router();

router.post(
  '/chat',
  protect,
  asyncHandler(async (req, res) => {
    const answer = await chatbotAnswer({ question: req.body.question, context: req.body.context });
    res.json({ answer });
  })
);

router.post(
  '/blog',
  protect,
  asyncHandler(async (req, res) => {
    const draft = await generateBlogPost({
      topic: req.body.topic,
      tone: req.body.tone,
      keywords: req.body.keywords,
      studioName: req.body.studioName,
    });
    res.json(draft);
  })
);

router.post(
  '/caption',
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
