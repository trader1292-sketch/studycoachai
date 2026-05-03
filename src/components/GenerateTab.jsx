import React, { useState, useMemo } from 'react'
import { callClaude, parseJSON } from '../lib/claude.js'
import { CURRICULUM, BOARDS, SUBJECTS_BY_TYPE, SUBJECT_CATEGORIES, FORMULA_SHEETS, PAST_PAPERS, TOPIC_RESOURCES } from '../lib/curriculum.js'
import { generateDiagram } from '../lib/diagrams.js'
import AIError from './AIError.jsx'

export default function GenerateTab({ subject, setSubject, setExamData, setFlashcards, switchTab }) {
  // Science type selection
  const [scienceType, setScienceType] = useState('Triple Science')
  const [board, setBoard] = useState('AQA')
  const [selectedSubject, setSelectedSubject] = useState('GCSE Physics')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedSubtopics, setSelectedSubtopics] = useState([])
  const [selectedPaperNum, setSelectedPaperNum] = useState('') // Paper 1, Paper 2 etc
  const [mode, setMode] = useState('exam')
  const [numQ, setNumQ] = useState('10')
  const [tier, setTier] = useState('Higher')
  const [syllabusText, setSyllabusText] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiError, setAiError] = useState(null)

  // ... rest of state
  const [generated, setGenerated] = useState(null)
  const [answers, setAnswers] = useState({})
  const [marking, setMarking] = useState(false)
  const [markingResults, setMarkingResults] = useState(null)
  const [answerMode, setAnswerMode] = useState('print')
  const [showPastPapers, setShowPastPapers] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState(null)

  // Derive subjects from selected category
  const subjectList = useMemo(() => {
    return SUBJECTS_BY_TYPE[scienceType] || SUBJECTS_BY_TYPE['Triple Science']
  }, [scienceType])

  const curriculumData = CURRICULUM[selectedSubject] || {}
  const topicList = Object.keys(curriculumData.topics || {})
  const subtopics = selectedTopic ? (curriculumData.topics[selectedTopic] || []) : []
  const formulasForTopic = (FORMULA_SHEETS[selectedSubject] || {})[selectedTopic] || []
  const papersForSubject = (PAST_PAPERS[board] || {})[selectedSubject] || []
  // Available paper numbers from curriculum
  const availablePapers = (curriculumData.papers || {})[board] || ['Paper 1', 'Paper 2']

  const toggleSubtopic = (s) => setSelectedSubtopics(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  )

  const handleSubjectChange = (s) => {
    setSelectedSubject(s)
    setSubject(s)
    setSelectedTopic('')
    setSelectedSubtopics([])
    setSelectedPaperNum('')
    setGenerated(null)
    setMarkingResults(null)
  }

  const handleTopicChange = (t) => {
    setSelectedTopic(t)
    setSelectedSubtopics([])
  }

  // ── Generate ────────────────────────────────────────────────────────────────
  const generate = async () => {
    setLoading(true)
    setAiError(null)
    setGenerated(null)
    setAnswers({})
    setMarkingResults(null)

    const topicFocus = selectedSubtopics.length
      ? selectedSubtopics.join(', ')
      : selectedTopic || (selectedPaperNum ? `all ${selectedPaperNum} topics` : 'all topics')

    const isCombined = selectedSubject.includes('Combined Science')
    const formulaList = formulasForTopic.length
      ? `Formulas to include with numeric questions: ${formulasForTopic.slice(0,4).map(f => `${f.formula} (${f.desc})`).join(', ')}`
      : ''

    const makeExam = mode !== 'flash'
    const makeFlash = mode !== 'exam'

    try {
      let examQuestions = []
      let flashcardSet = []

      // ── Generate exam questions ──
      if (makeExam) {
        const examPrompt = `You are a ${board} GCSE ${selectedSubject} examiner. ${isCombined ? 'Combined Science only.' : ''}
Subject: ${selectedSubject} (${board}) — ${tier} Tier
Topics: ${topicFocus}
${selectedPaperNum ? `Paper: ${selectedPaperNum} only` : ''}
${formulaList}

Generate exactly ${numQ} exam questions. Return ONLY valid JSON array:
[
  {
    "id": 1,
    "question": "Question text as it would appear on a ${board} paper",
    "marks": 3,
    "topic": "topic name",
    "subtopic": "specific subtopic",
    "type": "calculation|short answer|extended response|multiple choice",
    "diagramDescription": "Only if geometry/circuit/wave/force diagram needed — describe precisely. Empty string otherwise.",
    "formulaGiven": "formula if given in exam e.g. F = ma",
    "modelAnswer": "Mark scheme answer. Show formula→substitution→answer with units for calculations.",
    "examTip": "Most common mistake on this question type",
    "hints": ["hint 1", "hint 2"]
  }
]`
        const raw = await callClaude(examPrompt, '', 3000)
        const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim()
        const start = cleaned.indexOf('[')
        const end = cleaned.lastIndexOf(']') + 1
        examQuestions = JSON.parse(start >= 0 ? cleaned.slice(start, end) : cleaned)
        setExamData(examQuestions)
      }

      // ── Generate flashcards (separate call = faster, more reliable) ──
      if (makeFlash) {
        const flashPrompt = `You are a ${board} GCSE ${selectedSubject} teacher.
Generate exactly 15 flashcards for: ${topicFocus}
Return ONLY a valid JSON array:
[
  { "id": 1, "front": "Question or term", "back": "Full answer with formula/units/key points if applicable" }
]`
        const raw2 = await callClaude(flashPrompt, '', 1500)
        const cleaned2 = raw2.replace(/```json\n?|```\n?/g, '').trim()
        const s = cleaned2.indexOf('[')
        const e = cleaned2.lastIndexOf(']') + 1
        flashcardSet = JSON.parse(s >= 0 ? cleaned2.slice(s, e) : cleaned2)
        setFlashcards(flashcardSet)
      }

      setGenerated({ exam: examQuestions, flashcards: flashcardSet })
      setAiError(null)
    } catch (e) {
      setAiError({
        code: e.code || 'UNKNOWN',
        title: e.title || 'Generation failed',
        message: e.message || 'Please try again.',
        icon: e.icon || '⚠️',
        retryable: e.retryable !== false,
      })
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // ── Mark answers ─────────────────────────────────────────────────────────────
  const submitForMarking = async () => {
    setMarking(true)
    setMarkingResults(null)
    const exam = generated.exam
    const totalMarks = exam.reduce((s, q) => s + (q.marks || 1), 0)

    const prompt = `You are a strict but encouraging ${selectedSubject} (${board}) GCSE examiner.
Mark each student answer carefully against the model answer. Be precise about part marks.

${exam.map(q => `Q${q.id} [${q.marks} marks] — ${q.question}
Model answer: ${q.modelAnswer}
Student's answer: ${answers[q.id] || '(no answer given)'}`).join('\n\n')}

Return ONLY valid JSON:
{
  "totalAwarded": 18,
  "totalAvailable": ${totalMarks},
  "grade": "6",
  "summary": "2-3 warm encouraging sentences. Mention specific things they did well.",
  "questions": [
    {
      "id": 1,
      "awarded": 2,
      "available": 3,
      "feedback": "Specific: what they got right and exactly which mark point they missed and why",
      "modelComparison": "Their answer said X, the mark scheme required Y",
      "examTip": "One precise tip for this question type"
    }
  ],
  "weakTopics": ["subtopic or topic that cost them marks"],
  "strongTopics": ["topics they answered well"]
}`

    try {
      const raw = await callClaude(prompt, '', 2500)
      const results = parseJSON(raw)
      setMarkingResults(results)
      // Update weak topics for planner/tracker
    } catch (e) {
      setError('Marking failed — please try again.')
    } finally {
      setMarking(false)
    }
  }

  // ── Print exam only ──────────────────────────────────────────────────────────
  const printExam = () => {
    const exam = generated?.exam
    if (!exam) return
    const totalMarks = exam.reduce((s, q) => s + (q.marks || 1), 0)
    const w = window.open('', '_blank')
    w.document.write(`<!DOCTYPE html><html><head>
      <title>${selectedSubject} — ${board} Exam</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:Georgia,serif;font-size:14px;color:#000;padding:40px;max-width:740px;margin:0 auto}
        h1{font-size:22px;margin-bottom:4px}
        .meta{font-size:13px;color:#555;margin-bottom:6px}
        .instructions{border:1.5px solid #000;padding:12px 16px;margin:16px 0;font-size:13px;line-height:1.7}
        .formula-sheet{border:1px solid #999;padding:10px 14px;margin:12px 0;background:#f9f9f9;font-size:12px}
        .formula-sheet h3{font-size:12px;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em}
        .formula-item{margin:2px 0}
        .question{margin-bottom:28px;page-break-inside:avoid}
        .qhead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px}
        .qnum{font-weight:bold;font-size:16px}
        .qmarks{font-size:13px;font-weight:bold}
        .subtopic{font-size:11px;color:#777;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em}
        .qtext{font-size:14px;line-height:1.7;margin-bottom:10px}
        .formula-box{display:inline-block;border:1px solid #ddd;padding:4px 10px;border-radius:4px;background:#f0f4ff;font-size:13px;margin-bottom:8px;font-style:italic}
        .diagram-box{border:1px solid #bbb;border-radius:4px;padding:10px 14px;margin:8px 0 12px;background:#f9f9f9}
        .diagram-label{font-size:11px;font-weight:bold;color:#555;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px}
        .diagram-desc{font-size:13px;color:#333;font-style:italic;line-height:1.6;margin-bottom:10px}
        .draw-space{border:1px dashed #bbb;border-radius:4px;height:120px;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:12px}
        .line{border-bottom:1px solid #aaa;margin:7px 0;height:22px}
        .footer{margin-top:36px;font-size:11px;color:#aaa;text-align:center;border-top:1px solid #eee;padding-top:12px}
        @media print{body{padding:20px}.no-print{display:none}}
      </style>
    </head><body>
      <h1>${selectedSubject} — ${board}</h1>
      <div class="meta">${scienceType} &nbsp;·&nbsp; ${tier} Tier &nbsp;·&nbsp; ${exam.length} Questions &nbsp;·&nbsp; Total: ${totalMarks} marks &nbsp;·&nbsp; Suggested: ${Math.round(totalMarks * 1.5)} min</div>
      <div class="instructions">
        <strong>Instructions to candidates</strong><br>
        • Answer <strong>ALL</strong> questions in the spaces provided.<br>
        • Show ALL working for calculation questions — method marks are available.<br>
        • The number of marks is shown in brackets [ ] at the end of each question.<br>
        • Use a black or blue pen. Pencil may be used for diagrams only.
      </div>
      ${formulasForTopic.length ? `<div class="formula-sheet">
        <h3>📐 Formulae — ${selectedTopic}</h3>
        ${formulasForTopic.map(f => `<div class="formula-item"><strong>${f.formula}</strong> — ${f.desc} &nbsp;<em style="color:#777">${f.vars}</em></div>`).join('')}
      </div>` : ''}
      ${exam.map(q => {
        const lines = q.marks > 5 ? 10 : q.marks > 3 ? 7 : q.marks > 1 ? 4 : 3
        return `<div class="question">
          <div class="qhead">
            <span class="qnum">Question ${q.id}</span>
            <span class="qmarks">[${q.marks} mark${q.marks > 1 ? 's' : ''}]</span>
          </div>
          <div class="subtopic">${q.subtopic || q.topic || ''}</div>
          ${q.formulaGiven ? `<div class="formula-box">You may use: &nbsp; ${q.formulaGiven}</div><br>` : ''}
          ${q.diagramDescription ? `<div class="diagram-box">
            <span class="diagram-label">📐 Diagram</span>
            <div class="diagram-desc">${q.diagramDescription}</div>
            <div class="draw-space">Draw / sketch here</div>
          </div>` : ''}
          <div class="qtext">${q.question}</div>
          ${Array(lines).fill('<div class="line"></div>').join('')}
        </div>`
      }).join('')}
      <div class="footer">— End of paper — &nbsp;|&nbsp; Generated by StudyCoach AI &nbsp;|&nbsp; ${selectedSubject} (${board})</div>
    </body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 400)
  }

  const pct = markingResults ? Math.round((markingResults.totalAwarded / markingResults.totalAvailable) * 100) : 0
  const barColor = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,300px) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Subject category */}
        <div className="card">
          <h2 style={{ fontSize: 17, fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 14 }}>Generate material</h2>

          <label className="label">Subject category</label>
          <div style={{ display: 'flex', gap: 5, marginBottom: 14, flexWrap: 'wrap' }}>
            {SUBJECT_CATEGORIES.map(t => (
              <span key={t} className={`pill ${scienceType === t ? 'active' : ''}`}
                onClick={() => {
                  setScienceType(t)
                  const firstSubject = SUBJECTS_BY_TYPE[t]?.[0] || 'GCSE Physics'
                  setSelectedSubject(firstSubject)
                  setSubject(firstSubject)
                  setSelectedTopic('')
                  setSelectedSubtopics([])
                  setSelectedPaperNum('')
                  setGenerated(null)
                  setMarkingResults(null)
                }}
                style={{ fontSize: 11 }}>{t}</span>
            ))}
          </div>

          <label className="label">Subject</label>
          <select className="select-field" value={selectedSubject} onChange={e => handleSubjectChange(e.target.value)} style={{ marginBottom: 14 }}>
            {subjectList.map(s => <option key={s}>{s}</option>)}
          </select>

          <label className="label">Exam board</label>
          <select className="select-field" value={board} onChange={e => setBoard(e.target.value)} style={{ marginBottom: 14 }}>
            {BOARDS.map(b => <option key={b}>{b}</option>)}
          </select>

          {/* Topic selector */}
          <label className="label">Topic</label>
          <select className="select-field" value={selectedTopic} onChange={e => handleTopicChange(e.target.value)} style={{ marginBottom: 10 }}>
            <option value="">All topics</option>
            {topicList.map(t => <option key={t}>{t}</option>)}
          </select>

          {/* Subtopics */}
          {selectedTopic && subtopics.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <label className="label">Content areas <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(pick specific or leave blank for all)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, maxHeight: 160, overflowY: 'auto' }}>
                {subtopics.map(s => (
                  <span key={s} className={`pill ${selectedSubtopics.includes(s) ? 'active' : ''}`}
                    onClick={() => toggleSubtopic(s)} style={{ fontSize: 11 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Formulas preview */}
          {formulasForTopic.length > 0 && (
            <div style={{ marginBottom: 14, background: 'var(--blue-light)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1e40af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📐 Formulas for this topic
              </div>
              {formulasForTopic.slice(0, 3).map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: '#1e40af', padding: '2px 0' }}>
                  <strong>{f.formula}</strong> — {f.desc}
                </div>
              ))}
              {formulasForTopic.length > 3 && <div style={{ fontSize: 11, color: '#93c5fd' }}>+{formulasForTopic.length - 3} more</div>}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <label className="label">Create</label>
              <select className="select-field" value={mode} onChange={e => setMode(e.target.value)}>
                <option value="exam">Exam paper</option>
                <option value="flash">Flashcards</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="label">Tier</label>
              <select className="select-field" value={tier} onChange={e => setTier(e.target.value)}>
                <option>Foundation</option><option>Higher</option><option>Mixed</option>
              </select>
            </div>
          </div>

          {/* Paper 1 / Paper 2 / Paper 3 selector */}
          <div style={{ marginBottom: 14 }}>
            <label className="label">Paper <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(optional — filter by paper)</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span
                className={`pill ${selectedPaperNum === '' ? 'active' : ''}`}
                onClick={() => setSelectedPaperNum('')}
                style={{ fontSize: 12 }}>All papers</span>
              {availablePapers.map(p => (
                <span
                  key={p}
                  className={`pill ${selectedPaperNum === p ? 'active' : ''}`}
                  onClick={() => setSelectedPaperNum(p)}
                  style={{ fontSize: 12 }}>{p}</span>
              ))}
            </div>
            {selectedPaperNum && (
              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--blue)' }}>
                ✓ Questions will be specific to {selectedPaperNum} topics only
              </div>
            )}
          </div>

          {mode !== 'flash' && (
            <div style={{ marginBottom: 14 }}>
              <label className="label">Questions</label>
              <select className="select-field" value={numQ} onChange={e => setNumQ(e.target.value)}>
                <option>5</option><option>10</option><option>15</option><option>20</option>
              </select>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="label">Extra context (optional)</label>
            <textarea className="textarea-field" placeholder="Paste syllabus text, specific requirements..." value={syllabusText} onChange={e => setSyllabusText(e.target.value)} style={{ minHeight: 60 }} />
          </div>

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }} onClick={generate} disabled={loading}>
            {loading ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Generating...</> : '⚡ Generate with AI'}
          </button>

          {aiError && (
            <AIError
              error={aiError}
              onRetry={generate}
              onDismiss={() => setAiError(null)}
            />
          )}
        </div>

        {/* Past Papers card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showPastPapers ? 12 : 0 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>📄 Past papers</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Official {board} papers</div>
            </div>
            <button className="btn-secondary" style={{ fontSize: 12, padding: '5px 12px' }} onClick={() => setShowPastPapers(!showPastPapers)}>
              {showPastPapers ? 'Hide' : 'Show'}
            </button>
          </div>

          {showPastPapers && (
            <div>
              {papersForSubject.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--gray-400)', textAlign: 'center', padding: '12px 0' }}>
                  Select {board} and a subject above to see past papers
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {papersForSubject.map((p, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '7px 10px', background: selectedPaper === i ? 'var(--blue-light)' : 'var(--gray-50)',
                      borderRadius: 8, border: `1px solid ${selectedPaper === i ? 'var(--blue-mid)' : 'var(--gray-200)'}`,
                      cursor: 'pointer'
                    }} onClick={() => setSelectedPaper(selectedPaper === i ? null : i)}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>{p.year} — {p.paper}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{board} {selectedSubject}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={p.url} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 11, color: '#1e40af', background: 'var(--blue-light)', padding: '3px 8px', borderRadius: 6 }}
                          onClick={e => e.stopPropagation()}>
                          Official →
                        </a>
                        <a href={p.pmt} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 11, color: '#065f46', background: 'var(--green-light)', padding: '3px 8px', borderRadius: 6 }}
                          onClick={e => e.stopPropagation()}>
                          PMT →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick actions after generation */}
        {generated?.exam?.length > 0 && (
          <div className="card" style={{ background: 'var(--green-light)', border: '1px solid #6ee7b7' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 8 }}>✓ Exam ready!</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="btn-secondary" style={{ justifyContent: 'center', fontSize: 13 }} onClick={printExam}>🖨️ Print exam only</button>
              {generated.flashcards?.length > 0 && (
                <button className="btn-secondary" style={{ justifyContent: 'center', fontSize: 13 }} onClick={() => switchTab('flashcards')}>🃏 Flashcards →</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL ── */}
      <div>
        {!generated && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', gap: 12 }}>
            <div style={{ fontSize: 52 }}>⚡</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gray-300)' }}>Your exam will appear here</div>
            <div style={{ fontSize: 14, color: 'var(--gray-400)' }}>Choose your subject, topic and content areas, then Generate</div>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)' }}>
              {mode === 'flash' ? 'Generating flashcards...' : mode === 'both' ? 'Generating exam & flashcards...' : 'Building your exam...'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Tailoring to {selectedSubject} ({board})</div>
          </div>
        )}

        {generated?.exam?.length > 0 && (
          <div className="fade-in">
            {/* Header */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)', marginBottom: 6 }}>
                    {selectedSubject} — {board}
                  </h3>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="tag tag-navy">{generated.exam.length} questions</span>
                    <span className="tag tag-blue">{generated.exam.reduce((s, q) => s + (q.marks || 1), 0)} marks</span>
                    <span className="tag tag-amber">{tier} tier</span>
                    <span className="tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>{scienceType}</span>
                    {selectedTopic && <span className="tag tag-green">{selectedTopic}</span>}
                  </div>
                </div>
                <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={printExam}>🖨️ Print exam only</button>
              </div>

              {/* Mode toggle */}
              <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 10, padding: 4, gap: 4 }}>
                {[{ key: 'print', label: '📄 Print version' }, { key: 'online', label: '✏️ Answer online & get marked' }].map(opt => (
                  <button key={opt.key} onClick={() => { setAnswerMode(opt.key); setMarkingResults(null) }} style={{
                    flex: 1, padding: '9px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                    background: answerMode === opt.key ? 'white' : 'transparent',
                    color: answerMode === opt.key ? 'var(--navy)' : 'var(--gray-500)',
                    boxShadow: answerMode === opt.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
                  }}>{opt.label}</button>
                ))}
              </div>
            </div>

            {/* Formula sheet banner */}
            {formulasForTopic.length > 0 && (
              <div style={{ background: 'var(--navy)', borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📐 Formula sheet — {selectedTopic}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {formulasForTopic.map((f, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 10px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--gold)' }}>{f.formula}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions */}
            {generated.exam.map(q => {
              const result = markingResults?.questions?.find(r => r.id === q.id)
              const svgDiagram = (q.needsDiagram || q.diagramDescription) ? generateDiagram(q.question, q.topic) : null
              const borderCol = result
                ? result.awarded === result.available ? '#6ee7b7' : result.awarded > 0 ? '#fcd34d' : '#fca5a5'
                : undefined

              return (
                <div key={q.id} className="card" style={{ marginBottom: 12, borderColor: borderCol, borderWidth: result ? 1.5 : 1 }}>
                  {/* Q header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ background: 'var(--navy)', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{q.id}</span>
                        <span className="tag tag-blue" style={{ fontSize: 11 }}>{q.subtopic || q.topic}</span>
                        {q.type && <span className="tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)', fontSize: 11 }}>{q.type}</span>}
                      </div>
                      {q.formulaGiven && (
                        <div style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)', borderRadius: 6, padding: '4px 10px', fontSize: 13, color: '#1e40af', marginBottom: 8, display: 'inline-block' }}>
                          You may use: &nbsp;<strong>{q.formulaGiven}</strong>
                        </div>
                      )}
                      <p style={{ fontSize: 15, color: 'var(--gray-900)', lineHeight: 1.7, fontWeight: 500 }}>{q.question}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', whiteSpace: 'nowrap' }}>
                        [{q.marks} {q.marks === 1 ? 'mark' : 'marks'}]
                      </div>
                      {result && (
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', color: result.awarded === result.available ? 'var(--green)' : result.awarded > 0 ? 'var(--amber)' : 'var(--red)' }}>
                          {result.awarded}/{result.available}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SVG Diagram */}
                  {svgDiagram && (
                    <div style={{ border: '1.5px solid var(--gray-200)', borderRadius: 8, padding: '12px 14px', marginBottom: 12, background: 'var(--gray-50)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>📐 Diagram</div>
                      <div dangerouslySetInnerHTML={{ __html: svgDiagram }} />
                      {q.diagramDescription && (
                        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-500)', fontStyle: 'italic', borderTop: '1px solid var(--gray-200)', paddingTop: 8 }}>
                          {q.diagramDescription}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text-only diagram description if no SVG */}
                  {!svgDiagram && q.diagramDescription && (
                    <div style={{ border: '1.5px solid var(--gray-200)', borderRadius: 8, padding: '10px 14px', marginBottom: 12, background: 'var(--gray-50)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>📐 Diagram description</div>
                      <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: 10 }}>{q.diagramDescription}</div>
                      <div style={{ border: '1px dashed var(--gray-300)', borderRadius: 6, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)', fontSize: 12 }}>Sketch space</div>
                    </div>
                  )}

                  {/* Answer area */}
                  {answerMode === 'print' ? (
                    <div style={{ border: '1.5px dashed var(--gray-300)', borderRadius: 8, padding: 12, minHeight: q.marks > 3 ? 100 : 60, background: 'var(--gray-50)', marginBottom: 10, fontSize: 13, color: 'var(--gray-400)' }}>
                      Write your answer here...
                    </div>
                  ) : (
                    <textarea className="textarea-field" placeholder={`Type your answer for Q${q.id}...`} value={answers[q.id] || ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      style={{ minHeight: q.marks > 3 ? 110 : 70, marginBottom: 10 }} />
                  )}

                  {/* Marking result */}
                  {result && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                      <div style={{
                        background: result.awarded === result.available ? 'var(--green-light)' : result.awarded > 0 ? 'var(--amber-light)' : 'var(--red-light)',
                        borderRadius: 8, padding: '8px 12px', fontSize: 13, lineHeight: 1.6,
                        color: result.awarded === result.available ? '#065f46' : result.awarded > 0 ? '#92400e' : '#991b1b'
                      }}>{result.feedback}</div>
                      {result.examTip && (
                        <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#1e40af' }}>
                          💡 <strong>Exam tip:</strong> {result.examTip}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hints + model answer */}
                  <details style={{ fontSize: 13 }}>
                    <summary style={{ cursor: 'pointer', color: 'var(--blue)', fontWeight: 500, userSelect: 'none' }}>Show hint & model answer</summary>
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {q.hints?.length > 0 && (
                        <div style={{ background: 'var(--gold-light)', borderRadius: 8, padding: '8px 12px', color: '#92400e' }}>
                          <strong>Hint:</strong> {q.hints.join(' · ')}
                        </div>
                      )}
                      <div style={{ background: 'var(--green-light)', borderRadius: 8, padding: '8px 12px', color: '#065f46', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                        <strong>Model answer:</strong>{'\n'}{q.modelAnswer}
                      </div>
                      {q.examTip && (
                        <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '8px 12px', color: '#1e40af' }}>
                          💡 <strong>Exam tip:</strong> {q.examTip}
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )
            })}

            {/* Submit button */}
            {answerMode === 'online' && !markingResults && (
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, marginTop: 4 }} onClick={submitForMarking} disabled={marking}>
                {marking ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Marking your answers...</> : '✓ Submit all answers for AI marking'}
              </button>
            )}

            {/* Overall marking result */}
            {markingResults && (
              <div className="card fade-in" style={{ marginTop: 8, background: 'var(--navy)', border: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'white', lineHeight: 1 }}>{markingResults.totalAwarded}/{markingResults.totalAvailable}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{pct}% correct</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--gold)', lineHeight: 1 }}>{markingResults.grade}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Grade</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 999, height: 8, marginBottom: 14, overflow: 'hidden' }}>
                  <div style={{ height: 8, borderRadius: 999, background: barColor, width: `${pct}%`, transition: 'width 1s ease' }} />
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 14 }}>{markingResults.summary}</p>

                {/* Resource suggestions based on weak topics */}
                {markingResults.weakTopics?.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                      📚 Recommended resources for your weak topics
                    </div>
                    {markingResults.weakTopics.map(topic => {
                      const resources = TOPIC_RESOURCES[topic] || TOPIC_RESOURCES['default']
                      return (
                        <div key={topic} style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 500, marginBottom: 5 }}>{topic}</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {resources.slice(0, 3).map((r, i) => (
                              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                                fontSize: 12, color: 'white', background: 'rgba(255,255,255,0.15)',
                                padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)'
                              }}>
                                {r.name} →
                              </a>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-gold" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
                    onClick={() => { setAnswers({}); setMarkingResults(null) }}>
                    Try again
                  </button>
                  <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                    onClick={() => switchTab('planner')}>
                    Build revision plan →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {generated?.flashcards?.length > 0 && !generated?.exam?.length && (
          <div className="card fade-in" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🃏</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)', marginBottom: 8 }}>{generated.flashcards.length} flashcards ready</h3>
            <p style={{ color: 'var(--gray-500)', marginBottom: 20, fontSize: 14 }}>Head to Flashcards tab to study with spaced repetition</p>
            <button className="btn-primary" onClick={() => switchTab('flashcards')}>Go to Flashcards →</button>
          </div>
        )}
      </div>
    </div>
  )
}
