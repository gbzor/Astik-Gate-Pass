// Reads settings from environment variables (.env) once, checks them, and
// exports a frozen object. The app refuses to start if the secret is missing or weak.

function list(name, fallback) {
  return (process.env[name] || fallback)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET is missing or shorter than 32 characters. Copy .env.example to .env and fill it in.');
}

// The database connection string (Supabase/Neon). Without it nothing can be saved.
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is missing. Copy it from your Supabase/Neon dashboard into .env (see .env.example).');
}

const isProd = process.env.NODE_ENV === 'production';

// In production the frontend's real address must be set; the localhost default is for development only.
if (isProd && !process.env.CORS_ORIGINS) {
  throw new Error('CORS_ORIGINS is missing. In production, set it to the real frontend URL (https://...).');
}

export const env = Object.freeze({
  isProd,
  port: Number(process.env.PORT) || 3000,
  // Only these frontend origins may call the API with cookies.
  corsOrigins: list('CORS_ORIGINS', 'http://localhost:5500,http://127.0.0.1:5500'),
  trustProxy: process.env.TRUST_PROXY === 'true',

  databaseUrl,

  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',

  // Sign-ups must use a school email (subdomains such as gbox.adnu.edu.ph are allowed).
  allowedEmailDomains: list('ALLOWED_EMAIL_DOMAINS', 'adnu.edu.ph'),

  seedAdmin: Object.freeze({
    email: (process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase(),
    password: process.env.SEED_ADMIN_PASSWORD || '',
  }),
});
