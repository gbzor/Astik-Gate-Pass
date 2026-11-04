// ---------------------------------------------------------------------------
// DATA ACCESS LAYER: TEMPORARY IN-MEMORY VERSION
//
// The rest of the backend only talks to the data through the functions in
// this file. Right now they keep everything in memory (lost on restart) so the
// API can run before the real database exists.
//
// For the database developer: replace each function body with real queries
// and keep the same names, inputs and return shapes. Use parameterized
// queries or an ORM, never string-built SQL. See docs/DATABASE_CONTRACT.md.
// ---------------------------------------------------------------------------
import crypto from 'node:crypto';

const tables = {
  users: [],
};

const newId = () => crypto.randomUUID();
const now = () => new Date().toISOString();
// Return copies so callers can't change stored rows by accident (a real DB behaves the same way).
const copy = (row) => (row ? structuredClone(row) : null);

// --- users ------------------------------------------------------------------
export const users = {
  async findById(id) {
    return copy(tables.users.find((u) => u.id === id));
  },
  async findByEmail(email) {
    const target = email.toLowerCase();
    return copy(tables.users.find((u) => u.email === target));
  },
  async findBySchoolId(schoolId) {
    const target = schoolId.toUpperCase();
    return copy(tables.users.find((u) => u.schoolId === target));
  },
  async create(data) {
    const user = {
      id: newId(),
      ...data,
      email: data.email.toLowerCase(),
      schoolId: data.schoolId.toUpperCase(),
      createdAt: now(),
      updatedAt: now(),
    };
    tables.users.push(user);
    return copy(user);
  },
  async update(id, patch) {
    const user = tables.users.find((u) => u.id === id);
    if (!user) return null;
    Object.assign(user, patch, { updatedAt: now() });
    return copy(user);
  },
};
