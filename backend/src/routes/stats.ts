import { Router, Request, Response } from 'express';
import { getLinkStats } from '../url.service.js';

const router = Router();

router.get('/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  
  const stats = getLinkStats(slug);
  
  if (!stats) {
    return res.status(404).json({ error: 'Short link not found' });
  }
  
  res.json(stats);
});

export default router;

