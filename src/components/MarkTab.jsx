import React, { useState, useRef } from 'react'
import { callClaude, parseJSON } from '../lib/claude.js'

const SUBJECTS = [
  'GCSE Physics (AQA)', 'GCSE Physics (Edexcel)', 'GCSE Physics (OCR)',
  'GCSE Chemistry (AQA)', 'GCSE Chemistry (Edexcel)', 'GCSE Chemistry (OCR)',
  'GCSE Biology (AQA)', 'GCSE Biology (Edexcel)', 'GCSE Biology (OCR)',
  'GCSE Maths (AQA)', 'GCSE Maths (Edexcel)', 'GCSE Maths (OCR)',
  'GCSE Combined Science (AQA)', 'GCSE Combined Science (Edexcel)',
  'GCSE English Literature (AQA)', 'GCSE English Language (AQA)',
]

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function MarkTab({ examData, subject, setWeakTopics, switchTab }) {
  const [files, setFiles] = useState([])
  const [typedAnswers, setTypedAnswers] = useState('')
  const [markSubject, setMarkSubject] = useState(subject || 'GCSE Maths (AQA)')
  const [paperType, setPaperType] = useState('Topic test')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const inputRef = useRef()

  const handleFiles = (newFiles) => {
    const arr = Array.from(newFiles)
    setFiles(prev => {
      const existing = prev.map(f => f.name)
      return [...prev, ...arr.filter(f => !existing.includes(f.name))]
    })
    // Generate previews for images
    arr.forEach(f => {
      if (f.type.startsWith('image/')) {
        const url = URL.createObjectURL(f)
        setImagePreviews(prev => [...prev, { name: f.name, url }])
      }
    })
  }

  const removeFile = (i) => {
    const removed = files[i]
    setFiles(prev => prev.filter((_, idx) => idx !== i))
    setImagePreviews(prev => prev.filter(p => p.name !== removed.name))
  }

  // ── Main mark function ────────────────────────────────────────────────────
  const mark = async () => {
    const hasTyped = typedAnswers.trim().length > 0
    const hasFiles = files.length > 0
    if (!hasTyped && !hasFiles) {
      setError('Please upload a photo of your work or type your answers.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      let markedResult

      if (hasFiles && files[0].type.startsWith('image/')) {
        // ── Image path: use vision to READ the image first, then mark ──
        markedResult = await markFromImage(files[0], hasTyped ? typedAnswers : '')
      } else if (hasTyped) {
        // ── Typed answers path ──
        markedResult = await markFromText(typedAnswers)
      } else {
        // PDF or non-image file — ask student to type answers
        setError('PDF files cannot be read directly. Please type your answers in the box below, or take a photo of your handwritten work.')
        setLoading(false)
        return
      }

      setResult(markedResult)
      if (markedResult?.weakTopics?.length) setWeakTopics(markedResult.weakTopics)

    } catch (e) {
      setError('Marking failed. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // ── Mark from image: 2-step process ──────────────────────────────────────
  // Step 1: Read what's actually written in the image
  // Step 2: Mark ONLY what was actually answered
  const markFromImage = async (imageFile, extraText) => {
    const base64 = await fileToBase64(imageFile)
    const mimeType = imageFile.type || 'image/jpeg'

    // Step 1: Read the image — extract what questions were answered and what the student wrote
    const readPrompt = `You are reading a student's handwritten exam paper photo.

CRITICAL INSTRUCTIONS:
- Only read and transcribe what is ACTUALLY WRITTEN on the paper
- Do NOT assume answers for blank questions
- Do NOT invent or fill in any answers
- If a question space is blank or empty, say "NOT ANSWERED"
- Only mark questions that have actual written content

Please read this image and extract:
1. Which questions have written answers
2. What exactly the student wrote for each answered question

Return ONLY valid JSON:
{
  "questionsFound": [
    {
      "questionNumber": 1,
      "hasAnswer": true,
      "studentWrote": "exact text/working the student wrote",
      "questionText": "if visible, what the question asks"
    },
    {
      "questionNumber": 2,
      "hasAnswer": false,
      "studentWrote": "NOT ANSWERED",
      "questionText": "if visible"
    }
  ],
  "totalQuestionsVisible": 5,
  "totalQuestionsAnswered": 1,
  "notes": "any other observations about the paper"
}`

    const readResponse = await fetch('http://localhost:3001/api/claude-vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: base64,
        mimeType,
        prompt: readPrompt
      })
    })

    let readData = null
    if (readResponse.ok) {
      const rd = await readResponse.json()
      try { readData = parseJSON(rd.text) } catch (e) { readData = null }
    }

    // Step 2: Mark ONLY what was answered
    const answeredQuestions = readData?.questionsFound?.filter(q => q.hasAnswer) || []
    const totalAnswered = readData?.totalQuestionsAnswered || 1

    const examContext = examData?.length
      ? `\nExam questions and model answers:\n${examData.map(q => `Q${q.id}: ${q.question}\nModel answer: ${q.modelAnswer}\nMarks: ${q.marks}`).join('\n\n')}`
      : ''

    const markPrompt = `You are a ${markSubject} GCSE examiner marking a student's work from a photo.

Subject: ${markSubject}
Paper type: ${paperType}
${examContext}

CRITICAL: The student only answered ${totalAnswered} question(s). Only mark what was actually answered.
Do NOT give marks for unanswered questions. Do NOT assume answers for blank spaces.

Student's answered questions:
${answeredQuestions.length > 0
  ? answeredQuestions.map(q => `Q${q.questionNumber}: ${q.studentWrote}`).join('\n')
  : extraText || 'Student answered 1 question — please mark based on what is visible in the image'
}
${extraText ? `\nAdditional typed context: ${extraText}` : ''}

Mark ONLY the answered questions. Return valid JSON:
{
  "overallScore": 3,
  "outOf": 4,
  "grade": "7",
  "questionsMarked": ${totalAnswered},
  "questionsBlank": ${(readData?.totalQuestionsVisible || 5) - totalAnswered},
  "summary": "Warm 2 sentence summary. Acknowledge they only answered ${totalAnswered} question(s).",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1"],
  "questions": [
    {
      "id": 1,
      "attempted": true,
      "awarded": 3,
      "available": 4,
      "topic": "Algebra",
      "feedback": "Specific feedback on what they wrote",
      "examTip": "Key tip",
      "revision": "What to revise"
    }
  ],
  "unansweredNote": "Student left ${(readData?.totalQuestionsVisible || 5) - totalAnswered} question(s) blank — these were not marked.",
  "weakTopics": ["topic1"],
  "strongTopics": ["topic2"],
  "nextSteps": ["next step 1", "next step 2"]
}`

    const markResponse = await fetch('http://localhost:3001/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: markPrompt, maxTokens: 2000 })
    })

    if (!markResponse.ok) throw new Error('Marking API failed')
    const markData = await markResponse.json()
    return parseJSON(markData.text)
  }

  // ── Mark from typed text ──────────────────────────────────────────────────
  const markFromText = async (text) => {
    const examContext = examData?.length
      ? `\nExam questions and model answers:\n${examData.map(q => `Q${q.id}: ${q.question}\nModel answer: ${q.modelAnswer}\nMarks: ${q.marks}`).join('\n\n')}`
      : ''

    // Detect which questions were actually answered
    const answeredPattern = /Q?\d+[:.]/gi
    const matches = text.match(answeredPattern) || []
    const estimatedAnswered = Math.max(matches.length, 1)

    const prompt = `You are a ${markSubject} GCSE examiner marking typed answers.

Subject: ${markSubject}
Paper type: ${paperType}
${examContext}

Student answers:
${text}

IMPORTANT: Only mark questions that have actual content written. If a question has no answer, mark it as not attempted.
For each answered question, give:
- Specific feedback on what they got right and wrong
- The exact mark points they hit and missed
- An exam technique tip

Return ONLY valid JSON:
{
  "overallScore": 12,
  "outOf": 15,
  "grade": "7",
  "questionsMarked": ${estimatedAnswered},
  "summary": "Warm 2-3 sentence summary",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "questions": [
    {
      "id": 1,
      "attempted": true,
      "awarded": 3,
      "available": 4,
      "topic": "Algebra",
      "feedback": "Specific feedback on exactly what they wrote and what marks they earned",
      "examTip": "Key exam technique tip",
      "revision": "Specific thing to revise"
    }
  ],
  "weakTopics": ["topic"],
  "strongTopics": ["topic"],
  "nextSteps": ["step 1", "step 2", "step 3"]
}`

    const res = await fetch('http://localhost:3001/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, maxTokens: 2000 })
    })
    if (!res.ok) throw new Error('API failed')
    const data = await res.json()
    return parseJSON(data.text)
  }

  const pct = result ? Math.min(100, Math.round((result.overallScore / result.outOf) * 100)) : 0
  const barColor = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: 20, alignItems: 'start' }}>

      {/* ── LEFT: Upload + controls ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 6 }}>
            Mark my work
          </h2>

          {/* How it works */}
          <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '10px 12px', marginBottom: 14, fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>
            📸 <strong>How it works:</strong> Take a clear photo of your handwritten answers and upload it. AI will read exactly what you wrote and mark only the questions you answered. Blank questions will not be marked.
          </div>

          {/* Upload zone */}
          <div
            className="upload-zone"
            style={{ borderColor: dragOver ? 'var(--blue)' : undefined, background: dragOver ? 'var(--blue-light)' : undefined, marginBottom: 12 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
            <div style={{ fontWeight: 500, color: 'var(--gray-700)', marginBottom: 4 }}>
              Take or upload a photo of your work
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
              JPG or PNG photo — AI will read your handwriting
            </div>
            <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
              onChange={e => handleFiles(e.target.files)} />
          </div>

          {/* Image previews */}
          {imagePreviews.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 }}>Uploaded photos:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {imagePreviews.map((p, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={p.url} alt="answer" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--gray-200)' }} />
                    <button onClick={() => removeFile(i)} style={{
                      position: 'absolute', top: -6, right: -6, background: 'var(--red)', color: 'white',
                      border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer',
                      fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File list for non-images */}
          {files.filter(f => !f.type.startsWith('image/')).length > 0 && (
            <div style={{ marginBottom: 14 }}>
              {files.filter(f => !f.type.startsWith('image/')).map((f, i) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--amber-light)', borderRadius: 8, marginBottom: 6, border: '1px solid #fcd34d' }}>
                  <span style={{ fontSize: 13, color: '#92400e', flex: 1 }}>⚠️ {f.name} — PDFs cannot be read automatically. Please type your answers below.</span>
                  <button onClick={() => removeFile(files.indexOf(f))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', fontSize: 16 }}>×</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label className="label">Or type your answers <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(use Q1:, Q2: format)</span></label>
            <textarea className="textarea-field"
              placeholder={'Q1: The equation is y = 2x + 3 because...\nQ3: x = 5 (only answered Q1 and Q3, left Q2 blank)'}
              value={typedAnswers} onChange={e => setTypedAnswers(e.target.value)} style={{ minHeight: 120 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
            <div>
              <label className="label">Subject</label>
              <select className="select-field" value={markSubject} onChange={e => setMarkSubject(e.target.value)}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Paper type</label>
              <select className="select-field" value={paperType} onChange={e => setPaperType(e.target.value)}>
                <option>Topic test</option>
                <option>Full exam paper</option>
                <option>Past paper</option>
                <option>Homework</option>
                <option>Mock exam</option>
                <option>Practice paper</option>
              </select>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}
            onClick={mark} disabled={loading}>
            {loading
              ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> {files.length > 0 ? 'Reading your handwriting...' : 'Marking your answers...'}</>
              : '✓ Mark my work with AI'}
          </button>

          {error && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--amber-light)', borderRadius: 8, fontSize: 13, color: '#92400e', lineHeight: 1.5 }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="card" style={{ background: 'var(--gold-light)', border: '1px solid #fcd34d' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>📸 Tips for best results</div>
          {[
            'Write clearly and make sure your answers are visible',
            'Good lighting — avoid shadows over your work',
            'If you only answered some questions, fold the paper so blank questions are hidden',
            'For typed answers, use Q1:, Q2: format so AI knows which question each answer is for',
            'One photo per page works best',
          ].map((tip, i) => (
            <div key={i} style={{ fontSize: 13, color: '#92400e', padding: '3px 0', borderBottom: i < 4 ? '1px solid #fde68a' : 'none' }}>✓ {tip}</div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Results ── */}
      <div>
        {!result && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', gap: 12 }}>
            <div style={{ fontSize: 52 }}>📝</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gray-300)' }}>Your marked work appears here</div>
            <div style={{ fontSize: 14, color: 'var(--gray-400)', maxWidth: 320, lineHeight: 1.6 }}>Upload a photo of your answers or type them in. AI marks only what you actually answered.</div>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)' }}>
              {files.length > 0 ? 'Reading your handwriting...' : 'Marking your answers...'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>
              {files.length > 0 ? 'Step 1: Reading the image. Step 2: Marking.' : 'Checking each answer carefully'}
            </div>
          </div>
        )}

        {result && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Score card */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--navy)', lineHeight: 1 }}>
                    {result.overallScore}/{result.outOf}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--gray-500)', marginTop: 4 }}>{pct}% on answered questions</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, lineHeight: 1, color: pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)' }}>
                    {result.grade}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Grade</div>
                </div>
              </div>
              <div className="score-bar-track" style={{ marginBottom: 12 }}>
                <div className="score-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
              </div>

              {/* Answered vs blank */}
              {(result.questionsBlank > 0 || result.unansweredNote) && (
                <div style={{ background: 'var(--amber-light)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: '#92400e' }}>
                  ℹ️ {result.unansweredNote || `${result.questionsMarked} question(s) marked · ${result.questionsBlank} question(s) left blank (not marked)`}
                </div>
              )}

              <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.7 }}>{result.summary}</p>
            </div>

            {/* Strengths vs improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="card" style={{ background: 'var(--green-light)', border: '1px solid #6ee7b7' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 8 }}>What you did well</div>
                {result.strengths?.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#065f46', padding: '4px 0', borderBottom: i < result.strengths.length - 1 ? '1px solid #a7f3d0' : 'none' }}>✓ {s}</div>
                ))}
              </div>
              <div className="card" style={{ background: 'var(--amber-light)', border: '1px solid #fcd34d' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>To improve</div>
                {result.improvements?.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#92400e', padding: '4px 0', borderBottom: i < result.improvements.length - 1 ? '1px solid #fde68a' : 'none' }}>→ {s}</div>
                ))}
              </div>
            </div>

            {/* Per question */}
            {result.questions?.filter(q => q.attempted !== false).map(q => (
              <div key={q.id} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ background: 'var(--navy)', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{q.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-700)' }}>{q.topic}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: q.awarded === q.available ? 'var(--green)' : q.awarded > 0 ? 'var(--amber)' : 'var(--red)' }}>
                    {q.awarded}/{q.available}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 8 }}>{q.feedback}</p>
                {q.examTip && (
                  <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '7px 11px', fontSize: 13, color: '#1e40af', marginBottom: 6 }}>
                    💡 <strong>Exam tip:</strong> {q.examTip}
                  </div>
                )}
                {q.revision && (
                  <div style={{ background: 'var(--gold-light)', borderRadius: 8, padding: '7px 11px', fontSize: 13, color: '#92400e' }}>
                    📖 <strong>Revise:</strong> {q.revision}
                  </div>
                )}
              </div>
            ))}

            {/* Next steps */}
            {result.nextSteps?.length > 0 && (
              <div className="card">
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', marginBottom: 10 }}>Your next steps</div>
                {result.nextSteps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: i < result.nextSteps.length - 1 ? '1px solid var(--gray-100)' : 'none', fontSize: 13, color: 'var(--gray-700)' }}>
                    <span style={{ color: 'var(--blue)', fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>{s}
                  </div>
                ))}
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14, fontSize: 13 }}
                  onClick={() => switchTab('generate')}>
                  Practice weak topics →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
