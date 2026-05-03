import React, { useState, useEffect, useRef } from 'react'
import { saveFlashcardSession, loadFlashcardSessions, updateFlashcardScore, deleteFlashcardSession } from '../lib/userActivity.js'

export default function FlashcardsTab({ flashcards, subject, switchTab }) {
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [ratings, setRatings] = useState({})
  const [done, setDone] = useState(false)
  const [view, setView] = useState('library')
  const [loading, setLoading] = useState(true)
  // Track last flashcards array we processed to avoid duplicates
  const lastFlashcardsRef = useRef(null)

  // Load sessions on mount
  useEffect(() => {
    loadFlashcardSessions().then(data => {
      setSessions(data)
      setLoading(false)
    })
  }, [])

  // When new flashcards arrive from Generate tab — only process if they changed
  useEffect(() => {
    if (!flashcards?.length) return
    // Use stringified first card as fingerprint — prevents re-running on re-renders
    const fingerprint = JSON.stringify(flashcards[0])
    if (lastFlashcardsRef.current === fingerprint) return
    lastFlashcardsRef.current = fingerprint

    const newSession = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      subject: subject || 'GCSE',
      topic: flashcards[0]?.topic || flashcards[0]?.front?.slice(0, 40) || 'Mixed topics',
      cardCount: flashcards.length,
      cards: flashcards,
      bestScore: null,
      lastStudied: null,
    }

    saveFlashcardSession(newSession).then(() => {
      setSessions(prev => {
        // Remove any existing session with same fingerprint (deduplicate)
        const filtered = prev.filter(s => JSON.stringify(s.cards?.[0]) !== fingerprint)
        return [newSession, ...filtered]
      })
    })

    // Auto-start studying
    setActiveSession(newSession)
    setCurrent(0)
    setFlipped(false)
    setRatings({})
    setDone(false)
    setView('study')
  }, [flashcards])

  const startSession = (session) => {
    setActiveSession(session)
    setCurrent(0)
    setFlipped(false)
    setRatings({})
    setDone(false)
    setView('study')
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    await deleteFlashcardSession(id)
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const rate = async (r) => {
    const newRatings = { ...ratings, [current]: r }
    setRatings(newRatings)
    setFlipped(false)

    if (current < activeSession.cards.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 150)
    } else {
      // Session done
      const gotIt = Object.values(newRatings).filter(v => v !== 'hard').length
      const score = Math.round((gotIt / activeSession.cards.length) * 100)
      const lastStudied = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

      // Update score
      await updateFlashcardScore(activeSession.id, score, lastStudied)
      setSessions(prev => prev.map(s =>
        s.id === activeSession.id
          ? { ...s, bestScore: Math.max(s.bestScore || 0, score), lastStudied }
          : s
      ))
      setDone(true)
    }
  }

  // ── STUDY VIEW ────────────────────────────────────────────────────────────
  if (view === 'study' && activeSession) {
    const cards = activeSession.cards
    const fc = cards[current]
    const totalRated = Object.keys(ratings).length
    const hardCount = Object.values(ratings).filter(r => r === 'hard').length
    const gotItCount = Object.values(ratings).filter(r => r !== 'hard').length
    const pct = cards.length > 0 ? (totalRated / cards.length) * 100 : 0

    if (done) {
      const finalScore = Math.round((gotItCount / cards.length) * 100)
      const scoreColor = finalScore >= 80 ? 'var(--green)' : finalScore >= 50 ? 'var(--amber)' : 'var(--red)'
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', gap: 16, padding: 24, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 56 }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--navy)' }}>Session complete!</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', background: 'var(--green-light)', borderRadius: 12, padding: '16px 24px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--green)' }}>{gotItCount}</div>
              <div style={{ fontSize: 13, color: '#065f46' }}>Got it ✓</div>
            </div>
            <div style={{ textAlign: 'center', background: 'var(--red-light)', borderRadius: 12, padding: '16px 24px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--red)' }}>{hardCount}</div>
              <div style={{ fontSize: 13, color: '#991b1b' }}>Hard ✗</div>
            </div>
            <div style={{ textAlign: 'center', background: 'var(--blue-light)', borderRadius: 12, padding: '16px 24px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: scoreColor }}>{finalScore}%</div>
              <div style={{ fontSize: 13, color: '#1e40af' }}>Score</div>
            </div>
          </div>
          <p style={{ color: 'var(--gray-500)', maxWidth: 340, lineHeight: 1.6, fontSize: 14 }}>
            {hardCount === 0 ? 'Perfect! You know all of these cards.' :
             hardCount <= 3 ? `Almost there! Practise the ${hardCount} hard card${hardCount > 1 ? 's' : ''} again.` :
             'Keep going — repetition is how this sticks.'}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {hardCount > 0 && (
              <button className="btn-primary" onClick={() => {
                const hardCards = cards.filter((_, i) => ratings[i] === 'hard')
                setActiveSession({ ...activeSession, cards: hardCards })
                setCurrent(0); setFlipped(false); setRatings({}); setDone(false)
              }}>Retry {hardCount} hard card{hardCount > 1 ? 's' : ''} →</button>
            )}
            <button className="btn-secondary" onClick={() => { setCurrent(0); setFlipped(false); setRatings({}); setDone(false) }}>Start from beginning</button>
            <button className="btn-secondary" onClick={() => setView('library')}>← Library</button>
          </div>
        </div>
      )
    }

    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <button onClick={() => setView('library')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', fontSize: 13, padding: 0, marginBottom: 4 }}>
              ← Library
            </button>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--navy)' }}>
              {activeSession.subject.replace('GCSE ', '')} — {activeSession.topic}
            </div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--gray-500)', fontWeight: 500 }}>{current + 1} / {cards.length}</div>
        </div>

        {/* Progress */}
        <div style={{ background: 'var(--gray-100)', borderRadius: 999, height: 6, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--navy)', width: `${pct}%`, transition: 'width 0.3s ease' }} />
        </div>

        {/* Card */}
        <div onClick={() => setFlipped(!flipped)} style={{
          background: flipped ? 'var(--navy)' : 'white',
          border: `2px solid ${flipped ? 'var(--navy)' : 'var(--gray-200)'}`,
          borderRadius: 16, padding: '40px 32px', cursor: 'pointer',
          minHeight: 220, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          transition: 'all 0.2s ease', boxShadow: 'var(--shadow-md)', userSelect: 'none',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: flipped ? 'rgba(255,255,255,0.5)' : 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            {flipped ? 'Answer' : 'Question'}
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, color: flipped ? 'white' : 'var(--navy)', lineHeight: 1.6 }}>
            {flipped ? fc.back : fc.front}
          </div>
          {!flipped && <div style={{ marginTop: 20, fontSize: 12, color: 'var(--gray-300)' }}>Tap to reveal answer</div>}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {flipped ? (
            <>
              <button onClick={() => rate('hard')} style={{ flex: 1, maxWidth: 160, padding: '12px', borderRadius: 10, border: '1.5px solid #fca5a5', background: 'var(--red-light)', color: '#991b1b', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                ✗ Hard — see again
              </button>
              <button onClick={() => rate('ok')} style={{ flex: 1, maxWidth: 160, padding: '12px', borderRadius: 10, border: '1.5px solid #6ee7b7', background: 'var(--green-light)', color: '#065f46', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                ✓ Got it
              </button>
            </>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--gray-400)', padding: '10px 0' }}>Think of your answer, then tap the card</div>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <button onClick={() => rate('skip')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-300)', fontSize: 12 }}>Skip</button>
        </div>
      </div>
    )
  }

  // ── LIBRARY VIEW ────────────────────────────────────────────────────────────
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)', marginBottom: 4 }}>🃏 My Flashcard Library</h2>
          <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
            {loading ? 'Loading...' : sessions.length === 0
              ? 'No flashcards yet'
              : `${sessions.length} session${sessions.length > 1 ? 's' : ''} · ${sessions.reduce((t, s) => t + (s.cardCount || 0), 0)} total cards`}
          </p>
        </div>
        <button className="btn-primary" style={{ fontSize: 14 }} onClick={() => switchTab('generate')}>
          + Generate new flashcards
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
        </div>
      ) : sessions.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280, textAlign: 'center', gap: 12 }}>
          <div style={{ fontSize: 52 }}>🃏</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gray-300)' }}>No flashcards yet</div>
          <p style={{ fontSize: 14, color: 'var(--gray-400)', maxWidth: 340, lineHeight: 1.6 }}>
            Go to Generate tab, pick a subject and topic, select "Flashcards" and hit Generate. Your cards will be saved here automatically.
          </p>
          <button className="btn-primary" onClick={() => switchTab('generate')}>Generate flashcards →</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {sessions.map(session => {
            const score = session.bestScore
            const scoreColor = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)'
            return (
              <div key={session.id} className="card" style={{ cursor: 'pointer', position: 'relative', transition: 'var(--transition)' }}
                onClick={() => startSession(session)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                <button onClick={(e) => handleDelete(session.id, e)}
                  style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-300)', fontSize: 18, padding: '2px 4px' }}
                  title="Delete">×</button>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className="tag tag-navy" style={{ fontSize: 11 }}>{(session.subject || '').replace('GCSE ', '')}</span>
                  {session.lastStudied && <span className="tag tag-green" style={{ fontSize: 11 }}>Studied: {session.lastStudied}</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--navy)', marginBottom: 3, paddingRight: 20 }}>
                  {session.topic}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}>
                  {session.date} at {session.time} · {session.cardCount} cards
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {score !== null && score !== undefined ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: scoreColor }}>{score}%</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>best</div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--gray-400)', fontStyle: 'italic' }}>Not studied yet</div>
                  )}
                  <button className="btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}
                    onClick={(e) => { e.stopPropagation(); startSession(session) }}>Study →</button>
                </div>
                {score !== null && score !== undefined && (
                  <div style={{ background: 'var(--gray-100)', borderRadius: 999, height: 4, marginTop: 10, overflow: 'hidden' }}>
                    <div style={{ height: 4, borderRadius: 999, background: scoreColor, width: `${score}%`, transition: 'width 0.5s ease' }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
