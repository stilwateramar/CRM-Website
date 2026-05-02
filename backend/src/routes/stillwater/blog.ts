import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { BlogPost } from '../../models/stillwater/BlogPost';
import { Provider } from '../../models/stillwater/Provider';
import { swProtect, SwAuthRequest } from './auth';

const router = Router();

const postSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().default(''),
  body: z.string().default(''),
  status: z.enum(['published', 'draft']).default('draft'),
});

router.get(
  '/',
  swProtect('provider'),
  asyncHandler(async (req: SwAuthRequest, res) => {
    const items = await BlogPost.find({ provider: req.principal!.id }).sort({ createdAt: -1 }).lean();
    res.json(items);
  })
);

router.post(
  '/',
  swProtect('provider'),
  asyncHandler(async (req: SwAuthRequest, res) => {
    const data = postSchema.parse(req.body);
    const provider = await Provider.findById(req.principal!.id);
    const created = await BlogPost.create({
      ...data,
      provider: req.principal!.id,
      author: provider?.name || '',
    });
    res.status(201).json(created);
  })
);

router.put(
  '/:id',
  swProtect('provider'),
  asyncHandler(async (req: SwAuthRequest, res) => {
    const data = postSchema.partial().parse(req.body);
    const updated = await BlogPost.findOneAndUpdate(
      { _id: req.params.id, provider: req.principal!.id },
      data,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(updated);
  })
);

router.delete(
  '/:id',
  swProtect('provider'),
  asyncHandler(async (req: SwAuthRequest, res) => {
    await BlogPost.deleteOne({ _id: req.params.id, provider: req.principal!.id });
    res.json({ ok: true });
  })
);

export default router;
