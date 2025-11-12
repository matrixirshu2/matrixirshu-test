'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [msg, setMsg] = useState('');

  async function requestCode(e) {
    e.preventDefault();
    setMsg('Sending code...');
    const res = await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.ok) {
      setMsg('Code sent! Check your email.');
      setStep('code');
    } else {
      setMsg(data.error || 'Failed to send code');
    }
  }

  async function verify(e) {
    e.preventDefault();
    setMsg('Verifying...');
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (data.ok) {
      setMsg('Success! Redirecting...');
      window.location.href = '/';
    } else {
      setMsg(data.error || 'Invalid code');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Log in</h1>
        {step === 'email' && (
          <form onSubmit={requestCode}>
            <label className="label">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email" required/>
            <div style={{height:10}} />
            <button type="submit">Send OTP</button>
          </form>
        )}
        {step === 'code' && (
          <form onSubmit={verify}>
            <p className="badge">We sent a 6-digit code to <b>{email}</b>.</p>
            <label className="label">Enter code</label>
            <input value={code} onChange={e=>setCode(e.target.value)} placeholder="123456" required/>
            <div style={{height:10}} />
            <button type="submit">Verify & Continue</button>
          </form>
        )}
        <p className="badge">{msg}</p>
      </div>
    </div>
  );
}