// All AI calls go through our local server (server.js)
// This keeps your API key safe — never exposed in the browser

const SERVER = 'https://studycoach-backend-7ksr.onrender.com'

// ── Error types students will see ─────────────────────────────────────────────
export const ERROR_MESSAGES = {
  RATE_LIMITED: {
    title: 'AI is busy right now',
    message: 'Too many requests at once. The app will try again automatically in a few seconds.',
    icon: '⏳',
    retryable: true,
  },
  OVERLOADED: {
    title: 'AI service is in high demand',
    message: 'Anthropic\'s servers are very busy right now. Please wait a moment and try again.',
    icon: '🔄',
    retryable: true,
  },
  TIMEOUT: {
    title: 'Request took too long',
    message: 'This sometimes happens with longer responses. Please try again.',
    icon: '⏱️',
    retryable: true,
  },
  NETWORK_ERROR: {
    title: 'No internet connection',
    message: 'Please check your internet connection and try again.',
    icon: '📶',
    retryable: true,
  },
  SERVER_NOT_RUNNING: {
    title: 'App server not running',
    message: 'The local server is not running. Go to Terminal 1 and run: node server.js',
    icon: '🖥️',
    retryable: false,
  },
  INVALID_KEY: {
    title: 'API key problem',
    message: 'Your Anthropic API key is missing or invalid. Check server.js.',
    icon: '🔑',
    retryable: false,
  },
  SERVER_ERROR: {
    title: 'Temporary error',
    message: 'Something went wrong. Please try again in a moment.',
    icon: '⚠️',
    retryable: true,
  },
  UNKNOWN: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
    icon: '❓',
    retryable: true,
  },
}

// ── Main call function with client-side retry ─────────────────────────────────
export async function callClaude(prompt, system = '', maxTokens = 3000) {
  let lastError = null

  // Try up to 3 times on retryable errors
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${SERVER}/api/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system, maxTokens }),
      })

      if (res.ok) {
        const data = await res.json()
        return data.text
      }

      // Parse error from server
      const errData = await res.json().catch(() => ({}))
      const code = errData.code || 'UNKNOWN'
      const retryable = errData.retryable !== false
      const retryAfter = (errData.retryAfter || 5) * 1000

      lastError = {
        code,
        message: errData.error || ERROR_MESSAGES[code]?.message || 'Unknown error',
        retryable,
        status: res.status,
      }

      // Don't retry non-retryable errors
      if (!retryable) break

      // Wait before next attempt (increasing backoff)
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, retryAfter * (attempt + 1)))
      }

    } catch (fetchError) {
      // Network error — server probably not running
      if (fetchError.message?.includes('fetch') || fetchError.message?.includes('Failed')) {
        lastError = {
          code: 'SERVER_NOT_RUNNING',
          message: ERROR_MESSAGES.SERVER_NOT_RUNNING.message,
          retryable: false,
          status: 0,
        }
        break // Don't retry — server isn't running
      }

      lastError = {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES.NETWORK_ERROR.message,
        retryable: true,
        status: 0,
      }

      if (attempt < 2) await new Promise(r => setTimeout(r, 2000))
    }
  }

  // All attempts failed — throw structured error
  const errorInfo = ERROR_MESSAGES[lastError?.code] || ERROR_MESSAGES.UNKNOWN
  const err = new Error(lastError?.message || errorInfo.message)
  err.code = lastError?.code || 'UNKNOWN'
  err.title = errorInfo.title
  err.icon = errorInfo.icon
  err.retryable = errorInfo.retryable
  throw err
}

export function parseJSON(raw) {
  const clean = raw.replace(/```json\n?|```\n?/g, '').trim()
  const start = clean.search(/[{[]/)
  const end = Math.max(clean.lastIndexOf('}'), clean.lastIndexOf(']')) + 1
  return JSON.parse(start >= 0 ? clean.slice(start, end) : clean)
}

