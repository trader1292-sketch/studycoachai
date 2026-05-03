import React, { useState } from 'react'
import GenerateTab from '../components/GenerateTab.jsx'
import MarkTab from '../components/MarkTab.jsx'
import TrackerTab from '../components/TrackerTab.jsx'
import FlashcardsTab from '../components/FlashcardsTab.jsx'
import ResourcesTab from '../components/ResourcesTab.jsx'
import PlannerTab from '../components/PlannerTab.jsx'
import ExamSkillsTab from '../components/ExamSkillsTab.jsx'
import PastPapersTab from '../components/PastPapersTab.jsx'
import ExamPracticeTab from '../components/ExamPracticeTab.jsx'
import NotesTab from '../components/NotesTab.jsx'

const TABS = [
  { id: 'generate', label: 'Generate', icon: '⚡' },
  { id: 'notes', label: 'Revision Notes', icon: '📖' },
  { id: 'mark', label: 'Mark Work', icon: '📸' },
  { id: 'flashcards', label: 'Flashcards', icon: '🃏' },
  { id: 'examskills', label: 'Exam Skills', icon: '🎯' },
  { id: 'exampractice', label: 'Exam Practice', icon: '📝' },
  { id: 'pastpapers', label: 'Past Papers', icon: '📄' },
  { id: 'tracker', label: 'Progress', icon: '📊' },
  { id: 'resources', label: 'Resources', icon: '📚' },
  { id: 'planner', label: 'Planner', icon: '🗓️' },
]

export default function Dashboard({ user, profile, onBack, onSignOut, onShowSubscription, onTeacherDashboard, onParentDashboard }) {
  const [activeTab, setActiveTab] = useState('generate')
  const [examData, setExamData] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [weakTopics, setWeakTopics] = useState(['Forces', 'Atomic structure'])
  const [subject, setSubject] = useState('GCSE Physics')

  const name = user?.name || profile?.name || user?.email?.split('@')[0] || 'Student'
  const streak = profile?.streak || 0
  const plan = profile?.plan || 'free'
  const isGuest = user?.isGuest

  const tabProps = { examData, setExamData, flashcards, setFlashcards, weakTopics, setWeakTopics, subject, setSubject, switchTab: setActiveTab, user, profile }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, paddingBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 30, height: 30, background: 'var(--navy)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--navy)', lineHeight: 1.1 }}>Study & Exam Coach</div>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI-Powered GCSE Revision</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>Hey, {name}! 👋</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>🔥 {streak} day streak</div>
              </div>
              {plan === 'free' ? (
                <button onClick={onShowSubscription} style={{
                  fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6,
                  background: 'var(--gold)', color: 'white', border: 'none', cursor: 'pointer'
                }}>Upgrade to Pro ⭐</button>
              ) : (
                <span className="tag tag-green" style={{ fontSize: 12 }}>⭐ Pro</span>
              )}
              {onTeacherDashboard && (
                <button disabled style={{ fontSize: 12, color: '#9CA3AF', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'not-allowed', padding: '4px 10px', opacity: 0.6 }}>👨‍🏫 Teacher</button>
              )}
              {onParentDashboard && (
                <button disabled style={{ fontSize: 12, color: '#9CA3AF', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'not-allowed', padding: '4px 10px', opacity: 0.6 }}>👨‍👩‍👧 Parent</button>
              )}
              {!isGuest && (
                <button onClick={onSignOut} style={{ fontSize: 12, color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>Sign out</button>
              )}
              <button onClick={onBack} style={{ fontSize: 12, color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>← Home</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 0 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: '10px 12px', fontSize: 12,
                fontWeight: activeTab === t.id ? 500 : 400,
                color: activeTab === t.id ? 'var(--navy)' : 'var(--gray-500)',
                background: 'none', border: 'none',
                borderBottom: activeTab === t.id ? '2px solid var(--navy)' : '2px solid transparent',
                cursor: 'pointer', transition: 'var(--transition)',
                display: 'flex', alignItems: 'center', gap: 4,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main style={{ flex: 1, padding: '24px', maxWidth: 1300, width: '100%', margin: '0 auto' }}>
        {activeTab === 'generate' && <GenerateTab {...tabProps} />}
        {activeTab === 'notes' && <NotesTab {...tabProps} />}
        {activeTab === 'mark' && <MarkTab {...tabProps} />}
        {activeTab === 'flashcards' && <FlashcardsTab {...tabProps} />}
        {activeTab === 'examskills' && <ExamSkillsTab {...tabProps} />}
        {activeTab === 'exampractice' && <ExamPracticeTab {...tabProps} />}
        {activeTab === 'pastpapers' && <PastPapersTab {...tabProps} />}
        {activeTab === 'tracker' && <TrackerTab {...tabProps} />}
        {activeTab === 'resources' && <ResourcesTab {...tabProps} />}
        {activeTab === 'planner' && <PlannerTab {...tabProps} />}
      </main>
    </div>
  )
}