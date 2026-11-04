import { rateLimit } from 'express-rate-limit';

const message = (text) => ({ error: { message: text } });
// Automated tests send many requests quickly, so limits are off only when NODE_ENV=test.
const skip = () => process.env.NODE_ENV === 'test';

// General limit for the whole API.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip,
  message: message('Too many requests. Please try again in a few minutes.'),
});

// Stricter limit for sign-in and sign-up, to slow down password guessing.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip,
  message: message('Too many attempts. Please wait 15 minutes and try again.'),
});
