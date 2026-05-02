import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { DemoRequest } from '../../models/stillwater/DemoRequest';
import { swProtect, SwAuthRequest } from './auth';

const router = Router();

const demoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
  practice: z.string().min(1),
  message: z.string().optional(),
});

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = demoSchema.parse(req.body);
    const created = await DemoRequest.create(data);
    res.status(201).json({ ok: true, id: created._id });
  })
);

router.get(
  '/',
  swProtect('admin'),
  asyncHandler(async (_req: SwAuthRequest, res) => {
    const all = await DemoRequest.find().sort({ createdAt: -1 }).lean();
    res.json(all);
  })
);

export default router;
