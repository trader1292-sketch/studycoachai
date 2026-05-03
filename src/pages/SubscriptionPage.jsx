import React, { useState } from 'react'

const PRO_FEATURES = [
  { text: 'Unlimited AI exam generation — any subject, any topic', highlight: true },
  { text: 'Unlimited flashcards saved to your account', highlight: true },
  { text: 'Camera marking — photograph handwritten answers', highlight: true },
  { text: 'AI Revision Notes for every topic and board', highlight: true },
  { text: 'Required Practicals module — all subjects', highlight: true },
  { text: 'Command Word trainer with AI marking', highlight: false },
  { text: 'Synoptic & 6-Mark structure trainer', highlight: false },
  { text: 'AI Practice Papers — 3 per subject/paper + generate more', highlight: false },
  { text: 'Revision Planner saved to your account', highlight: false },
  { text: 'Progress tracking — every exam, note and session saved', highlight: false },
  { text: 'Past paper links 2021–2024 all boards', highlight: false },
  { text: 'All 9 subjects — Science, Maths, English, History, Geography', highlight: false },
  { text: 'All 4 exam boards — AQA, Edexcel, OCR, WJEC', highlight: false },
  { text: 'Timed exam mode (coming soon)', highlight: false },
  { text: 'Parent progress dashboard (coming soon)', highlight: false },
]

const FREE_FEATURES = [
  { text: '3 AI exams per month', included: true },
  { text: '30 flashcards total', included: true },
  { text: 'Command Word trainer', included: true },
  { text: 'Official past paper links', included: true },
  { text: 'Basic AI marking (typed answers only)', included: true },
  { text: 'Camera marking', included: false },
  { text: 'AI Revision Notes', included: false },
  { text: 'Required Practicals', included: false },
  { text: 'Progress tracking & account sync', included: false },
  { text: 'Revision Planner', included: false },
  { text: 'AI Practice Papers', included: false },
]

const FAQ = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your account settings at any time. You keep access until the end of your annual period. No questions asked.' },
  { q: 'Is the 50% off permanent?', a: 'No — this is an introductory offer for early supporters, valid until 30 September 2026. After that, the price will return to £199/year. If you subscribe before then, you lock in the £59.99 rate.' },
  { q: 'What subjects and boards are included?', a: 'All 9 GCSE subjects: Physics, Chemistry, Biology, Combined Science, Maths, English Language, English Literature, History and Geography. All 4 boards: AQA, Edexcel, OCR and WJEC.' },
  { q: 'Is my progress saved across devices?', a: 'Yes. Once you create an account, all your exam results, flashcard sessions, revision notes history and planner are saved to your account and available on any device.' },
  { q: 'Is the AI marking accurate?', a: 'For factual questions and calculations it is very accurate. For 6-mark extended responses it uses level-of-response marking which reliably identifies the grade level. We always recommend checking model answers yourself for borderline marks.' },
  { q: 'Are the AI revision notes official?', a: 'No. They are written by AI based on published exam board specifications and are not produced by AQA, Edexcel, OCR or WJEC. They are designed to be accurate and comprehensive, but we recommend using official board resources alongside them.' },
  { q: 'Can schools buy access for students?', a: 'Yes — school licences are available at £3–5 per pupil per year. Contact us at schools@studyexamcoach.co.uk for a quote.' },
]

export default function SubscriptionPage({ user, currentPlan, onBack, onUpgrade }) {
  const [upgrading, setUpgrading] = useState(false)

  const fullPrice = 199
  const salePrice = 59.99
  const saving = fullPrice - salePrice
  const savingPct = Math.round((saving / fullPrice) * 100)
  const offerDeadline = '30 September 2026'

  const handleUpgrade = () => {
    setUpgrading(true)
    // Stripe integration goes here
    setTimeout(() => {
      alert('Payment coming soon — Stripe integration in progress. Your account will be upgraded automatically once payment is set up.')
      setUpgrading(false)
    }, 800)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--gray-500)', padding: '4px 0' }}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: 'var(--navy)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--navy)' }}>Study & Exam Coach — Plans</span>
        </div>
        {currentPlan === 'pro' && (
          <span style={{ marginLeft: 'auto', background: 'var(--green-light)', color: '#065f46', fontSize: 12, fontWeight: 600, padding: '3px 12px', borderRadius: 999, border: '1px solid #6ee7b7' }}>
            ✓ You're on Pro
          </span>
        )}
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          {/* Offer badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FEF3C7', border: '1.5px solid #FCD34D', borderRadius: 999, padding: '6px 18px', marginBottom: 20 }}>
            <span style={{ fontSize: 16 }}>🎉</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#92400E' }}>
              Introductory offer — {savingPct}% off until {offerDeadline}
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,5vw,48px)', color: 'var(--navy)', marginBottom: 12, lineHeight: 1.1 }}>
            Unlock everything for<br />your GCSE revision
          </h1>
          <p style={{ fontSize: 16, color: 'var(--gray-500)', maxWidth: 500, margin: '0 auto' }}>
            One annual plan. Every subject, every board, unlimited practice.
            Used by students across the UK to go from Grade 4 to Grade 9.
          </p>
        </div>

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 56 }}>

          {/* Free */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Free</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'var(--navy)', lineHeight: 1 }}>£0</div>
              <div style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 4 }}>Forever free — no card needed</div>
            </div>
            <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 20, marginBottom: 24 }}>
              {FREE_FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', fontSize: 13, color: f.included ? 'var(--gray-700)' : 'var(--gray-300)' }}>
                  <span style={{ fontSize: 15, flexShrink: 0, color: f.included ? '#065f46' : 'var(--gray-300)' }}>{f.included ? '✓' : '–'}</span>
                  {f.text}
                </div>
              ))}
            </div>
            {currentPlan === 'free' ? (
              <div style={{ textAlign: 'center', padding: '10px', background: 'var(--gray-100)', borderRadius: 8, fontSize: 14, color: 'var(--gray-500)', fontWeight: 500 }}>
                Your current plan
              </div>
            ) : (
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onBack}>
                Continue with free
              </button>
            )}
          </div>

          {/* Pro Annual */}
          <div className="card" style={{ padding: 28, borderColor: 'var(--navy)', borderWidth: 2, position: 'relative', overflow: 'hidden' }}>
            {/* Ribbon */}
            <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--gold)', color: 'white', fontSize: 11, fontWeight: 700, padding: '5px 16px', borderBottomLeftRadius: 10, letterSpacing: '0.05em' }}>
              {savingPct}% OFF
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Pro — Annual</div>

              {/* Price with strikethrough */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 4 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, color: 'var(--navy)', lineHeight: 1 }}>£{salePrice}</div>
                <div style={{ paddingBottom: 6 }}>
                  <div style={{ fontSize: 13, color: 'var(--gray-400)', textDecoration: 'line-through' }}>£{fullPrice}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>per year</div>
                </div>
              </div>

              {/* Equivalent monthly */}
              <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 6 }}>
                = <strong style={{ color: 'var(--navy)' }}>£{(salePrice / 12).toFixed(2)}/month</strong> — less than a coffee
              </div>

              {/* Offer deadline */}
              <div style={{ background: '#FEF3C7', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#92400E', fontWeight: 500, display: 'inline-block' }}>
                ⏳ Offer ends {offerDeadline}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 20, marginBottom: 24 }}>
              {PRO_FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '5px 0', fontSize: 13, color: f.highlight ? 'var(--navy)' : 'var(--gray-700)', fontWeight: f.highlight ? 500 : 400 }}>
                  <span style={{ fontSize: 15, flexShrink: 0, color: f.text.includes('coming soon') ? 'var(--gray-300)' : '#065f46', marginTop: 1 }}>
                    {f.text.includes('coming soon') ? '○' : '✓'}
                  </span>
                  {f.text}
                </div>
              ))}
            </div>

            {currentPlan === 'pro' ? (
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--green-light)', borderRadius: 8, fontSize: 14, color: '#065f46', fontWeight: 500 }}>
                ✓ You're on Pro — thank you!
              </div>
            ) : (
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
                onClick={handleUpgrade} disabled={upgrading}>
                {upgrading
                  ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Processing...</>
                  : `Get Pro — £${salePrice}/year`}
              </button>
            )}

            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)', marginTop: 10 }}>
              Cancel anytime · Secure payment via Stripe
            </p>
          </div>

          {/* School */}
          <div className="card" style={{ padding: 28, background: 'var(--navy)', border: 'none' }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>School Licence</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: 'var(--gold)', lineHeight: 1 }}>£3–5</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>per pupil per year</div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, marginBottom: 24 }}>
              {['Everything in Pro for all students', 'Teacher dashboard & class analytics', 'Parent progress visibility', 'Set and track class assignments', 'GDPR compliant student data', 'Bulk student import', 'Dedicated school support', 'Ofsted-ready reporting'].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '5px 0', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                  <span style={{ flexShrink: 0, color: 'var(--gold)' }}>✓</span>{f}
                </div>
              ))}
            </div>
            <a href="mailto:schools@studyexamcoach.co.uk?subject=School licence enquiry"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '13px', background: 'var(--gold)', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Contact us for a quote →
            </a>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>
              schools@studyexamcoach.co.uk
            </p>
          </div>
        </div>

        {/* Saving callout */}
        <div style={{ background: 'white', borderRadius: 16, padding: '24px 32px', marginBottom: 48, border: '2px solid var(--gold)', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💰</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)', marginBottom: 8 }}>
            You save £{saving.toFixed(2)} with the introductory offer
          </div>
          <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.7 }}>
            Compare to a private tutor at £40–80 per hour — a full year of Study & Exam Coach costs less than a single session.
            <br />Price rises to £{fullPrice}/year after {offerDeadline}. Lock in your rate by subscribing now.
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--navy)', marginBottom: 20, textAlign: 'center' }}>Common questions</h2>
          {FAQ.map((item, i) => (
            <div key={i} style={{ marginBottom: 10, padding: '16px 20px', background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>{item.q}</div>
              <div style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>{item.a}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          {currentPlan !== 'pro' && (
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: 16, marginBottom: 10 }} onClick={handleUpgrade}>
              Get Pro for £{salePrice}/year →
            </button>
          )}
          <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>
            Questions? Email us at <a href="mailto:hello@studyexamcoach.co.uk" style={{ color: 'var(--blue)' }}>hello@studyexamcoach.co.uk</a>
          </p>
        </div>
      </div>
    </div>
  )
}
