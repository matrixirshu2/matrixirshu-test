import crypto from 'crypto';
import { sql } from '@vercel/postgres';

export function generateCode(length = 6) {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

export function hashCode(code: string, salt: string) {
  return crypto.createHash('sha256').update(code + ':' + salt).digest('hex');
}

export async function saveOTP(email: string, code: string, ttlSeconds = 300) {
  const salt = crypto.randomBytes(8).toString('hex');
  const code_hash = hashCode(code, salt) + ':' + salt;
  const expires_at = new Date(Date.now() + ttlSeconds * 1000);
  await sql`INSERT INTO otps (email, code_hash, expires_at) VALUES (${email}, ${code_hash}, ${expires_at});`;
}

export async function verifyOTP(email: string, code: string) {
  const { rows } = await sql`
    SELECT * FROM otps 
    WHERE email=${email} AND used=false AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 10;
  `;
  for (const row of rows) {
    const [storedHash, salt] = (row.code_hash as string).split(':');
    const attempt = hashCode(code, salt);
    if (attempt === storedHash) {
      await sql`UPDATE otps SET used=true WHERE id=${row.id};`;
      return true;
    }
  }
  return false;
}