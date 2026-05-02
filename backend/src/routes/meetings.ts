import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Studio } from '../models/Studio';
import { protect, AuthRequest } from '../middleware/auth';
import { exchangeZoomCode, exchangeGoogleCode } from '../services/meetingService';

const router = Router();

router.get('/zoom/connect', protect, (_req, res) => {
  const url =
    `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.ZOOM_REDIRECT_URI || '')}`;
  res.json({ url });
});

router.get(
  '/zoom/callback',
  asyncHandler(async (req, res) => {
    const code = req.query.code as string;
    const studioId = req.query.state as string;
    const tokens = await exchangeZoomCode(code);
    if (studioId) {
      await Studio.findByIdAndUpdate(studioId, {
        'integrations.zoom.connected': true,
        'integrations.zoom.accessToken': tokens.access_token,
        'integrations.zoom.refreshToken': tokens.refresh_token,
      });
    }
    res.redirect(`${process.env.CORS_ORIGIN || 'http://localhost:5173'}/meetings?connected=zoom`);
  })
);

router.get('/google/connect', protect, (_req, res) => {
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?response_type=code` +
    `&client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || '')}` +
    `&scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar.events')}` +
    `&access_type=offline&prompt=consent`;
  res.json({ url });
});

router.get(
  '/google/callback',
  asyncHandler(async (req, res) => {
    const code = req.query.code as string;
    const studioId = req.query.state as string;
    const tokens = await exchangeGoogleCode(code);
    if (studioId) {
      await Studio.findByIdAndUpdate(studioId, {
        'integrations.google.connected': true,
        'integrations.google.accessToken': tokens.access_token,
        'integrations.google.refreshToken': tokens.refresh_token,
      });
    }
    res.redirect(`${process.env.CORS_ORIGIN || 'http://localhost:5173'}/meetings?connected=google`);
  })
);

router.get(
  '/status',
  protect,
  asyncHandler(async (req: AuthRequest, res) => {
    const studio = await Studio.findById(req.user!.studio).select('integrations');
    res.json({
      zoom: !!studio?.integrations?.zoom?.connected,
      google: !!studio?.integrations?.google?.connected,
    });
  })
);

export default router;
