import React, { useState } from 'react'

const subjects = [
  'GCSE Physics', 'GCSE Chemistry', 'GCSE Biology',
  'GCSE Maths', 'GCSE English Literature', 'GCSE English Language',
  'GCSE History', 'GCSE Geography', 'GCSE Combined Science',
]

const features = [
  { icon: '⚡', title: 'AI exam generator', desc: 'Realistic exam papers by subject, topic and exam board. AQA, Edexcel, OCR and WJEC — all covered. Mark-scheme quality questions.' },
  { icon: '📸', title: 'Camera marking', desc: 'Photograph your handwritten answers. AI reads your writing and marks only the questions you actually answered.' },
  { icon: '📖', title: 'AI revision notes', desc: 'Full topic notes written by AI, aligned to your exact exam board specification — every key fact, formula and definition.' },
  { icon: '🔬', title: 'Required practicals', desc: 'Every required practical covered with method, exam tips and Grade 9 points. These appear in every paper.' },
  { icon: '📝', title: 'Command word trainer', desc: 'Master Explain, Evaluate, Justify and more. AI marks whether you used the command word correctly.' },
  { icon: '🔗', title: 'Synoptic & 6-mark trainer', desc: 'The hardest questions on any paper. Learn the structure, practise with AI questions, get level-of-response marking.' },
  { icon: '🃏', title: 'Smart flashcards', desc: 'Spaced repetition built in. Hard cards come back sooner. Topics you know get retired.' },
  { icon: '📄', title: 'Past papers 2021–2024', desc: 'Official past papers and mark schemes for all major boards and subjects. Answer online or print.' },
  { icon: '🗓️', title: 'Personalised revision planner', desc: 'Enter your exam date and weak topics. AI builds a day-by-day plan with specific tasks and resources.' },
]

const stats = [
  { val: '1M+', label: 'GCSE students in UK each year' },
  { val: 'AQA · Edexcel · OCR · WJEC', label: 'All major exam boards' },
  { val: '9 subjects', label: 'Science, Maths, English, Humanities' },
  { val: 'Free', label: 'To get started — no card needed' },
]

const faq = [
  { q: 'Is it free?', a: 'Yes — the free plan gives you 3 AI exams per month, 30 flashcards, command word training and past paper links. Pro (£4.99/month) gives unlimited access to everything.' },
  { q: 'Which exam boards do you cover?', a: 'AQA, Edexcel, OCR and WJEC for all subjects. Content follows your chosen board\'s specification and mark scheme style.' },
  { q: 'How accurate is the AI marking?', a: 'Very good for factual and calculation questions. For 6-mark extended responses it uses level-of-response marking which reliably identifies the grade level. We always recommend checking model answers for borderline cases.' },
  { q: 'Are the revision notes official?', a: 'No. Our notes are written by AI based on published exam board specifications. They are not produced by AQA, Edexcel, OCR or WJEC. We recommend also using official board resources.' },
  { q: 'Can I use it on my phone?', a: 'Yes. The web app works on any mobile browser. A dedicated iOS and Android app is in development.' },
  { q: 'Is my data safe?', a: 'Yes. All data is stored securely. We do not share or sell any student data. Students under 13 require parental consent.' },
]

export default function Landing({ onEnter }) {
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [page, setPage] = useState('home')

  const Logo = ({ light = false }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setPage('home')}>
      <div style={{ width: 34, height: 34, background: light ? 'rgba(255,255,255,0.15)' : 'var(--navy)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: light ? 'white' : 'var(--navy)', lineHeight: 1.1 }}>Study & Exam Coach</div>
        <div style={{ fontSize: 10, color: light ? 'rgba(255,255,255,0.6)' : 'var(--gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI-Powered GCSE Revision</div>
      </div>
    </div>
  )

  const Nav = () => (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', borderBottom: '1px solid var(--gray-200)', position: 'sticky', top: 0, background: 'white', zIndex: 100 }}>
      <Logo />
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <button onClick={() => setPage('about')} style={{ fontSize: 14, color: page === 'about' ? 'var(--navy)' : 'var(--gray-500)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: page === 'about' ? 500 : 400 }}>About</button>
        <button onClick={() => setPage('contact')} style={{ fontSize: 14, color: page === 'contact' ? 'var(--navy)' : 'var(--gray-500)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: page === 'contact' ? 500 : 400 }}>Contact</button>
        <button className="btn-primary" style={{ padding: '8px 18px', fontSize: 14 }} onClick={onEnter}>Start free →</button>
      </div>
    </nav>
  )

  const Footer = () => (
    <footer style={{ background: 'var(--navy)', padding: '48px 32px 28px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 36 }}>
          <div>
            <Logo light />
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginTop: 10 }}>
              AI-powered GCSE revision.<br />Built for UK students.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Features</div>
            {['Generate exams', 'Mark my work', 'Revision notes', 'Flashcards', 'Past papers', 'Revision planner'].map(l => (
              <div key={l} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', padding: '3px 0', cursor: 'pointer' }} onClick={onEnter}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Company</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', padding: '3px 0', cursor: 'pointer' }} onClick={() => setPage('about')}>About us</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', padding: '3px 0', cursor: 'pointer' }} onClick={() => setPage('contact')}>Contact us</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', padding: '3px 0', cursor: 'pointer' }} onClick={() => setPage('about')}>FAQ</div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Subjects</div>
            {['Physics', 'Chemistry', 'Biology', 'Maths', 'English', 'History', 'Geography'].map(s => (
              <div key={s} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', padding: '2px 0' }}>GCSE {s}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>© 2026 Study & Exam Coach. Built for GCSE students in the UK.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  )

  // ── ABOUT PAGE ──────────────────────────────────────────────────────────────
  if (page === 'about') return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <Nav />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,5vw,44px)', color: 'var(--navy)', marginBottom: 12 }}>About Study & Exam Coach</h1>
          <p style={{ fontSize: 16, color: 'var(--gray-500)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            We built this because every student deserves great revision tools — not just those whose families can afford private tutors.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 16, padding: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)', marginBottom: 10 }}>What Study & Exam Coach is</h2>
          <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.8, marginBottom: 10 }}>
            Study & Exam Coach is an AI-powered revision platform built specifically for GCSE students in the UK. It covers all major exam boards — AQA, Edexcel, OCR and WJEC — across nine subjects including Physics, Chemistry, Biology, Combined Science, Maths, English Language, English Literature, History and Geography.
          </p>
          <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.8 }}>
            The app generates realistic exam papers, marks handwritten work from photos, creates revision notes aligned to your specific exam board, and tracks your progress over time. It helps students understand what they got wrong, why, and exactly what to revise next.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 16, padding: 28, background: 'var(--blue-light)', border: '1px solid var(--blue-mid)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)', marginBottom: 10 }}>What we are honest about</h2>
          <p style={{ fontSize: 14, color: '#1e40af', lineHeight: 1.8, marginBottom: 8 }}>
            <strong>AI marking is very good but not perfect.</strong> For borderline marks on 6-mark questions, we always recommend checking the model answer yourself.
          </p>
          <p style={{ fontSize: 14, color: '#1e40af', lineHeight: 1.8, marginBottom: 8 }}>
            <strong>AI notes are comprehensive but not official.</strong> Our revision notes are based on published exam board specifications but are not produced by or affiliated with AQA, Edexcel, OCR or WJEC. Use official board resources alongside ours.
          </p>
          <p style={{ fontSize: 14, color: '#1e40af', lineHeight: 1.8 }}>
            <strong>We are a revision tool, not a tutoring service.</strong> We cannot replace a great teacher. We help you practise more efficiently and identify gaps in your knowledge.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 32, padding: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)', marginBottom: 16 }}>What you can actually do</h2>
          {[
            { icon: '⚡', t: 'Generate exam papers', d: 'By subject, topic, exam board and tier. Questions modelled on real GCSE papers using AI trained on published mark schemes.' },
            { icon: '📸', t: 'Get handwritten work marked', d: 'Take a photo of your written answers. AI reads the handwriting and marks only the questions you actually answered.' },
            { icon: '📖', t: 'Read AI revision notes', d: 'Full topic notes for every subject, aligned to your exam board specification. Key facts, formulas, definitions and exam tips.' },
            { icon: '🔬', t: 'Practise required practicals', d: 'Every required practical with method, equipment, Grade 9 points and practice questions. These appear in every paper.' },
            { icon: '📝', t: 'Master command words', d: 'Subject-specific practice with AI marking on whether you used each command word correctly.' },
            { icon: '📄', t: 'Access past papers 2021–2024', d: 'Direct links to official papers and mark schemes. Answer online in the app or print and mark with AI.' },
            { icon: '🗓️', t: 'Get a personalised revision plan', d: 'Based on your exam date, subject, board and weak topics. Includes daily sessions with specific tasks.' },
          ].map(f => (
            <div key={f.t} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 2 }}>{f.t}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6 }}>{f.d}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--navy)', marginBottom: 16 }}>Frequently Asked Questions</h2>
        {faq.map((item, i) => (
          <div key={i} style={{ marginBottom: 10, padding: '16px 20px', background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 5 }}>Q: {item.q}</div>
            <div style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>{item.a}</div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn-primary" style={{ padding: '13px 28px', fontSize: 15 }} onClick={onEnter}>Start using Study & Exam Coach free →</button>
        </div>
      </div>
      <Footer />
    </div>
  )

  // ── CONTACT PAGE ────────────────────────────────────────────────────────────
  if (page === 'contact') {
    const [formName, setFormName] = useState('')
    const [formEmail, setFormEmail] = useState('')
    const [formType, setFormType] = useState('general')
    const [formMsg, setFormMsg] = useState('')
    const [formSent, setFormSent] = useState(false)
    const [formSending, setFormSending] = useState(false)

    const sendForm = () => {
      if (!formName || !formEmail || !formMsg) return
      setFormSending(true)
      // Opens default mail client with pre-filled message
      const to = formType === 'schools' ? 'schools@studyexamcoach.co.uk' : formType === 'bug' ? 'support@studyexamcoach.co.uk' : 'hello@studyexamcoach.co.uk'
      const subject = encodeURIComponent(`[${formType === 'schools' ? 'School enquiry' : formType === 'bug' ? 'Bug report' : 'General enquiry'}] from ${formName}`)
      const body = encodeURIComponent(`Name: ${formName}\nEmail: ${formEmail}\n\nMessage:\n${formMsg}`)
      window.open(`mailto:${to}?subject=${subject}&body=${body}`)
      setFormSent(true)
      setFormSending(false)
    }

    return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <Nav />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,5vw,42px)', color: 'var(--navy)', marginBottom: 12 }}>Contact us</h1>
          <p style={{ fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.7 }}>
            We're a small team and we read every message. Whether you've found a bug, have a suggestion, or want to discuss a school partnership — we'd love to hear from you.
          </p>
        </div>

        {/* Email contacts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {[
            { icon: '📧', title: 'General enquiries', desc: 'Questions, feedback or suggestions', email: 'hello@studyexamcoach.co.uk' },
            { icon: '🏫', title: 'Schools & partnerships', desc: 'School licences, bulk access, teacher dashboard', email: 'schools@studyexamcoach.co.uk' },
            { icon: '🐛', title: 'Report a bug', desc: 'Found something not working?', email: 'support@studyexamcoach.co.uk' },
          ].map(c => (
            <div key={c.title} className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px' }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 5 }}>{c.desc}</div>
                <a href={`mailto:${c.email}`} style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 500 }}>{c.email}</a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="card" style={{ padding: 28, border: '2px solid var(--gray-200)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)', marginBottom: 4 }}>
            Send us a message
          </h2>
          <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 20 }}>
            Fill in the form below and we'll reply within 2 working days.
          </p>

          {formSent ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)', marginBottom: 8 }}>Message prepared!</div>
              <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 }}>
                Your email app should have opened with the message pre-filled. Just hit Send. If it didn't open, email us directly at <a href="mailto:hello@studyexamcoach.co.uk" style={{ color: 'var(--blue)' }}>hello@studyexamcoach.co.uk</a>
              </p>
              <button className="btn-secondary" style={{ marginTop: 16, fontSize: 13 }} onClick={() => setFormSent(false)}>Send another message</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">Your name *</label>
                  <input className="input-field" type="text" placeholder="Jamie Smith"
                    value={formName} onChange={e => setFormName(e.target.value)} />
                </div>
                <div>
                  <label className="label">Email address *</label>
                  <input className="input-field" type="email" placeholder="jamie@email.com"
                    value={formEmail} onChange={e => setFormEmail(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="label">What's this about?</label>
                <select className="select-field" value={formType} onChange={e => setFormType(e.target.value)}>
                  <option value="general">General enquiry</option>
                  <option value="schools">School or teacher enquiry</option>
                  <option value="bug">Report a bug</option>
                  <option value="feedback">Product feedback</option>
                  <option value="other">Something else</option>
                </select>
              </div>

              <div>
                <label className="label">Your message *</label>
                <textarea className="textarea-field"
                  placeholder="Tell us what's on your mind..."
                  value={formMsg} onChange={e => setFormMsg(e.target.value)}
                  style={{ minHeight: 120 }} />
              </div>

              <button className="btn-primary"
                style={{ justifyContent: 'center', padding: '12px', fontSize: 14 }}
                onClick={sendForm}
                disabled={!formName || !formEmail || !formMsg || formSending}>
                {formSending ? 'Opening email...' : 'Send message →'}
              </button>

              <p style={{ fontSize: 12, color: 'var(--gray-400)', textAlign: 'center', lineHeight: 1.5 }}>
                This opens your email app with the message pre-filled so you can send it directly.
                We never store your personal data from this form.
              </p>
            </div>
          )}
        </div>

        <div style={{ background: 'var(--amber-light)', borderRadius: 10, padding: '12px 16px', marginTop: 16, fontSize: 13, color: '#92400e', lineHeight: 1.7 }}>
          <strong>Please note:</strong> We cannot provide individual academic tutoring. For subject help, please use BBC Bitesize, Physics & Maths Tutor, or your teacher.
        </div>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-secondary" onClick={() => setPage('home')} style={{ fontSize: 14 }}>← Back to home</button>
        </div>
      </div>
      <Footer />
    </div>
  )}

  // ── HOME PAGE ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <Nav />

      {/* Hero */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'var(--gold-light)', color: '#92400e', padding: '4px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, marginBottom: 24 }}>
          Free for all GCSE students · No credit card needed
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,6vw,64px)', color: 'var(--navy)', lineHeight: 1.1, marginBottom: 20 }}>
          Your AI-powered personal<br />
          <span style={{ fontStyle: 'italic', color: 'var(--blue)' }}>Study & Exam Coach</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--gray-500)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Generate GCSE exams, get handwritten work marked instantly,
          read AI revision notes and follow a personalised plan —
          all in one place, built for UK students.
        </p>
        <div style={{ display: 'flex', gap: 12, maxWidth: 340, margin: '0 auto 16px', justifyContent: 'center' }}>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px 20px', fontSize: 15 }} onClick={onEnter}>
            Start for free →
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>No account needed to start. Save your progress by signing up free.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 28 }}>
          {subjects.map(s => (
            <span key={s} style={{ padding: '4px 12px', borderRadius: 999, background: 'var(--gray-100)', fontSize: 12, color: 'var(--gray-600)', border: '1px solid var(--gray-200)' }}>{s}</span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div style={{ background: 'var(--navy)', padding: '22px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
          {stats.map(s => (
            <div key={s.val} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '68px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,38px)', textAlign: 'center', color: 'var(--navy)', marginBottom: 10 }}>Everything you need to go from a Grade 4 to a Grade 9</h2>
        <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginBottom: 44, fontSize: 15 }}>No tutors. No expensive revision guides. Just AI working 24/7 for you.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
          {features.map((f, i) => (
            <div key={f.title} className="card" style={{ transition: 'var(--transition)', transform: hoveredFeature === i ? 'translateY(-3px)' : 'none', boxShadow: hoveredFeature === i ? 'var(--shadow-md)' : 'none', borderColor: hoveredFeature === i ? 'var(--blue-mid)' : 'var(--gray-200)' }}
              onMouseEnter={() => setHoveredFeature(i)} onMouseLeave={() => setHoveredFeature(null)}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', marginBottom: 5 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--gray-50)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,34px)', color: 'var(--navy)', marginBottom: 10 }}>How it works</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: 36, fontSize: 14 }}>The only revision app that closes the full loop</p>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { n: '1', t: 'Pick subject & topic', c: '#EBF1FF', tc: '#1e40af' },
              { n: '2', t: 'Read AI notes', c: '#EBF1FF', tc: '#1e40af' },
              { n: '3', t: 'Generate exam', c: '#EBF1FF', tc: '#1e40af' },
              { n: '4', t: 'Photo your answers', c: '#EBF1FF', tc: '#1e40af' },
              { n: '5', t: 'AI marks it', c: '#EBF1FF', tc: '#1e40af' },
              { n: '6', t: 'Revise & retry', c: 'var(--green-light)', tc: '#065f46' },
            ].map((s, i, arr) => (
              <React.Fragment key={s.n}>
                <div style={{ textAlign: 'center', padding: '10px 12px', background: s.c, borderRadius: 8, minWidth: 90, margin: 4 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: s.tc, fontFamily: 'var(--font-display)' }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: s.tc, marginTop: 1, fontWeight: 500 }}>{s.t}</div>
                </div>
                {i < arr.length - 1 && <div style={{ color: 'var(--gray-300)', fontSize: 14, margin: '0 2px', flexShrink: 0 }}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,32px)', color: 'var(--navy)', marginBottom: 20, textAlign: 'center' }}>Common questions</h2>
        {faq.slice(0, 4).map((item, i) => (
          <div key={i} style={{ marginBottom: 10, padding: '14px 18px', background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>Q: {item.q}</div>
            <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.7 }}>{item.a}</div>
          </div>
        ))}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setPage('about')}>See all FAQs →</button>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--navy)', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,40px)', color: 'white', marginBottom: 14 }}>Ready to start revising properly?</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 28 }}>Free to start. No credit card. Takes 30 seconds.</p>
        <button className="btn-gold" style={{ fontSize: 16, padding: '14px 36px' }} onClick={onEnter}>Start for free →</button>
      </section>

      <Footer />
    </div>
  )
}
