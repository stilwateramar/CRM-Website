import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { User } from '../models/User';
import { Studio } from '../models/Studio';
import { Website } from '../models/Website';
import { signToken, slugify } from '../utils/jwt';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['owner', 'teacher', 'student']).default('owner'),
  studioName: z.string().optional(),
});

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
    });

    let studio = null;
    if (data.role === 'owner') {
      const baseSlug = slugify(data.studioName || data.name);
      let slug = baseSlug;
      let i = 1;
      while (await Studio.findOne({ slug })) slug = `${baseSlug}-${i++}`;
      studio = await Studio.create({
        name: data.studioName || `${data.name}'s Studio`,
        owner: user._id,
        slug,
      });
      await Website.create({ studio: studio._id });
      user.studio = studio._id;
      await user.save();
    }

    res.status(201).json({
      token: signToken(user._id.toString()),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, studio: user.studio },
    });
  })
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user || !(await user.comparePassword(data.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    res.json({
      token: signToken(user._id.toString()),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, studio: user.studio },
    });
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const u = req.user!;
    res.json({ id: u._id, name: u.name, email: u.email, role: u.role, studio: u.studio, phone: u.phone });
  })
);

export default router;
