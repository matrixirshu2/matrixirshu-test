import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function Home() {
  const session = await getSession();
  return (
    <div>
      <div className="topbar">
        <strong>Mail OTP Demo</strong>
        <div>
          {session ? (
            <form action="/api/auth/logout" method="post"><button>Logout</button></form>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
      <div className="container">
        <div className="card">
          <h1>Welcome{session ? `, ${session.email}` : ''}!</h1>
          {!session && <p className="badge">You are not logged in. <Link href="/login">Go to login</Link>.</p>}
          {session && (
            <ul>
              <li><Link href="/(protected)/admin">Admin Panel</Link> (admins only)</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}