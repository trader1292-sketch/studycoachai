import React from 'react'

const TOPIC_DATA = [
  { name: 'Energy', pct: 88, exams: 4 },
  { name: 'Waves', pct: 82, exams: 3 },
  { name: 'Space Physics', pct: 76, exams: 2 },
  { name: 'Electricity', pct: 74, exams: 5 },
  { name: 'Magnetism', pct: 68, exams: 2 },
  { name: 'Atomic Structure', pct: 51, exams: 3 },
  { name: 'Forces & Motion', pct: 42, exams: 6 },
]

export default function TrackerTab({ weakTopics, switchTab }) {
  const overallAvg = Math.round(TOPIC_DATA.reduce((s, t) => s + t.pct, 0) / TOPIC_DATA.length)
  const predictedGrade = overallAvg >= 85 ? '8–9' : overallAvg >= 75 ? '7' : overallAvg >= 65 ? '6' : overallAvg >= 55 ? '5' : '4'
  const streakDays = [true,true,true,true,true,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,false,false,false,false,true,true,false,false,false,false]

  const barColor = (pct) => pct >= 75 ? 'var(--green)' : pct >= 55 ? 'var(--amber)' : 'var(--red)'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Overall stats */}
        <div className="card" style={{ background: 'var(--navy)', border: 'none' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Overall performance</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, color: 'white', lineHeight: 1 }}>{overallAvg}%</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Average across all topics</div>
            </div>
            <div style={{ textAlign: 'right', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--gold)', lineHeight: 1 }}>{predictedGrade}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Predicted grade</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white' }}>12</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Exams taken</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gold)' }}>+8%</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Last 2 weeks</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#6ee7b7' }}>7</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Day streak 🔥</div>
            </div>
          </div>
        </div>

        {/* Streak calendar */}
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', marginBottom: 4 }}>Study streak — this month</div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}>Each dot = a study day</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {streakDays.map((active, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: '50%',
                background: active ? 'var(--navy)' : 'var(--gray-100)',
                transition: 'background 0.2s'
              }} title={`Day ${i + 1}`} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-500)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--navy)' }} />
              Studied
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-500)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gray-200)' }} />
              Missed
            </div>
          </div>
        </div>

        {/* Grade prediction */}
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', marginBottom: 12 }}>Grade prediction</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 14 }}>
            {['1','2','3','4','5','6','7','8','9'].map(g => (
              <div key={g} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: g === predictedGrade || predictedGrade.includes(g)
                    ? 'var(--navy)' : 'var(--gray-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 16,
                  color: g === predictedGrade || predictedGrade.includes(g) ? 'white' : 'var(--gray-400)',
                  transition: 'all 0.2s',
                  border: g === predictedGrade || predictedGrade.includes(g) ? '2px solid var(--navy)' : '2px solid transparent'
                }}>{g}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--blue-light)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>
            Based on your recent scores. Revising <strong>Forces & Motion</strong> and <strong>Atomic Structure</strong> could push you to a Grade 7.
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 12, fontSize: 13 }}
            onClick={() => switchTab('generate')}
          >
            Practice weak topics →
          </button>
        </div>
      </div>

      {/* Right column — topic tracker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', marginBottom: 4 }}>Topic performance</div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 16 }}>Based on your marked exams</div>

          {TOPIC_DATA.sort((a, b) => a.pct - b.pct).map(t => (
            <div key={t.name} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{t.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{t.exams} exams</span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: 16,
                    color: barColor(t.pct), minWidth: 40, textAlign: 'right'
                  }}>{t.pct}%</span>
                </div>
              </div>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${t.pct}%`, background: barColor(t.pct) }} />
              </div>
              {t.pct < 60 && (
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="tag tag-red" style={{ fontSize: 11 }}>Needs work</span>
                  <button
                    style={{ fontSize: 11, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0 }}
                    onClick={() => switchTab('resources')}
                  >Find resources →</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="card" style={{ background: 'var(--gold-light)', border: '1px solid #fcd34d' }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#92400e', marginBottom: 8 }}>
            📌 This week's focus
          </div>
          <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.7 }}>
            Your data shows <strong>Forces & Motion</strong> is your biggest opportunity — you're at 42% and it's worth the most marks on Paper 1.
            Spending 3 sessions this week on Forces could realistically add 8–10% to your overall score.
          </div>
          <button
            className="btn-gold"
            style={{ width: '100%', justifyContent: 'center', marginTop: 12, fontSize: 13 }}
            onClick={() => switchTab('planner')}
          >
            Build revision plan →
          </button>
        </div>
      </div>
    </div>
  )
}
