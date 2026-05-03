import React, { useState } from 'react'
import { callClaude, parseJSON } from '../lib/claude.js'
import { CURRICULUM, SUBJECTS_BY_TYPE, SUBJECT_CATEGORIES } from '../lib/curriculum.js'

const ALL_SUBJECTS = [
  ...SUBJECTS_BY_TYPE['Triple Science'],
  ...SUBJECTS_BY_TYPE['Combined Science'],
  ...SUBJECTS_BY_TYPE['Maths'],
  ...SUBJECTS_BY_TYPE['Other Subjects'],
]

// External resources per subject for "learn more" links
const EXTERNAL_RESOURCES = {
  'GCSE Physics': [
    { name: 'BBC Bitesize — Physics', url: 'https://www.bbc.co.uk/bitesize/subjects/zpm6fg8', desc: 'Video explanations and interactive quizzes' },
    { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/', desc: 'Detailed notes and past paper questions' },
    { name: 'Cognito (YouTube)', url: 'https://www.youtube.com/@CognitoYT', desc: 'Short clear video explanations' },
  ],
  'GCSE Chemistry': [
    { name: 'BBC Bitesize — Chemistry', url: 'https://www.bbc.co.uk/bitesize/subjects/z4v48mnS', desc: 'Video explanations and interactive quizzes' },
    { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/', desc: 'Detailed notes and past paper questions' },
  ],
  'GCSE Biology': [
    { name: 'BBC Bitesize — Biology', url: 'https://www.bbc.co.uk/bitesize/subjects/z9ddmp3', desc: 'Video explanations and interactive quizzes' },
    { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/', desc: 'Detailed notes and past paper questions' },
  ],
  'GCSE Maths': [
    { name: 'Maths Genie', url: 'https://www.mathsgenie.co.uk/gcse.html', desc: 'Practice questions and video explanations' },
    { name: 'Corbettmaths', url: 'https://corbettmaths.com/contents/', desc: 'Videos and worksheets for every topic' },
    { name: 'BBC Bitesize — Maths', url: 'https://www.bbc.co.uk/bitesize/subjects/z38pycw', desc: 'Interactive lessons and quizzes' },
  ],
  'default': [
    { name: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize/levels/z98jmp3', desc: 'Video explanations and interactive content' },
    { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com', desc: 'Detailed revision notes' },
  ],
}

export default function NotesTab({ subject: globalSubject }) {
  const [notesSubject, setNotesSubject] = useState(globalSubject || 'GCSE Physics')
  const [board, setBoard] = useState('AQA')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedSubtopic, setSelectedSubtopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState(null)
  const [error, setError] = useState('')
  const [expandedSection, setExpandedSection] = useState(null)

  const curriculumData = CURRICULUM[notesSubject] || {}
  const topicList = Object.keys(curriculumData.topics || {})
  const subtopics = selectedTopic ? (curriculumData.topics[selectedTopic] || []) : []
  const resources = EXTERNAL_RESOURCES[notesSubject] || EXTERNAL_RESOURCES['default']

  const handleSubjectChange = (s) => {
    setNotesSubject(s)
    setSelectedTopic('')
    setSelectedSubtopic('')
    setNotes(null)
  }

  const handleTopicChange = (t) => {
    setSelectedTopic(t)
    setSelectedSubtopic('')
    setNotes(null)
  }

  const generateNotes = async () => {
    if (!selectedTopic) { setError('Please select a topic first.'); return }
    setLoading(true)
    setError('')
    setNotes(null)

    const focus = selectedSubtopic || selectedTopic
    const isCombined = notesSubject.includes('Combined Science')

    const prompt = `You are an expert ${notesSubject} teacher writing comprehensive GCSE revision notes.

CRITICAL — follow the official ${board} ${notesSubject} specification exactly:
- Only include content that is actually assessed in ${board} ${notesSubject} exams
- Use exact terminology from ${board} mark schemes
- ${isCombined ? 'This is COMBINED SCIENCE — include only combined science content, not triple-only content' : 'This is TRIPLE SCIENCE — include full depth of the specification'}

Subject: ${notesSubject} (${board})
Topic: ${selectedTopic}
${selectedSubtopic ? `Focus: ${selectedSubtopic}` : 'Cover all key content areas within this topic'}

Write thorough revision notes. Return ONLY valid JSON:
{
  "topic": "${selectedTopic}",
  "subtopic": "${selectedSubtopic || 'Full topic overview'}",
  "subject": "${notesSubject}",
  "board": "${board}",
  "introduction": "2-3 sentence overview of what this topic covers and why it matters in the exam",
  "sections": [
    {
      "title": "Section heading e.g. Key Definitions",
      "content": "Full explanatory text — write clearly as if explaining to a student. Include all key points.",
      "keyPoints": ["Bullet point key fact 1", "Key fact 2", "Key fact 3"],
      "type": "definitions | explanation | process | calculation | comparison"
    }
  ],
  "formulas": [
    {
      "formula": "F = ma",
      "name": "Newton's Second Law",
      "variables": "F = force (N), m = mass (kg), a = acceleration (m/s²)",
      "example": "A 2kg object accelerates at 5 m/s². F = 2 × 5 = 10 N"
    }
  ],
  "keyDefinitions": [
    { "term": "Acceleration", "definition": "The rate of change of velocity. Measured in m/s²." }
  ],
  "commonMistakes": [
    "Common mistake students make 1",
    "Common mistake 2"
  ],
  "examTips": [
    "Exam technique tip 1 — what markers look for",
    "Exam tip 2"
  ],
  "grade9Points": [
    "What a grade 9 student knows that others don't 1",
    "Grade 9 point 2"
  ],
  "links": [
    { "text": "For video explanations of ${selectedSubtopic || selectedTopic}, visit BBC Bitesize", "url": "https://www.bbc.co.uk/bitesize" },
    { "text": "For practice questions, visit Physics & Maths Tutor", "url": "https://www.physicsandmathstutor.com" }
  ],
  "summary": "3-4 sentence summary of the most important points to remember for the exam"
}`

    try {
      const raw = await callClaude(prompt, '', 3500)
      setNotes(parseJSON(raw))
    } catch (e) {
      setError('Failed to generate notes. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const printNotes = () => {
    if (!notes) return
    const w = window.open('', '_blank')
    w.document.write(`<!DOCTYPE html><html><head>
    <title>${notes.topic} — ${notes.subject} (${notes.board}) Notes</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Georgia,serif;font-size:14px;color:#000;padding:40px;max-width:740px;margin:0 auto;line-height:1.7}
      h1{font-size:22px;margin-bottom:4px}
      .meta{font-size:12px;color:#666;margin-bottom:20px}
      h2{font-size:16px;margin:20px 0 8px;border-bottom:1px solid #ccc;padding-bottom:4px}
      h3{font-size:14px;margin:14px 0 6px;font-weight:bold}
      .intro{background:#f0f4ff;padding:12px;border-radius:4px;margin-bottom:16px;font-size:13px}
      .formula{background:#fff8e1;border:1px solid #ffd;padding:8px 12px;border-radius:4px;margin:6px 0;font-family:monospace}
      .definition{margin:4px 0;padding-left:12px;border-left:3px solid #ddd}
      .tip{background:#e8f5e9;padding:8px 12px;border-radius:4px;margin:4px 0;font-size:13px}
      .mistake{background:#ffeaea;padding:8px 12px;border-radius:4px;margin:4px 0;font-size:13px}
      .g9{background:#fff3e0;padding:8px 12px;border-radius:4px;margin:4px 0;font-size:13px}
      .summary{background:#f0f4ff;padding:12px;border-radius:4px;margin-top:20px;font-size:13px}
      ul{margin:6px 0 6px 20px}
      li{margin:3px 0;font-size:13px}
      .footer{margin-top:24px;font-size:10px;color:#aaa;border-top:1px solid #eee;padding-top:10px;text-align:center}
      @media print{body{padding:20px}}
    </style>
    </head><body>
    <h1>${notes.topic}${notes.subtopic !== 'Full topic overview' ? ' — ' + notes.subtopic : ''}</h1>
    <div class="meta">${notes.subject} · ${notes.board} · Generated by Study & Exam Coach</div>
    <div class="intro">${notes.introduction}</div>
    ${notes.sections?.map(s => `
      <h2>${s.title}</h2>
      <p style="font-size:13px;margin-bottom:8px">${s.content}</p>
      ${s.keyPoints?.length ? `<ul>${s.keyPoints.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
    `).join('')}
    ${notes.formulas?.length ? `
      <h2>Key Formulas</h2>
      ${notes.formulas.map(f => `<div class="formula"><strong>${f.formula}</strong> — ${f.name}<br><small>${f.variables}</small>${f.example ? `<br><em>Example: ${f.example}</em>` : ''}</div>`).join('')}
    ` : ''}
    ${notes.keyDefinitions?.length ? `
      <h2>Key Definitions</h2>
      ${notes.keyDefinitions.map(d => `<div class="definition"><strong>${d.term}:</strong> ${d.definition}</div>`).join('')}
    ` : ''}
    ${notes.commonMistakes?.length ? `
      <h2>Common Mistakes to Avoid</h2>
      ${notes.commonMistakes.map(m => `<div class="mistake">⚠️ ${m}</div>`).join('')}
    ` : ''}
    ${notes.examTips?.length ? `
      <h2>Exam Tips</h2>
      ${notes.examTips.map(t => `<div class="tip">✓ ${t}</div>`).join('')}
    ` : ''}
    ${notes.grade9Points?.length ? `
      <h2>Grade 9 Points</h2>
      ${notes.grade9Points.map(p => `<div class="g9">⭐ ${p}</div>`).join('')}
    ` : ''}
    <div class="summary"><strong>Summary:</strong> ${notes.summary}</div>
    <div class="footer">Study & Exam Coach — AI Revision Notes — ${notes.subject} (${notes.board}) — These notes are AI-generated based on the ${notes.board} specification and are not official ${notes.board} materials.</div>
    </body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 400)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,280px) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>

      {/* ── LEFT: Selector ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card">
          <h2 style={{ fontSize: 17, fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 6 }}>AI Revision Notes</h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14, lineHeight: 1.5 }}>
            Full topic notes written by AI, aligned to your exam board specification. Every key fact, formula and definition.
          </p>

          <label className="label">Subject</label>
          <select className="select-field" value={notesSubject} onChange={e => handleSubjectChange(e.target.value)} style={{ marginBottom: 12 }}>
            {ALL_SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>

          <label className="label">Exam board</label>
          <select className="select-field" value={board} onChange={e => setBoard(e.target.value)} style={{ marginBottom: 12 }}>
            <option>AQA</option><option>Edexcel</option><option>OCR</option><option>WJEC</option>
          </select>

          <label className="label">Topic</label>
          <select className="select-field" value={selectedTopic} onChange={e => handleTopicChange(e.target.value)} style={{ marginBottom: 12 }}>
            <option value="">Select a topic...</option>
            {topicList.map(t => <option key={t}>{t}</option>)}
          </select>

          {selectedTopic && subtopics.length > 0 && (
            <>
              <label className="label">Focus on specific content area <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(optional)</span></label>
              <select className="select-field" value={selectedSubtopic} onChange={e => setSelectedSubtopic(e.target.value)} style={{ marginBottom: 12 }}>
                <option value="">Full topic overview</option>
                {subtopics.map(s => <option key={s}>{s}</option>)}
              </select>
            </>
          )}

          {error && <div style={{ marginBottom: 10, padding: '8px 12px', background: 'var(--red-light)', borderRadius: 8, fontSize: 13, color: 'var(--red)' }}>{error}</div>}

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}
            onClick={generateNotes} disabled={loading || !selectedTopic}>
            {loading
              ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Writing notes...</>
              : '📖 Generate revision notes'}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="card" style={{ background: 'var(--amber-light)', border: '1px solid #fcd34d' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>⚠️ Important note</div>
          <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
            These notes are written by AI based on the {board} specification. They are not official {board} materials. Always cross-check with official resources for critical exam preparation.
          </div>
        </div>

        {/* External resources */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 10 }}>📚 More resources</div>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 10 }}>
            For video explanations and additional practice:
          </div>
          {resources.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', padding: '8px 0', borderBottom: i < resources.length - 1 ? '1px solid var(--gray-100)' : 'none', textDecoration: 'none' }}>
              <div style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 500 }}>{r.name} →</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{r.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Notes output ── */}
      <div>
        {!notes && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', gap: 12 }}>
            <div style={{ fontSize: 56 }}>📖</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gray-300)' }}>Select a topic for AI notes</div>
            <div style={{ fontSize: 14, color: 'var(--gray-400)', maxWidth: 380, lineHeight: 1.6 }}>
              Choose your subject, exam board and topic. AI will write comprehensive revision notes aligned to the {board} specification — every key fact, formula and exam tip.
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)' }}>Writing your revision notes...</div>
            <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Tailoring to {board} {notesSubject} specification</div>
          </div>
        )}

        {notes && (
          <div className="fade-in">
            {/* Header */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--navy)', marginBottom: 6 }}>
                    {notes.topic}
                    {notes.subtopic && notes.subtopic !== 'Full topic overview' && (
                      <span style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--blue)' }}> — {notes.subtopic}</span>
                    )}
                  </h2>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="tag tag-navy">{notes.subject}</span>
                    <span className="tag tag-blue">{notes.board}</span>
                    {notes.formulas?.length > 0 && <span className="tag tag-amber">{notes.formulas.length} formula{notes.formulas.length > 1 ? 's' : ''}</span>}
                  </div>
                </div>
                <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={printNotes}>🖨️ Print notes</button>
              </div>
              <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7, background: 'var(--gray-50)', padding: '10px 14px', borderRadius: 8 }}>
                {notes.introduction}
              </p>
            </div>

            {/* Main sections */}
            {notes.sections?.map((section, i) => (
              <div key={i} className="card" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: expandedSection === i ? 14 : 0 }}
                  onClick={() => setExpandedSection(expandedSection === i ? null : i)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      background: section.type === 'calculation' ? 'var(--navy)' : section.type === 'definitions' ? 'var(--blue-light)' : section.type === 'process' ? 'var(--green-light)' : 'var(--gray-100)',
                      color: section.type === 'calculation' ? 'white' : section.type === 'definitions' ? '#1e40af' : section.type === 'process' ? '#065f46' : 'var(--gray-600)',
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>{section.type}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--navy)', margin: 0 }}>{section.title}</h3>
                  </div>
                  <span style={{ color: 'var(--gray-400)', fontSize: 18, flexShrink: 0 }}>{expandedSection === i ? '▲' : '▼'}</span>
                </div>

                {expandedSection === i && (
                  <div className="fade-in">
                    <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.8, marginBottom: section.keyPoints?.length ? 12 : 0 }}>
                      {section.content}
                    </p>
                    {section.keyPoints?.length > 0 && (
                      <div style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '10px 14px' }}>
                        {section.keyPoints.map((p, pi) => (
                          <div key={pi} style={{ display: 'flex', gap: 8, padding: '4px 0', fontSize: 13, color: 'var(--gray-700)', borderBottom: pi < section.keyPoints.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                            <span style={{ color: 'var(--navy)', fontWeight: 600, flexShrink: 0 }}>•</span>{p}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Click to expand all hint */}
            {notes.sections?.length > 0 && expandedSection === null && (
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setExpandedSection(0)}>
                  Click any section to expand →
                </button>
              </div>
            )}

            {/* Formulas */}
            {notes.formulas?.length > 0 && (
              <div className="card" style={{ marginBottom: 12, background: 'var(--navy)', border: 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  📐 Key formulas — {board} specification
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {notes.formulas.map((f, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', flex: '1 1 220px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--gold)', marginBottom: 4 }}>{f.formula}</div>
                      <div style={{ fontSize: 13, color: 'white', fontWeight: 500, marginBottom: 2 }}>{f.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: f.example ? 6 : 0 }}>{f.variables}</div>
                      {f.example && (
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)', padding: '5px 8px', borderRadius: 6, fontStyle: 'italic' }}>
                          e.g. {f.example}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key definitions */}
            {notes.keyDefinitions?.length > 0 && (
              <div className="card" style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 10 }}>📋 Key definitions</div>
                {notes.keyDefinitions.map((d, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: i < notes.keyDefinitions.length - 1 ? '1px solid var(--gray-100)' : 'none', fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{d.term}: </span>
                    <span style={{ color: 'var(--gray-700)' }}>{d.definition}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Three-column: mistakes, tips, grade 9 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
              {notes.commonMistakes?.length > 0 && (
                <div className="card" style={{ background: 'var(--red-light)', border: '1px solid #fca5a5' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#991b1b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚠️ Common mistakes</div>
                  {notes.commonMistakes.map((m, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#991b1b', padding: '4px 0', borderBottom: i < notes.commonMistakes.length - 1 ? '1px solid #fca5a5' : 'none', lineHeight: 1.5 }}>
                      • {m}
                    </div>
                  ))}
                </div>
              )}

              {notes.examTips?.length > 0 && (
                <div className="card" style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1e40af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>💡 Exam tips</div>
                  {notes.examTips.map((t, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#1e40af', padding: '4px 0', borderBottom: i < notes.examTips.length - 1 ? '1px solid #bfdbfe' : 'none', lineHeight: 1.5 }}>
                      ✓ {t}
                    </div>
                  ))}
                </div>
              )}

              {notes.grade9Points?.length > 0 && (
                <div className="card" style={{ background: 'var(--gold-light)', border: '1px solid #fcd34d' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>⭐ Grade 9 points</div>
                  {notes.grade9Points.map((p, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#92400e', padding: '4px 0', borderBottom: i < notes.grade9Points.length - 1 ? '1px solid #fde68a' : 'none', lineHeight: 1.5 }}>
                      ★ {p}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {notes.summary && (
              <div className="card" style={{ background: 'var(--green-light)', border: '1px solid #6ee7b7', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#065f46', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Summary — key things to remember</div>
                <p style={{ fontSize: 14, color: '#065f46', lineHeight: 1.7 }}>{notes.summary}</p>
              </div>
            )}

            {/* Learn more resources */}
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 10 }}>📚 Learn more about {notes.subtopic || notes.topic}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 10 }}>
                These AI notes cover the key points. For video explanations and additional practice questions:
              </div>
              <div style={{ display: 'flex', flex: 'wrap', gap: 8, flexWrap: 'wrap' }}>
                {resources.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                    background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 8,
                    textDecoration: 'none', fontSize: 13, color: 'var(--navy)', fontWeight: 500
                  }}>
                    {r.name} →
                  </a>
                ))}
              </div>
            </div>

            {/* Generate another */}
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
              onClick={() => { setNotes(null); setSelectedSubtopic('') }}>
              Generate notes for a different topic →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
