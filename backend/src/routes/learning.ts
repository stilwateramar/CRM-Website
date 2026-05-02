import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { LearningMaterial } from '../models/Learning';
import { protect, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const filter: any = { studio: req.user!.studio };
    if (req.query.level) filter.level = req.query.level;
    if (req.query.category) filter.category = req.query.category;
    const items = await LearningMaterial.find(filter).sort({ createdAt: -1 });
    res.json(items);
  })
);

router.post(
  '/',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const item = await LearningMaterial.create({ ...req.body, studio: req.user!.studio });
    res.status(201).json(item);
  })
);

router.put(
  '/:id',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const item = await LearningMaterial.findOneAndUpdate(
      { _id: req.params.id, studio: req.user!.studio },
      req.body,
      { new: true }
    );
    res.json(item);
  })
);

router.delete(
  '/:id',
  protect,
  requireRole('owner', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    await LearningMaterial.deleteOne({ _id: req.params.id, studio: req.user!.studio });
    res.json({ message: 'Deleted' });
  })
);

export default router;
