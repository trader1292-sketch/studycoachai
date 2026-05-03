import React, { useState, useEffect } from 'react'
import { callClaude, parseJSON } from '../lib/claude.js'
import { CURRICULUM, SUBJECTS_BY_TYPE } from '../lib/curriculum.js'
import { saveRevisionPlan, loadRevisionPlans } from '../lib/userActivity.js'

const ALL_SUBJECTS = [
  ...SUBJECTS_BY_TYPE['Triple Science'],
  ...SUBJECTS_BY_TYPE['Combined Science'],
  ...SUBJECTS_BY_TYPE['Maths'],
  ...SUBJECTS_BY_TYPE['Other Subjects'],
]

const EXTERNAL_RESOURCES = {
  'GCSE Physics': [
    { name: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize/subjects/zpm6fg8' },
    { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/' },
  ],
  'GCSE Chemistry': [
    { name: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize/subjects/z4v48mn' },
    { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/' },
  ],
  'GCSE Biology': [
    { name: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize/subjects/z9ddmp3' },
    { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/' },
  ],
  'GCSE Maths': [
    { name: 'Maths Genie', url: 'https://www.mathsgenie.co.uk/gcse.html' },
    { name: 'Corbettmaths', url: 'https://corbettmaths.com/contents/' },
  ],
  'default': [
    { name: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize/levels/z98jmp3' },
    { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com' },
  ],
}

// ── Inline AI Notes Panel ──────────────────────────────────────────────────
function InlineNotes({ session, board, subject, onClose, onGenerateExam, onGenerateFlashcards }) {
  const [notes, setNotes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const resources = EXTERNAL_RESOURCES[subject] || EXTERNAL_RESOURCES['default']

  const load = async () => {
    if (loaded) return
    setLoading(true)
    const isCombined = subject.includes('Combined Science')

    const prompt = `You are an expert ${subject} teacher writing concise GCSE revision notes for a single study session.

Subject: ${subject} (${board})
Topic: ${session.topic}
Subtopic: ${session.subtopic || session.topic}
${isCombined ? 'Combined Science only — do not include triple-only content.' : ''}

Write focused revision notes for this ONE subtopic. Return ONLY valid JSON:
{
  "introduction": "1-2 sentence overview of this subtopic and why it matters",
  "sections": [
    {
      "title": "Section heading",
      "content": "Clear explanation of this content area",
      "keyPoints": ["key fact 1", "key fact 2", "key fact 3"]
    }
  ],
  "formulas": [
    { "formula": "F = ma", "name": "Newton's Second Law", "variables": "F=force(N), m=mass(kg), a=acceleration(m/s²)", "example": "2kg object, a=5m/s² → F=10N" }
  ],
  "keyDefinitions": [
    { "term": "Term", "definition": "Clear definition" }
  ],
  "commonMistakes": ["mistake 1", "mistake 2"],
  "examTips": ["tip 1", "tip 2"],
  "grade9Points": ["grade 9 point 1"],
  "summary": "2-3 sentences summarising the most important exam points for this subtopic"
}`

    try {
      const raw = await callClaude(prompt, '', 2500)
      setNotes(parseJSON(raw))
      setLoaded(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Auto-load when component mounts
  React.useEffect(() => { load() }, [])

  return (
    <div style={{ marginTop: 12, background: 'white', border: '2px solid var(--navy)', borderRadius: 12, overflow: 'hidden' }}>
      {/* Notes header */}
      <div style={{ background: 'var(--navy)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
            📖 AI Revision Notes
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'white' }}>
            {session.subtopic || session.topic}
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, color: 'white', fontSize: 12, padding: '4px 10px', cursor: 'pointer' }}>
          Close ✕
        </button>
      </div>

      <div style={{ padding: 16 }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', color: 'var(--gray-500)', fontSize: 13 }}>
            <div className="spinner" />
            Writing your revision notes for {session.subtopic || session.topic}...
          </div>
        )}

        {notes && (
          <div className="fade-in">
            {/* Introduction */}
            <div style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.7 }}>
              {notes.introduction}
            </div>

            {/* Sections */}
            {notes.sections?.map((s, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>{s.title}</div>
                <p style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.7, marginBottom: s.keyPoints?.length ? 8 : 0 }}>{s.content}</p>
                {s.keyPoints?.length > 0 && (
                  <div style={{ background: 'var(--gray-50)', borderRadius: 6, padding: '8px 12px' }}>
                    {s.keyPoints.map((p, pi) => (
                      <div key={pi} style={{ fontSize: 13, color: 'var(--gray-700)', padding: '2px 0', display: 'flex', gap: 6 }}>
                        <span style={{ color: 'var(--navy)', fontWeight: 600, flexShrink: 0 }}>•</span>{p}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Formulas */}
            {notes.formulas?.length > 0 && (
              <div style={{ background: 'var(--navy)', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Key formulas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {notes.formulas.map((f, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 12px', flex: '1 1 180px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--gold)', marginBottom: 2 }}>{f.formula}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{f.variables}</div>
                      {f.example && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontStyle: 'italic' }}>e.g. {f.example}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Definitions */}
            {notes.keyDefinitions?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {notes.keyDefinitions.map((d, i) => (
                  <div key={i} style={{ fontSize: 13, padding: '4px 0', borderBottom: i < notes.keyDefinitions.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{d.term}: </span>
                    <span style={{ color: 'var(--gray-700)' }}>{d.definition}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 3 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 12 }}>
              {notes.commonMistakes?.length > 0 && (
                <div style={{ background: 'var(--red-light)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#991b1b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>⚠️ Common mistakes</div>
                  {notes.commonMistakes.map((m, i) => <div key={i} style={{ fontSize: 12, color: '#991b1b', padding: '2px 0' }}>• {m}</div>)}
                </div>
              )}
              {notes.examTips?.length > 0 && (
                <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#1e40af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>💡 Exam tips</div>
                  {notes.examTips.map((t, i) => <div key={i} style={{ fontSize: 12, color: '#1e40af', padding: '2px 0' }}>✓ {t}</div>)}
                </div>
              )}
              {notes.grade9Points?.length > 0 && (
                <div style={{ background: 'var(--gold-light)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#92400e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>⭐ Grade 9</div>
                  {notes.grade9Points.map((p, i) => <div key={i} style={{ fontSize: 12, color: '#92400e', padding: '2px 0' }}>★ {p}</div>)}
                </div>
              )}
            </div>

            {/* Summary */}
            {notes.summary && (
              <div style={{ background: 'var(--green-light)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#065f46', lineHeight: 1.7 }}>
                <strong>Summary:</strong> {notes.summary}
              </div>
            )}

            {/* For more depth */}
            <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}>
              For video explanations of {session.subtopic || session.topic}:&nbsp;
              {resources.map((r, i) => (
                <span key={i}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', fontWeight: 500 }}>{r.name}</a>
                  {i < resources.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--gray-100)' }}>
              <button className="btn-primary" style={{ fontSize: 13, padding: '9px 16px' }}
                onClick={() => onGenerateExam(session)}>
                ⚡ Generate practice exam on this
              </button>
              <button className="btn-secondary" style={{ fontSize: 13, padding: '9px 16px' }}
                onClick={() => onGenerateFlashcards(session)}>
                🃏 Generate flashcards
              </button>
              <button className="btn-secondary" style={{ fontSize: 13, padding: '9px 16px' }}
                onClick={onClose}>
                ✓ Done — back to plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Planner Tab ──────────────────────────────────────────────────────────
export default function PlannerTab({ weakTopics, subject: globalSubject, switchTab, setExamData, setFlashcards, setSubject }) {
  const [planSubject, setPlanSubject] = useState(globalSubject || 'GCSE Physics')
  const [board, setBoard] = useState('AQA')
  const [examDate, setExamDate] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState('2')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [customWeakTopics, setCustomWeakTopics] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState('')
  const [openNotesKey, setOpenNotesKey] = useState(null)
  const [savedPlans, setSavedPlans] = useState([])
  const [showSavedPlans, setShowSavedPlans] = useState(false)

  // Load saved plans on mount
  React.useEffect(() => {
    loadRevisionPlans().then(setSavedPlans)
  }, [])

  const curriculumData = CURRICULUM[planSubject] || {}
  const topicList = Object.keys(curriculumData.topics || {})

  const toggleTopic = t => setSelectedTopics(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
  )

  const handleSubjectChange = (s) => {
    setPlanSubject(s)
    setSelectedTopics([])
    setPlan(null)
    setOpenNotesKey(null)
  }

  const build = async () => {
    if (!examDate) { setError('Please enter your exam date.'); return }
    setLoading(true)
    setError('')
    setPlan(null)
    setOpenNotesKey(null)

    const topicsToRevise = selectedTopics.length
      ? selectedTopics.join(', ')
      : (weakTopics?.join(', ') || 'all topics')

    const customExtra = customWeakTopics.trim() ? `, plus: ${customWeakTopics}` : ''

    // Get subtopics for the selected topics to make sessions specific
    const subtopicMap = {}
    selectedTopics.forEach(t => {
      subtopicMap[t] = (curriculumData.topics?.[t] || []).slice(0, 6)
    })

    const prompt = `You are an expert GCSE revision planner. Create a detailed day-by-day revision plan.

Subject: ${planSubject} (${board})
Exam date: ${examDate}
Hours per day: ${hoursPerDay}
Topics to focus on: ${topicsToRevise}${customExtra}

CRITICAL: Each session must include a specific "subtopic" field — this is used to open AI revision notes instantly inside the app. Use exact subtopic names from the specification.

Available subtopics per topic:
${Object.entries(subtopicMap).map(([t, subs]) => `${t}: ${subs.length ? subs.join(', ') : 'general content'}`).join('\n')}

Create a 2-week plan. Every session must be specific and actionable. Return ONLY valid JSON:
{
  "daysUntilExam": 14,
  "totalHours": 28,
  "planSummary": "One sentence describing the plan's overall strategy",
  "weeks": [
    {
      "week": 1,
      "theme": "Foundation — tackle weakest topics first",
      "days": [
        {
          "day": "Monday",
          "date": "5 May",
          "totalTime": "2 hours",
          "sessions": [
            {
              "sessionKey": "w1d1s1",
              "topic": "Forces & Motion",
              "subtopic": "Newton's Second Law (F=ma)",
              "task": "Read AI notes, then write out F=ma with 3 worked examples from memory",
              "duration": "45 min",
              "sessionType": "Learn",
              "afterNotes": "Generate 5 practice questions on F=ma"
            },
            {
              "sessionKey": "w1d1s2",
              "topic": "Forces & Motion",
              "subtopic": "Stopping distances",
              "task": "Read AI notes on stopping distances, learn the factors affecting thinking and braking distance",
              "duration": "45 min",
              "sessionType": "Learn",
              "afterNotes": "Do 10 flashcards on stopping distances"
            }
          ]
        }
      ]
    },
    {
      "week": 2,
      "theme": "Practice and exam technique",
      "days": []
    }
  ],
  "examWeekTips": ["tip 1 for the week before the exam", "tip 2", "tip 3"],
  "examDayAdvice": "Concise practical advice for exam day"
}`

    try {
      const raw = await callClaude(prompt, '', 4000)
      const parsed = parseJSON(raw)
      setPlan(parsed)
      // Save plan
      const record = await saveRevisionPlan(parsed, planSubject, board, examDate)
      setSavedPlans(prev => [record, ...prev.filter(p => p.subject !== planSubject)])
    } catch (e) {
      setError('Failed to build plan. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // When student clicks "Generate practice exam" from within notes
  const handleGenerateExam = (session) => {
    setSubject(planSubject)
    setOpenNotesKey(null)
    switchTab('generate')
    // Small note: the generate tab will use the globally set subject
  }

  // When student clicks "Generate flashcards" from within notes
  const handleGenerateFlashcards = (session) => {
    setSubject(planSubject)
    setOpenNotesKey(null)
    switchTab('generate')
  }

  const typeStyle = (type) => {
    if (type === 'Learn') return { bg: 'var(--blue-light)', color: '#1e40af', border: '#bfdbfe' }
    if (type === 'Practice') return { bg: 'var(--green-light)', color: '#065f46', border: '#6ee7b7' }
    if (type === 'Test') return { bg: 'var(--red-light)', color: '#991b1b', border: '#fca5a5' }
    if (type === 'Review') return { bg: 'var(--gold-light)', color: '#92400e', border: '#fde68a' }
    return { bg: 'var(--gray-100)', color: 'var(--gray-600)', border: 'var(--gray-200)' }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,300px) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>

      {/* ── LEFT: Setup ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card">
          <h2 style={{ fontSize: 17, fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 6 }}>
            AI Revision Planner
          </h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14, lineHeight: 1.5 }}>
            Each session links directly to AI revision notes — read, then practise, all inside the app.
          </p>

          <label className="label">Subject</label>
          <select className="select-field" value={planSubject} onChange={e => handleSubjectChange(e.target.value)} style={{ marginBottom: 12 }}>
            {ALL_SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>

          <label className="label">Exam board</label>
          <select className="select-field" value={board} onChange={e => setBoard(e.target.value)} style={{ marginBottom: 12 }}>
            <option>AQA</option><option>Edexcel</option><option>OCR</option><option>WJEC</option>
          </select>

          <label className="label">Exam date</label>
          <input type="date" className="input-field" value={examDate} onChange={e => setExamDate(e.target.value)} style={{ marginBottom: 12 }} />

          <label className="label">Hours per day</label>
          <select className="select-field" value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)} style={{ marginBottom: 12 }}>
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
            <option value="5">5+ hours</option>
          </select>

          {topicList.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <label className="label">
                Topics to focus on
                <span style={{ fontWeight: 400, color: 'var(--gray-400)', marginLeft: 4 }}>(pick your weakest)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, maxHeight: 180, overflowY: 'auto' }}>
                {topicList.map(t => (
                  <span key={t} className={`pill ${selectedTopics.includes(t) ? 'active' : ''}`}
                    onClick={() => toggleTopic(t)} style={{ fontSize: 11 }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="label">Specific weak areas <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(optional)</span></label>
            <textarea className="textarea-field"
              placeholder="e.g. I struggle with mole calculations, can never remember half-life..."
              value={customWeakTopics} onChange={e => setCustomWeakTopics(e.target.value)}
              style={{ minHeight: 60 }} />
          </div>

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
            onClick={build} disabled={loading}>
            {loading
              ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Building your plan...</>
              : '🗓️ Build my revision plan'}
          </button>

          {error && <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--red-light)', borderRadius: 8, fontSize: 13, color: 'var(--red)' }}>{error}</div>}
        </div>

        {/* How it works */}
        <div className="card" style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 8 }}>How the plan works</div>
          {[
            { icon: '📖', text: 'Each session shows exactly what to study' },
            { icon: '✨', text: 'Click "Open notes" → AI revision notes load instantly inside the app' },
            { icon: '⚡', text: 'After reading, generate a practice exam or flashcards on that exact subtopic' },
            { icon: '✓', text: 'Mark session as done and move to the next' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#1e40af', padding: '3px 0' }}>
              <span>{s.icon}</span>{s.text}
            </div>
          ))}
        </div>

        {/* Saved plans */}
        {savedPlans.length > 0 && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showSavedPlans ? 10 : 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>📋 Saved plans ({savedPlans.length})</div>
              <button className="btn-secondary" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => setShowSavedPlans(!showSavedPlans)}>
                {showSavedPlans ? 'Hide' : 'Show'}
              </button>
            </div>
            {showSavedPlans && savedPlans.map(p => (
              <div key={p.id} onClick={() => { setPlan(p.plan); setPlanSubject(p.subject); setBoard(p.board); setExamDate(p.examDate) }}
                style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>{p.subject.replace('GCSE ', '')}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{p.board} · {p.createdAt}</div>
              </div>
            ))}
          </div>
        )}

        {plan && (
          <div className="card" style={{ background: 'var(--green-light)', border: '1px solid #6ee7b7' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 6 }}>✓ Plan ready!</div>
            <div style={{ fontSize: 13, color: '#065f46', lineHeight: 1.7 }}>
              <strong>{plan.daysUntilExam}</strong> days · <strong>{plan.totalHours}</strong> hours<br />
              {planSubject} · {board}
            </div>
            <div style={{ fontSize: 12, color: '#065f46', marginTop: 6, fontStyle: 'italic' }}>{plan.planSummary}</div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Plan output ── */}
      <div>
        {!plan && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', gap: 12 }}>
            <div style={{ fontSize: 56 }}>🗓️</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gray-300)' }}>Your revision plan appears here</div>
            <div style={{ fontSize: 14, color: 'var(--gray-400)', maxWidth: 380, lineHeight: 1.6 }}>
              Choose your subject and weak topics, enter your exam date, and get a personalised day-by-day plan with AI notes for every session.
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)' }}>Building your personalised plan...</div>
            <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Tailoring sessions to {planSubject}</div>
          </div>
        )}

        {plan && (
          <div className="fade-in">
            {/* Plan header */}
            <div className="card" style={{ background: 'var(--navy)', border: 'none', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'white', marginBottom: 8 }}>
                {planSubject} ({board}) — Revision Plan
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--gold)' }}>{plan.daysUntilExam}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Days left</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--gold)' }}>{plan.totalHours}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Study hours</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{plan.planSummary}</div>
                </div>
              </div>
            </div>

            {/* Week blocks */}
            {plan.weeks?.map(w => (
              <div key={w.week} className="card" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ background: 'var(--navy)', color: 'white', borderRadius: 6, padding: '3px 12px', fontSize: 12, fontWeight: 500 }}>
                    Week {w.week}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--navy)' }}>{w.theme}</div>
                </div>

                {w.days?.map((d, di) => (
                  <div key={d.day} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: di < w.days.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                    {/* Day header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <div style={{ background: 'var(--navy)', color: 'white', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500 }}>
                        {d.day}
                      </div>
                      {d.date && <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{d.date}</span>}
                      {d.totalTime && <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>· {d.totalTime}</span>}
                    </div>

                    {/* Sessions */}
                    {d.sessions?.map((session, si) => {
                      const tc = typeStyle(session.sessionType)
                      const noteKey = session.sessionKey || `w${w.week}d${di}s${si}`
                      const isOpen = openNotesKey === noteKey

                      return (
                        <div key={si} style={{ marginBottom: 8 }}>
                          {/* Session card */}
                          <div style={{
                            background: 'var(--gray-50)', borderRadius: 10, padding: '12px 14px',
                            border: `1px solid ${isOpen ? 'var(--navy)' : 'var(--gray-100)'}`,
                            borderBottomLeftRadius: isOpen ? 0 : 10,
                            borderBottomRightRadius: isOpen ? 0 : 10,
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Session type + duration */}
                                <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
                                    {session.sessionType}
                                  </span>
                                  <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{session.duration}</span>
                                </div>

                                {/* Topic + subtopic */}
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 2 }}>
                                  {session.topic}
                                  {session.subtopic && session.subtopic !== session.topic && (
                                    <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--blue)', marginLeft: 6 }}>
                                      — {session.subtopic}
                                    </span>
                                  )}
                                </div>

                                {/* Task */}
                                <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5 }}>{session.task}</div>

                                {/* After notes suggestion */}
                                {session.afterNotes && (
                                  <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4, fontStyle: 'italic' }}>
                                    After notes: {session.afterNotes}
                                  </div>
                                )}
                              </div>

                              {/* Open Notes button */}
                              {session.sessionType === 'Learn' || session.sessionType === 'Review' ? (
                                <button
                                  className={isOpen ? 'btn-primary' : 'btn-secondary'}
                                  style={{ fontSize: 12, padding: '7px 14px', flexShrink: 0, whiteSpace: 'nowrap' }}
                                  onClick={() => setOpenNotesKey(isOpen ? null : noteKey)}
                                >
                                  {isOpen ? '📖 Reading notes' : '📖 Open notes'}
                                </button>
                              ) : (
                                <button
                                  className="btn-secondary"
                                  style={{ fontSize: 12, padding: '7px 14px', flexShrink: 0, whiteSpace: 'nowrap' }}
                                  onClick={() => { setSubject(planSubject); switchTab('generate') }}
                                >
                                  ⚡ Generate exam
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Inline notes panel — opens directly below the session */}
                          {isOpen && (
                            <InlineNotes
                              session={session}
                              board={board}
                              subject={planSubject}
                              onClose={() => setOpenNotesKey(null)}
                              onGenerateExam={handleGenerateExam}
                              onGenerateFlashcards={handleGenerateFlashcards}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ))}

            {/* Exam week tips */}
            {plan.examWeekTips?.length > 0 && (
              <div className="card" style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)', marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 8 }}>📌 Week before the exam</div>
                {plan.examWeekTips.map((t, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#1e40af', padding: '4px 0', borderBottom: i < plan.examWeekTips.length - 1 ? '1px solid #bfdbfe' : 'none' }}>
                    💡 {t}
                  </div>
                ))}
              </div>
            )}

            {/* Exam day */}
            {plan.examDayAdvice && (
              <div className="card" style={{ background: 'var(--navy)', border: 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)', marginBottom: 6 }}>🏁 Exam day</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>{plan.examDayAdvice}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
