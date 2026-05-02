import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Booking } from '../models/Booking';
import { YogaClass } from '../models/Class';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const cls = await YogaClass.findById(req.body.yogaClass);
    if (!cls) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }
    const count = await Booking.countDocuments({
      yogaClass: cls._id,
      status: { $in: ['pending', 'confirmed', 'attended'] },
    });
    if (count >= cls.capacity) {
      res.status(409).json({ message: 'Class is full' });
      return;
    }
    const booking = await Booking.create({
      yogaClass: cls._id,
      student: req.user!._id,
      studio: cls.studio,
      status: cls.price > 0 ? 'pending' : 'confirmed',
      paymentStatus: cls.price > 0 ? 'unpaid' : 'paid',
    });
    res.status(201).json(booking);
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const bookings = await Booking.find({ student: req.user!._id })
      .populate('yogaClass')
      .sort({ createdAt: -1 });
    res.json(bookings);
  })
);

router.get(
  '/studio',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const bookings = await Booking.find({ studio: req.user!.studio })
      .populate('yogaClass student')
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(bookings);
  })
);

router.post(
  '/:id/feedback',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const b = await Booking.findOne({ _id: req.params.id, student: req.user!._id });
    if (!b) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }
    b.feedback = {
      rating: Number(req.body.rating),
      comment: req.body.comment,
      createdAt: new Date(),
    };
    await b.save();
    res.json(b);
  })
);

router.post(
  '/:id/cancel',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const b = await Booking.findOneAndUpdate(
      { _id: req.params.id, student: req.user!._id },
      { status: 'cancelled' },
      { new: true }
    );
    res.json(b);
  })
);

export default router;
