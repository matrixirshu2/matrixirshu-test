import { getSession } from '@/lib/auth';
import { listUsers } from '@/lib/db';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) return <div className="container"><div className="card"><p>You must <Link href="/login">log in</Link>.</p></div></div>;
  if (session.role !== 'admin') return <div className="container"><div className="card"><p>Admins only.</p></div></div>;

  const users = await listUsers();

  return (
    <div>
      <div className="topbar">
        <strong>Admin Panel</strong>
        <form action="/api/auth/logout" method="post"><button>Logout</button></form>
      </div>
      <div className="container">
        <div className="card">
          <h2>Users</h2>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.is_disabled ? 'Disabled' : 'Active'}</td>
                  <td style={{display:'flex', gap:8}}>
                    <form action="/api/users" method="post">
                      <input type="hidden" name="action" value="role"/>
                      <input type="hidden" name="id" value={u.id}/>
                      <select name="role" defaultValue={u.role}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                      <button>Set</button>
                    </form>
                    <form action="/api/users" method="post">
                      <input type="hidden" name="action" value="disable"/>
                      <input type="hidden" name="id" value={u.id}/>
                      <input type="hidden" name="disabled" value={u.is_disabled ? 'false':'true'}/>
                      <button>{u.is_disabled ? 'Enable' : 'Disable'}</button>
                    </form>
                    <form action="/api/users" method="post" onSubmit={(e)=>{ if(!confirm('Delete user?')) e.preventDefault();}}>
                      <input type="hidden" name="action" value="delete"/>
                      <input type="hidden" name="id" value={u.id}/>
                      <button>Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}