import React, { useState } from 'react'
import { signIn, signUp } from '../lib/supabase.js'

export default function AuthPage({ onSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!email || !password) { setError('Please enter your email and password.'); return }
    if (mode === 'register') {
      if (!name.trim()) { setError('Please enter your name.'); return }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    }

    setLoading(true)
    try {
      if (mode === 'register') {
        await signUp(email, password, name)
        setSuccess('Account created! Check your email to confirm, then log in.')
        setMode('login')
      } else {
        const { user } = await signIn(email, password)
        onSuccess(user)
      }
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--gray-50)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--navy)', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
          }}>
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--navy)', marginBottom: 4 }}>
            StudyCoach AI
          </h1>
          <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
            {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your free account.'}
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32 }}>
          {/* Tab toggle */}
          <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 10, padding: 4, gap: 4, marginBottom: 24 }}>
            {[{ key: 'login', label: 'Sign in' }, { key: 'register', label: 'Create account' }].map(opt => (
              <button key={opt.key} onClick={() => { setMode(opt.key); setError(''); setSuccess('') }} style={{
                flex: 1, padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 500, transition: 'all 0.15s',
                background: mode === opt.key ? 'white' : 'transparent',
                color: mode === opt.key ? 'var(--navy)' : 'var(--gray-500)',
                boxShadow: mode === opt.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}>{opt.label}</button>
            ))}
          </div>

          {/* Fields */}
          {mode === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label className="label">Your first name</label>
              <input className="input-field" type="text" placeholder="e.g. Jamie"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="label">Email address</label>
            <input className="input-field" type="email" placeholder="your@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          <div style={{ marginBottom: mode === 'register' ? 16 : 24 }}>
            <label className="label">Password</label>
            <input className="input-field" type="password"
              placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: 24 }}>
              <label className="label">Confirm password</label>
              <input className="input-field" type="password" placeholder="••••••••"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
          )}

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--red-light)', borderRadius: 8, fontSize: 13, color: 'var(--red)', lineHeight: 1.5 }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--green-light)', borderRadius: 8, fontSize: 13, color: '#065f46', lineHeight: 1.5 }}>
              ✓ {success}
            </div>
          )}

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}
            onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> {mode === 'register' ? 'Creating account...' : 'Signing in...'}</>
              : mode === 'register' ? 'Create free account' : 'Sign in'
            }
          </button>

          {/* Free plan note */}
          {mode === 'register' && (
            <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: 'var(--gray-400)', lineHeight: 1.6 }}>
              Free account includes 3 exams/month.<br />
              Upgrade to Pro anytime for unlimited access.
            </div>
          )}
        </div>

        {/* Guest option */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={() => onSuccess(null)}
            style={{ fontSize: 13, color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Continue without account (progress won't be saved)
          </button>
        </div>
      </div>
    </div>
  )
}
