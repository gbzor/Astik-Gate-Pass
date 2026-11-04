import bcrypt from 'bcryptjs';
import { BCRYPT_COST } from '../config/constants.js';
import { users } from '../db/index.js';
import { clearSessionCookie, setSessionCookie } from '../middleware/auth.js';
import { HttpError } from '../utils/httpError.js';
import { publicUser } from '../utils/present.js';

// Compared against when the email doesn't exist, so a wrong email takes as long
// as a wrong password and attackers can't tell which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_COST);

// POST /api/auth/register: students and faculty only. Admins are seeded, never signed up.
export async function register(req, res) {
  const data = req.body;

  if ((await users.findByEmail(data.email)) || (await users.findBySchoolId(data.schoolId))) {
    throw new HttpError(409, 'An account with this email or ID number already exists.');
  }

  const user = await users.create({
    role: data.role,
    status: 'active',
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    schoolId: data.schoolId,
    passwordHash: await bcrypt.hash(data.password, BCRYPT_COST),
  });

  res.status(201).json({ user: publicUser(user), message: 'Account created. You can now sign in.' });
}

// Shared sign-in logic. `portal` decides which roles may use that login page,
// so an admin can't sign in on the student page and a student can't use the admin page.
async function signIn(req, res, portal) {
  const { email, password } = req.body;
  const user = await users.findByEmail(email);
  const passwordOk = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  const portalOk = user && (portal === 'admin' ? user.role === 'admin' : user.role !== 'admin');

  if (!user || !passwordOk || !portalOk) {
    console.warn(`[auth] Failed ${portal} sign-in from ${req.ip}`);
    throw new HttpError(401, 'Incorrect email or password.');
  }
  if (user.status !== 'active') {
    throw new HttpError(403, 'This account is disabled. Please contact the Security Office.');
  }

  setSessionCookie(res, user);
  res.json({ user: publicUser(user) });
}

// POST /api/auth/login: student and faculty login page.
export const login = (req, res) => signIn(req, res, 'user');

// POST /api/auth/admin/login: admin login page.
export const adminLogin = (req, res) => signIn(req, res, 'admin');

// POST /api/auth/logout
export function logout(req, res) {
  clearSessionCookie(res);
  res.status(204).end();
}

// GET /api/auth/me: who is signed in (used by the frontend on page load).
export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
