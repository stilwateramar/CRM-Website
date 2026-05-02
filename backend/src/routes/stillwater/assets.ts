import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { Asset } from '../../models/stillwater/Asset';
import { swProtect, SwAuthRequest } from './auth';

const router = Router();

router.use(swProtect('provider'));

router.get(
  '/',
  asyncHandler(async (req: SwAuthRequest, res) => {
    const items = await Asset.find({ provider: req.principal!.id }).sort({ createdAt: -1 }).lean();
    res.json(items);
  })
);

const createSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  size: z.string().optional(),
  usedIn: z.string().optional(),
});

router.post(
  '/',
  asyncHandler(async (req: SwAuthRequest, res) => {
    const data = createSchema.parse(req.body);
    const created = await Asset.create({ ...data, provider: req.principal!.id });
    res.status(201).json(created);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req: SwAuthRequest, res) => {
    await Asset.deleteOne({ _id: req.params.id, provider: req.principal!.id });
    res.json({ ok: true });
  })
);

export default router;
