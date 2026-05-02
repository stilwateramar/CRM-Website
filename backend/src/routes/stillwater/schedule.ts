import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { ScheduleClass } from '../../models/stillwater/ScheduleClass';
import { swProtect, SwAuthRequest } from './auth';

const router = Router();

router.use(swProtect('provider'));

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const classSchema = z.object({
  day: z.enum(DAYS),
  time: z.string(),
  duration: z.number().int().positive().default(60),
  name: z.string().min(1),
  level: z.string().default('All levels'),
  teacher: z.string().default(''),
  spots: z.number().int().nonnegative().default(14),
});

router.get(
  '/',
  asyncHandler(async (req: SwAuthRequest, res) => {
    const items = await ScheduleClass.find({ provider: req.principal!.id }).lean();
    res.json(items);
  })
);

router.post(
  '/',
  asyncHandler(async (req: SwAuthRequest, res) => {
    const data = classSchema.parse(req.body);
    const created = await ScheduleClass.create({ ...data, provider: req.principal!.id });
    res.status(201).json(created);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req: SwAuthRequest, res) => {
    const data = classSchema.partial().parse(req.body);
    const updated = await ScheduleClass.findOneAndUpdate(
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
  asyncHandler(async (req: SwAuthRequest, res) => {
    await ScheduleClass.deleteOne({ _id: req.params.id, provider: req.principal!.id });
    res.json({ ok: true });
  })
);

export default router;
