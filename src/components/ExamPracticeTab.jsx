import React, { useState, useEffect } from 'react'
import { callClaude, parseJSON } from '../lib/claude.js'

// ── Paper definitions — subject → papers → 3 practice exams each ─────────────
const EXAM_STRUCTURE = {
  'GCSE Physics': {
    boards: ['AQA', 'Edexcel', 'OCR'],
    papers: [
      {
        id: 'p1',
        name: 'Paper 1',
        topics: 'Energy, Electricity, Particle Model, Atomic Structure',
        marks: 100,
        time: '1h 45min',
        tier: ['Foundation', 'Higher'],
      },
      {
        id: 'p2',
        name: 'Paper 2',
        topics: 'Forces, Waves, Magnetism & Electromagnetism, Space Physics',
        marks: 100,
        time: '1h 45min',
        tier: ['Foundation', 'Higher'],
      },
    ],
  },
  'GCSE Chemistry': {
    boards: ['AQA', 'Edexcel', 'OCR'],
    papers: [
      {
        id: 'p1',
        name: 'Paper 1',
        topics: 'Atomic Structure, Periodic Table, Bonding, Quantitative Chemistry, Chemical Changes, Energy Changes',
        marks: 100,
        time: '1h 45min',
        tier: ['Foundation', 'Higher'],
      },
      {
        id: 'p2',
        name: 'Paper 2',
        topics: 'Rates of Reaction, Equilibrium, Organic Chemistry, Analysis, Atmosphere & Resources',
        marks: 100,
        time: '1h 45min',
        tier: ['Foundation', 'Higher'],
      },
    ],
  },
  'GCSE Biology': {
    boards: ['AQA', 'Edexcel', 'OCR'],
    papers: [
      {
        id: 'p1',
        name: 'Paper 1',
        topics: 'Cell Biology, Organisation (digestive system, heart, lungs), Infection & Response, Bioenergetics',
        marks: 100,
        time: '1h 45min',
        tier: ['Foundation', 'Higher'],
      },
      {
        id: 'p2',
        name: 'Paper 2',
        topics: 'Homeostasis (nervous system, hormones, kidneys), Inheritance & Genetics, Evolution, Ecology',
        marks: 100,
        time: '1h 45min',
        tier: ['Foundation', 'Higher'],
      },
    ],
  },
  'GCSE Combined Science (Physics)': {
    boards: ['AQA', 'Edexcel', 'OCR'],
    papers: [
      { id: 'p1', name: 'Paper 1', topics: 'Energy, Electricity, Particle Model, Atomic Structure (combined)', marks: 70, time: '1h 15min', tier: ['Foundation', 'Higher'] },
      { id: 'p2', name: 'Paper 2', topics: 'Forces, Waves, Magnetism (combined)', marks: 70, time: '1h 15min', tier: ['Foundation', 'Higher'] },
    ],
  },
  'GCSE Combined Science (Chemistry)': {
    boards: ['AQA', 'Edexcel', 'OCR'],
    papers: [
      { id: 'p1', name: 'Paper 1', topics: 'Atomic Structure, Bonding, Quantitative, Chemical Changes (combined)', marks: 70, time: '1h 15min', tier: ['Foundation', 'Higher'] },
      { id: 'p2', name: 'Paper 2', topics: 'Rates, Organic, Analysis, Atmosphere (combined)', marks: 70, time: '1h 15min', tier: ['Foundation', 'Higher'] },
    ],
  },
  'GCSE Combined Science (Biology)': {
    boards: ['AQA', 'Edexcel', 'OCR'],
    papers: [
      { id: 'p1', name: 'Paper 1', topics: 'Cells, Organisation, Infection & Response, Bioenergetics (combined)', marks: 70, time: '1h 15min', tier: ['Foundation', 'Higher'] },
      { id: 'p2', name: 'Paper 2', topics: 'Homeostasis, Inheritance, Evolution, Ecology (combined)', marks: 70, time: '1h 15min', tier: ['Foundation', 'Higher'] },
    ],
  },
  'GCSE Maths': {
    boards: ['AQA', 'Edexcel', 'OCR'],
    papers: [
      { id: 'p1', name: 'Paper 1 (Non-calculator)', topics: 'Number, Algebra, Ratio, Geometry, Probability (no calculator)', marks: 80, time: '1h 30min', tier: ['Foundation', 'Higher'] },
      { id: 'p2', name: 'Paper 2 (Calculator)', topics: 'Statistics, Trigonometry, Graphs, Further Algebra', marks: 80, time: '1h 30min', tier: ['Foundation', 'Higher'] },
      { id: 'p3', name: 'Paper 3 (Calculator)', topics: 'Mixed — all topics, problem solving focus', marks: 80, time: '1h 30min', tier: ['Foundation', 'Higher'] },
    ],
  },
  'GCSE English Literature': {
    boards: ['AQA', 'Edexcel', 'OCR'],
    papers: [
      { id: 'p1', name: 'Paper 1', topics: 'Shakespeare (Macbeth / Romeo & Juliet) + 19th Century Novel', marks: 64, time: '1h 45min', tier: ['Higher'] },
      { id: 'p2', name: 'Paper 2', topics: 'Modern Prose/Drama + Poetry Anthology + Unseen Poetry', marks: 96, time: '2h 15min', tier: ['Higher'] },
    ],
  },
  'GCSE English Language': {
    boards: ['AQA', 'Edexcel', 'OCR'],
    papers: [
      { id: 'p1', name: 'Paper 1', topics: 'Reading fiction texts + Descriptive/Narrative writing', marks: 80, time: '1h 45min', tier: ['Foundation', 'Higher'] },
      { id: 'p2', name: 'Paper 2', topics: 'Reading non-fiction texts + Persuasive/Viewpoint writing', marks: 80, time: '1h 45min', tier: ['Foundation', 'Higher'] },
    ],
  },
}

const ALL_SUBJECTS = Object.keys(EXAM_STRUCTURE)
const CACHE_KEY = 'sec_practice_papers'

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
}
function saveCache(cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch {}
}

export default function ExamPracticeTab({ subject: globalSubject }) {
  const [selectedSubject, setSelectedSubject] = useState(
    EXAM_STRUCTURE[globalSubject] ? globalSubject : 'GCSE Physics'
  )
  const [selectedBoard, setSelectedBoard] = useState('AQA')
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [selectedTier, setSelectedTier] = useState('Higher')
  const [selectedPractice, setSelectedPractice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generatingExtra, setGeneratingExtra] = useState(false)
  const [generatedExam, setGeneratedExam] = useState(null)
  const [answers, setAnswers] = useState({})
  const [answerMode, setAnswerMode] = useState('print')
  const [marking, setMarking] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [cache, setCache] = useState(loadCache)
  // Extra generated exams (beyond the 3 base ones)
  const [extraExams, setExtraExams] = useState([]) // array of exam objects

  const subjectData = EXAM_STRUCTURE[selectedSubject] || {}
  const papers = subjectData.papers || []

  const getCacheKey = (examNum) =>
    `${selectedSubject}__${selectedBoard}__${selectedPaper?.id}__${selectedTier}__exam${examNum}`

  const deleteFromCache = (examNum) => {
    const cacheKey = getCacheKey(examNum)
    const newCache = { ...cache }
    delete newCache[cacheKey]
    setCache(newCache)
    saveCache(newCache)
  }

  const deleteExtraExam = (extraId) => {
    setExtraExams(prev => prev.filter(e => e.extraId !== extraId))
  }

  const generateExtra = async () => {
    setGeneratingExtra(true)
    setError('')
    const extraNum = extraExams.length + 4 // 4, 5, 6...
    const isCombined = selectedSubject.includes('Combined Science')
    const prompt = `You are a senior ${selectedBoard} GCSE ${selectedSubject} examiner creating extra Practice Paper ${extraNum}.
Subject: ${selectedSubject} (${selectedBoard})
Paper: ${selectedPaper?.name}
Tier: ${selectedTier}
Topics: ${selectedPaper?.topics}
Total marks: ${selectedPaper?.marks}
${isCombined ? 'Combined Science only.' : ''}
This is an ADDITIONAL practice paper — make it different from the previous ones.
Return ONLY a JSON array of questions (same format as before):
[{ "id": 1, "question": "...", "marks": 2, "topic": "...", "subtopic": "...", "type": "...", "options": [], "formulaGiven": "", "diagramDescription": "", "modelAnswer": "...", "examTip": "..." }]
Generate enough questions to total approximately ${selectedPaper?.marks} marks.`

    try {
      const raw = await callClaude(prompt, '', 4000)
      const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim()
      const start = cleaned.indexOf('[')
      const end = cleaned.lastIndexOf(']') + 1
      const questions = JSON.parse(start >= 0 ? cleaned.slice(start, end) : cleaned)
      const extraExam = {
        extraId: Date.now(),
        examNum: extraNum,
        subject: selectedSubject,
        board: selectedBoard,
        paper: selectedPaper?.name,
        tier: selectedTier,
        topics: selectedPaper?.topics,
        totalMarks: selectedPaper?.marks,
        time: selectedPaper?.time,
        questions,
        generatedAt: new Date().toLocaleDateString('en-GB'),
      }
      setExtraExams(prev => [...prev, extraExam])
    } catch (e) {
      setError('Failed to generate extra paper. Please try again.')
    } finally {
      setGeneratingExtra(false)
    }
  }

  const generatePaper = async (examNum) => {
    const cacheKey = getCacheKey(examNum)

    // Check cache first
    const cached = cache[cacheKey]
    if (cached) {
      setGeneratedExam(cached)
      setSelectedPractice({ examNum, paper: selectedPaper })
      setAnswers({})
      setResults(null)
      return
    }

    setLoading(true)
    setError('')

    const isCombined = selectedSubject.includes('Combined Science')
    const calcNote = selectedPaper?.name?.includes('Non-calc') ? 'NON-CALCULATOR paper — no calculator questions.' : ''

    const prompt = `You are a senior ${selectedBoard} GCSE ${selectedSubject} examiner creating Practice Paper ${examNum} of 3.

These are PRACTICE papers — they must be DIFFERENT from each other (this is Paper ${examNum}/3).
Subject: ${selectedSubject} (${selectedBoard})
Paper: ${selectedPaper?.name}
Tier: ${selectedTier}
Topics: ${selectedPaper?.topics}
Total marks: ${selectedPaper?.marks}
Time: ${selectedPaper?.time}
${calcNote}
${isCombined ? 'Combined Science — use combined syllabus content only.' : ''}

Create a realistic paper matching real ${selectedBoard} ${selectedSubject} ${selectedPaper?.name} style exactly.
Include: multiple choice (1 mark), short answer (2-3 marks), calculations (3-4 marks), extended response (5-6 marks).
Must include at least 1 required practical question and 1 six-mark extended response.

Return ONLY a JSON array of questions:
[
  {
    "id": 1,
    "question": "Question text exactly as it would appear on a ${selectedBoard} paper",
    "marks": 2,
    "topic": "topic name",
    "subtopic": "specific content",
    "type": "multiple choice|short answer|calculation|extended response|practical",
    "options": ["A. option", "B. option", "C. option", "D. option"],
    "formulaGiven": "e.g. v = fλ if formula is given in exam",
    "diagramDescription": "describe diagram if needed, empty string otherwise",
    "modelAnswer": "Full mark scheme answer — show formula, substitution, answer with units for calculations",
    "examTip": "Key tip for this question type"
  }
]
Generate enough questions to total approximately ${selectedPaper?.marks} marks.`

    try {
      const raw = await callClaude(prompt, '', 4000)
      const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim()
      const start = cleaned.indexOf('[')
      const end = cleaned.lastIndexOf(']') + 1
      const questions = JSON.parse(start >= 0 ? cleaned.slice(start, end) : cleaned)

      const exam = {
        subject: selectedSubject,
        board: selectedBoard,
        paper: selectedPaper?.name,
        tier: selectedTier,
        topics: selectedPaper?.topics,
        totalMarks: selectedPaper?.marks,
        time: selectedPaper?.time,
        examNum,
        questions,
        generatedAt: new Date().toLocaleDateString('en-GB'),
      }

      // Cache it
      const newCache = { ...cache, [cacheKey]: exam }
      setCache(newCache)
      saveCache(newCache)

      setGeneratedExam(exam)
      setSelectedPractice({ examNum, paper: selectedPaper })
      setAnswers({})
      setResults(null)
    } catch (e) {
      setError('Generation failed. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const markPaper = async () => {
    if (!generatedExam) return
    setMarking(true)
    setResults(null)

    const totalMarks = generatedExam.questions.reduce((s, q) => s + (q.marks || 0), 0)

    const prompt = `You are marking a ${selectedSubject} (${selectedBoard}) GCSE ${selectedPaper?.name} — ${selectedTier} tier.

${generatedExam.questions.map(q =>
  `Q${q.id} [${q.marks} marks] — ${q.question}\nModel answer: ${q.modelAnswer}\nStudent: ${answers[q.id] || '(blank)'}`
).join('\n\n')}

Return ONLY valid JSON:
{
  "totalAwarded": 60,
  "totalAvailable": ${totalMarks},
  "percentage": 60,
  "grade": "6",
  "summary": "2-3 warm encouraging sentences",
  "questions": [
    { "id": 1, "awarded": 2, "available": 2, "feedback": "specific feedback", "examTip": "tip" }
  ],
  "weakTopics": ["topic1"],
  "strongTopics": ["topic2"],
  "adviceToImprove": "specific advice to go from their grade to the next"
}`

    try {
      const raw = await callClaude(prompt, '', 3000)
      setResults(parseJSON(raw))
    } catch (e) {
      setError('Marking failed. Please try again.')
    } finally {
      setMarking(false)
    }
  }

  const printPaper = () => {
    if (!generatedExam) return
    const w = window.open('', '_blank')
    w.document.write(`<!DOCTYPE html><html><head>
    <title>${generatedExam.subject} — ${generatedExam.board} ${generatedExam.paper} Practice ${generatedExam.examNum}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Georgia,serif;font-size:14px;color:#000;padding:36px;max-width:740px;margin:0 auto;line-height:1.6}
      h1{font-size:20px;margin-bottom:4px}
      .meta{font-size:12px;color:#555;margin-bottom:14px}
      .notice{border:1.5px solid #000;padding:10px 14px;margin:12px 0;font-size:13px;line-height:1.7}
      .q{margin-bottom:22px;page-break-inside:avoid}
      .qrow{display:flex;justify-content:space-between;margin-bottom:4px}
      .qnum{font-weight:bold;font-size:14px}
      .sub{font-size:11px;color:#777;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}
      .qtext{font-size:14px;margin-bottom:8px;line-height:1.7}
      .formula{display:inline-block;border:1px solid #ccc;padding:3px 10px;background:#f0f4ff;font-size:13px;margin-bottom:6px;border-radius:3px}
      .diag{border:1px solid #bbb;padding:8px 12px;background:#f9f9f9;margin:6px 0;border-radius:3px;font-size:13px;font-style:italic}
      .draw{border:1px dashed #bbb;height:100px;margin:6px 0;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:11px}
      .opt{margin:3px 0 3px 12px;font-size:13px}
      .line{border-bottom:1px solid #aaa;margin:7px 0;height:20px}
      .footer{margin-top:28px;font-size:10px;color:#aaa;border-top:1px solid #eee;padding-top:10px;text-align:center}
      @media print{body{padding:18px}}
    </style>
    </head><body>
    <h1>${generatedExam.subject} — ${generatedExam.board}</h1>
    <div style="font-size:16px;font-weight:bold;margin-bottom:4px">${generatedExam.paper} — Practice Paper ${generatedExam.examNum} of 3</div>
    <div class="meta">${generatedExam.tier} Tier · Total: ${generatedExam.totalMarks} marks · Time allowed: ${generatedExam.time}</div>
    <div class="notice">
      <strong>Instructions to candidates</strong><br>
      • Answer ALL questions. Write your answers in the spaces provided.<br>
      • Show ALL working for calculation questions — method marks are available.<br>
      • The number of marks is shown in brackets [ ] at the end of each question.<br>
      ${generatedExam.paper?.includes('Non-calc') ? '• <strong>You must NOT use a calculator in this paper.</strong>' : '• A calculator may be used in this paper.'}
    </div>
    ${generatedExam.questions.map(q => {
      const lines = q.marks > 5 ? 10 : q.marks > 3 ? 7 : q.marks > 1 ? 4 : 2
      return `<div class="q">
        <div class="qrow"><span class="qnum">Q${q.id}</span><span>[${q.marks} mark${q.marks > 1 ? 's' : ''}]</span></div>
        <div class="sub">${q.subtopic || q.topic}</div>
        ${q.formulaGiven ? `<div class="formula">You may use: ${q.formulaGiven}</div><br>` : ''}
        ${q.diagramDescription ? `<div class="diag">${q.diagramDescription}<div class="draw">Sketch here</div></div>` : ''}
        <div class="qtext">${q.question}</div>
        ${q.options?.length
          ? q.options.map(o => `<div class="opt">☐ ${o}</div>`).join('')
          : Array(lines).fill('<div class="line"></div>').join('')}
      </div>`
    }).join('')}
    <div class="footer">
      Study & Exam Coach — Practice Paper ${generatedExam.examNum}/3 · ${generatedExam.subject} (${generatedExam.board}) · ${generatedExam.paper}<br>
      Generated ${generatedExam.generatedAt} · AI-generated practice paper, not official ${generatedExam.board} content
    </div>
    </body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 400)
  }

  const pct = results ? Math.round((results.totalAwarded / results.totalAvailable) * 100) : 0
  const barColor = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)'

  // ── VIEW: Exam being taken ────────────────────────────────────────────────
  if (generatedExam && selectedPractice) {
    const allQ = generatedExam.questions
    return (
      <div>
        {/* Header */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <div>
              <button onClick={() => { setGeneratedExam(null); setSelectedPractice(null); setResults(null) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', fontSize: 13, padding: 0, marginBottom: 6 }}>
                ← Back to papers
              </button>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)', marginBottom: 6 }}>
                {generatedExam.subject} — {generatedExam.board}
              </h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="tag tag-navy">{generatedExam.paper}</span>
                <span className="tag tag-blue">Practice {generatedExam.examNum} of 3</span>
                <span className="tag tag-amber">{generatedExam.tier} tier</span>
                <span className="tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)', fontSize: 11 }}>
                  {generatedExam.totalMarks} marks · {generatedExam.time}
                </span>
              </div>
            </div>
            <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={printPaper}>
              🖨️ Print paper
            </button>
          </div>

          {/* Answer mode toggle */}
          <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 10, padding: 4, gap: 4 }}>
            {[{ key: 'print', label: '📄 Print version' }, { key: 'online', label: '✏️ Answer online & get marked' }].map(opt => (
              <button key={opt.key} onClick={() => { setAnswerMode(opt.key); setResults(null) }} style={{
                flex: 1, padding: '9px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                background: answerMode === opt.key ? 'white' : 'transparent',
                color: answerMode === opt.key ? 'var(--navy)' : 'var(--gray-500)',
                boxShadow: answerMode === opt.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}>{opt.label}</button>
            ))}
          </div>
        </div>

        {/* Questions */}
        {allQ.map(q => {
          const result = results?.questions?.find(r => r.id === q.id)
          const borderCol = result
            ? result.awarded === result.available ? '#6ee7b7' : result.awarded > 0 ? '#fcd34d' : '#fca5a5'
            : undefined

          return (
            <div key={q.id} className="card" style={{ marginBottom: 12, borderColor: borderCol, borderWidth: result ? 1.5 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ background: 'var(--navy)', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{q.id}</span>
                    <span className="tag tag-blue" style={{ fontSize: 11 }}>{q.subtopic || q.topic}</span>
                    <span className="tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)', fontSize: 11 }}>{q.type}</span>
                  </div>
                  {q.formulaGiven && (
                    <div style={{ display: 'inline-block', background: 'var(--blue-light)', border: '1px solid var(--blue-mid)', borderRadius: 6, padding: '3px 10px', fontSize: 13, color: '#1e40af', marginBottom: 8 }}>
                      You may use: <strong>{q.formulaGiven}</strong>
                    </div>
                  )}
                  {q.diagramDescription && (
                    <div style={{ background: 'var(--gray-50)', border: '1.5px solid var(--gray-200)', borderRadius: 8, padding: '10px 14px', marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 5 }}>📐 Diagram</div>
                      <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: 8 }}>{q.diagramDescription}</div>
                      <div style={{ border: '1px dashed var(--gray-300)', borderRadius: 6, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)', fontSize: 12 }}>Sketch here</div>
                    </div>
                  )}
                  <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.7 }}>{q.question}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>
                    [{q.marks} {q.marks === 1 ? 'mark' : 'marks'}]
                  </div>
                  {result && (
                    <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', color: result.awarded === result.available ? 'var(--green)' : result.awarded > 0 ? 'var(--amber)' : 'var(--red)' }}>
                      {result.awarded}/{result.available}
                    </div>
                  )}
                </div>
              </div>

              {/* Multiple choice options */}
              {q.options?.length > 0 && answerMode === 'online' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                  {q.options.map((opt, oi) => (
                    <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', background: answers[q.id] === opt ? 'var(--blue-light)' : 'var(--gray-50)', border: `1px solid ${answers[q.id] === opt ? 'var(--blue-mid)' : 'var(--gray-200)'}`, fontSize: 14, color: 'var(--gray-800)' }}>
                      <input type="radio" name={`q${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))} style={{ flexShrink: 0 }} />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.options?.length > 0 && answerMode === 'print' && (
                <div style={{ marginBottom: 10 }}>
                  {q.options.map((opt, oi) => <div key={oi} style={{ fontSize: 14, color: 'var(--gray-700)', padding: '3px 0' }}>☐ {opt}</div>)}
                </div>
              )}

              {/* Written answer */}
              {(!q.options?.length) && answerMode === 'online' && (
                <textarea className="textarea-field" placeholder={`Answer Q${q.id}...`}
                  value={answers[q.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  style={{ minHeight: q.marks > 4 ? 120 : q.marks > 2 ? 80 : 50, marginBottom: 10 }} />
              )}
              {(!q.options?.length) && answerMode === 'print' && (
                <div style={{ border: '1.5px dashed var(--gray-300)', borderRadius: 8, padding: 10, minHeight: q.marks > 4 ? 90 : 50, background: 'var(--gray-50)', marginBottom: 10, fontSize: 13, color: 'var(--gray-400)' }}>
                  Write your answer here...
                </div>
              )}

              {/* Marking feedback */}
              {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                  <div style={{ background: result.awarded === result.available ? 'var(--green-light)' : result.awarded > 0 ? 'var(--amber-light)' : 'var(--red-light)', borderRadius: 8, padding: '8px 12px', fontSize: 13, lineHeight: 1.6, color: result.awarded === result.available ? '#065f46' : result.awarded > 0 ? '#92400e' : '#991b1b' }}>
                    {result.feedback}
                  </div>
                  {result.examTip && <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '7px 12px', fontSize: 13, color: '#1e40af' }}>💡 {result.examTip}</div>}
                </div>
              )}

              {/* Model answer */}
              <details style={{ fontSize: 13 }}>
                <summary style={{ cursor: 'pointer', color: 'var(--blue)', fontWeight: 500, userSelect: 'none' }}>Show model answer</summary>
                <div style={{ marginTop: 10, background: 'var(--green-light)', borderRadius: 8, padding: '8px 12px', color: '#065f46', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {q.modelAnswer}
                </div>
              </details>
            </div>
          )
        })}

        {/* Submit for marking */}
        {answerMode === 'online' && !results && (
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, marginTop: 8 }}
            onClick={markPaper} disabled={marking}>
            {marking ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Marking your paper...</> : '✓ Submit for AI marking'}
          </button>
        )}

        {/* Results */}
        {results && (
          <div className="card fade-in" style={{ marginTop: 12, background: 'var(--navy)', border: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: 'white', lineHeight: 1 }}>{results.totalAwarded}/{results.totalAvailable}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{pct}% · {generatedExam.paper} Practice {generatedExam.examNum}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: 'var(--gold)', lineHeight: 1 }}>{results.grade}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Grade</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 999, height: 8, marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ height: 8, borderRadius: 999, background: barColor, width: `${pct}%`, transition: 'width 1s ease' }} />
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 12 }}>{results.summary}</p>
            {results.adviceToImprove && (
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--gold)' }}>To improve: </strong>{results.adviceToImprove}
              </div>
            )}
            {results.weakTopics?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Revise:</span>
                {results.weakTopics.map(t => <span key={t} className="tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 11 }}>{t}</span>)}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn-gold" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
                onClick={() => { setAnswers({}); setResults(null) }}>Try this paper again</button>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => { setGeneratedExam(null); setSelectedPractice(null); setResults(null) }}>
                Choose another paper
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── VIEW: Paper selection ─────────────────────────────────────────────────
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)', marginBottom: 4 }}>
          📝 Exam Practice Papers
        </h2>
        <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 0, lineHeight: 1.6 }}>
          3 complete practice papers per subject and paper number. Each paper is realistic, board-specific and fully AI-marked.
          Papers are generated once then saved — so they load instantly after the first time.
        </p>
      </div>

      {/* Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        <div>
          <label className="label">Subject</label>
          <select className="select-field" value={selectedSubject}
            onChange={e => { setSelectedSubject(e.target.value); setSelectedPaper(null) }}>
            {ALL_SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Exam board</label>
          <select className="select-field" value={selectedBoard} onChange={e => setSelectedBoard(e.target.value)}>
            {(subjectData.boards || ['AQA', 'Edexcel', 'OCR']).map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Tier</label>
          <select className="select-field" value={selectedTier} onChange={e => setSelectedTier(e.target.value)}>
            {(selectedPaper?.tier || ['Foundation', 'Higher']).map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Paper tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {papers.map(paper => (
          <button key={paper.id}
            onClick={() => setSelectedPaper(paper)}
            style={{
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, transition: 'all 0.15s',
              background: selectedPaper?.id === paper.id ? 'var(--navy)' : 'white',
              color: selectedPaper?.id === paper.id ? 'white' : 'var(--gray-700)',
              boxShadow: selectedPaper?.id === paper.id ? '0 2px 8px rgba(10,36,99,0.2)' : '0 1px 3px rgba(0,0,0,0.08)',
            }}>
            {paper.name}
          </button>
        ))}
      </div>

      {/* Paper info + 3 practice exams */}
      {selectedPaper && (
        <div className="fade-in">
          <div className="card" style={{ marginBottom: 16, background: 'var(--gray-50)', border: '1.5px solid var(--gray-200)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)', marginBottom: 6 }}>
              {selectedSubject} — {selectedBoard} {selectedPaper.name}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              <span className="tag tag-navy">{selectedPaper.marks} marks</span>
              <span className="tag tag-blue">{selectedPaper.time}</span>
              <span className="tag tag-amber">{selectedTier} tier</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>
              <strong>Topics covered:</strong> {selectedPaper.topics}
            </div>
          </div>

          {error && <div style={{ marginBottom: 14, padding: '10px 14px', background: 'var(--red-light)', borderRadius: 8, fontSize: 13, color: 'var(--red)' }}>{error}</div>}

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, gap: 14 }}>
              <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)' }}>Generating practice paper...</div>
              <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>This takes about 15 seconds. The paper is saved after generation.</div>
            </div>
          )}

          {!loading && (
            <div>
              {/* Base 3 papers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 14 }}>
                {[1, 2, 3].map(examNum => {
                  const cacheKey = getCacheKey(examNum)
                  const isCached = !!cache[cacheKey]
                  return (
                    <div key={examNum} className="card" style={{ transition: 'var(--transition)', position: 'relative' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>

                      {/* Delete button — only shows if cached */}
                      {isCached && (
                        <button onClick={() => deleteFromCache(examNum)}
                          title="Delete this paper (will regenerate next time)"
                          style={{ position: 'absolute', top: 8, right: 8, background: 'var(--red-light)', border: '1px solid #fca5a5', borderRadius: 6, color: '#991b1b', fontSize: 11, padding: '2px 8px', cursor: 'pointer' }}>
                          Delete
                        </button>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, paddingRight: isCached ? 56 : 0 }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)', marginBottom: 4 }}>
                            Practice Paper {examNum}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                            {selectedSubject.replace('GCSE ', '')} · {selectedPaper.name}
                          </div>
                        </div>
                        {isCached && (
                          <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--green-light)', color: '#065f46', borderRadius: 999, fontWeight: 500, flexShrink: 0 }}>
                            ✓ Ready
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12, lineHeight: 1.6 }}>
                        <div>📋 {selectedPaper.marks} marks · {selectedPaper.time}</div>
                        <div style={{ marginTop: 2 }}>📚 {selectedPaper.topics.split(',').slice(0, 3).join(', ')}...</div>
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '9px 12px' }}
                          onClick={() => generatePaper(examNum)}>
                          {isCached ? '▶ Open paper' : '⚡ Generate paper'}
                        </button>
                        {isCached && (
                          <button className="btn-secondary" style={{ fontSize: 13, padding: '9px 12px' }}
                            onClick={() => {
                              setGeneratedExam(cache[cacheKey])
                              setSelectedPractice({ examNum, paper: selectedPaper })
                              setAnswerMode('print')
                              setAnswers({})
                              setResults(null)
                              setTimeout(printPaper, 100)
                            }}>
                            🖨️
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Extra generated exams */}
              {extraExams.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Extra practice papers
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                    {extraExams.map(extra => (
                      <div key={extra.extraId} className="card" style={{ transition: 'var(--transition)', position: 'relative', borderColor: '#185FA5', borderWidth: 1.5 }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                        <button onClick={() => deleteExtraExam(extra.extraId)}
                          style={{ position: 'absolute', top: 8, right: 8, background: 'var(--red-light)', border: '1px solid #fca5a5', borderRadius: 6, color: '#991b1b', fontSize: 11, padding: '2px 8px', cursor: 'pointer' }}>
                          Delete
                        </button>
                        <div style={{ paddingRight: 56 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)', marginBottom: 3 }}>
                            Practice Paper {extra.examNum}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8 }}>Generated {extra.generatedAt}</div>
                          <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--blue-light)', color: '#1e40af', borderRadius: 999, fontWeight: 500 }}>
                            Extra practice
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--gray-500)', margin: '10px 0', lineHeight: 1.5 }}>
                          📋 {extra.totalMarks} marks · {extra.time}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '9px 12px' }}
                            onClick={() => { setGeneratedExam(extra); setSelectedPractice({ examNum: extra.examNum, paper: selectedPaper }); setAnswers({}); setResults(null) }}>
                            ▶ Open paper
                          </button>
                          <button className="btn-secondary" style={{ fontSize: 13, padding: '9px 12px' }}
                            onClick={() => { setGeneratedExam(extra); setTimeout(printPaper, 100) }}>
                            🖨️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate More button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <button
                  className="btn-secondary"
                  style={{ fontSize: 14, padding: '11px 28px', display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={generateExtra}
                  disabled={generatingExtra || !selectedPaper}
                >
                  {generatingExtra
                    ? <><div className="spinner" /> Generating extra paper...</>
                    : '+ Generate another practice paper'}
                </button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--amber-light)', borderRadius: 10, fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
            ⚠️ These are AI-generated practice papers modelled on real {selectedBoard} {selectedSubject} papers. They are not official {selectedBoard} papers.
            For official past papers, visit the <strong>Past Papers</strong> tab.
          </div>
        </div>
      )}

      {!selectedPaper && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, textAlign: 'center', gap: 12 }}>
          <div style={{ fontSize: 52 }}>📝</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gray-300)' }}>Select a paper above</div>
          <div style={{ fontSize: 14, color: 'var(--gray-400)', maxWidth: 360, lineHeight: 1.6 }}>
            Choose your subject, board and tier, then pick Paper 1 or Paper 2 to see your 3 practice exams.
          </div>
        </div>
      )}
    </div>
  )
}
