import React, { useState } from 'react'
import PracticalsTab from './PracticalsTab.jsx'
import CommandWordTab from './CommandWordTab.jsx'
import SynopticTab from './SynopticTab.jsx'

const SECTIONS = [
  {
    id: 'practicals',
    icon: '🔬',
    label: 'Required Practicals',
    desc: 'Every required practical with method, exam tips and Grade 9 points. Appear in every paper.',
  },
  {
    id: 'commandwords',
    icon: '📝',
    label: 'Command Words',
    desc: 'Master Describe, Explain, Evaluate, Calculate and more. AI marks whether you used them correctly.',
  },
  {
    id: 'synoptic',
    icon: '🔗',
    label: 'Synoptic & 6-Mark',
    desc: 'The hardest questions on any paper. Learn the structure, practise, get level-of-response marking.',
  },
]

export default function ExamSkillsTab(props) {
  const [activeSection, setActiveSection] = useState('practicals')

  return (
    <div>
      {/* Section header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)', marginBottom: 4 }}>
          🎯 Exam Skills
        </h2>
        <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 16 }}>
          The techniques that separate Grade 7 from Grade 9. Master these and pick up marks other students miss.
        </p>

        {/* Sub-navigation pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 500, transition: 'all 0.15s',
                background: activeSection === s.id ? 'var(--navy)' : 'white',
                color: activeSection === s.id ? 'white' : 'var(--gray-600)',
                boxShadow: activeSection === s.id
                  ? '0 2px 8px rgba(10,36,99,0.2)'
                  : '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Active section description */}
        <div style={{
          marginTop: 10, padding: '8px 14px',
          background: 'var(--gray-50)', borderRadius: 8,
          fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5,
          borderLeft: '3px solid var(--navy)',
        }}>
          {SECTIONS.find(s => s.id === activeSection)?.desc}
        </div>
      </div>

      {/* Render active section */}
      <div className="fade-in" key={activeSection}>
        {activeSection === 'practicals' && <PracticalsTab {...props} />}
        {activeSection === 'commandwords' && <CommandWordTab {...props} />}
        {activeSection === 'synoptic' && <SynopticTab {...props} />}
      </div>
    </div>
  )
}
