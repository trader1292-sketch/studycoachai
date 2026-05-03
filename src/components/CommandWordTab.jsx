import React, { useState } from 'react'
import { callClaude, parseJSON } from '../lib/claude.js'

const COMMAND_WORDS = [
  { word: 'State', definition: 'Give a specific fact, name or value. No explanation needed.', marks: '1', structure: 'One short precise sentence. No "because" needed.', badExample: '❌ "Force is measured in Newtons because Newton discovered it."', goodExample: '✓ "The unit of force is the Newton (N)."', commonMistake: 'Over-explaining — you get NO extra marks for explaining. Stop after the fact.', tip: 'If the question says "State", stop after one sentence. No explanation = full marks.', difficulty: 'Foundation', color: '#065f46', bg: 'var(--green-light)' },
  { word: 'Describe', definition: 'Give a detailed account — say what happens, what you see, what the method is.', marks: '2–4', structure: 'List what happens in order. Include measurements, observations, key details.', badExample: '❌ "The temperature increases." (too vague)', goodExample: '✓ "As the current increases from 0 to 2A, the temperature rises from 20°C to 45°C, showing a linear relationship."', commonMistake: 'Not including enough detail. Say WHAT happens AND what you observe.', tip: 'One mark per relevant point. Count the marks — write that many clear points.', difficulty: 'Foundation', color: '#1e40af', bg: 'var(--blue-light)' },
  { word: 'Explain', definition: 'Give reasons WHY something happens. Link cause to effect using scientific knowledge.', marks: '2–4', structure: 'Point → Reason → Link. Use "because", "therefore", "this means", "as a result".', badExample: '❌ "The rate increases because there are more particles." (not enough)', goodExample: '✓ "Increasing concentration increases rate because there are more particles per unit volume, causing more frequent collisions, therefore more successful collisions per second."', commonMistake: 'Describing what happens without saying WHY. "Explain" needs the word "because".', tip: 'Every explain answer needs "because" or "therefore". If it\'s missing, you\'re describing not explaining.', difficulty: 'Higher', color: '#92400e', bg: 'var(--amber-light)' },
  { word: 'Evaluate', definition: 'Judge the strengths AND weaknesses of something. Come to a conclusion.', marks: '4–6', structure: 'Strengths → Weaknesses → Overall conclusion with evidence.', badExample: '❌ "The experiment has some good points and some bad points."', goodExample: '✓ "A strength is the data logger removes timing errors. However, only 5 temperatures were tested so the trend may not be accurate across all values. Overall, the method is valid but limited in range."', commonMistake: 'Only listing weaknesses — evaluation needs BOTH sides AND a conclusion.', tip: 'Structure: 1-2 strengths, 1-2 limitations, conclusion starting with "Overall..."', difficulty: 'Grade 8-9', color: '#791f1f', bg: 'var(--red-light)' },
  { word: 'Calculate', definition: 'Use numbers and equations to find a value. Always show your working.', marks: '2–4', structure: 'State formula → Substitute values with units → Calculate → State answer with units.', badExample: '❌ "20N" (no working shown)', goodExample: '✓ "F = ma\nF = 2.0 × 10\nF = 20 N"', commonMistake: 'Forgetting units — a calculation without units loses the final answer mark every time.', tip: 'Even if wrong answer, you get marks for correct formula and substitution. ALWAYS show working.', difficulty: 'Higher', color: '#26215c', bg: '#EEEDFE' },
  { word: 'Compare', definition: 'Identify similarities AND differences between two or more things.', marks: '2–4', structure: 'For each point: state what A does, what B does, then link with a comparison word.', badExample: '❌ "Ionic compounds have high melting points. Covalent compounds have low melting points." (no comparison)', goodExample: '✓ "Both ionic and simple covalent compounds contain chemical bonds, however ionic compounds have much higher melting points than simple covalent compounds because ionic bonds are stronger than intermolecular forces."', commonMistake: 'Writing about each thing separately without linking them.', tip: 'Use: "both... however...", "whereas", "unlike X, Y...", "in contrast", "similarly"', difficulty: 'Higher', color: '#065f46', bg: 'var(--green-light)' },
  { word: 'Suggest', definition: 'Apply your knowledge to an unfamiliar situation. More than one answer may be acceptable.', marks: '1–3', structure: 'Use your scientific knowledge to make a reasoned proposal. Justify it briefly.', badExample: '❌ "It might be because of the temperature." (too vague)', goodExample: '✓ "The anomalous result may be due to the student not fully submerging the object, so not all water was displaced, giving a smaller volume than expected."', commonMistake: 'Being too vague — "suggest" still requires specific scientific reasoning.', tip: '"Suggest" means various answers are accepted — use any relevant science. But still be specific.', difficulty: 'Higher', color: '#1e40af', bg: 'var(--blue-light)' },
  { word: 'Justify', definition: 'Give evidence or reasons to support a conclusion or decision.', marks: '2–3', structure: 'State your position + give specific evidence + explain why it supports your position.', badExample: '❌ "I chose method A because it is better."', goodExample: '✓ "Method A should be used because its uncertainty of ±0.1cm is smaller than Method B (±0.5cm), meaning the results will be more reliable and closer to the true value."', commonMistake: 'Giving a reason without linking it back to WHY it supports the conclusion.', tip: 'Always refer to specific data. "Because the graph shows..." / "Since the value is..."', difficulty: 'Grade 8-9', color: '#92400e', bg: 'var(--amber-light)' },
  { word: 'Deduce', definition: 'Reach a conclusion from the information given. Show your reasoning from the data.', marks: '2–3', structure: 'Look at the data → identify the pattern → state conclusion with evidence.', badExample: '❌ "The substance is copper." (no reasoning)', goodExample: '✓ "The substance contains copper ions because the flame test produced a blue-green colour, which is characteristic of Cu²⁺ ions. This is confirmed by the blue precipitate with NaOH."', commonMistake: 'Stating the conclusion without showing how you got there from the evidence.', tip: 'Always write "because the data shows..." or "this is confirmed by..."', difficulty: 'Grade 8-9', color: '#26215c', bg: '#EEEDFE' },
  { word: 'Sketch', definition: 'Draw a rough diagram or graph — shows key features, does not need to be precise.', marks: '2–3', structure: 'Labelled axes with units + correct shape + key features labelled (max, intercept, asymptote).', badExample: '❌ A graph with no axis labels or scale.', goodExample: '✓ Graph with both axes labelled (quantity + unit), correct curve shape, key point (e.g. peak at 37°C) labelled.', commonMistake: 'Not labelling axes with both quantity AND unit — this costs marks every single time.', tip: 'For graphs: label both axes (quantity + unit), correct shape, mark any key values (peak, plateau, intercept).', difficulty: 'Foundation', color: '#065f46', bg: 'var(--green-light)' },
]

const SUBJECTS = ['GCSE Physics', 'GCSE Chemistry', 'GCSE Biology', 'GCSE Maths', 'GCSE Combined Science', 'GCSE English Literature']

export default function CommandWordTab({ subject: globalSubject }) {
  const [localSubject, setLocalSubject] = useState(globalSubject || 'GCSE Physics')
  const [selected, setSelected] = useState(null)
  const [practiceMode, setPracticeMode] = useState(false)
  const [practiceQ, setPracticeQ] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filterDiff, setFilterDiff] = useState('All')

  const difficulties = ['All', 'Foundation', 'Higher', 'Grade 8-9']
  const filtered = COMMAND_WORDS.filter(w => filterDiff === 'All' || w.difficulty === filterDiff)
  const subjectShort = localSubject.replace('GCSE ', '')

  const generatePractice = async (cmdWord) => {
    setLoading(true)
    setPracticeQ(null)
    setAnswer('')
    setFeedback(null)

    const prompt = `Generate ONE realistic GCSE exam question using the command word "${cmdWord.word}" for the subject: ${localSubject}.

Requirements:
- The question MUST start with the command word "${cmdWord.word}"
- It should be about ${subjectShort} content specifically
- Worth ${cmdWord.marks} marks
- Be realistic for a GCSE ${cmdWord.difficulty} level paper
- Include enough context for the student to answer

Return ONLY valid JSON:
{
  "question": "full question starting with ${cmdWord.word}...",
  "context": "any data, table, scenario or information given to student (or empty string)",
  "marks": 3,
  "subjectArea": "specific topic within ${localSubject}",
  "modelAnswer": "mark scheme quality answer showing all mark points clearly",
  "structureGuide": "specific guidance for how to structure a ${cmdWord.word} answer for this question",
  "markPoints": ["mark point 1", "mark point 2", "mark point 3"]
}`

    try {
      const raw = await callClaude(prompt, '', 800)
      setPracticeQ(parseJSON(raw))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const markAnswer = async () => {
    if (!practiceQ || !answer.trim()) return
    setLoading(true)
    setFeedback(null)

    const prompt = `You are a GCSE ${localSubject} examiner marking a "${selected.word}" question.

Command word: ${selected.word}
What it means: ${selected.definition}
How to structure: ${selected.structure}

Question [${practiceQ.marks} marks]: ${practiceQ.question}
${practiceQ.context ? `Context given: ${practiceQ.context}` : ''}
Model answer: ${practiceQ.modelAnswer}
Mark points: ${practiceQ.markPoints?.join(' | ')}

Student's answer: ${answer}

Return ONLY valid JSON:
{
  "awarded": 2,
  "available": ${practiceQ.marks},
  "usedCommandWordCorrectly": true,
  "feedback": "specific: what they got right, exactly which mark point they missed and why",
  "commandWordFeedback": "specifically: did they use ${selected.word} correctly? What was right/wrong about their approach?",
  "improvedAnswer": "a better version of their answer showing what full marks looks like",
  "keyTip": "one precise tip for next time using this command word in ${localSubject}"
}`

    try {
      const raw = await callClaude(prompt, '', 700)
      setFeedback(parseJSON(raw))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,260px) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>

      {/* ── LEFT ── */}
      <div className="card">
        <h2 style={{ fontSize: 17, fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 4 }}>Command Words</h2>
        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12, lineHeight: 1.5 }}>
          Master these = master the exam. Select your subject first.
        </p>

        {/* Subject selector */}
        <label className="label">Your subject</label>
        <select className="select-field" value={localSubject} onChange={e => { setLocalSubject(e.target.value); setPracticeQ(null); setFeedback(null); setAnswer('') }} style={{ marginBottom: 14 }}>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>

        {/* Difficulty filter */}
        <label className="label">Level</label>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {difficulties.map(d => (
            <span key={d} className={`pill ${filterDiff === d ? 'active' : ''}`}
              style={{ fontSize: 11 }} onClick={() => setFilterDiff(d)}>{d}</span>
          ))}
        </div>

        {/* Word list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {filtered.map(w => (
            <div key={w.word}
              onClick={() => { setSelected(w); setPracticeMode(false); setPracticeQ(null); setFeedback(null); setAnswer('') }}
              style={{
                padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                background: selected?.word === w.word ? 'var(--navy)' : w.bg,
                border: `1px solid ${selected?.word === w.word ? 'var(--navy)' : 'transparent'}`,
                transition: 'all 0.15s'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: selected?.word === w.word ? 'white' : w.color }}>{w.word}</div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999, background: selected?.word === w.word ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)', color: selected?.word === w.word ? 'white' : w.color }}>
                  {w.difficulty}
                </span>
              </div>
              <div style={{ fontSize: 11, color: selected?.word === w.word ? 'rgba(255,255,255,0.7)' : w.color, opacity: 0.8, marginTop: 2 }}>
                {w.marks} mark{w.marks.includes('–') ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div>
        {!selected && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', gap: 12 }}>
            <div style={{ fontSize: 52 }}>📝</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gray-300)' }}>Select a command word</div>
            <div style={{ fontSize: 14, color: 'var(--gray-400)', maxWidth: 340, lineHeight: 1.6 }}>
              Your subject is set to <strong>{localSubject}</strong>. All practice questions will be tailored to this subject.
            </div>
          </div>
        )}

        {selected && (
          <div className="fade-in">
            {/* Header */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Command word — {selected.difficulty} · {localSubject}
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--navy)', marginBottom: 6 }}>"{selected.word}"</h2>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="tag tag-navy">{selected.marks} marks</span>
                  <span className="tag tag-blue">{localSubject}</span>
                  <span className="tag tag-amber">{selected.difficulty}</span>
                </div>
              </div>

              <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 10, padding: 4, gap: 4 }}>
                {[{ key: false, label: '📖 Learn it' }, { key: true, label: '✏️ Practice it' }].map(opt => (
                  <button key={String(opt.key)}
                    onClick={() => { setPracticeMode(opt.key); if (opt.key && !practiceQ) generatePractice(selected); }}
                    style={{ flex: 1, padding: '9px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s', background: practiceMode === opt.key ? 'white' : 'transparent', color: practiceMode === opt.key ? 'var(--navy)' : 'var(--gray-500)', boxShadow: practiceMode === opt.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── LEARN MODE ── */}
            {!practiceMode && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="card" style={{ background: selected.bg, border: `1.5px solid ${selected.color}30` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: selected.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>What it means</div>
                  <div style={{ fontSize: 15, color: selected.color, fontWeight: 500, lineHeight: 1.6 }}>{selected.definition}</div>
                </div>

                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>📋 How to structure your answer</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.7, background: 'var(--gray-50)', borderRadius: 8, padding: '10px 14px' }}>{selected.structure}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="card" style={{ background: 'var(--red-light)', border: '1px solid #fca5a5' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#991b1b', marginBottom: 6 }}>❌ Weak answer</div>
                    <div style={{ fontSize: 13, color: '#991b1b', lineHeight: 1.6 }}>{selected.badExample}</div>
                  </div>
                  <div className="card" style={{ background: 'var(--green-light)', border: '1px solid #6ee7b7' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#065f46', marginBottom: 6 }}>✓ Strong answer</div>
                    <div style={{ fontSize: 13, color: '#065f46', lineHeight: 1.6 }}>{selected.goodExample}</div>
                  </div>
                </div>

                <div className="card" style={{ background: 'var(--amber-light)', border: '1px solid #fcd34d' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>⚠️ Most common mistake</div>
                  <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>{selected.commonMistake}</div>
                </div>

                <div className="card" style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 6 }}>💡 Exam technique tip</div>
                  <div style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>{selected.tip}</div>
                </div>

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 14 }}
                  onClick={() => { setPracticeMode(true); generatePractice(selected) }}>
                  Practice a "{selected.word}" question from {localSubject} →
                </button>
              </div>
            )}

            {/* ── PRACTICE MODE ── */}
            {practiceMode && (
              <div>
                {loading && !practiceQ && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
                    <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
                    <div style={{ fontSize: 14, color: 'var(--gray-500)' }}>Generating {localSubject} question...</div>
                  </div>
                )}

                {practiceQ && (
                  <div className="fade-in">
                    <div style={{ background: selected.bg, border: `1.5px solid ${selected.color}40`, borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: selected.color }}>
                      <strong>Remember — "{selected.word}" means:</strong> {selected.definition}
                    </div>

                    <div className="card" style={{ marginBottom: 14 }}>
                      <span className="tag tag-blue" style={{ marginBottom: 8, display: 'inline-block' }}>{practiceQ.subjectArea}</span>
                      {practiceQ.context && (
                        <div style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6, borderLeft: '3px solid var(--blue)' }}>
                          {practiceQ.context}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                        <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.7, flex: 1 }}>{practiceQ.question}</p>
                        <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', flexShrink: 0 }}>[{practiceQ.marks} marks]</div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--blue-light)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#1e40af' }}>
                      💡 <strong>Structure guide:</strong> {practiceQ.structureGuide || selected.structure}
                    </div>

                    <textarea className="textarea-field"
                      placeholder={`Write your "${selected.word}" answer here...`}
                      value={answer} onChange={e => setAnswer(e.target.value)}
                      style={{ minHeight: 130, marginBottom: 12 }} />

                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                      <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: 14 }}
                        onClick={markAnswer} disabled={loading || !answer.trim()}>
                        {loading ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Marking...</> : '✓ Mark my answer'}
                      </button>
                      <button className="btn-secondary" style={{ fontSize: 13, padding: '12px 16px' }}
                        onClick={() => { generatePractice(selected); setAnswer(''); setFeedback(null) }}>
                        New question
                      </button>
                    </div>

                    {feedback && (
                      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div className="card" style={{
                          background: feedback.awarded === feedback.available ? 'var(--green-light)' : feedback.awarded > 0 ? 'var(--amber-light)' : 'var(--red-light)',
                          border: `1.5px solid ${feedback.awarded === feedback.available ? '#6ee7b7' : feedback.awarded > 0 ? '#fcd34d' : '#fca5a5'}`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: feedback.awarded === feedback.available ? 'var(--green)' : feedback.awarded > 0 ? 'var(--amber)' : 'var(--red)' }}>
                              {feedback.awarded}/{feedback.available} marks
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.08)', color: 'var(--gray-700)' }}>
                              {feedback.usedCommandWordCorrectly ? `✓ Used "${selected.word}" correctly` : `✗ "${selected.word}" not fully applied`}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--gray-700)' }}>{feedback.feedback}</div>
                        </div>

                        <div className="card" style={{ background: selected.bg }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: selected.color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>How well did you use "{selected.word}"?</div>
                          <div style={{ fontSize: 13, color: selected.color, lineHeight: 1.6 }}>{feedback.commandWordFeedback}</div>
                        </div>

                        {feedback.improvedAnswer && (
                          <div className="card" style={{ background: 'var(--green-light)', border: '1px solid #6ee7b7' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#065f46', marginBottom: 6 }}>✓ Full marks answer</div>
                            <div style={{ fontSize: 13, color: '#065f46', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{feedback.improvedAnswer}</div>
                          </div>
                        )}

                        {feedback.keyTip && (
                          <div className="card" style={{ background: 'var(--blue-light)' }}>
                            <div style={{ fontSize: 13, color: '#1e40af' }}>💡 <strong>Key tip:</strong> {feedback.keyTip}</div>
                          </div>
                        )}

                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
                          onClick={() => { generatePractice(selected); setAnswer(''); setFeedback(null) }}>
                          Try another {localSubject} question →
                        </button>
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
