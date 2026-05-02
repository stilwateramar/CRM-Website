import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { ChangeRequest } from '../../models/stillwater/ChangeRequest';
import { swProtect, SwAuthRequest } from './auth';

const router = Router();

const requestSchema = z.object({
  title: z.string().min(1),
  category: z.string().default('Content'),
  priority: z.string().default('Normal'),
  details: z.string().default(''),
});

router.get(
  '/',
  swProtect('provider'),
  asyncHandler(async (req: SwAuthRequest, res) => {
    const items = await ChangeRequest.find({ provider: req.principal!.id }).sort({ createdAt: -1 }).lean();
    res.json(items);
  })
);

router.post(
  '/',
  swProtect('provider'),
  asyncHandler(async (req: SwAuthRequest, res) => {
    const data = requestSchema.parse(req.body);
    const created = await ChangeRequest.create({ ...data, provider: req.principal!.id });
    res.status(201).json(created);
  })
);

router.put(
  '/:id/status',
  swProtect('admin'),
  asyncHandler(async (req, res) => {
    const status = z.enum(['pending', 'in_progress', 'completed']).parse(req.body.status);
    const updated = await ChangeRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(updated);
  })
);

router.get(
  '/admin/all',
  swProtect('admin'),
  asyncHandler(async (_req, res) => {
    const items = await ChangeRequest.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  })
);

export default router;
