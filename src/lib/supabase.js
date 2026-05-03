import { createClient } from '@supabase/supabase-js'

// ─── Setup ────────────────────────────────────────────────────────────────────
// Replace these with your actual Supabase project URL and anon key
// Get them from: https://app.supabase.com → your project → Settings → API
const SUPABASE_URL = 'https://enmnayqhaulkzzrommde.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubW5heXFoYXVsa3p6cm9tbWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3Mzc0MzgsImV4cCI6MjA5MzMxMzQzOH0.S67RpLQXqIlOndUURT_qU6TcDLmsASgozy_fc2V3i7c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })
  if (error) throw error
  // Create profile row
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      email,
      plan: 'free',
      streak: 0,
      created_at: new Date().toISOString(),
    })
  }
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  if (error) throw error
  return data
}

// ─── Exam history ─────────────────────────────────────────────────────────────

export async function saveExamResult(userId, result) {
  const { data, error } = await supabase
    .from('exam_results')
    .insert({
      user_id: userId,
      subject: result.subject,
      board: result.board,
      paper: result.paper || null,
      topic: result.topic || null,
      score: result.score,
      out_of: result.outOf,
      percentage: result.percentage,
      grade: result.grade,
      weak_topics: result.weakTopics || [],
      strong_topics: result.strongTopics || [],
      created_at: new Date().toISOString(),
    })
  if (error) throw error
  return data
}

export async function getExamHistory(userId, limit = 20) {
  const { data, error } = await supabase
    .from('exam_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return data
}

export async function getTopicPerformance(userId, subject) {
  const { data, error } = await supabase
    .from('exam_results')
    .select('weak_topics, strong_topics, percentage, created_at')
    .eq('user_id', userId)
    .eq('subject', subject)
    .order('created_at', { ascending: false })
  if (error) return []
  return data
}

// ─── Flashcard progress ───────────────────────────────────────────────────────

export async function saveFlashcardSession(userId, session) {
  const { data, error } = await supabase
    .from('flashcard_sessions')
    .insert({
      user_id: userId,
      subject: session.subject,
      topic: session.topic,
      total_cards: session.totalCards,
      got_it: session.gotIt,
      hard: session.hard,
      created_at: new Date().toISOString(),
    })
  if (error) throw error
  return data
}

// ─── Streak tracking ──────────────────────────────────────────────────────────

export async function updateStreak(userId) {
  const profile = await getProfile(userId)
  if (!profile) return 0

  const today = new Date().toDateString()
  const lastStudied = profile.last_studied ? new Date(profile.last_studied).toDateString() : null
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  let newStreak = profile.streak || 0

  if (lastStudied === today) {
    // Already studied today — no change
    return newStreak
  } else if (lastStudied === yesterday) {
    // Studied yesterday — increment streak
    newStreak += 1
  } else if (lastStudied !== today) {
    // Missed a day — reset streak
    newStreak = 1
  }

  await updateProfile(userId, {
    streak: newStreak,
    last_studied: new Date().toISOString(),
  })
  return newStreak
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export async function getUserPlan(userId) {
  const profile = await getProfile(userId)
  return profile?.plan || 'free'
}

// Free plan limits
export const FREE_LIMITS = {
  examsPerMonth: 3,
  flashcardsTotal: 30,
  practicals: false,
  commandWords: true,
  synoptic: false,
  pastPapers: true,
  practicePapers: 1,
  planner: false,
}

export const PRO_LIMITS = {
  examsPerMonth: Infinity,
  flashcardsTotal: Infinity,
  practicals: true,
  commandWords: true,
  synoptic: true,
  pastPapers: true,
  practicePapers: Infinity,
  planner: true,
}

export async function checkLimit(userId, feature) {
  const plan = await getUserPlan(userId)
  if (plan === 'pro') return { allowed: true, plan }

  // For free users, check usage this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  if (feature === 'exam') {
    const { count } = await supabase
      .from('exam_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())

    return {
      allowed: count < FREE_LIMITS.examsPerMonth,
      used: count,
      limit: FREE_LIMITS.examsPerMonth,
      plan: 'free',
    }
  }

  return { allowed: FREE_LIMITS[feature] !== false, plan: 'free' }
}
