// userActivity.js
// Saves all student activity to Supabase (logged in) or localStorage (guest)
// This is the single source of truth for all progress tracking

import { supabase } from './supabase.js'

// ── Keys ─────────────────────────────────────────────────────────────────────
const KEYS = {
  flashcards: 'sec_flashcard_sessions',
  plans: 'sec_revision_plans',
  notes: 'sec_notes_history',
  examHistory: 'sec_exam_history',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function localGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function localSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

async function getUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch { return null }
}

// ── FLASHCARD SESSIONS ────────────────────────────────────────────────────────

export async function saveFlashcardSession(session) {
  // Always save to localStorage (for instant access)
  const local = localGet(KEYS.flashcards)
  // Deduplicate by id
  const updated = [session, ...local.filter(s => s.id !== session.id)].slice(0, 30)
  localSet(KEYS.flashcards, updated)

  // Also save to Supabase if logged in
  const user = await getUser()
  if (user && !user.isGuest) {
    try {
      await supabase.from('flashcard_sessions').upsert({
        id: String(session.id),
        user_id: user.id,
        subject: session.subject,
        topic: session.topic,
        card_count: session.cardCount,
        cards: session.cards,
        best_score: session.bestScore,
        last_studied: session.lastStudied,
        date: session.date,
        time: session.time,
        created_at: new Date(session.id).toISOString(),
      }, { onConflict: 'id' })
    } catch (e) { console.warn('Supabase flashcard save failed:', e.message) }
  }
}

export async function loadFlashcardSessions() {
  const user = await getUser()

  if (user && !user.isGuest) {
    try {
      const { data, error } = await supabase
        .from('flashcard_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30)

      if (!error && data?.length > 0) {
        // Sync to localStorage
        const mapped = data.map(d => ({
          id: Number(d.id) || d.id,
          subject: d.subject,
          topic: d.topic,
          cardCount: d.card_count,
          cards: d.cards,
          bestScore: d.best_score,
          lastStudied: d.last_studied,
          date: d.date,
          time: d.time,
        }))
        localSet(KEYS.flashcards, mapped)
        return mapped
      }
    } catch (e) { console.warn('Supabase flashcard load failed:', e.message) }
  }

  return localGet(KEYS.flashcards)
}

export async function updateFlashcardScore(sessionId, bestScore, lastStudied) {
  const local = localGet(KEYS.flashcards)
  const updated = local.map(s => s.id === sessionId ? { ...s, bestScore, lastStudied } : s)
  localSet(KEYS.flashcards, updated)

  const user = await getUser()
  if (user && !user.isGuest) {
    try {
      await supabase.from('flashcard_sessions')
        .update({ best_score: bestScore, last_studied: lastStudied })
        .eq('id', String(sessionId))
        .eq('user_id', user.id)
    } catch (e) { console.warn('Score update failed:', e.message) }
  }
}

export async function deleteFlashcardSession(sessionId) {
  const local = localGet(KEYS.flashcards)
  localSet(KEYS.flashcards, local.filter(s => s.id !== sessionId))

  const user = await getUser()
  if (user && !user.isGuest) {
    try {
      await supabase.from('flashcard_sessions')
        .delete()
        .eq('id', String(sessionId))
        .eq('user_id', user.id)
    } catch (e) { console.warn('Delete failed:', e.message) }
  }
}

// ── REVISION PLANS ────────────────────────────────────────────────────────────

export async function saveRevisionPlan(plan, subject, board, examDate) {
  const planRecord = {
    id: Date.now(),
    subject,
    board,
    examDate,
    createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    plan,
  }

  const local = localGet(KEYS.plans)
  const updated = [planRecord, ...local.filter(p => p.subject !== subject)].slice(0, 10)
  localSet(KEYS.plans, updated)

  const user = await getUser()
  if (user && !user.isGuest) {
    try {
      await supabase.from('revision_plans').upsert({
        id: String(planRecord.id),
        user_id: user.id,
        subject,
        board,
        exam_date: examDate,
        plan_data: plan,
        created_at: new Date().toISOString(),
      }, { onConflict: 'user_id,subject' })
    } catch (e) { console.warn('Plan save failed:', e.message) }
  }

  return planRecord
}

export async function loadRevisionPlans() {
  const user = await getUser()

  if (user && !user.isGuest) {
    try {
      const { data, error } = await supabase
        .from('revision_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (!error && data?.length > 0) {
        const mapped = data.map(d => ({
          id: d.id,
          subject: d.subject,
          board: d.board,
          examDate: d.exam_date,
          createdAt: new Date(d.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          plan: d.plan_data,
        }))
        localSet(KEYS.plans, mapped)
        return mapped
      }
    } catch (e) { console.warn('Plans load failed:', e.message) }
  }

  return localGet(KEYS.plans)
}

// ── NOTES HISTORY ─────────────────────────────────────────────────────────────

export async function saveNotesSession(notes, subject, board, topic, subtopic) {
  const record = {
    id: Date.now(),
    subject,
    board,
    topic,
    subtopic,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    summary: notes.summary || '',
  }

  const local = localGet(KEYS.notes)
  // Don't duplicate same topic+subtopic — update instead
  const existing = local.findIndex(n => n.topic === topic && n.subtopic === subtopic && n.subject === subject)
  let updated
  if (existing >= 0) {
    updated = local.map((n, i) => i === existing ? record : n)
  } else {
    updated = [record, ...local].slice(0, 50)
  }
  localSet(KEYS.notes, updated)

  const user = await getUser()
  if (user && !user.isGuest) {
    try {
      await supabase.from('notes_history').upsert({
        user_id: user.id,
        subject,
        board,
        topic,
        subtopic,
        summary: notes.summary || '',
        viewed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,subject,topic,subtopic' })
    } catch (e) { console.warn('Notes save failed:', e.message) }
  }
}

export async function loadNotesHistory() {
  const user = await getUser()

  if (user && !user.isGuest) {
    try {
      const { data, error } = await supabase
        .from('notes_history')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(50)

      if (!error && data?.length > 0) {
        const mapped = data.map(d => ({
          id: d.id || `${d.topic}-${d.subtopic}`,
          subject: d.subject,
          board: d.board,
          topic: d.topic,
          subtopic: d.subtopic,
          date: new Date(d.viewed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          summary: d.summary,
        }))
        localSet(KEYS.notes, mapped)
        return mapped
      }
    } catch (e) { console.warn('Notes history load failed:', e.message) }
  }

  return localGet(KEYS.notes)
}

// ── EXAM RESULTS ──────────────────────────────────────────────────────────────

export async function saveExamAttempt(result, subject, board) {
  const record = {
    id: Date.now(),
    subject,
    board,
    score: result.totalAwarded,
    outOf: result.totalAvailable,
    percentage: Math.round((result.totalAwarded / result.totalAvailable) * 100),
    grade: result.grade,
    weakTopics: result.weakTopics || [],
    strongTopics: result.strongTopics || [],
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  }

  const local = localGet(KEYS.examHistory)
  localSet(KEYS.examHistory, [record, ...local].slice(0, 100))

  const user = await getUser()
  if (user && !user.isGuest) {
    try {
      await supabase.from('exam_results').insert({
        user_id: user.id,
        subject,
        board,
        score: record.score,
        out_of: record.outOf,
        percentage: record.percentage,
        grade: record.grade,
        weak_topics: record.weakTopics,
        strong_topics: record.strongTopics,
        created_at: new Date().toISOString(),
      })
    } catch (e) { console.warn('Exam result save failed:', e.message) }
  }

  return record
}

export async function loadExamHistory() {
  const user = await getUser()

  if (user && !user.isGuest) {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100)

      if (!error && data?.length > 0) {
        const mapped = data.map(d => ({
          id: d.id,
          subject: d.subject,
          board: d.board,
          score: d.score,
          outOf: d.out_of,
          percentage: d.percentage,
          grade: d.grade,
          weakTopics: d.weak_topics || [],
          strongTopics: d.strong_topics || [],
          date: new Date(d.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        }))
        localSet(KEYS.examHistory, mapped)
        return mapped
      }
    } catch (e) { console.warn('Exam history load failed:', e.message) }
  }

  return localGet(KEYS.examHistory)
}
