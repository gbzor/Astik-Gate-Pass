# Astik Gate Pass

Campus Sticker Car Parking System for **Ateneo de Naga University (AdNU)**.

Students and faculty register their vehicles and apply for a campus parking sticker. Admins
(the Security Office) review applications, keep vehicle and parking records, and monitor parking areas.

> **Status:** in development, built as a team project for a programming course.
> The frontend pages use sample data for now and are not connected to the backend yet.

## Folders

```
Astik-Gate-Pass/
├── frontend/          Web pages (HTML, CSS, JavaScript). Opened with VS Code Live Server.
│                      Admin pages so far: login, dashboard, records list, record details.
│
├── backend/           REST API (Node.js + Express) and the database layer.
│   ├── src/           Server code: routes → controllers → services → db, plus security middleware and validation.
│   │   └── db/        PostgreSQL tables (schema.sql) and queries (index.js).
│   ├── test/          Automated API tests (npm test).
│   ├── docs/          API.md for the frontend, DATABASE_CONTRACT.md for the database.
│   ├── .env.example   Template for private settings. Copy it to .env (never committed).
│   └── README.md      How to run, test and extend the backend.
│
├── .gitignore         Keeps secrets, packages and logs out of GitHub.
└── README.md          This file.
```

## Tech stack

All free, with no credit card needed.

| Part | Tools |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js 22.9+, Express 5, Zod, bcrypt, JSON Web Tokens in HttpOnly cookies, Helmet |
| Database | PostgreSQL, hosted on a free Supabase or Neon plan |
| Maps | To be decided. Google Maps needs a billing card, so Leaflet + OpenStreetMap is the free option. |

## Getting started

1. Install [Node.js](https://nodejs.org) 22.9 or newer and [Git](https://git-scm.com).
2. Clone the repo:
   ```powershell
   git clone https://github.com/gbzor/Astik-Gate-Pass.git
   cd Astik-Gate-Pass
   ```
3. **Backend:** follow [backend/README.md](backend/README.md). The API runs at `http://localhost:3000/api`.
4. **Frontend:** open the `frontend` folder in VS Code, right-click `AdminLogin.html` and choose
   **Open with Live Server**. Use `http://localhost:5500`, not `127.0.0.1`, so the login cookie works once
   the frontend is connected.

## Documentation

- [backend/README.md](backend/README.md): run, test and add features to the API
- [backend/docs/API.md](backend/docs/API.md): every endpoint with request and response examples
- [backend/docs/DATABASE_CONTRACT.md](backend/docs/DATABASE_CONTRACT.md): tables and data functions

## Team workflow

`main` is protected, so all changes go through a pull request:

1. Update `main`: `git switch main`, then `git pull`.
2. Create a branch for your task: `git switch -c feature/short-name`.
3. Commit your work and push the branch: `git push -u origin feature/short-name`.
4. Open a pull request on GitHub, then merge it into `main`.

## Security rules

- Never commit `.env`, passwords, database URLs or keys. Share them privately, one person at a time.
- If a secret is pushed by mistake, change it right away. Deleting the commit isn't enough.
- Every input is checked on the server, even when the page already checks it.
- Run `npm audit` in `backend/` after adding packages.
