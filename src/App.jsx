import React, { useState, useEffect } from 'react'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AuthPage from './pages/AuthPage.jsx'
import SubscriptionPage from './pages/SubscriptionPage.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import ParentDashboard from './pages/ParentDashboard.jsx'
import { supabase, getProfile, updateStreak } from './lib/supabase.js'

export default function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user)
        setPage('dashboard')
      } else if (event === 'SIGNED_OUT') {
        setUser(null); setProfile(null); setPage('landing')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) { await loadUserData(session.user); setPage('dashboard') }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const loadUserData = async (authUser) => {
    setUser(authUser)
    const prof = await getProfile(authUser.id)
    setProfile(prof)
    if (prof) {
      const newStreak = await updateStreak(authUser.id)
      setProfile(prev => ({ ...prev, streak: newStreak }))
    }
  }

  const handleAuthSuccess = async (authUser) => {
    if (!authUser) {
      setUser({ name: 'Student', isGuest: true })
      setProfile({ plan: 'free', streak: 0 })
      setPage('dashboard')
      return
    }
    await loadUserData(authUser)
    setPage('dashboard')
  }

  const handleSignOut = async () => {
    try { await supabase.auth.signOut() } catch (e) {}
    setUser(null); setProfile(null); setPage('landing')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '3px solid var(--gray-200)', borderTopColor: 'var(--navy)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
          <div style={{ fontSize: 14, color: 'var(--gray-400)' }}>Loading Study & Exam Coach...</div>
        </div>
      </div>
    )
  }

  if (page === 'auth') return <AuthPage onSuccess={handleAuthSuccess} />
  if (page === 'subscription') return <SubscriptionPage user={user} currentPlan={profile?.plan || 'free'} onBack={() => setPage('dashboard')} onUpgrade={() => { setProfile(prev => ({ ...prev, plan: 'pro' })); setPage('dashboard') }} />
  if (page === 'teacher') return <TeacherDashboard user={user} onBack={() => setPage('dashboard')} />
  if (page === 'parent') return <ParentDashboard user={user} onBack={() => setPage('dashboard')} />
  if (page === 'dashboard') return <Dashboard user={user} profile={profile} onBack={() => setPage('landing')} onSignOut={handleSignOut} onShowSubscription={() => setPage('subscription')} onTeacherDashboard={() => setPage('teacher')} onParentDashboard={() => setPage('parent')} />
  return <Landing onEnter={() => setPage('auth')} />
}

