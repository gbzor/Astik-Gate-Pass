// Creates the first admin account at startup from SEED_ADMIN_EMAIL and
// SEED_ADMIN_PASSWORD in .env. Admins can't sign up through the API.
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { BCRYPT_COST } from '../config/constants.js';
import { users } from './index.js';

export async function seed() {
  const { email, password } = env.seedAdmin;
  if (!email || password.length < 12) {
    console.warn('[seed] No admin created. Set SEED_ADMIN_EMAIL and a 12+ character SEED_ADMIN_PASSWORD in .env.');
    return;
  }
  if (await users.findByEmail(email)) return;

  await users.create({
    role: 'admin',
    status: 'active',
    firstName: 'System',
    lastName: 'Admin',
    email,
    schoolId: 'ADMIN-0001',
    passwordHash: await bcrypt.hash(password, BCRYPT_COST),
  });
  console.log(`[seed] Admin account ready: ${email}`);
}
