// Run with: npm test
// Starts the real app on a random port and calls it over HTTP.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

// Settings for the test run only (set before the app is imported).
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters-long';
process.env.ALLOWED_EMAIL_DOMAINS = 'adnu.edu.ph';
process.env.SEED_ADMIN_EMAIL = 'admin@adnu.edu.ph';
process.env.SEED_ADMIN_PASSWORD = 'Admin-Password-123!';

const { createApp } = await import('../src/app.js');
const { seed } = await import('../src/db/seed.js');
const { requireAuth, requireRole } = await import('../src/middleware/auth.js');

let server;
let base;

before(async () => {
  await seed();
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(() => server.close());

// Small helper: sends JSON and returns { status, body, cookie }.
async function call(method, path, { body, cookie } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: {
      ...(body && { 'Content-Type': 'application/json' }),
      ...(cookie && { Cookie: cookie }),
    },
    body: body && JSON.stringify(body),
  });
  const text = await res.text();
  const setCookie = res.headers.get('set-cookie');
  return {
    status: res.status,
    body: text ? JSON.parse(text) : null,
    cookie: setCookie ? setCookie.split(';')[0] : null,
    setCookie,
  };
}

const student = {
  role: 'student',
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  email: 'juan@gbox.adnu.edu.ph',
  schoolId: '2023-12345',
  password: 'Student-Pass-1!',
  confirmPassword: 'Student-Pass-1!',
};

test('health check works', async () => {
  const res = await call('GET', '/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('register, sign in, see profile, sign out', async () => {
  const reg = await call('POST', '/auth/register', { body: student });
  assert.equal(reg.status, 201);
  assert.equal(reg.body.user.email, student.email);
  assert.equal(reg.body.user.passwordHash, undefined, 'password hash must never be returned');

  const login = await call('POST', '/auth/login', { body: { email: student.email, password: student.password } });
  assert.equal(login.status, 200);
  assert.match(login.setCookie, /HttpOnly/i);
  assert.match(login.setCookie, /SameSite=Strict/i);

  const me = await call('GET', '/auth/me', { cookie: login.cookie });
  assert.equal(me.status, 200);
  assert.equal(me.body.user.role, 'student');

  const out = await call('POST', '/auth/logout', { cookie: login.cookie });
  assert.equal(out.status, 204);
});

test('duplicate email or ID is refused', async () => {
  const res = await call('POST', '/auth/register', { body: { ...student, email: 'other@adnu.edu.ph' } });
  assert.equal(res.status, 409);
});

test('sign-up cannot create an admin', async () => {
  const res = await call('POST', '/auth/register', {
    body: { ...student, role: 'admin', email: 'sneaky@adnu.edu.ph', schoolId: 'X-9999' },
  });
  assert.equal(res.status, 400);
});

test('sign-up rejects non-school emails and weak passwords', async () => {
  const res = await call('POST', '/auth/register', {
    body: { ...student, email: 'juan@gmail.com', schoolId: 'X-1111', password: 'short', confirmPassword: 'short' },
  });
  assert.equal(res.status, 400);
  const fields = res.body.error.fields.map((f) => f.field);
  assert.ok(fields.includes('email'));
  assert.ok(fields.includes('password'));
});

test('passwords over 72 bytes are refused (bcrypt limit)', async () => {
  const long = `Aa1!${'é'.repeat(40)}`; // 44 characters but 84 bytes
  const res = await call('POST', '/auth/register', {
    body: { ...student, email: 'long@adnu.edu.ph', schoolId: 'X-2222', password: long, confirmPassword: long },
  });
  assert.equal(res.status, 400);
  assert.ok(res.body.error.fields.some((f) => f.field === 'password'));
});

test('wrong password gets a generic error', async () => {
  const res = await call('POST', '/auth/login', { body: { email: student.email, password: 'Wrong-Pass-1!' } });
  assert.equal(res.status, 401);
  assert.equal(res.body.error.message, 'Incorrect email or password.');
});

test('each login page only accepts its own roles', async () => {
  // Student on the admin page: refused.
  const studentOnAdmin = await call('POST', '/auth/admin/login', { body: { email: student.email, password: student.password } });
  assert.equal(studentOnAdmin.status, 401);

  // Admin on the student page: refused.
  const admin = { email: 'admin@adnu.edu.ph', password: 'Admin-Password-123!' };
  const adminOnUser = await call('POST', '/auth/login', { body: admin });
  assert.equal(adminOnUser.status, 401);

  // Admin on the admin page: allowed.
  const adminOk = await call('POST', '/auth/admin/login', { body: admin });
  assert.equal(adminOk.status, 200);
  assert.equal(adminOk.body.user.role, 'admin');
});

test('protected routes need a valid session', async () => {
  assert.equal((await call('GET', '/auth/me')).status, 401);
  assert.equal((await call('GET', '/auth/me', { cookie: 'gp_session=forged.token.here' })).status, 401);
});

test('requireRole blocks the wrong role', async () => {
  const express = (await import('express')).default;
  const cookieParser = (await import('cookie-parser')).default;
  const { errorHandler } = await import('../src/middleware/errorHandler.js');

  // Tiny app with one admin-only route, using the real middleware.
  const app = express();
  app.use(cookieParser());
  app.get('/api/admin-only', requireAuth, requireRole('admin'), (req, res) => res.json({ ok: true }));
  app.use(errorHandler);
  const s = app.listen(0);
  await new Promise((resolve) => s.once('listening', resolve));
  const url = `http://127.0.0.1:${s.address().port}/api/admin-only`;

  try {
    const studentLogin = await call('POST', '/auth/login', { body: { email: student.email, password: student.password } });
    const adminLogin = await call('POST', '/auth/admin/login', { body: { email: 'admin@adnu.edu.ph', password: 'Admin-Password-123!' } });

    assert.equal((await fetch(url, { headers: { Cookie: studentLogin.cookie } })).status, 403);
    assert.equal((await fetch(url, { headers: { Cookie: adminLogin.cookie } })).status, 200);
  } finally {
    s.close();
  }
});

test('unknown routes return 404 JSON', async () => {
  const res = await call('GET', '/does-not-exist');
  assert.equal(res.status, 404);
  assert.equal(res.body.error.message, 'Not found.');
});
