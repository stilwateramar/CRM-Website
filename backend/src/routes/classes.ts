import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { YogaClass } from '../models/Class';
import { Studio } from '../models/Studio';
import { protect, requireRole, AuthRequest } from '../middleware/auth';
import { createZoomMeeting, createGoogleMeet } from '../services/meetingService';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const filter: any = { studio: req.user!.studio };
    if (req.query.from) filter.startTime = { ...filter.startTime, $gte: new Date(req.query.from as string) };
    if (req.query.to) filter.startTime = { ...filter.startTime, $lte: new Date(req.query.to as string) };
    const classes = await YogaClass.find(filter).populate('teacher', 'name avatar').sort({ startTime: 1 });
    res.json(classes);
  })
);

router.post(
  '/',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const studio = await Studio.findById(req.user!.studio);
    if (!studio) {
      res.status(404).json({ message: 'Studio not found' });
      return;
    }
    const cls = await YogaClass.create({
      ...req.body,
      studio: studio._id,
      teacher: req.body.teacher || req.user!._id,
    });

    if (cls.type !== 'in-person' && req.body.createMeeting) {
      try {
        if (req.body.meetingProvider === 'zoom' && studio.integrations?.zoom?.accessToken) {
          const m = await createZoomMeeting({
            accessToken: studio.integrations.zoom.accessToken,
            topic: cls.title,
            startTime: cls.startTime,
            durationMinutes: cls.durationMinutes,
          });
          cls.meetingProvider = 'zoom';
          cls.meetingUrl = m.joinUrl;
          cls.meetingId = String(m.id);
        } else if (req.body.meetingProvider === 'google' && studio.integrations?.google?.accessToken) {
          const m = await createGoogleMeet({
            accessToken: studio.integrations.google.accessToken,
            summary: cls.title,
            startTime: cls.startTime,
            durationMinutes: cls.durationMinutes,
          });
          cls.meetingProvider = 'google';
          cls.meetingUrl = m.joinUrl;
          cls.meetingId = m.id;
        }
        await cls.save();
      } catch (e: any) {
        console.warn('meeting creation failed', e?.message);
      }
    }
    res.status(201).json(cls);
  })
);

router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const cls = await YogaClass.findById(req.params.id).populate('teacher', 'name avatar');
    if (!cls) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }
    res.json(cls);
  })
);

router.put(
  '/:id',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const cls = await YogaClass.findOneAndUpdate(
      { _id: req.params.id, studio: req.user!.studio },
      req.body,
      { new: true }
    );
    res.json(cls);
  })
);

router.delete(
  '/:id',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    await YogaClass.findOneAndUpdate(
      { _id: req.params.id, studio: req.user!.studio },
      { status: 'cancelled' }
    );
    res.json({ message: 'Class cancelled' });
  })
);

export default router;
