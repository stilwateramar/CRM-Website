import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { protect, requireRole, AuthRequest } from '../middleware/auth';
import { normalizeImportedContacts, sendWhatsappText } from '../services/whatsappService';

const router = Router();

router.get(
  '/',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const students = await User.find({ studio: req.user!.studio, role: 'student' })
      .select('name email phone source preferences createdAt')
      .sort({ createdAt: -1 });
    res.json(students);
  })
);

router.post(
  '/',
  protect,
  requireRole('owner', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const tempPassword = Math.random().toString(36).slice(2, 10);
    const student = await User.create({
      ...req.body,
      role: 'student',
      studio: req.user!.studio,
      password: tempPassword,
    });
    res.status(201).json({ student, tempPassword });
  })
);

router.post(
  '/import',
  protect,
  requireRole('owner', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const rows = normalizeImportedContacts(req.body.contacts || []);
    const studioId = req.user!.studio;
    const created: any[] = [];
    const skipped: any[] = [];
    for (const r of rows) {
      const email = r.email || `${r.phone}@imported.local`;
      const existing = await User.findOne({ email });
      if (existing) {
        skipped.push({ email, reason: 'already exists' });
        continue;
      }
      const u = await User.create({
        name: r.name,
        email,
        phone: r.phone,
        password: await bcrypt.hash(Math.random().toString(36), 10),
        role: 'student',
        studio: studioId,
        source: req.body.source || 'whatsapp',
      });
      created.push({ id: u._id, name: u.name, email: u.email, phone: u.phone });
    }
    res.json({ created, skipped, total: rows.length });
  })
);

router.get(
  '/:id',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const student = await User.findOne({ _id: req.params.id, studio: req.user!.studio });
    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }
    const bookings = await Booking.find({ student: student._id })
      .populate('yogaClass')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ student, bookings });
  })
);

router.post(
  '/:id/message',
  protect,
  requireRole('owner', 'teacher', 'admin'),
  asyncHandler(async (req: AuthRequest, res) => {
    const student = await User.findOne({ _id: req.params.id, studio: req.user!.studio });
    if (!student?.phone) {
      res.status(400).json({ message: 'No phone number on file' });
      return;
    }
    const result = await sendWhatsappText(student.phone, req.body.message);
    res.json(result);
  })
);

export default router;
