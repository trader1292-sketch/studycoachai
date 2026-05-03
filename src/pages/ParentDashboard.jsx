import React, { useState } from 'react'

const gradeColor = (g) => {
  const n = parseInt(g)
  if (n >= 7) return 'var(--green)'
  if (n >= 5) return 'var(--amber)'
  return 'var(--red)'
}

const gradeLabel = (g) => {
  const n = parseInt(g)
  if (n >= 8) return 'Excellent — on track for top grades'
  if (n >= 6) return 'Good — some topics to strengthen'
  if (n >= 4) return 'Developing — more practice needed'
  return 'Needs support — consider extra help'
}

// Sample child data — will pull from Supabase with real account linking
const SAMPLE_CHILD = {
  name: 'Jamie',
  subjects: [
    { subject: 'GCSE Physics (AQA)', grade: '7', avgScore: 73, examsCompleted: 8, lastStudied: 'Today', streak: 12, weakTopics: ['Atomic Structure', 'Waves'], strongTopics: ['Forces', 'Energy'] },
    { subject: 'GCSE Maths (AQA)', grade: '6', avgScore: 65, examsCompleted: 5, lastStudied: '2 days ago', streak: 4, weakTopics: ['Trigonometry', 'Quadratic equations'], strongTopics: ['Number', 'Statistics'] },
    { subject: 'GCSE Biology (AQA)', grade: '5', avgScore: 57, examsCompleted: 3, lastStudied: 'Yesterday', streak: 7, weakTopics: ['Genetics', 'Homeostasis'], strongTopics: ['Cell Biology'] },
  ],
  totalStudyDays: 23,
  totalExams: 16,
  bestStreak: 14,
  recentActivity: [
    { date: 'Today', action: 'Completed Physics exam — scored 76% (Grade 7)', type: 'exam' },
    { date: 'Yesterday', action: 'Studied Biology revision notes — Cell Biology', type: 'notes' },
    { date: '2 days ago', action: 'Generated 15 flashcards — Trigonometry', type: 'flashcards' },
    { date: '3 days ago', action: 'Completed Maths exam — scored 61% (Grade 6)', type: 'exam' },
    { date: '4 days ago', action: 'Practised required practical — Osmosis in plants', type: 'practical' },
  ],
}

export default function ParentDashboard({ user, onBack }) {
  const [selectedSubject, setSelectedSubject] = useState(0)
  const child = SAMPLE_CHILD
  const subject = child.subjects[selectedSubject]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '14px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 30, height: 30, background: '#7C3AED', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--navy)', lineHeight: 1.1 }}>Parent Dashboard</div>
              <div style={{ fontSize: 10, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Study & Exam Coach</div>
            </div>
          </div>
          <button onClick={onBack} style={{ fontSize: 12, color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '24px', maxWidth: 900, width: '100%', margin: '0 auto' }}>

        {/* Preview notice */}
        <div style={{ background: '#EDE9FE', border: '1px solid #C4B5FD', borderRadius: 10, padding: '12px 18px', marginBottom: 20, fontSize: 13, color: '#5B21B6' }}>
          <strong>👋 Parent Dashboard — Preview</strong> · This shows sample data. Once you link your child's account, you'll see their real progress here. <a href="mailto:hello@studyexamcoach.co.uk" style={{ color: '#5B21B6', fontWeight: 600 }}>Contact us</a> to link accounts or enquire about family plans.
        </div>

        {/* Child header */}
        <div className="card" style={{ background: 'var(--navy)', border: 'none', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Your child</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white' }}>{child.name}</div>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Study days', value: child.totalStudyDays, icon: '📅' },
                { label: 'Exams done', value: child.totalExams, icon: '✅' },
                { label: 'Best streak', value: `${child.bestStreak} days`, icon: '🔥' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 16px' }}>
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--gold)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {child.subjects.map((s, i) => (
            <button key={i} onClick={() => setSelectedSubject(i)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: selectedSubject === i ? 'var(--navy)' : 'white',
              color: selectedSubject === i ? 'white' : 'var(--gray-600)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              {s.subject.replace('GCSE ', '').split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Subject detail */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>

          {/* Grade and progress */}
          <div className="card">
            <div style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 4 }}>{subject.subject}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 6 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: gradeColor(subject.grade), lineHeight: 1 }}>
                Grade {subject.grade}
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 14 }}>
              {gradeLabel(subject.grade)}
            </div>
            <div style={{ background: 'var(--gray-100)', borderRadius: 999, height: 8, marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ height: 8, borderRadius: 999, background: gradeColor(subject.grade), width: `${subject.avgScore}%`, transition: 'width 0.8s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>📊 {subject.avgScore}% average score</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>✅ {subject.examsCompleted} practice exams</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>🔥 {subject.streak} day streak</div>
              <div style={{ fontSize: 13, color: subject.lastStudied === 'Today' ? '#059669' : 'var(--gray-500)' }}>
                Last studied: {subject.lastStudied}
              </div>
            </div>
          </div>

          {/* Strong and weak topics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ background: 'var(--green-light)', border: '1px solid #6ee7b7' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 8 }}>✓ Topics doing well</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {subject.strongTopics.map(t => (
                  <span key={t} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: 'white', color: '#065f46', border: '1px solid #6ee7b7' }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="card" style={{ background: 'var(--red-light)', border: '1px solid #fca5a5' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#991b1b', marginBottom: 8 }}>⚠️ Topics that need more work</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {subject.weakTopics.map(t => (
                  <span key={t} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: 'white', color: '#991b1b', border: '1px solid #fca5a5' }}>{t}</span>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#991b1b', marginTop: 8, fontStyle: 'italic' }}>
                {child.name} can practise these in the app under Generate → {subject.weakTopics[0]}
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)', marginBottom: 14 }}>
            📋 Recent activity
          </div>
          {child.recentActivity.map((a, i) => {
            const icons = { exam: '📝', notes: '📖', flashcards: '🃏', practical: '🔬', planner: '🗓️' }
            const colors = { exam: 'var(--blue-light)', notes: 'var(--green-light)', flashcards: 'var(--gold-light)', practical: '#F0FDF4', planner: '#EDE9FE' }
            return (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < child.recentActivity.length - 1 ? '1px solid var(--gray-100)' : 'none', alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, background: colors[a.type] || 'var(--gray-100)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {icons[a.type] || '📌'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.5 }}>{a.action}</div>
                  <div style={{ fontSize: 12, color: a.date === 'Today' ? '#059669' : 'var(--gray-400)', marginTop: 2 }}>{a.date}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Parent tips */}
        <div className="card" style={{ background: '#F5F3FF', border: '1px solid #C4B5FD' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#5B21B6', marginBottom: 10 }}>
            💜 How you can help {child.name}
          </div>
          {[
            `Encourage ${child.name} to study for 30–60 minutes per day rather than long cramming sessions.`,
            `The weak topics (${subject.weakTopics[0]}) are the ones to focus on now — ask if they'd like to practise these tonight.`,
            `A consistent streak builds confidence. Celebrate the ${subject.streak}-day streak!`,
            `Exam season is approaching — make sure ${child.name} has a revision plan set up in the Planner tab.`,
          ].map((tip, i) => (
            <div key={i} style={{ fontSize: 13, color: '#5B21B6', padding: '5px 0', borderBottom: i < 3 ? '1px solid #C4B5FD' : 'none', lineHeight: 1.6 }}>
              💡 {tip}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
