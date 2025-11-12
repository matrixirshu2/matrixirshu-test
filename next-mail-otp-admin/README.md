# Next.js Email OTP + Admin (Resend + Prisma + Postgres)

This starter gives you:
- Email OTP login via Resend
- JWT cookie session
- Prisma + Postgres for users, OTPs, sessions
- Simple Admin panel to list users, block/unblock, toggle admin
- Works on Vercel (App Router + route handlers)

## 1) Configure ENV

Create `.env.local` (we already created one with your key):

```
RESEND_API_KEY=... # provided
FROM_EMAIL=Your App <onboarding@resend.dev>
POSTGRES_URL=postgres://USER:PASSWORD@HOST:PORT/DB
JWT_SECRET=change_me
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Vercel:** Add the same variables in **Project → Settings → Environment Variables**.

## 2) Install & DB

```bash
npm install
npm run prisma:generate
# set POSTGRES_URL first then
npm run prisma:migrate
```

## 3) Run

```bash
npm run dev
```

Open http://localhost:3000

## 4) Admin Access

After you sign in once, promote your user to ADMIN in the database (or via API):

```sql
-- In SQL client
UPDATE "User" SET role='ADMIN' WHERE email='your@email.com';
```

Or call the toggle admin endpoint once you've set an admin manually.

## 5) Common 404 Fixes (Vercel)

- Ensure your API routes live under `app/api/.../route.ts` (they do).
- Ensure `next.config.mjs` has `output: 'standalone'` (done).
- Make sure build succeeds and Prisma is included at build time (it is).
- Set your ENV in Vercel for **Production** and **Preview** and redeploy.
- If you see `404: NOT_FOUND` on your API, check project base path; your fetches are relative (`/api/...`), which is correct on Vercel.

## 6) Security

- Use a very long `JWT_SECRET` in production.
- Set a verified sender in Resend and domain as needed.
- Consider rate limiting OTP requests by IP/email.
