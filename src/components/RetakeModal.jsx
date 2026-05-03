import React, { useState } from 'react'
import { callClaude, parseJSON } from '../lib/claude.js'

export default function RetakeModal({ weakTopics, subject, board, onClose, onExamReady }) {
  const [selected, setSelected] = useState(weakTopics || [])
  const [numQ, setNumQ] = useState('10')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const allTopics = weakTopics?.length
    ? weakTopics
    : ['Forces & Motion','Energy','Waves','Electricity','Atomic Structure']

  const toggle = t => setSelected(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
  )

  const generate = async () => {
    setLoading(true)
    setError('')
    const topicList = selected.length ? selected.join(', ') : allTopics.join(', ')

    const prompt = `Generate a targeted GCSE retake exam focusing ONLY on weak topics.

Subject: ${subject || 'GCSE Physics'}
Board: ${board || 'AQA'}
Focus topics (student struggled with these): ${topicList}
Number of questions: ${numQ}

Return ONLY JSON:
{
  "exam": [
    {
      "id": 1,
      "question": "...",
      "marks": 3,
      "topic": "Forces & Motion",
      "type": "short answer",
      "modelAnswer": "Mark scheme style answer",
      "examTip": "Common mistake tip",
      "hints": ["hint 1", "hint 2"]
    }
  ]
}

Make these questions slightly easier than before to build confidence, then increase difficulty. Focus exclusively on the listed weak topics.`

    try {
      const raw = await callClaude(prompt, '', 3000)
      const parsed = parseJSON(raw)
      onExamReady(parsed.exam || [])
      onClose()
    } catch (e) {
      setError('Failed to generate retake. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: 20, width: '100%', maxWidth: 480,
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>🔁 Retake mode</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--navy)' }}>Practice your weak topics</div>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--gray-100)', border: 'none', borderRadius: '50%',
            width: 30, height: 30, cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)'
          }}>×</button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ background: 'var(--amber-light)', borderRadius: 10, padding: '12px 14px', marginBottom: 18, fontSize: 13, color: '#92400e' }}>
            These are the topics where you dropped marks. A fresh exam on just these will help you improve faster.
          </div>

          <label className="label">Topics to include in retake</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
            {allTopics.map(t => (
              <span
                key={t}
                className={`pill ${selected.includes(t) ? 'active' : ''}`}
                onClick={() => toggle(t)}
              >{t}</span>
            ))}
          </div>

          <label className="label">Number of questions</label>
          <select className="select-field" value={numQ} onChange={e => setNumQ(e.target.value)} style={{ marginBottom: 20 }}>
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>

          {error && <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--red)' }}>{error}</div>}

          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
            onClick={generate}
            disabled={loading}
          >
            {loading
              ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Generating retake...</>
              : '⚡ Generate retake exam'}
          </button>
        </div>
      </div>
    </div>
  )
}
