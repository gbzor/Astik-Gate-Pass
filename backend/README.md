# Astik Gate Pass: Backend

REST API for the Ateneo de Naga University Campus Sticker Car Parking System.

This is the **starter**: the server foundation plus authentication (sign-up, user login, admin login,
logout, current user) and role-based access control. Vehicles, sticker applications, admin records
and parking are built on top of it next.

**Stack (all free):** Node.js 22.9+ · Express 5 · Zod validation · bcrypt · JWT in HttpOnly cookies ·
Helmet · express-rate-limit

> **Database:** not connected yet. `src/db/index.js` keeps data **in memory**, so it resets on every
> restart. The database developer replaces it by following [docs/DATABASE_CONTRACT.md](docs/DATABASE_CONTRACT.md).

## Run it locally

1. Open a terminal in this `backend` folder and install the packages:
   ```powershell
   npm install
   ```
   It should finish with `found 0 vulnerabilities`.
2. Create your settings file from the template:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Generate a secret, then paste the result after `JWT_SECRET=` in `.env`:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
4. In `.env`, set `SEED_ADMIN_PASSWORD` to a password of 12+ characters for the first admin account.
5. Start the server:
   ```powershell
   npm run dev
   ```
   You should see `Astik Gate Pass API running at http://localhost:3000/api`.
6. Open <http://localhost:3000/api/health> in your browser. You should see `{"status":"ok",...}`.

Run the automated tests anytime with `npm test`.

## Folder layout

```
src/
  server.js                 starts the server
  app.js                    security headers, CORS, JSON, routes
  config/env.js             reads and checks .env
  config/constants.js       roles, statuses, bcrypt cost
  routes/index.js           mounts every feature's routes under /api
  routes/auth.routes.js     /api/auth/* URLs
  controllers/              request handlers
  middleware/               auth + roles, validation, rate limits, errors
  validators/               Zod schemas for every input
  utils/                    HttpError, publicUser (safe response shapes)
  db/index.js               data access; replace with the real database
  db/seed.js                creates the first admin
test/                       automated API tests (npm test)
docs/API.md                 endpoints for the frontend team
docs/DATABASE_CONTRACT.md   tables and functions for the database developer
```

## Adding a feature

1. Add `routes/<feature>.routes.js` and `controllers/<feature>.controller.js`.
2. Add a Zod schema in `validators/` and use `validateBody(schema)` on every POST/PATCH.
3. Protect routes with `requireAuth` and `requireRole('admin')` (or `'student'`, `'faculty'`).
4. Check ownership in the controller, so users can only touch their own records.
5. Add the data functions to `db/index.js` and document them in `docs/DATABASE_CONTRACT.md`.
6. Mount the router in `routes/index.js`, document it in `docs/API.md`, and add tests.

## Security built in

- Passwords hashed with bcrypt (cost 12). Wrong email and wrong password take the same time and get the same message.
- Session JWT in an `HttpOnly`, `SameSite=Strict` cookie (`Secure` in production). Every request rechecks that the account still exists and is active.
- Separate student/faculty and admin login pages. Sign-up can never create an admin.
- Zod validates every input and drops unknown fields.
- Helmet security headers, CORS limited to your frontend, a 100 KB JSON limit, and rate limits (10 auth attempts per 15 min).
- Errors never expose stack traces.

## Before deploying

- Set `NODE_ENV=production`, use HTTPS, and set `CORS_ORIGINS` to the real frontend URL.
- Set `TRUST_PROXY=true` on hosts like Render or Railway.

## Maps (not in this starter)

The ticket asks for Google Maps, but **Google Maps Platform needs a billing account with a credit card**.
Free option with no key and no card: **Leaflet + OpenStreetMap** in the frontend, with the backend
storing parking area coordinates. Confirm with the team before choosing.
