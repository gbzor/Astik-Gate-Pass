// All API routes, mounted under /api. See docs/API.md for request and response examples.
//
// Adding a new feature (vehicles, applications, parking...):
//   1. Create routes/<feature>.routes.js and controllers/<feature>.controller.js
//   2. Protect it:   requireAuth, requireRole('admin')   (or 'student', 'faculty')
//   3. Validate it:  validateBody(<schema from validators/>)
//   4. Mount it below.
import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

// Public
router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

router.use('/auth', authRoutes);

export default router;
