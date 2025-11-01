import { Router, Request, Response } from 'express';
import { findLinkBySlug, incrementClicks } from '../url.service.js';

const router = Router();

router.get('/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  
  const link = findLinkBySlug(slug);
  
  if (!link) {
    return res.status(404).json({ error: 'Short link not found' });
  }
  
  // Increment click count
  incrementClicks(slug);
  
  // Redirect with 301 (permanent redirect)
  res.redirect(301, link.url);
});

export default router;

