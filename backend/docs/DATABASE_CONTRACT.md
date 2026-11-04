# Database contract (for the database developer)

The backend reads and writes data only through `src/db/index.js`. Right now that file stores
everything in memory, so it's lost on restart. To connect a real database, replace each function
body with real queries. Nothing else in the backend needs to change.

**Rules**

1. Keep every function name, its parameters and its return shape. Functions are `async`.
2. Return plain objects with the **camelCase** field names below. Map `snake_case` columns if you use them.
3. Return `null` when a single row isn't found.
4. Use parameterized queries or an ORM. Never build SQL by joining strings with user input.
5. Store connection details in `.env` (for example `DATABASE_URL`), never in code.
6. Run `npm test` when you finish.

Free hosted options with no card required: **Supabase** or **Neon** (Postgres), **Aiven** (MySQL).
Check the current free-tier limits before choosing.

## Table: users

| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| role | enum `student`, `faculty`, `admin` | |
| status | enum `active`, `disabled` | Only `active` can sign in |
| firstName, lastName | varchar(60) | |
| email | varchar(254) **unique** | Stored lowercase |
| schoolId | varchar(20) **unique** | Student ID or Employee ID, stored uppercase |
| passwordHash | varchar(100) | bcrypt hash. Never return it from the API |
| createdAt, updatedAt | timestamptz | |

## Functions in `src/db/index.js`

| Function | Returns |
|---|---|
| `users.findById(id)` | user or `null` |
| `users.findByEmail(email)` | user or `null` (case-insensitive) |
| `users.findBySchoolId(schoolId)` | user or `null` (case-insensitive) |
| `users.create(data)` | the new user, with `id`, `createdAt`, `updatedAt` filled in |
| `users.update(id, patch)` | the updated user, or `null` if not found |

New tables (vehicles, applications, parking) will be added here as those features are built.
