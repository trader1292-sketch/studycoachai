import React, { useState, useEffect } from 'react'

// ── AIError component ─────────────────────────────────────────────────────────
// Use this anywhere an AI call can fail.
// Props:
//   error      — the caught error object (from callClaude)
//   onRetry    — function to call when student clicks retry
//   onDismiss  — function to call to clear the error (optional)

export default function AIError({ error, onRetry, onDismiss }) {
  const [countdown, setCountdown] = useState(0)
  const [retrying, setRetrying] = useState(false)

  // Auto-countdown before enabling retry button
  useEffect(() => {
    if (!error?.retryable) return
    const waitSecs = error.code === 'RATE_LIMITED' ? 10 : error.code === 'OVERLOADED' ? 5 : 3
    setCountdown(waitSecs)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [error])

  const handleRetry = async () => {
    if (countdown > 0 || retrying) return
    setRetrying(true)
    try { await onRetry() }
    finally { setRetrying(false) }
  }

  if (!error) return null

  const icon = error.icon || '⚠️'
  const title = error.title || 'Something went wrong'
  const message = error.message || 'Please try again.'
  const isRetryable = error.retryable !== false

  // Choose colours based on error type
  const isServerNotRunning = error.code === 'SERVER_NOT_RUNNING'
  const isKeyError = error.code === 'INVALID_KEY' || error.code === 'KEY_FORBIDDEN'
  const bg = isServerNotRunning || isKeyError ? '#FEF3C7' : '#FEF2F2'
  const border = isServerNotRunning || isKeyError ? '#FCD34D' : '#FECACA'
  const titleColor = isServerNotRunning || isKeyError ? '#92400E' : '#991B1B'
  const textColor = isServerNotRunning || isKeyError ? '#78350F' : '#7F1D1D'

  return (
    <div style={{
      background: bg,
      border: `1.5px solid ${border}`,
      borderRadius: 12,
      padding: '16px 20px',
      marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: titleColor, marginBottom: 3 }}>{title}</div>
          <div style={{ fontSize: 13, color: textColor, lineHeight: 1.6 }}>{message}</div>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, fontSize: 18, lineHeight: 1, padding: '0 4px', flexShrink: 0 }}>×</button>
        )}
      </div>

      {/* Extra help for specific errors */}
      {isServerNotRunning && (
        <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: textColor, fontFamily: 'monospace', marginBottom: 10 }}>
          Terminal 1: <strong>node server.js</strong>
        </div>
      )}

      {isKeyError && (
        <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: textColor, marginBottom: 10 }}>
          Open <strong>server.js</strong> and replace <code>YOUR_API_KEY_HERE</code> with your key from{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: titleColor, fontWeight: 600 }}>console.anthropic.com</a>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        {isRetryable && onRetry && (
          <button
            onClick={handleRetry}
            disabled={countdown > 0 || retrying}
            style={{
              padding: '7px 16px', borderRadius: 8, border: 'none', cursor: countdown > 0 || retrying ? 'not-allowed' : 'pointer',
              background: countdown > 0 || retrying ? 'rgba(0,0,0,0.1)' : titleColor,
              color: countdown > 0 || retrying ? textColor : 'white',
              fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {retrying ? (
              <><div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Retrying...</>
            ) : countdown > 0 ? (
              `Retry in ${countdown}s`
            ) : (
              'Try again'
            )}
          </button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${border}`, cursor: 'pointer', background: 'transparent', color: textColor, fontSize: 13 }}>
            Dismiss
          </button>
        )}
      </div>
    </div>
  )
}

// ── useAICall hook ─────────────────────────────────────────────────────────────
// Wraps any async AI call with loading, error, and retry state.
// Usage:
//   const { loading, error, run, clearError } = useAICall()
//   const result = await run(() => callClaude(prompt))

export function useAICall() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const lastFn = React.useRef(null)

  const run = async (fn) => {
    lastFn.current = fn
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      return result
    } catch (e) {
      setError({
        code: e.code || 'UNKNOWN',
        title: e.title || 'Something went wrong',
        message: e.message || 'Please try again.',
        icon: e.icon || '⚠️',
        retryable: e.retryable !== false,
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const retry = async () => {
    if (lastFn.current) await run(lastFn.current)
  }

  const clearError = () => setError(null)

  return { loading, error, run, retry, clearError }
}
