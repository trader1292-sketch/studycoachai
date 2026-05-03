import React, { useState } from 'react'
import { callClaude } from '../lib/claude.js'

export default function TopicSummary({ subject, board, onClose }) {
  const [topic, setTopic] = useState('')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!topic.trim()) { setError('Please enter a topic.'); return }
    setLoading(true)
    setError('')
    setSummary(null)

    const prompt = `Create a concise one-page revision summary for a GCSE student on this topic.

Subject: ${subject || 'GCSE Physics'}
Exam Board: ${board || 'AQA'}
Topic: ${topic}

Return ONLY valid JSON:
{
  "topic": "${topic}",
  "keyFacts": [
    "Key fact or definition 1",
    "Key fact or definition 2",
    "Key fact or definition 3",
    "Key fact or definition 4",
    "Key fact or definition 5"
  ],
  "keyFormulas": [
    { "formula": "F = ma", "means": "Force = mass × acceleration", "units": "N = kg × m/s²" }
  ],
  "commonMistakes": [
    "Common mistake students make 1",
    "Common mistake students make 2"
  ],
  "examTips": [
    "Exam technique tip 1",
    "Exam technique tip 2"
  ],
  "memoryTricks": [
    "A memorable way to remember key concept 1"
  ],
  "6MarkerTemplate": "For a 6-mark question on this topic, structure your answer: [point 1], [evidence/example], [explanation]..."
}`

    try {
      const raw = await callClaude(prompt, '', 1800)
      const clean = raw.replace(/```json\n?|```\n?/g, '').trim()
      const start = clean.search(/[{[]/)
      const end = Math.max(clean.lastIndexOf('}'), clean.lastIndexOf(']')) + 1
      setSummary(JSON.parse(clean.slice(start, end)))
    } catch (e) {
      setError('Failed to generate summary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const printSummary = () => window.print()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: 20, width: '100%', maxWidth: 640,
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--gray-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
              📄 Topic Summary Sheet
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>{subject} — {board}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {summary && (
              <button className="btn-secondary" style={{ fontSize: 13, padding: '7px 14px' }} onClick={printSummary}>
                🖨️ Print
              </button>
            )}
            <button onClick={onClose} style={{
              background: 'var(--gray-100)', border: 'none', borderRadius: '50%',
              width: 30, height: 30, cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)'
            }}>×</button>
          </div>
        </div>

        {/* Search */}
        {!summary && (
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)' }}>
            <label className="label">Which topic do you need a summary for?</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="input-field"
                placeholder="e.g. Forces & Motion, Atomic Structure, Ionic Bonding..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generate()}
                style={{ flex: 1 }}
              />
              <button
                className="btn-primary"
                onClick={generate}
                disabled={loading}
                style={{ padding: '9px 18px', flexShrink: 0 }}
              >
                {loading ? <div className="spinner" style={{ borderTopColor: 'white' }} /> : 'Generate'}
              </button>
            </div>
            {error && <div style={{ marginTop: 8, fontSize: 13, color: 'var(--red)' }}>{error}</div>}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '40px 0' }}>
              <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
              <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Building your summary sheet...</div>
            </div>
          )}

          {summary && (
            <div className="fade-in">
              {/* Topic header */}
              <div style={{
                background: 'var(--navy)', borderRadius: 12, padding: '14px 18px', marginBottom: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'white' }}>{summary.topic}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 11 }}>{subject}</span>
                  <span className="tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 11 }}>{board}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Key facts */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    Key facts & definitions
                  </div>
                  <div style={{ background: 'var(--blue-light)', borderRadius: 10, padding: '12px 16px' }}>
                    {summary.keyFacts?.map((f, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: '#1e40af', padding: '5px 0',
                        borderBottom: i < summary.keyFacts.length - 1 ? '1px solid #bfdbfe' : 'none',
                        lineHeight: 1.5
                      }}>
                        <span style={{ fontWeight: 700, marginRight: 6 }}>{i + 1}.</span>{f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formulas */}
                {summary.keyFormulas?.length > 0 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      Key formulas
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {summary.keyFormulas.map((f, i) => (
                        <div key={i} style={{
                          background: 'var(--navy)', borderRadius: 10, padding: '10px 16px', flex: '1 1 200px'
                        }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--gold)', marginBottom: 2 }}>{f.formula}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{f.means}</div>
                          {f.units && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Units: {f.units}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common mistakes */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    Common mistakes
                  </div>
                  <div style={{ background: 'var(--red-light)', borderRadius: 10, padding: '12px 16px' }}>
                    {summary.commonMistakes?.map((m, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: '#991b1b', padding: '4px 0',
                        borderBottom: i < summary.commonMistakes.length - 1 ? '1px solid #fca5a5' : 'none',
                        lineHeight: 1.5
                      }}>
                        ⚠️ {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exam tips */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    Exam tips
                  </div>
                  <div style={{ background: 'var(--green-light)', borderRadius: 10, padding: '12px 16px' }}>
                    {summary.examTips?.map((t, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: '#065f46', padding: '4px 0',
                        borderBottom: i < summary.examTips.length - 1 ? '1px solid #6ee7b7' : 'none',
                        lineHeight: 1.5
                      }}>
                        ✓ {t}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Memory tricks */}
                {summary.memoryTricks?.length > 0 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      Memory tricks
                    </div>
                    <div style={{ background: 'var(--gold-light)', borderRadius: 10, padding: '12px 16px' }}>
                      {summary.memoryTricks.map((t, i) => (
                        <div key={i} style={{ fontSize: 13, color: '#92400e', lineHeight: 1.5 }}>🧠 {t}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6-marker template */}
                {summary['6MarkerTemplate'] && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      6-mark question template
                    </div>
                    <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.7 }}>
                      {summary['6MarkerTemplate']}
                    </div>
                  </div>
                )}
              </div>

              {/* Generate another */}
              <button
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 16, fontSize: 13 }}
                onClick={() => { setSummary(null); setTopic('') }}
              >
                Generate another topic →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
