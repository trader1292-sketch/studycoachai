import React, { useState, useEffect } from 'react'
import { callClaude } from '../lib/claude.js'

export default function ExplainModal({ question, subject, onClose }) {
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(true)
  const [followUp, setFollowUp] = useState('')
  const [followUpAnswer, setFollowUpAnswer] = useState('')
  const [followUpLoading, setFollowUpLoading] = useState(false)

  useEffect(() => {
    const explain = async () => {
      const prompt = `A GCSE student got this ${subject} question wrong and needs it explained clearly.

Question: ${question.question}
Correct answer: ${question.modelAnswer}
${question.topic ? `Topic: ${question.topic}` : ''}

Explain this to the student in a friendly, clear way. Structure your response exactly like this:

**What this question is really asking:**
[1-2 sentences on the core concept being tested]

**The key idea you need to know:**
[Explain the underlying concept simply, as if to a 15-year-old]

**How to answer it step by step:**
[Numbered steps showing the exact thinking process]

**The bit students often get wrong:**
[Common mistake and how to avoid it]

**A memory trick:**
[One memorable way to remember this]

Keep it friendly, encouraging and clear. No jargon without explanation.`

      try {
        const text = await callClaude(prompt, '', 1500)
        setExplanation(text)
      } catch (e) {
        setExplanation('Sorry, could not load explanation. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    explain()
  }, [])

  const askFollowUp = async () => {
    if (!followUp.trim()) return
    setFollowUpLoading(true)
    try {
      const prompt = `A GCSE student is asking a follow-up question about this topic.

Original question: ${question.question}
Topic: ${question.topic || subject}
Student's follow-up question: ${followUp}

Answer their follow-up question clearly and briefly (3-5 sentences max). Be encouraging.`
      const text = await callClaude(prompt, '', 600)
      setFollowUpAnswer(text)
    } catch (e) {
      setFollowUpAnswer('Sorry, could not answer that. Please try again.')
    } finally {
      setFollowUpLoading(false)
    }
  }

  // Format markdown-style bold text
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return (
        <p key={i}
          dangerouslySetInnerHTML={{ __html: boldLine }}
          style={{
            marginBottom: line.startsWith('**') ? 6 : 4,
            fontWeight: line.startsWith('**') ? 600 : 400,
            color: line.startsWith('**') ? 'var(--navy)' : 'var(--gray-700)',
            fontSize: line.startsWith('**') ? 14 : 13,
            lineHeight: 1.6,
          }}
        />
      )
    })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: 20, width: '100%', maxWidth: 580,
        maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--gray-100)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12
        }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              💡 Explain it to me
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.4 }}>
              {question.question}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--gray-100)', border: 'none', borderRadius: '50%',
            width: 30, height: 30, cursor: 'pointer', fontSize: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)'
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '40px 0' }}>
              <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
              <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Preparing your explanation...</div>
            </div>
          ) : (
            <div style={{ lineHeight: 1.7 }}>
              {formatText(explanation)}
            </div>
          )}

          {/* Correct answer box */}
          {!loading && (
            <div style={{
              marginTop: 20, background: 'var(--green-light)', borderRadius: 10,
              padding: '12px 16px', border: '1px solid #6ee7b7'
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#065f46', marginBottom: 4 }}>MODEL ANSWER</div>
              <div style={{ fontSize: 13, color: '#065f46', lineHeight: 1.6 }}>{question.modelAnswer}</div>
            </div>
          )}

          {/* Follow-up question */}
          {!loading && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)', marginBottom: 8 }}>
                Still confused? Ask a follow-up question:
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="input-field"
                  placeholder="e.g. Why does F=ma not work for high speeds?"
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && askFollowUp()}
                  style={{ flex: 1 }}
                />
                <button
                  className="btn-primary"
                  style={{ padding: '9px 16px', fontSize: 13, flexShrink: 0 }}
                  onClick={askFollowUp}
                  disabled={followUpLoading}
                >
                  {followUpLoading ? <div className="spinner" style={{ borderTopColor: 'white' }} /> : 'Ask'}
                </button>
              </div>
              {followUpAnswer && (
                <div style={{
                  marginTop: 12, background: 'var(--blue-light)', borderRadius: 10,
                  padding: '12px 16px', fontSize: 13, color: '#1e40af', lineHeight: 1.6
                }}>
                  {followUpAnswer}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--gray-100)' }}>
          <button className="btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
            Got it — back to results
          </button>
        </div>
      </div>
    </div>
  )
}
