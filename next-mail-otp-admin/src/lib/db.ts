import { sql } from '@vercel/postgres';

export async function createTablesIfNotExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      is_disabled BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS otps (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export async function getUserByEmail(email: string) {
  const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
  return rows[0] || null;
}

export async function ensureUser(email: string) {
  const existing = await getUserByEmail(email);
  if (existing) return existing;
  const { rows } = await sql`
    INSERT INTO users (email) VALUES (${email}) ON CONFLICT (email) DO NOTHING RETURNING *;
  `;
  return rows[0] || (await getUserByEmail(email));
}

export async function listUsers() {
  const { rows } = await sql`SELECT id, email, role, is_disabled, created_at FROM users ORDER BY created_at DESC;`;
  return rows;
}

export async function setUserRole(id: number, role: string) {
  await sql`UPDATE users SET role=${role} WHERE id=${id};`;
}

export async function setUserDisabled(id: number, disabled: boolean) {
  await sql`UPDATE users SET is_disabled=${disabled} WHERE id=${id};`;
}

export async function deleteUser(id: number) {
  await sql`DELETE FROM users WHERE id=${id};`;
}