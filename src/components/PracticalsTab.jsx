import React, { useState } from 'react'
import { callClaude, parseJSON } from '../lib/claude.js'
import { REQUIRED_PRACTICALS } from '../lib/practicals.js'

const SCIENCE_SUBJECTS = [
  'GCSE Physics', 'GCSE Chemistry', 'GCSE Biology',
  'GCSE Combined Science (Physics)', 'GCSE Combined Science (Chemistry)', 'GCSE Combined Science (Biology)',
]

export default function PracticalsTab({ subject, switchTab }) {
  const [localSubject, setLocalSubject] = useState(
    SCIENCE_SUBJECTS.includes(subject) ? subject : 'GCSE Physics'
  )
  const [selectedBoard, setSelectedBoard] = useState('AQA')
  const [selectedPractical, setSelectedPractical] = useState(null)
  const [mode, setMode] = useState('learn')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState(null)
  const [answers, setAnswers] = useState({})
  const [marking, setMarking] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const subjectKey = localSubject
  const boardPracticals = (REQUIRED_PRACTICALS[subjectKey] || {})[selectedBoard] || []

  const handleSubjectChange = (s) => {
    setLocalSubject(s)
    setSelectedPractical(null)
    setQuestions(null)
    setResults(null)
    setAnswers({})
  }

  const generateQuestions = async (practical) => {
    setLoading(true)
    setError('')
    setQuestions(null)
    setAnswers({})
    setResults(null)

    const prompt = `You are an expert ${subjectKey} (${selectedBoard}) GCSE examiner.
Generate exam questions specifically about this required practical:

Practical: ${practical.title}
Topic: ${practical.topic}
Subject: ${subjectKey} (${selectedBoard})
Apparatus: ${practical.apparatus}
Key equations: ${practical.keyEquations.join(', ') || 'none'}

Generate 6 exam-quality questions covering:
1. Describe the method (3-4 marks)
2. Identify a variable (1-2 marks)
3. Explain a result or observation (2-3 marks)
4. Calculate using data (2-3 marks)
5. Evaluate or suggest improvement (2-3 marks)
6. A Grade 8-9 level analysis question (4-6 marks)

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "full question text exactly as in a ${selectedBoard} paper",
      "marks": 3,
      "type": "describe | explain | calculate | evaluate | analyse",
      "commandWord": "Describe",
      "modelAnswer": "mark scheme quality answer — bullet points for each mark",
      "grade9Tip": "what a grade 9 student would add that others miss",
      "hint": "one hint to help the student"
    }
  ]
}`

    try {
      const raw = await callClaude(prompt, '', 3000)
      setQuestions(parseJSON(raw).questions || [])
    } catch (e) {
      setError('Failed to generate questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const markAnswers = async () => {
    if (!questions) return
    setMarking(true)
    setResults(null)

    const prompt = `You are a ${subjectKey} (${selectedBoard}) GCSE examiner. Mark these practical exam answers.

Practical context: ${selectedPractical.title}

${questions.map(q => `Q${q.id} [${q.marks} marks] ${q.commandWord}: ${q.question}
Model answer: ${q.modelAnswer}
Student answer: ${answers[q.id] || '(no answer)'}`).join('\n\n')}

Return ONLY valid JSON:
{
  "totalAwarded": 12,
  "totalAvailable": ${questions.reduce((s, q) => s + q.marks, 0)},
  "grade": "6",
  "summary": "warm 2-sentence summary",
  "questions": [
    {
      "id": 1,
      "awarded": 2,
      "available": 3,
      "feedback": "what they got right and exactly what mark they missed",
      "missedPoints": ["specific mark point 1 they missed"],
      "grade9Addition": "what would have got full marks at grade 9"
    }
  ],
  "practicalTips": ["key practical tip 1", "key practical tip 2"]
}`

    try {
      const raw = await callClaude(prompt, '', 2000)
      setResults(parseJSON(raw))
    } catch (e) {
      setError('Marking failed. Try again.')
    } finally {
      setMarking(false)
    }
  }

  const pct = results ? Math.round((results.totalAwarded / results.totalAvailable) * 100) : 0

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,280px) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>

      {/* ── LEFT: Practical selector ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card">
          <h2 style={{ fontSize: 17, fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 4 }}>
            Required Practicals
          </h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14, lineHeight: 1.5 }}>
            These appear in every exam. Master them for guaranteed marks.
          </p>

          <label className="label">Subject</label>
          <select className="select-field" value={localSubject}
            onChange={e => handleSubjectChange(e.target.value)}
            style={{ marginBottom: 12 }}>
            {SCIENCE_SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>

          <label className="label">Exam board</label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {['AQA', 'Edexcel', 'OCR'].map(b => (
              <span key={b} className={`pill ${selectedBoard === b ? 'active' : ''}`}
                style={{ fontSize: 12 }} onClick={() => { setSelectedBoard(b); setSelectedPractical(null); setQuestions(null) }}>
                {b}
              </span>
            ))}
          </div>

          {boardPracticals.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--gray-400)', textAlign: 'center', padding: '20px 0' }}>
              Practicals for {subjectKey} ({selectedBoard}) coming soon.
              <br /><br />
              <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => switchTab('generate')}>
                Use Generate tab →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {boardPracticals.map((p, i) => (
                <div key={p.id}
                  onClick={() => { setSelectedPractical(p); setQuestions(null); setResults(null); setAnswers({}); setMode('learn') }}
                  style={{
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    background: selectedPractical?.id === p.id ? 'var(--navy)' : 'var(--gray-50)',
                    border: `1px solid ${selectedPractical?.id === p.id ? 'var(--navy)' : 'var(--gray-200)'}`,
                    transition: 'all 0.15s'
                  }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: selectedPractical?.id === p.id ? 'white' : 'var(--navy)', marginBottom: 2 }}>
                    {i + 1}. {p.title}
                  </div>
                  <div style={{ fontSize: 11, color: selectedPractical?.id === p.id ? 'rgba(255,255,255,0.6)' : 'var(--gray-400)' }}>
                    {p.topic}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedPractical && (
          <div className="card" style={{ background: 'var(--gold-light)', border: '1px solid #fcd34d' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>⚠️ Exam appearance</div>
            <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
              This practical appears in <strong>every exam series</strong>. Questions are typically worth 4–9 marks per paper. Students who know these well gain a significant advantage.
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Content ── */}
      <div>
        {!selectedPractical && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', gap: 12 }}>
            <div style={{ fontSize: 52 }}>🔬</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gray-300)' }}>Select a practical</div>
            <div style={{ fontSize: 14, color: 'var(--gray-400)', maxWidth: 340 }}>
              Required practicals appear in every paper. Pick one to learn the method, key points and practice exam questions.
            </div>
          </div>
        )}

        {selectedPractical && (
          <div className="fade-in">
            {/* Header */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    🔬 Required Practical — {selectedBoard}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)', marginBottom: 6 }}>
                    {selectedPractical.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="tag tag-blue">{selectedPractical.topic}</span>
                    <span className="tag tag-green">{subjectKey}</span>
                    <span className="tag tag-navy">{selectedBoard}</span>
                  </div>
                </div>
              </div>

              {/* Mode toggle */}
              <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 10, padding: 4, gap: 4 }}>
                {[
                  { key: 'learn', label: '📖 Learn it' },
                  { key: 'practice', label: '✏️ Practice questions' },
                ].map(opt => (
                  <button key={opt.key} onClick={() => setMode(opt.key)} style={{
                    flex: 1, padding: '9px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                    background: mode === opt.key ? 'white' : 'transparent',
                    color: mode === opt.key ? 'var(--navy)' : 'var(--gray-500)',
                    boxShadow: mode === opt.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
                  }}>{opt.label}</button>
                ))}
              </div>
            </div>

            {/* ── LEARN MODE ── */}
            {mode === 'learn' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Apparatus */}
                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>🧪 Apparatus</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.7 }}>{selectedPractical.apparatus}</div>
                </div>

                {/* Method */}
                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 10 }}>📋 Method (step by step)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedPractical.method.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', background: 'var(--navy)',
                          color: 'white', fontSize: 12, fontWeight: 600, display: 'flex',
                          alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>{i + 1}</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6, paddingTop: 3 }}>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key equations */}
                {selectedPractical.keyEquations.length > 0 && (
                  <div className="card" style={{ background: 'var(--navy)', border: 'none' }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      📐 Key equations
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {selectedPractical.keyEquations.map((eq, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--gold)' }}>{eq}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exam tips */}
                <div className="card" style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 10 }}>💡 Exam tips — what markers look for</div>
                  {selectedPractical.examTips.map((tip, i) => (
                    <div key={i} style={{
                      fontSize: 13, color: '#1e40af', padding: '5px 0',
                      borderBottom: i < selectedPractical.examTips.length - 1 ? '1px solid #bfdbfe' : 'none',
                      lineHeight: 1.6
                    }}>✓ {tip}</div>
                  ))}
                </div>

                {/* Grade 9 points */}
                <div className="card" style={{ background: 'var(--gold-light)', border: '1px solid #fcd34d' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 10 }}>⭐ Grade 8–9 points — what separates the top students</div>
                  {selectedPractical.grade9Points.map((pt, i) => (
                    <div key={i} style={{
                      fontSize: 13, color: '#92400e', padding: '5px 0',
                      borderBottom: i < selectedPractical.grade9Points.length - 1 ? '1px solid #fde68a' : 'none',
                      lineHeight: 1.6
                    }}>★ {pt}</div>
                  ))}
                </div>

                {/* Common exam questions */}
                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 10 }}>📝 Common exam questions on this practical</div>
                  {selectedPractical.commonExamQs.map((q, i) => (
                    <div key={i} style={{
                      fontSize: 13, color: 'var(--gray-700)', padding: '6px 0',
                      borderBottom: i < selectedPractical.commonExamQs.length - 1 ? '1px solid var(--gray-100)' : 'none',
                      lineHeight: 1.6
                    }}>
                      <span style={{ color: 'var(--blue)', fontWeight: 600, marginRight: 6 }}>{i + 1}.</span>{q}
                    </div>
                  ))}
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14, fontSize: 13 }}
                    onClick={() => setMode('practice')}>
                    Practice these questions →
                  </button>
                </div>
              </div>
            )}

            {/* ── PRACTICE MODE ── */}
            {mode === 'practice' && (
              <div>
                {!questions && !loading && (
                  <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>✏️</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)', marginBottom: 8 }}>
                      Exam questions on {selectedPractical.title}
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 20, lineHeight: 1.6 }}>
                      AI will generate 6 realistic exam questions on this practical — the same types that appear in real {selectedBoard} papers.
                    </p>
                    <button className="btn-primary" style={{ justifyContent: 'center', padding: '12px 28px' }}
                      onClick={() => generateQuestions(selectedPractical)}>
                      Generate exam questions →
                    </button>
                  </div>
                )}

                {loading && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
                    <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)' }}>Generating practical questions...</div>
                  </div>
                )}

                {error && (
                  <div style={{ padding: '12px 16px', background: 'var(--red-light)', borderRadius: 10, fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>
                    {error}
                  </div>
                )}

                {questions && (
                  <div className="fade-in">
                    <div className="card" style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)', marginBottom: 4 }}>
                          {selectedPractical.title} — Practice paper
                        </h3>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span className="tag tag-navy">{questions.length} questions</span>
                          <span className="tag tag-blue">{questions.reduce((s, q) => s + q.marks, 0)} marks</span>
                        </div>
                      </div>
                      <button className="btn-secondary" style={{ fontSize: 13 }}
                        onClick={() => generateQuestions(selectedPractical)}>
                        Regenerate
                      </button>
                    </div>

                    {questions.map(q => {
                      const r = results?.questions?.find(r => r.id === q.id)
                      return (
                        <div key={q.id} className="card" style={{
                          marginBottom: 12,
                          borderColor: r ? r.awarded === r.available ? '#6ee7b7' : r.awarded > 0 ? '#fcd34d' : '#fca5a5' : undefined,
                          borderWidth: r ? 1.5 : 1
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 10 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                                <span style={{ background: 'var(--navy)', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{q.id}</span>
                                <span className="tag tag-blue" style={{ fontSize: 11 }}>{q.commandWord}</span>
                                <span className="tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)', fontSize: 11 }}>{q.type}</span>
                              </div>
                              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', lineHeight: 1.6 }}>{q.question}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                              <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>
                                [{q.marks} {q.marks === 1 ? 'mark' : 'marks'}]
                              </div>
                              {r && (
                                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', color: r.awarded === r.available ? 'var(--green)' : r.awarded > 0 ? 'var(--amber)' : 'var(--red)' }}>
                                  {r.awarded}/{r.available}
                                </div>
                              )}
                            </div>
                          </div>

                          <textarea className="textarea-field"
                            placeholder={`Your answer for Q${q.id}...`}
                            value={answers[q.id] || ''}
                            onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            style={{ minHeight: q.marks > 3 ? 110 : 70, marginBottom: 10 }} />

                          {r && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                              <div style={{
                                background: r.awarded === r.available ? 'var(--green-light)' : r.awarded > 0 ? 'var(--amber-light)' : 'var(--red-light)',
                                borderRadius: 8, padding: '8px 12px', fontSize: 13, lineHeight: 1.6,
                                color: r.awarded === r.available ? '#065f46' : r.awarded > 0 ? '#92400e' : '#991b1b'
                              }}>{r.feedback}</div>
                              {r.missedPoints?.length > 0 && (
                                <div style={{ background: 'var(--red-light)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#991b1b' }}>
                                  <strong>Missed mark points:</strong>
                                  {r.missedPoints.map((pt, i) => <div key={i}>• {pt}</div>)}
                                </div>
                              )}
                              {r.grade9Addition && (
                                <div style={{ background: 'var(--gold-light)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#92400e' }}>
                                  ⭐ <strong>Grade 9 addition:</strong> {r.grade9Addition}
                                </div>
                              )}
                            </div>
                          )}

                          <details style={{ fontSize: 13 }}>
                            <summary style={{ cursor: 'pointer', color: 'var(--blue)', fontWeight: 500, userSelect: 'none' }}>Show hint & model answer</summary>
                            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <div style={{ background: 'var(--gold-light)', borderRadius: 8, padding: '8px 12px', color: '#92400e' }}>
                                <strong>Hint:</strong> {q.hint}
                              </div>
                              <div style={{ background: 'var(--green-light)', borderRadius: 8, padding: '8px 12px', color: '#065f46', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                <strong>Model answer:</strong>{'\n'}{q.modelAnswer}
                              </div>
                              <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '8px 12px', color: '#1e40af' }}>
                                ⭐ <strong>Grade 9:</strong> {q.grade9Tip}
                              </div>
                            </div>
                          </details>
                        </div>
                      )
                    })}

                    {!results && (
                      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, marginTop: 4 }}
                        onClick={markAnswers} disabled={marking}>
                        {marking ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Marking...</> : '✓ Submit for AI marking'}
                      </button>
                    )}

                    {results && (
                      <div className="card fade-in" style={{ background: 'var(--navy)', border: 'none', marginTop: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                          <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'white' }}>{results.totalAwarded}/{results.totalAvailable}</div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{pct}%</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--gold)' }}>{results.grade}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Grade</div>
                          </div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 999, height: 8, marginBottom: 12, overflow: 'hidden' }}>
                          <div style={{ height: 8, borderRadius: 999, background: pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)', width: `${pct}%`, transition: 'width 1s ease' }} />
                        </div>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 12 }}>{results.summary}</p>
                        {results.practicalTips?.length > 0 && (
                          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
                            <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, marginBottom: 6 }}>Key practical tips to remember</div>
                            {results.practicalTips.map((t, i) => (
                              <div key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', padding: '3px 0' }}>✓ {t}</div>
                            ))}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn-gold" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
                            onClick={() => { setAnswers({}); setResults(null) }}>
                            Try again
                          </button>
                          <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                            onClick={() => setMode('learn')}>
                            Back to notes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
