import React, { useState } from 'react'

const RESOURCES = [
  {
    name: 'BBC Bitesize',
    logo: '🔴',
    bg: '#fee2e2',
    color: '#991b1b',
    desc: 'Clear explanations, diagrams and quizzes. Free, aligned to all major GCSE boards. The best starting point for any topic.',
    url: 'https://www.bbc.co.uk/bitesize/levels/z98jmp3',
    subjects: ['Physics','Chemistry','Biology','Maths','English'],
    type: 'Explanations + Quizzes',
    badge: 'Free',
    badgeClass: 'tag-green',
    recommended: true,
  },
  {
    name: 'Physics & Maths Tutor',
    logo: '📐',
    bg: '#fef3c7',
    color: '#92400e',
    desc: 'Revision notes, past papers and mark schemes for every GCSE board. Used by millions of UK students every year.',
    url: 'https://www.physicsandmathstutor.com',
    subjects: ['Physics','Maths','Chemistry','Biology'],
    type: 'Notes + Past Papers',
    badge: 'Free',
    badgeClass: 'tag-green',
  },
  {
    name: 'Khan Academy',
    logo: '🎓',
    bg: '#e0f2fe',
    color: '#0c4a6e',
    desc: 'Video-based lessons with practice problems. Best for understanding concepts from scratch. Excellent for Maths.',
    url: 'https://www.khanacademy.org',
    subjects: ['Maths','Physics','Chemistry','Biology'],
    type: 'Video lessons',
    badge: 'Free',
    badgeClass: 'tag-green',
  },
  {
    name: 'Save My Exams',
    logo: '📝',
    bg: '#f3e8ff',
    color: '#6b21a8',
    desc: 'Exam-technique focused notes and practice questions, board-specific. Particularly strong for sciences and exam strategy.',
    url: 'https://www.savemyexams.com',
    subjects: ['Physics','Chemistry','Biology','Maths'],
    type: 'Exam technique',
    badge: 'Free + Premium',
    badgeClass: 'tag-blue',
  },
  {
    name: 'Seneca Learning',
    logo: '🧠',
    bg: '#fef9c3',
    color: '#713f12',
    desc: 'Adaptive AI learning — claims 2x faster revision. Fully mapped to GCSE syllabuses for all major boards.',
    url: 'https://app.senecalearning.com',
    subjects: ['All subjects'],
    type: 'Adaptive learning',
    badge: 'Free',
    badgeClass: 'tag-green',
  },
  {
    name: 'Cognito (YouTube)',
    logo: '▶️',
    bg: '#fee2e2',
    color: '#991b1b',
    desc: 'Short, visual GCSE science videos. Excellent for Atomic Structure, Waves, Electricity. Very clear explanations.',
    url: 'https://www.youtube.com/@CognitoYT',
    subjects: ['Physics','Chemistry','Biology'],
    type: 'Videos',
    badge: 'Free',
    badgeClass: 'tag-green',
  },
  {
    name: 'AQA Past Papers',
    logo: '📄',
    bg: '#e0f2fe',
    color: '#0c4a6e',
    desc: 'Official past papers and mark schemes direct from AQA. Always the most reliable for AQA students.',
    url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes',
    subjects: ['All AQA subjects'],
    type: 'Past papers (official)',
    badge: 'AQA',
    badgeClass: 'tag-navy',
  },
  {
    name: 'Edexcel Past Papers',
    logo: '📄',
    bg: '#e0f2fe',
    color: '#0c4a6e',
    desc: 'Official Pearson Edexcel past papers and mark schemes. Essential if you sit Edexcel exams.',
    url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html',
    subjects: ['All Edexcel subjects'],
    type: 'Past papers (official)',
    badge: 'Edexcel',
    badgeClass: 'tag-navy',
  },
  {
    name: 'GCSEPod',
    logo: '🎧',
    bg: '#d1fae5',
    color: '#065f46',
    desc: 'Short, curriculum-mapped audio and video pods. Great for revision on the go — listen on your commute.',
    url: 'https://www.gcsepod.com',
    subjects: ['All subjects'],
    type: 'Audio + Video',
    badge: 'School licence',
    badgeClass: 'tag-amber',
  },
]

export default function ResourcesTab({ weakTopics, subject }) {
  const [filter, setFilter] = useState('All')
  const subjectShort = subject?.replace('GCSE ', '') || 'Physics'
  const filters = ['All', 'Free only', 'Videos', 'Past papers', 'Recommended']

  const filtered = RESOURCES.filter(r => {
    if (filter === 'Free only') return r.badge === 'Free'
    if (filter === 'Videos') return r.type.toLowerCase().includes('video')
    if (filter === 'Past papers') return r.type.toLowerCase().includes('past paper')
    if (filter === 'Recommended') return r.recommended
    return true
  })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--navy)', marginBottom: 6 }}>
          Trusted resources
        </h2>
        <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
          Curated, free, exam-board aligned. No ads. No dodgy sites. Just the best revision resources in the UK.
        </p>
      </div>

      {/* Weak topic alert */}
      {weakTopics?.length > 0 && (
        <div style={{
          background: 'var(--amber-light)', border: '1px solid #fcd34d',
          borderRadius: 12, padding: '14px 18px', marginBottom: 20,
          display: 'flex', alignItems: 'flex-start', gap: 12
        }}>
          <span style={{ fontSize: 20 }}>🎯</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#92400e', marginBottom: 4 }}>
              Prioritise these based on your last exam
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {weakTopics.map(t => (
                <span key={t} className="tag tag-amber">{t}</span>
              ))}
            </div>
            <div style={{ fontSize: 13, color: '#92400e', marginTop: 6 }}>
              Search BBC Bitesize or PMT for these topics first.
            </div>
          </div>
        </div>
      )}

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {filters.map(f => (
          <span
            key={f}
            className={`pill ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >{f}</span>
        ))}
      </div>

      {/* Resource cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {filtered.map(r => (
          <div
            key={r.name}
            className="card"
            style={{
              display: 'flex', flexDirection: 'column', gap: 10,
              borderColor: r.recommended ? '#93c5fd' : undefined,
              position: 'relative', overflow: 'hidden'
            }}
          >
            {r.recommended && (
              <div style={{
                position: 'absolute', top: 0, right: 0,
                background: 'var(--blue)', color: 'white',
                fontSize: 10, fontWeight: 600, padding: '3px 10px',
                borderBottomLeftRadius: 8
              }}>⭐ TOP PICK</div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0
              }}>{r.logo}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--navy)' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{r.type}</div>
              </div>
              <span className={`tag ${r.badgeClass}`} style={{ marginLeft: 'auto', flexShrink: 0 }}>{r.badge}</span>
            </div>

            <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>{r.desc}</p>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {r.subjects.map(s => (
                <span key={s} style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 999,
                  background: 'var(--gray-100)', color: 'var(--gray-500)'
                }}>{s}</span>
              ))}
            </div>

            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ justifyContent: 'center', fontSize: 13, marginTop: 'auto' }}
            >
              Open {r.name} →
            </a>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div style={{
        marginTop: 24, padding: '14px 18px',
        background: 'var(--gray-100)', borderRadius: 12,
        fontSize: 13, color: 'var(--gray-500)', textAlign: 'center'
      }}>
        All resources are free or have a free tier. We have no affiliation with any of these sites — just the best tools for GCSE students.
      </div>
    </div>
  )
}
