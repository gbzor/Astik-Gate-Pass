// All API routes, mounted under /api. See docs/API.md for request and response examples.
//
// Adding a new feature (vehicles, applications, parking...):
//   1. Create routes/<feature>.routes.js and controllers/<feature>.controller.js
//   2. Protect it:   requireAuth, requireRole('admin')   (or 'student', 'faculty')
//   3. Validate it:  validateBody(<schema from validators/>)
//   4. Mount it below.
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import { pool } from '../db/index.js';

const router = Router();

// Public. Also checks the database, so "is the backend working?" has one answer.
// Returns 503 (not the real error) if the database can't be reached; details go to the server log.
router.get('/health', async (req, res) => {
  let database = 'ok';
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    console.error('[health] database unreachable:', err.code || err.message || err);
    database = 'unreachable';
  }
  res.status(database === 'ok' ? 200 : 503).json({
    status: database === 'ok' ? 'ok' : 'degraded',
    database,
    time: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);

export default router;
