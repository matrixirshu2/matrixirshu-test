# Next.js Email OTP Auth + Admin Panel (Vercel-ready)

**What you get**
- Email login with **6-digit OTP** (expires in 5 minutes)
- **Admin Panel** to list users, set role (user/admin), disable/enable, and delete
- JWT cookie sessions
- **Vercel Postgres** for data, **Resend** for sending email
- Ready for **Deploy on Vercel** and connect to **GitHub**

## 1) Local setup
1. Install Node.js (LTS).
2. Create `.env.local`:
```
JWT_SECRET=replace_with_random_long_string
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=Your App <onboarding@resend.dev>
POSTGRES_URL=postgres://USER:PASSWORD@HOST:PORT/DB
POSTGRES_PRISMA_URL=${POSTGRES_URL}
POSTGRES_URL_NON_POOLING=${POSTGRES_URL}
```
3. Install & run:
```
npm install
npm run dev
```
4. Create tables (one-time):
```
curl -X POST http://localhost:3000/api/setup
```
5. Open http://localhost:3000/login, enter email, then the code you receive.

**Promote yourself to admin (first time):**
```
UPDATE users SET role='admin' WHERE email='you@example.com';
```

## 2) Deploy on Vercel (GitHub)
- Push to a new GitHub repo, then on Vercel: New Project → Import from GitHub.
- Provision **Vercel Postgres** (Storage tab).
- Add env vars: `JWT_SECRET`, `RESEND_API_KEY`, `FROM_EMAIL`. (Postgres vars auto-added when attached.)
- Deploy, then run POST `https://<your-url>/api/setup` once.

## 3) How it works
- `/api/auth/request-otp` → generate 6-digit code, store **hashed** with expiry, email it.
- `/api/auth/verify-otp` → verify code, set **JWT cookie** containing `email` + `role`.
- `/(protected)/admin` → manage users (role/disable/delete).

**Tables**
```
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_disabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otps (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 4) Notes
- Use a verified sender in Resend.
- Add rate-limits to request-otp in production.
- To add GitHub OAuth later, integrate **Auth.js** with a GitHub provider.