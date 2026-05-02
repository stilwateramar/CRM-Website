import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { Student } from '../../models/stillwater/Student';
import { swProtect, SwAuthRequest } from './auth';

const router = Router();

router.use(swProtect('provider'));

const studentSchema = z.object({
  name: z.string().min(1),
  accessCode: z.string().min(4),
  email: z.string().optional(),
  phone: z.string().optional(),
});

router.get(
  '/',
  asyncHandler(async (req: SwAuthRequest, res) => {
    const items = await Student.find({ provider: req.principal!.id }).lean();
    res.json(items);
  })
);

router.post(
  '/',
  asyncHandler(async (req: SwAuthRequest, res) => {
    const data = studentSchema.parse(req.body);
    const created = await Student.create({
      ...data,
      accessCode: data.accessCode.toUpperCase().replace(/\s+/g, ''),
      provider: req.principal!.id,
    });
    res.status(201).json(created);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req: SwAuthRequest, res) => {
    await Student.deleteOne({ _id: req.params.id, provider: req.principal!.id });
    res.json({ ok: true });
  })
);

export default router;
