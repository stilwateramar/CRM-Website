import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Provider } from '../../models/stillwater/Provider';
import { Seeker } from '../../models/stillwater/Seeker';
import { AdminUser } from '../../models/stillwater/AdminUser';
import { Student } from '../../models/stillwater/Student';
import { Otp } from '../../models/stillwater/Otp';
import { SiteConfig } from '../../models/stillwater/SiteConfig';
import { slugify } from '../../utils/jwt';

const router = Router();

const SECRET = process.env.JWT_SECRET || 'dev-secret';
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

type Principal = 'seeker' | 'student' | 'provider' | 'admin';

function signFor(type: Principal, id: string, extra: Record<string, unknown> = {}) {
  return jwt.sign({ type, id, ...extra }, SECRET, { expiresIn: EXPIRES } as jwt.SignOptions);
}

export interface SwAuthRequest extends Request {
  principal?: { type: Principal; id: string; [k: string]: unknown };
}

export function swProtect(...allow: Principal[]) {
  return (req: SwAuthRequest, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    try {
      const token = header.split(' ')[1];
      const payload = jwt.verify(token, SECRET) as { type: Principal; id: string };
      if (allow.length && !allow.includes(payload.type)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }
      req.principal = payload;
      next();
    } catch {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

/* ---------- Seeker (mobile/email OTP) ---------- */

const otpRequestSchema = z.object({
  channel: z.enum(['mobile', 'email']),
  identifier: z.string().min(3),
});

router.post(
  '/seeker/otp',
  asyncHandler(async (req, res) => {
    const { channel, identifier } = otpRequestSchema.parse(req.body);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await Otp.create({ identifier, channel, code, expiresAt });
    const dev = process.env.NODE_ENV !== 'production';
    res.json({ ok: true, message: 'Verification code sent', ...(dev ? { devCode: code } : {}) });
  })
);

const otpVerifySchema = z.object({
  channel: z.enum(['mobile', 'email']),
  identifier: z.string().min(3),
  code: z.string().min(4),
  name: z.string().optional(),
});

router.post(
  '/seeker/verify',
  asyncHandler(async (req, res) => {
    const { channel, identifier, code, name } = otpVerifySchema.parse(req.body);
    const record = await Otp.findOne({ identifier, channel, code, consumed: false }).sort({ createdAt: -1 });
    if (!record || record.expiresAt < new Date()) {
      res.status(401).json({ message: 'Invalid or expired code' });
      return;
    }
    record.consumed = true;
    await record.save();

    const filter = channel === 'mobile' ? { mobile: identifier } : { email: identifier };
    let seeker = await Seeker.findOne(filter);
    if (!seeker) {
      seeker = await Seeker.create({ ...filter, name });
    } else if (name && !seeker.name) {
      seeker.name = name;
      await seeker.save();
    }

    res.json({
      token: signFor('seeker', seeker._id.toString()),
      user: { id: seeker._id, name: seeker.name, mobile: seeker.mobile, email: seeker.email, type: 'seeker' },
    });
  })
);

/* ---------- Student (access code) ---------- */

const studentLoginSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(4),
});

router.post(
  '/student/login',
  asyncHandler(async (req, res) => {
    const { name, code } = studentLoginSchema.parse(req.body);
    const cleaned = code.toUpperCase().replace(/\s+/g, '');
    const student = await Student.findOne({ accessCode: cleaned, name });
    if (!student) {
      res.status(401).json({ message: 'No student found with that name and code' });
      return;
    }
    res.json({
      token: signFor('student', student._id.toString(), { provider: student.provider.toString() }),
      user: { id: student._id, name: student.name, provider: student.provider, type: 'student' },
    });
  })
);

/* ---------- Provider (email + password) ---------- */

const providerSignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  studioName: z.string().min(2),
  practice: z.string().optional(),
  phone: z.string().optional(),
});

router.post(
  '/provider/signup',
  asyncHandler(async (req, res) => {
    const data = providerSignupSchema.parse(req.body);
    const existing = await Provider.findOne({ email: data.email });
    if (existing) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }
    const baseSlug = slugify(data.studioName);
    let slug = baseSlug;
    let i = 1;
    while (await Provider.findOne({ slug })) slug = `${baseSlug}-${i++}`;
    const provider = await Provider.create({ ...data, slug });
    await SiteConfig.create({ provider: provider._id, email: provider.email });
    res.status(201).json({
      token: signFor('provider', provider._id.toString()),
      user: { id: provider._id, name: provider.name, email: provider.email, studioName: provider.studioName, slug: provider.slug, type: 'provider' },
    });
  })
);

const providerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post(
  '/provider/login',
  asyncHandler(async (req, res) => {
    const data = providerLoginSchema.parse(req.body);
    const provider = await Provider.findOne({ email: data.email }).select('+password');
    if (!provider || !(await provider.comparePassword(data.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    res.json({
      token: signFor('provider', provider._id.toString()),
      user: { id: provider._id, name: provider.name, email: provider.email, studioName: provider.studioName, slug: provider.slug, type: 'provider' },
    });
  })
);

/* ---------- Admin (email + password + 2FA) ---------- */

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  twoFactor: z.string().min(4),
});

router.post(
  '/admin/login',
  asyncHandler(async (req, res) => {
    const data = adminLoginSchema.parse(req.body);
    const admin = await AdminUser.findOne({ email: data.email }).select('+password');
    if (!admin || !(await admin.comparePassword(data.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const expectedCode = process.env.STILLWATER_ADMIN_2FA || '123456';
    if (data.twoFactor !== expectedCode) {
      res.status(401).json({ message: 'Invalid two-factor code' });
      return;
    }
    res.json({
      token: signFor('admin', admin._id.toString()),
      user: { id: admin._id, name: admin.name, email: admin.email, type: 'admin' },
    });
  })
);

/* ---------- Current principal ---------- */

router.get(
  '/me',
  swProtect(),
  asyncHandler(async (req: SwAuthRequest, res) => {
    const p = req.principal!;
    if (p.type === 'provider') {
      const provider = await Provider.findById(p.id);
      if (!provider) {
        res.status(401).json({ message: 'Not found' });
        return;
      }
      res.json({ id: provider._id, name: provider.name, email: provider.email, studioName: provider.studioName, slug: provider.slug, type: 'provider' });
      return;
    }
    if (p.type === 'seeker') {
      const seeker = await Seeker.findById(p.id);
      if (!seeker) {
        res.status(401).json({ message: 'Not found' });
        return;
      }
      res.json({ id: seeker._id, name: seeker.name, mobile: seeker.mobile, email: seeker.email, type: 'seeker' });
      return;
    }
    if (p.type === 'student') {
      const student = await Student.findById(p.id);
      if (!student) {
        res.status(401).json({ message: 'Not found' });
        return;
      }
      res.json({ id: student._id, name: student.name, provider: student.provider, type: 'student' });
      return;
    }
    if (p.type === 'admin') {
      const admin = await AdminUser.findById(p.id);
      if (!admin) {
        res.status(401).json({ message: 'Not found' });
        return;
      }
      res.json({ id: admin._id, name: admin.name, email: admin.email, type: 'admin' });
      return;
    }
    res.status(401).json({ message: 'Unknown principal' });
  })
);

export default router;
