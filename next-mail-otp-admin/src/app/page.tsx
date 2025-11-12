'use client'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email'|'code'>('email')
  const [msg, setMsg] = useState<string|undefined>()

  async function requestOtp() {
    setMsg('Sending code...')
    const res = await fetch('/api/auth/request-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const data = await res.json()
    if (data.ok) { setStep('code'); setMsg('Check your email for the code.') } else { setMsg(data.error || 'Failed') }
  }

  async function verify() {
    setMsg('Verifying...')
    const res = await fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code }) })
    const data = await res.json()
    if (data.ok) {
      setMsg('Signed in!')
      if (data.role === 'ADMIN') window.location.href = '/admin'
      else window.location.href = '/'
    } else setMsg(data.error || 'Failed')
  }

  return (
    <main>
      <h1>Welcome</h1>
      {step === 'email' ? (
        <div>
          <label>Email</label><br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{padding:8,width:'100%'}}/>
          <button onClick={requestOtp} style={{marginTop:12,padding:8}}>Send OTP</button>
        </div>
      ) : (
        <div>
          <label>Enter Code</label><br/>
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="6-digit code" style={{padding:8,width:'100%'}}/>
          <button onClick={verify} style={{marginTop:12,padding:8}}>Verify</button>
        </div>
      )}
      {msg && <p style={{marginTop:12}}>{msg}</p>}
    </main>
  )
}
