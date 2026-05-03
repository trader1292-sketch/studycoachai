import React, { useState } from 'react'

// Sample data — will be replaced with real Supabase data
const SAMPLE_STUDENTS = [
  { id: 1, name: 'Aisha Rahman', subject: 'GCSE Physics (AQA)', grade: '7', streak: 12, lastActive: 'Today', examsCompleted: 8, avgScore: 74, weakTopics: ['Atomic Structure', 'Waves'] },
  { id: 2, name: 'James Thornton', subject: 'GCSE Chemistry (AQA)', grade: '5', streak: 3, lastActive: 'Yesterday', examsCompleted: 5, avgScore: 58, weakTopics: ['Quantitative Chemistry', 'Bonding'] },
  { id: 3, name: 'Priya Patel', subject: 'GCSE Maths (Edexcel)', grade: '8', streak: 21, lastActive: 'Today', examsCompleted: 14, avgScore: 82, weakTopics: ['Trigonometry'] },
  { id: 4, name: 'Connor O\'Brien', subject: 'GCSE Biology (AQA)', grade: '4', streak: 1, lastActive: '3 days ago', examsCompleted: 3, avgScore: 45, weakTopics: ['Homeostasis', 'Genetics', 'Ecology'] },
  { id: 5, name: 'Sophie Williams', subject: 'GCSE Physics (AQA)', grade: '6', streak: 8, lastActive: 'Today', examsCompleted: 11, avgScore: 67, weakTopics: ['Forces', 'Energy'] },
]

const gradeColor = (g) => {
  const n = parseInt(g)
  if (n >= 7) return 'var(--green)'
  if (n >= 5) return 'var(--amber)'
  return 'var(--red)'
}

export default function TeacherDashboard({ user, onBack }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const name = user?.name || 'Teacher'
  const filtered = SAMPLE_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const avgGrade = Math.round(SAMPLE_STUDENTS.reduce((t, s) => t + parseInt(s.grade), 0) / SAMPLE_STUDENTS.length)
  const totalExams = SAMPLE_STUDENTS.reduce((t, s) => t + s.examsCompleted, 0)
  const activeToday = SAMPLE_STUDENTS.filter(s => s.lastActive === 'Today').length

  const TABS = [
    { id: 'overview', label: 'Class Overview', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'insights', label: 'Insights', icon: '💡' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, paddingBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 30, height: 30, background: '#059669', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--navy)', lineHeight: 1.1 }}>Teacher Dashboard</div>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Study & Exam Coach</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>Welcome, {name}</div>
              <button onClick={onBack} style={{ fontSize: 12, color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}>← Student app</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: '10px 14px', fontSize: 13,
                fontWeight: activeTab === t.id ? 500 : 400,
                color: activeTab === t.id ? 'var(--navy)' : 'var(--gray-500)',
                background: 'none', border: 'none',
                borderBottom: activeTab === t.id ? '2px solid var(--navy)' : '2px solid transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '24px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>

        {/* Coming soon notice */}
        <div style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)', borderRadius: 10, padding: '12px 18px', marginBottom: 20, fontSize: 13, color: '#1e40af' }}>
          <strong>👋 Teacher Dashboard — Preview</strong> · This is a preview showing sample data. Full functionality (real student data, assignment setting, reports) launches with the school licence. <a href="mailto:schools@studyexamcoach.co.uk" style={{ color: '#1e40af', fontWeight: 600 }}>Contact us</a> for early access.
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Total students', value: SAMPLE_STUDENTS.length, icon: '👥', color: 'var(--navy)' },
                { label: 'Active today', value: activeToday, icon: '🔥', color: '#E02424' },
                { label: 'Avg class grade', value: avgGrade, icon: '📊', color: gradeColor(String(avgGrade)) },
                { label: 'Exams completed', value: totalExams, icon: '✅', color: '#059669' },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Students needing attention */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)', marginBottom: 14 }}>⚠️ Students who may need support</div>
              {SAMPLE_STUDENTS.filter(s => parseInt(s.grade) <= 5 || s.streak < 3).map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray-100)', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--navy)' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{s.subject} · Last active: {s.lastActive}</div>
                    <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 2 }}>Weak: {s.weakTopics.join(', ')}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: gradeColor(s.grade) }}>Grade {s.grade}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>🔥 {s.streak} day streak</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Common weak topics across class */}
            <div className="card">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)', marginBottom: 14 }}>📚 Most common weak topics in your class</div>
              {['Atomic Structure', 'Quantitative Chemistry', 'Trigonometry', 'Homeostasis', 'Bonding', 'Forces', 'Waves'].map((topic, i) => (
                <div key={topic} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ fontSize: 14, color: 'var(--gray-700)' }}>{topic}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ background: 'var(--gray-100)', borderRadius: 999, height: 6, width: 100, overflow: 'hidden' }}>
                      <div style={{ height: 6, borderRadius: 999, background: i < 2 ? 'var(--red)' : i < 4 ? 'var(--amber)' : 'var(--green)', width: `${90 - i * 10}%` }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--gray-400)', width: 30, textAlign: 'right' }}>{4 - Math.floor(i / 2)} students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STUDENTS ── */}
        {activeTab === 'students' && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <input className="input-field" type="text" placeholder="Search students..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ maxWidth: 300, marginBottom: 0 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {filtered.map(s => (
                <div key={s.id} className="card" style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedStudent(selectedStudent?.id === s.id ? null : s)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', marginBottom: 2 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{s.subject}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: gradeColor(s.grade), lineHeight: 1 }}>
                      {s.grade}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>🔥 {s.streak} day streak</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>✅ {s.examsCompleted} exams</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>📊 {s.avgScore}% avg</div>
                  </div>
                  <div style={{ background: 'var(--gray-100)', borderRadius: 999, height: 6, marginBottom: 8, overflow: 'hidden' }}>
                    <div style={{ height: 6, borderRadius: 999, background: gradeColor(s.grade), width: `${s.avgScore}%`, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ fontSize: 12, color: s.lastActive === 'Today' ? '#059669' : 'var(--gray-400)' }}>
                    Last active: {s.lastActive}
                  </div>
                  {selectedStudent?.id === s.id && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--gray-100)' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weak topics</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {s.weakTopics.map(t => <span key={t} className="tag" style={{ background: 'var(--red-light)', color: '#991b1b', fontSize: 11 }}>{t}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INSIGHTS ── */}
        {activeTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ background: 'var(--navy)', border: 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', marginBottom: 12 }}>📋 Teaching recommendations</div>
              {[
                { insight: 'Atomic Structure is the most common weak topic — consider a dedicated lesson or direct students to the Practicals module in the app.', priority: 'High' },
                { insight: '2 students have not revised in 3+ days — consider a reminder or check-in.', priority: 'Medium' },
                { insight: 'Connor O\'Brien has 3 weak topics and is averaging Grade 4 — may benefit from additional support.', priority: 'High' },
                { insight: 'Priya Patel has a 21-day streak and Grade 8 average — she is performing well and working consistently.', priority: 'Info' },
              ].map((r, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: r.priority === 'High' ? 'var(--red)' : r.priority === 'Medium' ? 'var(--amber)' : '#1e40af', color: 'white' }}>
                      {r.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{r.insight}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)', marginBottom: 12 }}>📅 Coming soon — Full teacher features</div>
              {['Set practice assignments for the whole class', 'See which students completed each assignment', 'Generate class-wide weak topic reports', 'Export progress data as PDF or CSV', 'Send study reminders to inactive students', 'Parent communication portal'].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', fontSize: 14, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ color: 'var(--gray-300)' }}>○</span>{f}
                </div>
              ))}
              <div style={{ marginTop: 14 }}>
                <a href="mailto:schools@studyexamcoach.co.uk?subject=Teacher dashboard early access"
                  className="btn-primary" style={{ fontSize: 13, display: 'inline-flex' }}>
                  Request early access →
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
