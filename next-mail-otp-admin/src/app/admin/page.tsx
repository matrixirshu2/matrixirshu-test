'use client'
import { useEffect, useState } from 'react'

type User = { id: string; email: string; role: 'USER'|'ADMIN'; isBlocked: boolean; createdAt: string }

export default function Admin() {
  const [users, setUsers] = useState<User[]>([])
  async function load() {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data.users || [])
  }
  async function toggleBlock(id: string) {
    await fetch(`/api/admin/user/${id}/toggle-block`, { method: 'POST' })
    await load()
  }
  async function promote(id: string) {
    await fetch(`/api/admin/user/${id}/promote`, { method: 'POST' })
    await load()
  }
  useEffect(()=>{ load() }, [])
  return (
    <main>
      <h1>Admin Panel</h1>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr><th align="left">Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u=> (
            <tr key={u.id} style={{borderTop:'1px solid #ddd'}}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isBlocked ? 'Blocked' : 'Active'}</td>
              <td>
                <button onClick={()=>promote(u.id)} style={{marginRight:8}}>Toggle Admin</button>
                <button onClick={()=>toggleBlock(u.id)}>{u.isBlocked?'Unblock':'Block'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
