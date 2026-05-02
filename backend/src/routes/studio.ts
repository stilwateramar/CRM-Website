import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Studio } from '../models/Studio';
import { protect, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

router.get(
  '/me',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    if (!req.user?.studio) {
      res.status(404).json({ message: 'No studio associated' });
      return;
    }
    const studio = await Studio.findById(req.user.studio);
    res.json(studio);
  })
);

router.put(
  '/me',
  protect,
  requireRole('owner', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const studio = await Studio.findByIdAndUpdate(req.user!.studio, req.body, { new: true });
    res.json(studio);
  })
);

router.get(
  '/public/:slug',
  asyncHandler(async (req, res) => {
    const studio = await Studio.findOne({ slug: req.params.slug }).select(
      'name slug description logo address phone email socialLinks'
    );
    if (!studio) {
      res.status(404).json({ message: 'Studio not found' });
      return;
    }
    res.json(studio);
  })
);

export default router;
