import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { SiteConfig } from '../../models/stillwater/SiteConfig';
import { Provider } from '../../models/stillwater/Provider';
import { swProtect, SwAuthRequest } from './auth';

const router = Router();

router.use(swProtect('provider'));

router.get(
  '/',
  asyncHandler(async (req: SwAuthRequest, res) => {
    let cfg = await SiteConfig.findOne({ provider: req.principal!.id });
    if (!cfg) {
      const provider = await Provider.findById(req.principal!.id);
      cfg = await SiteConfig.create({ provider: req.principal!.id, email: provider?.email || '' });
    }
    res.json(cfg);
  })
);

const updateSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  instagram: z.string().optional(),
  showSchedule: z.boolean().optional(),
  showBlog: z.boolean().optional(),
});

router.put(
  '/',
  asyncHandler(async (req: SwAuthRequest, res) => {
    const data = updateSchema.parse(req.body);
    const cfg = await SiteConfig.findOneAndUpdate(
      { provider: req.principal!.id },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json(cfg);
  })
);

export default router;
