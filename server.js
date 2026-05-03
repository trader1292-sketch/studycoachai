// Study & Exam Coach - Backend Server
// Deployed on Render.com

import express from 'express'
import cors from 'cors'

const app = express()

// Use environment variable for port (Render sets this automatically)
const PORT = process.env.PORT || 3001

// Get API key from environment variable (NEVER hardcode in production!)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''

// CORS - allow your Netlify frontend and local development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'https://studycoachai.netlify.app',
]

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  credentials: true
}))

app.use(express.json({ limit: '25mb' }))

// ── Friendly error messages for each error type ───────────────────────────────
function friendlyError(status, rawError) {
  const raw = typeof rawError === 'string' ? rawError : JSON.stringify(rawError)

  if (status === 401) return {
    code: 'INVALID_KEY',
    message: 'API key is invalid or missing. Please check your API key in Render environment variables.',
    retryable: false,
  }
  if (status === 403) return {
    code: 'KEY_FORBIDDEN',
    message: 'Your API key does not have permission to use this model.',
    retryable: false,
  }
  if (status === 429) return {
    code: 'RATE_LIMITED',
    message: 'The AI is busy right now — too many requests. Please wait a moment and try again.',
    retryable: true,
    retryAfter: 10,
  }
  if (status === 529 || raw.includes('overloaded')) return {
    code: 'OVERLOADED',
    message: 'The AI service is experiencing high demand right now. Please try again in a few seconds.',
    retryable: true,
    retryAfter: 5,
  }
  if (status === 500 || status === 502 || status === 503) return {
    code: 'SERVER_ERROR',
    message: 'The AI service had a temporary issue. Please try again.',
    retryable: true,
    retryAfter: 3,
  }
  if (status === 408 || raw.includes('timeout')) return {
    code: 'TIMEOUT',
    message: 'The request took too long. This sometimes happens with longer responses. Please try again.',
    retryable: true,
    retryAfter: 2,
  }
  return {
    code: 'UNKNOWN',
    message: 'Something went wrong. Please try again.',
    retryable: true,
    retryAfter: 2,
  }
}

// ── Call Anthropic with auto-retry ────────────────────────────────────────────
async function callAnthropic(body, maxRetries = 2) {
  let lastError = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add timeout — 60 seconds max
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 60000)

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      }

      // Parse the error
      const errText = await response.text()
      const friendly = friendlyError(response.status, errText)
      lastError = { status: response.status, friendly, raw: errText }

      // Only retry if retryable and not last attempt
      if (!friendly.retryable || attempt === maxRetries) break

      // Wait before retry
      const waitMs = (friendly.retryAfter || 3) * 1000 * (attempt + 1)
      console.log(`Attempt ${attempt + 1} failed (${response.status}). Retrying in ${waitMs/1000}s...`)
      await new Promise(r => setTimeout(r, waitMs))

    } catch (err) {
      // Network error or timeout
      if (err.name === 'AbortError') {
        lastError = { status: 408, friendly: friendlyError(408, 'timeout'), raw: 'Request timed out' }
      } else {
        lastError = {
          status: 0,
          friendly: {
            code: 'NETWORK_ERROR',
            message: 'Cannot reach the AI service. Please check your internet connection.',
            retryable: true,
            retryAfter: 3,
          },
          raw: err.message,
        }
      }
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
      }
    }
  }

  return { success: false, error: lastError }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Study & Exam Coach server running',
    keySet: ANTHROPIC_API_KEY ? true : false,
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Study & Exam Coach API',
    version: '1.0.0',
    endpoints: ['/health', '/api/claude', '/api/claude-vision'],
    status: 'operational'
  })
})

// ── Main Claude endpoint ──────────────────────────────────────────────────────
app.post('/api/claude', async (req, res) => {
  const { prompt, system = '', maxTokens = 3000 } = req.body
  if (!prompt) {
    return res.status(400).json({ 
      error: 'prompt is required', 
      code: 'NO_PROMPT',
      friendly: 'Please provide a prompt for the AI.'
    })
  }

  // Check if API key is set
  if (!ANTHROPIC_API_KEY) {
    return res.status(401).json({
      error: 'API key not configured on server',
      code: 'MISSING_KEY',
      friendly: 'The server is not configured with an API key. Please contact support.',
      retryable: false,
    })
  }

  const body = {
    model: 'claude-3-sonnet-20240229',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  }
  if (system) body.system = system

  const result = await callAnthropic(body)

  if (result.success) {
    const text = result.data.content.map(c => c.text || '').join('')
    return res.json({ text })
  }

  console.error('API failed after retries:', result.error?.raw)
  return res.status(result.error?.status || 500).json({
    error: result.error?.friendly?.message || 'Something went wrong',
    code: result.error?.friendly?.code || 'UNKNOWN',
    retryable: result.error?.friendly?.retryable ?? true,
    retryAfter: result.error?.friendly?.retryAfter ?? 5,
  })
})

// ── Vision endpoint ───────────────────────────────────────────────────────────
app.post('/api/claude-vision', async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg', prompt } = req.body
  if (!imageBase64 || !prompt) {
    return res.status(400).json({ 
      error: 'imageBase64 and prompt are required',
      code: 'MISSING_FIELDS'
    })
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(401).json({ 
      error: 'API key not configured', 
      code: 'MISSING_KEY',
      friendly: 'Server API key not configured.'
    })
  }

  const body = {
    model: 'claude-3-sonnet-20240229',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
        { type: 'text', text: prompt }
      ]
    }]
  }

  const result = await callAnthropic(body, 1)

  if (result.success) {
    const text = result.data.content.map(c => c.text || '').join('')
    return res.json({ text })
  }

  console.error('Vision API failed:', result.error?.raw)
  return res.status(result.error?.status || 500).json({
    error: result.error?.friendly?.message || 'Could not read image',
    code: result.error?.friendly?.code || 'UNKNOWN',
    retryable: result.error?.friendly?.retryable ?? true,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Study & Exam Coach server running on port ${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   API key: ${ANTHROPIC_API_KEY ? '✓ Set' : '✗ NOT SET'}`)
  console.log(`   Health check: http://localhost:${PORT}/health\n`)
})