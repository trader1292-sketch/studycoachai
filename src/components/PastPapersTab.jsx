import React, { useState } from 'react'
import { callClaude, parseJSON } from '../lib/claude.js'
import { FORMULA_SHEETS } from '../lib/curriculum.js'

// ── Official past paper links ─────────────────────────────────────────────────
const PAST_PAPERS = {
  'GCSE Physics': {
    AQA: [
      { year: 2023, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/', topics: 'Energy, Electricity, Particles, Atomic Structure' },
      { year: 2023, paper: 'Paper 2', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/', topics: 'Forces, Waves, Magnetism, Space' },
      { year: 2022, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/', topics: 'Energy, Electricity, Particles, Atomic Structure' },
      { year: 2022, paper: 'Paper 2', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/', topics: 'Forces, Waves, Magnetism, Space' },
      { year: 2019, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/', topics: 'Energy, Electricity, Particles, Atomic Structure' },
      { year: 2019, paper: 'Paper 2', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/', topics: 'Forces, Waves, Magnetism, Space' },
      { year: 2018, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/', topics: 'Energy, Electricity, Particles, Atomic Structure' },
      { year: 2018, paper: 'Paper 2', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/', topics: 'Forces, Waves, Magnetism, Space' },
    ],
    Edexcel: [
      { year: 2023, paper: 'Paper 1', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/', topics: 'Key concepts, Motion and forces, Conservation of energy' },
      { year: 2023, paper: 'Paper 2', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/', topics: 'Waves, Light, Electricity, Magnetism' },
      { year: 2022, paper: 'Paper 1', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/', topics: 'Key concepts, Motion and forces, Conservation of energy' },
      { year: 2022, paper: 'Paper 2', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/', topics: 'Waves, Light, Electricity, Magnetism' },
      { year: 2019, paper: 'Paper 1', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/', topics: 'Key concepts, Motion and forces' },
    ],
    OCR: [
      { year: 2023, paper: 'Paper 1 (Gateway)', qp: 'https://www.ocr.org.uk/administration/stage-5-certification/past-papers/', ms: 'https://www.ocr.org.uk/administration/stage-5-certification/past-papers/', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-ocr/', topics: 'Matter, Forces, Electricity, Magnetism' },
      { year: 2023, paper: 'Paper 2 (Gateway)', qp: 'https://www.ocr.org.uk/administration/stage-5-certification/past-papers/', ms: 'https://www.ocr.org.uk/administration/stage-5-certification/past-papers/', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-ocr/', topics: 'Waves, Radiation, Space, Energy' },
      { year: 2022, paper: 'Paper 1 (Gateway)', qp: 'https://www.ocr.org.uk/administration/stage-5-certification/past-papers/', ms: 'https://www.ocr.org.uk/administration/stage-5-certification/past-papers/', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-ocr/', topics: 'Matter, Forces, Electricity, Magnetism' },
    ],
  },
  'GCSE Chemistry': {
    AQA: [
      { year: 2023, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/', topics: 'Atomic Structure, Bonding, Quantitative, Chemical Changes, Energy' },
      { year: 2023, paper: 'Paper 2', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/', topics: 'Rates, Equilibrium, Organic, Analysis, Atmosphere' },
      { year: 2022, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/', topics: 'Atomic Structure, Bonding, Quantitative, Chemical Changes, Energy' },
      { year: 2022, paper: 'Paper 2', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/', topics: 'Rates, Equilibrium, Organic, Analysis, Atmosphere' },
      { year: 2019, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/', topics: 'Atomic Structure, Bonding, Quantitative, Chemical Changes, Energy' },
      { year: 2019, paper: 'Paper 2', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/', topics: 'Rates, Equilibrium, Organic, Analysis, Atmosphere' },
      { year: 2018, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/', topics: 'Atomic Structure, Bonding, Quantitative, Chemical Changes, Energy' },
    ],
    Edexcel: [
      { year: 2023, paper: 'Paper 1', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-edexcel/', topics: 'Atomic Structure, Periodic Table, Ionic Bonding, Covalent Bonding' },
      { year: 2023, paper: 'Paper 2', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-edexcel/', topics: 'Rates, Equilibrium, Organic, Quantitative' },
    ],
  },
  'GCSE Biology': {
    AQA: [
      { year: 2023, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/', topics: 'Cell Biology, Organisation, Infection & Response, Bioenergetics' },
      { year: 2023, paper: 'Paper 2', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/', topics: 'Homeostasis, Inheritance, Variation, Ecology' },
      { year: 2022, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/', topics: 'Cell Biology, Organisation, Infection & Response, Bioenergetics' },
      { year: 2022, paper: 'Paper 2', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/', topics: 'Homeostasis, Inheritance, Variation, Ecology' },
      { year: 2019, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/', topics: 'Cell Biology, Organisation, Infection & Response, Bioenergetics' },
      { year: 2019, paper: 'Paper 2', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/', topics: 'Homeostasis, Inheritance, Variation, Ecology' },
      { year: 2018, paper: 'Paper 1', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/', topics: 'Cell Biology, Organisation, Infection & Response, Bioenergetics' },
    ],
  },
  'GCSE Maths': {
    AQA: [
      { year: 2023, paper: 'Paper 1 (Non-calc)', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Number, Algebra, Geometry' },
      { year: 2023, paper: 'Paper 2 (Calculator)', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Statistics, Probability, Geometry, Algebra' },
      { year: 2023, paper: 'Paper 3 (Calculator)', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Mixed — all topics' },
      { year: 2022, paper: 'Paper 1 (Non-calc)', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Number, Algebra, Geometry' },
      { year: 2022, paper: 'Paper 2 (Calculator)', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Statistics, Probability, Geometry' },
      { year: 2022, paper: 'Paper 3 (Calculator)', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Mixed — all topics' },
      { year: 2019, paper: 'Paper 1 (Non-calc)', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Number, Algebra, Geometry' },
      { year: 2019, paper: 'Paper 2 (Calculator)', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Statistics, Probability, Algebra' },
      { year: 2018, paper: 'Paper 1 (Non-calc)', qp: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', ms: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Number, Algebra, Geometry' },
    ],
    Edexcel: [
      { year: 2023, paper: 'Paper 1 (Non-calc)', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Number, Algebra, Geometry' },
      { year: 2023, paper: 'Paper 2 (Calculator)', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Statistics, Probability, Geometry' },
      { year: 2023, paper: 'Paper 3 (Calculator)', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Mixed — all topics' },
      { year: 2022, paper: 'Paper 1 (Non-calc)', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Number, Algebra, Geometry' },
      { year: 2022, paper: 'Paper 2 (Calculator)', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Statistics, Probability' },
      { year: 2019, paper: 'Paper 1 (Non-calc)', qp: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', ms: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html', topics: 'Number, Algebra, Geometry' },
    ],
  },
}

// Paper 1 topic maps for practice paper generation
const PAPER_TOPICS = {
  'GCSE Physics': {
    'Paper 1': 'Energy stores and transfers, specific heat capacity, specific latent heat, electricity (circuits, V=IR, power), particle model (density, gas pressure), atomic structure (nuclear radiation, half-life, fission)',
    'Paper 2': 'Forces and motion (Newton\'s laws, momentum, stopping distances), waves (EM spectrum, sound, light), magnetism and electromagnetism (motor effect, transformers), space physics',
  },
  'GCSE Chemistry': {
    'Paper 1': 'Atomic structure and periodic table, bonding and structure, quantitative chemistry (moles, yield), chemical changes (reactivity, electrolysis, acids), energy changes',
    'Paper 2': 'Rates of reaction, equilibrium (Le Chatelier), organic chemistry (alkanes, alkenes, polymers), analysis (flame tests, ion tests, chromatography), atmosphere and resources',
  },
  'GCSE Biology': {
    'Paper 1': 'Cell biology (microscopy, osmosis, mitosis), organisation (digestive system, enzymes, heart, lungs), infection and response (pathogens, immune system, vaccines), bioenergetics (photosynthesis, respiration)',
    'Paper 2': 'Homeostasis (nervous system, hormones, kidneys, blood glucose), inheritance (DNA, meiosis, genetic crosses, mutations), evolution and classification, ecology (ecosystems, biodiversity, human impact)',
  },
  'GCSE Maths': {
    'Paper 1 (Non-calc)': 'Number (fractions, surds, standard form, HCF/LCM), algebra (equations, sequences, inequalities, simultaneous equations), geometry (angles, area, volume, transformations)',
    'Paper 2 (Calculator)': 'Statistics (histograms, box plots, cumulative frequency), probability (tree diagrams, Venn diagrams), trigonometry (SOHCAHTOA, sine rule, cosine rule), graphs (quadratic, real-life)',
    'Paper 3 (Calculator)': 'Mixed paper covering all topics — heavy problem solving, ratio, proportion, vectors, functions',
  },
}

export default function PastPapersTab({ subject }) {
  const [activeSection, setActiveSection] = useState('official') // 'official' | 'practice'
  const [selectedBoard, setSelectedBoard] = useState('AQA')
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [practiceBoard, setPracticeBoard] = useState('AQA')
  const [practicePaperType, setPracticePaperType] = useState('Paper 1')
  const [practiceTier, setPracticeTier] = useState('Higher')
  const [loading, setLoading] = useState(false)
  const [practiceExam, setPracticeExam] = useState(null)
  const [answers, setAnswers] = useState({})
  const [marking, setMarking] = useState(false)
  const [markingResults, setMarkingResults] = useState(null)
  const [answerMode, setAnswerMode] = useState('print')
  const [error, setError] = useState('')

  const subjectKey = subject || 'GCSE Physics'
  const papersForBoard = (PAST_PAPERS[subjectKey] || {})[selectedBoard] || []
  const paperTypes = Object.keys(PAPER_TOPICS[subjectKey] || { 'Paper 1': '', 'Paper 2': '' })
  const formulasAll = FORMULA_SHEETS[subjectKey] || {}

  // ── Generate AI practice paper ────────────────────────────────────────────
  const generatePracticePaper = async () => {
    setLoading(true)
    setError('')
    setPracticeExam(null)
    setAnswers({})
    setMarkingResults(null)

    const topicsForPaper = (PAPER_TOPICS[subjectKey] || {})[practicePaperType] || 'all topics'
    const allFormulas = Object.values(formulasAll).flat()
    const formulaList = allFormulas.length ? allFormulas.slice(0, 10).map(f => `${f.formula} (${f.desc})`).join(', ') : ''

    const prompt = `You are a senior examiner at ${practiceBoard} creating a realistic GCSE ${subjectKey} practice paper.

This is a PRACTICE PAPER modelled EXACTLY on real ${practiceBoard} ${subjectKey} ${practicePaperType} papers.
Tier: ${practiceTier}
Topics for this paper: ${topicsForPaper}
${formulaList ? `Key formulas for this paper: ${formulaList}` : ''}

CRITICAL — make this paper as close to a real ${practiceBoard} exam as possible:
- Match the EXACT question style, command words and mark allocation of real ${practiceBoard} papers
- Include a mix: multiple choice (1 mark), short answer (2-3 marks), calculations (3-4 marks), extended response (5-6 marks)
- Total paper should be 60-70 marks (matching real ${practiceBoard} papers)
- Include at least 1 required practical question
- Include at least 1 synoptic question linking two topics
- Include at least 1 six-mark extended response question
- End with the hardest questions (as real papers do)
- Questions should increase in difficulty through the paper

Return ONLY valid JSON:
{
  "paperTitle": "${practiceBoard} ${subjectKey} ${practicePaperType} — Practice Paper",
  "totalMarks": 70,
  "timeAllowed": "1 hour 45 minutes",
  "sections": [
    {
      "section": "Section A — Multiple Choice",
      "questions": [
        {
          "id": 1,
          "question": "question text",
          "marks": 1,
          "topic": "topic name",
          "subtopic": "specific content",
          "type": "multiple choice",
          "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
          "formulaGiven": "",
          "diagramDescription": "",
          "modelAnswer": "B — explanation of why",
          "examTip": "tip"
        }
      ]
    },
    {
      "section": "Section B — Short Answer Questions",
      "questions": []
    },
    {
      "section": "Section C — Extended Response",
      "questions": []
    }
  ]
}`

    try {
      const raw = await callClaude(prompt, '', 5000)
      setPracticeExam(parseJSON(raw))
    } catch (e) {
      setError('Failed to generate practice paper. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // ── Mark practice paper ───────────────────────────────────────────────────
  const markPaper = async () => {
    if (!practiceExam) return
    setMarking(true)
    setMarkingResults(null)

    const allQuestions = practiceExam.sections?.flatMap(s => s.questions) || []
    const totalMarks = allQuestions.reduce((s, q) => s + (q.marks || 0), 0)

    const prompt = `You are marking a GCSE ${subjectKey} (${practiceBoard}) practice paper.

${allQuestions.map(q => `Q${q.id} [${q.marks} marks] — ${q.question}
Model answer: ${q.modelAnswer}
Student answer: ${answers[q.id] || '(no answer)'}`).join('\n\n')}

Return ONLY valid JSON:
{
  "totalAwarded": 45,
  "totalAvailable": ${totalMarks},
  "percentage": 64,
  "grade": "6",
  "summary": "warm 2-3 sentence overall summary",
  "sectionPerformance": [
    { "section": "Section A", "awarded": 5, "available": 10, "comment": "brief comment" }
  ],
  "questions": [
    { "id": 1, "awarded": 1, "available": 1, "feedback": "correct/what was missing", "examTip": "tip" }
  ],
  "weakTopics": ["topic1"],
  "strongTopics": ["topic2"],
  "gradeToReach": "7",
  "adviceToReach": "specific advice to go from current grade to next"
}`

    try {
      const raw = await callClaude(prompt, '', 3000)
      setMarkingResults(parseJSON(raw))
    } catch (e) {
      setError('Marking failed. Please try again.')
    } finally {
      setMarking(false)
    }
  }

  // ── Print practice paper ──────────────────────────────────────────────────
  const printPaper = () => {
    if (!practiceExam) return
    const allQ = practiceExam.sections?.flatMap(s => s.questions) || []
    const w = window.open('', '_blank')
    w.document.write(`<!DOCTYPE html><html><head>
    <title>${practiceExam.paperTitle}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Georgia,serif;font-size:14px;color:#000;padding:40px;max-width:740px;margin:0 auto}
      h1{font-size:20px;margin-bottom:4px}
      .meta{font-size:13px;color:#555;margin-bottom:4px}
      .box{border:1.5px solid #000;padding:12px 16px;margin:14px 0;font-size:13px;line-height:1.7}
      .section-head{font-size:15px;font-weight:bold;margin:20px 0 10px;border-bottom:1px solid #000;padding-bottom:4px}
      .q{margin-bottom:22px;page-break-inside:avoid}
      .qrow{display:flex;justify-content:space-between;margin-bottom:4px}
      .qnum{font-weight:bold}
      .sub{font-size:11px;color:#777;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}
      .qtext{font-size:14px;line-height:1.7;margin-bottom:8px}
      .formula-box{border:1px solid #ccc;padding:3px 10px;display:inline-block;background:#f0f4ff;font-size:13px;margin-bottom:6px;border-radius:3px}
      .opts{margin:6px 0 6px 14px}
      .opt{margin:3px 0;font-size:13px}
      .line{border-bottom:1px solid #aaa;margin:6px 0;height:20px}
      .diag{border:1px solid #ccc;padding:8px 12px;background:#f9f9f9;margin:8px 0;border-radius:3px}
      .diag-label{font-size:10px;text-transform:uppercase;letter-spacing:.04em;font-weight:bold;color:#666;margin-bottom:4px}
      .draw-box{border:1px dashed #bbb;height:100px;margin-top:6px;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:11px}
      .footer{margin-top:30px;font-size:11px;color:#aaa;text-align:center;border-top:1px solid #eee;padding-top:10px}
      @media print{body{padding:20px}}
    </style>
    </head><body>
    <h1>${practiceExam.paperTitle}</h1>
    <div class="meta">Time allowed: ${practiceExam.timeAllowed} &nbsp;·&nbsp; Total marks: ${practiceExam.totalMarks} &nbsp;·&nbsp; ${practiceTier} Tier</div>
    <div class="box">
      <strong>Instructions to candidates</strong><br>
      • Answer ALL questions. Write your answers in the spaces provided.<br>
      • Show ALL working for calculation questions — method marks are available.<br>
      • The number of marks is shown in brackets at the end of each question.<br>
      • Use a black or blue pen. Pencil may be used for diagrams only.<br>
      • A calculator ${practicePaperType.includes('Non') ? 'may <strong>NOT</strong> be used' : 'may be used'} in this paper.
    </div>
    ${practiceExam.sections?.map(section => `
      <div class="section-head">${section.section}</div>
      ${section.questions?.map(q => {
        const lines = q.marks > 5 ? 10 : q.marks > 3 ? 7 : q.marks > 1 ? 4 : 2
        return `<div class="q">
          <div class="qrow"><span class="qnum">Question ${q.id}</span><span>[${q.marks} mark${q.marks > 1 ? 's' : ''}]</span></div>
          <div class="sub">${q.subtopic || q.topic}</div>
          ${q.formulaGiven ? `<div class="formula-box">You may use: ${q.formulaGiven}</div><br>` : ''}
          ${q.diagramDescription ? `<div class="diag"><div class="diag-label">Diagram</div>${q.diagramDescription}<div class="draw-box">Sketch here</div></div>` : ''}
          <div class="qtext">${q.question}</div>
          ${q.options?.length ? `<div class="opts">${q.options.map(o => `<div class="opt">☐ ${o}</div>`).join('')}</div>` : Array(lines).fill('<div class="line"></div>').join('')}
        </div>`
      }).join('')}
    `).join('')}
    <div class="footer">— End of paper — &nbsp;|&nbsp; ${practiceExam.paperTitle} &nbsp;|&nbsp; Generated by StudyCoach AI<br>Closely modelled on ${practiceBoard} ${subjectKey} papers. Visit physicsandmathstutor.com or mathsgenie.co.uk for official past papers.</div>
    </body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 400)
  }

  const allQuestions = practiceExam?.sections?.flatMap(s => s.questions) || []
  const pct = markingResults ? Math.round((markingResults.totalAwarded / markingResults.totalAvailable) * 100) : 0
  const barColor = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)'

  return (
    <div>
      {/* Section tabs */}
      <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 12, padding: 4, gap: 4, marginBottom: 20, maxWidth: 500 }}>
        {[
          { key: 'official', label: '📄 Official Past Papers' },
          { key: 'practice', label: '🤖 AI Practice Papers' },
        ].map(opt => (
          <button key={opt.key} onClick={() => setActiveSection(opt.key)} style={{
            flex: 1, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
            background: activeSection === opt.key ? 'white' : 'transparent',
            color: activeSection === opt.key ? 'var(--navy)' : 'var(--gray-500)',
            boxShadow: activeSection === opt.key ? '0 1px 4px rgba(0,0,0,0.12)' : 'none'
          }}>{opt.label}</button>
        ))}
      </div>

      {/* ══ OFFICIAL PAST PAPERS ════════════════════════════════════════════ */}
      {activeSection === 'official' && (
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {['AQA', 'Edexcel', 'OCR', 'WJEC'].map(b => (
              <span key={b} className={`pill ${selectedBoard === b ? 'active' : ''}`}
                onClick={() => setSelectedBoard(b)}>{b}</span>
            ))}
          </div>

          {papersForBoard.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)', marginBottom: 8 }}>
                No papers listed for {selectedBoard} {subjectKey}
              </div>
              <div style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 20, lineHeight: 1.6 }}>
                Use the direct links below to find all past papers on the official board websites.
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="https://www.aqa.org.uk/find-past-papers-and-mark-schemes" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: 13 }}>AQA past papers →</a>
                <a href="https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: 13 }}>Edexcel past papers →</a>
                <a href="https://www.ocr.org.uk/administration/stage-5-certification/past-papers/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: 13 }}>OCR past papers →</a>
              </div>
            </div>
          ) : (
            <div>
              {/* Quick access links */}
              <div className="card" style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--navy)', marginBottom: 2 }}>Quick access — {selectedBoard} official sites</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Direct links to download question papers and mark schemes</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <a href={papersForBoard[0]?.qp} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: 13, padding: '8px 14px' }}>
                    {selectedBoard} official site →
                  </a>
                  <a href={papersForBoard[0]?.pmt} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }}>
                    Physics & Maths Tutor →
                  </a>
                </div>
              </div>

              {/* Paper grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {papersForBoard.map((p, i) => (
                  <div key={i} className="card" style={{
                    borderColor: selectedPaper === i ? '#185FA5' : undefined,
                    borderWidth: selectedPaper === i ? 1.5 : 1,
                    cursor: 'pointer', transition: 'all 0.15s'
                  }} onClick={() => setSelectedPaper(selectedPaper === i ? null : i)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)', marginBottom: 2 }}>
                          {p.year} — {p.paper}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{selectedBoard} · {subjectKey}</div>
                      </div>
                      <span className="tag tag-navy" style={{ fontSize: 11 }}>{p.year}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 12, lineHeight: 1.5 }}>
                      <strong>Topics:</strong> {p.topics}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <a href={p.qp} target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'white', background: 'var(--navy)', padding: '7px 10px', borderRadius: 8, fontWeight: 500 }}
                        onClick={e => e.stopPropagation()}>
                        Question Paper →
                      </a>
                      <a href={p.ms} target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#065f46', background: 'var(--green-light)', padding: '7px 10px', borderRadius: 8, fontWeight: 500, border: '1px solid #6ee7b7' }}
                        onClick={e => e.stopPropagation()}>
                        Mark Scheme →
                      </a>
                      <a href={p.pmt} target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#92400e', background: 'var(--amber-light)', padding: '7px 10px', borderRadius: 8, fontWeight: 500, border: '1px solid #fcd34d' }}
                        onClick={e => e.stopPropagation()}>
                        PMT notes →
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional resources */}
              <div className="card" style={{ marginTop: 16, background: 'var(--blue-light)', border: '1px solid var(--blue-mid)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 8 }}>📚 Best sites for {subjectKey} past papers</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[
                    { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com' },
                    { name: 'Maths Genie', url: 'https://www.mathsgenie.co.uk/gcse.html' },
                    { name: 'Save My Exams', url: 'https://www.savemyexams.com' },
                    { name: 'Corbettmaths', url: 'https://corbettmaths.com' },
                    { name: 'Biology Corner', url: 'https://www.biologycorner.com' },
                  ].map(r => (
                    <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 13, color: '#1e40af', background: 'white', padding: '5px 12px', borderRadius: 8, border: '1px solid var(--blue-mid)', fontWeight: 500 }}>
                      {r.name} →
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ AI PRACTICE PAPERS ══════════════════════════════════════════════ */}
      {activeSection === 'practice' && (
        <div>
          {!practiceExam && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,320px) minmax(0,1fr)', gap: 20 }}>
              {/* Settings */}
              <div className="card">
                <h2 style={{ fontSize: 17, fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 6 }}>
                  AI Practice Paper
                </h2>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16, lineHeight: 1.5 }}>
                  Generates a full exam paper closely modelled on real {subjectKey} papers — same question types, same mark allocation, same structure.
                </p>

                <label className="label">Exam board</label>
                <select className="select-field" value={practiceBoard} onChange={e => setPracticeBoard(e.target.value)} style={{ marginBottom: 14 }}>
                  <option>AQA</option><option>Edexcel</option><option>OCR</option><option>WJEC</option>
                </select>

                <label className="label">Paper</label>
                <select className="select-field" value={practicePaperType} onChange={e => setPracticePaperType(e.target.value)} style={{ marginBottom: 14 }}>
                  {paperTypes.map(p => <option key={p}>{p}</option>)}
                </select>

                <label className="label">Tier</label>
                <select className="select-field" value={practiceTier} onChange={e => setPracticeTier(e.target.value)} style={{ marginBottom: 18 }}>
                  <option>Foundation</option><option>Higher</option>
                </select>

                {/* Topics covered */}
                <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '10px 12px', marginBottom: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#1e40af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Topics covered</div>
                  <div style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>
                    {(PAPER_TOPICS[subjectKey] || {})[practicePaperType] || 'All topics'}
                  </div>
                </div>

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 14 }}
                  onClick={generatePracticePaper} disabled={loading}>
                  {loading ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Generating full paper...</> : '⚡ Generate practice paper'}
                </button>
                {error && <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--red-light)', borderRadius: 8, fontSize: 13, color: 'var(--red)' }}>{error}</div>}
              </div>

              {/* Info panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="card">
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 10 }}>What makes these practice papers realistic?</div>
                  {[
                    { icon: '📊', title: 'Matched mark allocation', desc: 'Same mix of 1-mark, 3-mark, 6-mark questions as real papers' },
                    { icon: '📋', title: 'Correct question structure', desc: 'Includes required practical questions, calculations, extended response' },
                    { icon: '🔗', title: 'Synoptic questions included', desc: 'At least one question linking two topics — just like real papers' },
                    { icon: '📐', title: 'Formula sheet provided', desc: 'Printed at the top of the paper exactly as in real exams' },
                    { icon: '⬆️', title: 'Increasing difficulty', desc: 'Questions get harder through the paper, matching real exam structure' },
                    { icon: '✅', title: 'Full AI marking', desc: 'Answer online and get detailed feedback on every question' },
                  ].map(f => (
                    <div key={f.title} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                      <div style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)', marginBottom: 2 }}>{f.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ background: 'var(--amber-light)', border: '1px solid #fcd34d' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>⚠️ Important note</div>
                  <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
                    These are AI-generated practice papers, not official papers. Always also practise on real past papers from the official board site. Both types of practice are important.
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
              <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)' }}>Generating your practice paper...</div>
              <div style={{ fontSize: 14, color: 'var(--gray-400)' }}>This takes 20-30 seconds — building a full paper</div>
            </div>
          )}

          {practiceExam && !loading && (
            <div className="fade-in">
              {/* Paper header */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)', marginBottom: 6 }}>
                      {practiceExam.paperTitle}
                    </h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="tag tag-navy">{practiceExam.totalMarks} marks</span>
                      <span className="tag tag-blue">{practiceExam.timeAllowed}</span>
                      <span className="tag tag-amber">{practiceTier} tier</span>
                      <span className="tag tag-green">AI Practice Paper</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={printPaper}>🖨️ Print paper</button>
                    <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={() => { setPracticeExam(null); setAnswers({}); setMarkingResults(null) }}>← New paper</button>
                  </div>
                </div>

                {/* Answer mode toggle */}
                <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 10, padding: 4, gap: 4 }}>
                  {[{ key: 'print', label: '📄 Print version' }, { key: 'online', label: '✏️ Answer online & mark' }].map(opt => (
                    <button key={opt.key} onClick={() => { setAnswerMode(opt.key); setMarkingResults(null) }} style={{
                      flex: 1, padding: '9px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                      background: answerMode === opt.key ? 'white' : 'transparent',
                      color: answerMode === opt.key ? 'var(--navy)' : 'var(--gray-500)',
                      boxShadow: answerMode === opt.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
                    }}>{opt.label}</button>
                  ))}
                </div>
              </div>

              {/* Sections */}
              {practiceExam.sections?.map(section => (
                <div key={section.section}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)', padding: '12px 0 8px', borderBottom: '2px solid var(--navy)', marginBottom: 14 }}>
                    {section.section}
                  </div>

                  {section.questions?.map(q => {
                    const result = markingResults?.questions?.find(r => r.id === q.id)
                    return (
                      <div key={q.id} className="card" style={{
                        marginBottom: 12,
                        borderColor: result ? result.awarded === result.available ? '#6ee7b7' : result.awarded > 0 ? '#fcd34d' : '#fca5a5' : undefined,
                        borderWidth: result ? 1.5 : 1
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ background: 'var(--navy)', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{q.id}</span>
                              <span className="tag tag-blue" style={{ fontSize: 11 }}>{q.subtopic || q.topic}</span>
                              <span className="tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)', fontSize: 11 }}>{q.type}</span>
                            </div>
                            {q.formulaGiven && (
                              <div style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)', borderRadius: 6, padding: '4px 10px', fontSize: 13, color: '#1e40af', marginBottom: 8, display: 'inline-block' }}>
                                You may use: <strong>{q.formulaGiven}</strong>
                              </div>
                            )}
                            {q.diagramDescription && (
                              <div style={{ background: 'var(--gray-50)', border: '1.5px solid var(--gray-200)', borderRadius: 8, padding: '10px 14px', marginBottom: 10 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 5 }}>📐 Diagram</div>
                                <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: 8 }}>{q.diagramDescription}</div>
                                <div style={{ border: '1px dashed var(--gray-300)', borderRadius: 6, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)', fontSize: 12 }}>Sketch here</div>
                              </div>
                            )}
                            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.7 }}>{q.question}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                            <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', whiteSpace: 'nowrap' }}>
                              [{q.marks} {q.marks === 1 ? 'mark' : 'marks'}]
                            </div>
                            {result && (
                              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', color: result.awarded === result.available ? 'var(--green)' : result.awarded > 0 ? 'var(--amber)' : 'var(--red)' }}>
                                {result.awarded}/{result.available}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Multiple choice options */}
                        {q.options?.length > 0 && answerMode === 'online' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                            {q.options.map((opt, oi) => (
                              <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', background: answers[q.id] === opt ? 'var(--blue-light)' : 'var(--gray-50)', border: `1px solid ${answers[q.id] === opt ? 'var(--blue-mid)' : 'var(--gray-200)'}`, fontSize: 14, color: 'var(--gray-800)' }}>
                                <input type="radio" name={`q${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))} style={{ flexShrink: 0 }} />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}

                        {/* Print options */}
                        {q.options?.length > 0 && answerMode === 'print' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                            {q.options.map((opt, oi) => (
                              <div key={oi} style={{ fontSize: 14, color: 'var(--gray-700)', padding: '3px 0' }}>☐ {opt}</div>
                            ))}
                          </div>
                        )}

                        {/* Written answer */}
                        {!q.options?.length && answerMode === 'online' && (
                          <textarea className="textarea-field" placeholder={`Answer Q${q.id}...`}
                            value={answers[q.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            style={{ minHeight: q.marks > 4 ? 120 : q.marks > 2 ? 80 : 50, marginBottom: 10 }} />
                        )}

                        {!q.options?.length && answerMode === 'print' && (
                          <div style={{ border: '1.5px dashed var(--gray-300)', borderRadius: 8, padding: 12, minHeight: q.marks > 4 ? 100 : 55, background: 'var(--gray-50)', marginBottom: 10, fontSize: 13, color: 'var(--gray-400)' }}>
                            Write answer here...
                          </div>
                        )}

                        {/* Marking result */}
                        {result && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                            <div style={{
                              background: result.awarded === result.available ? 'var(--green-light)' : result.awarded > 0 ? 'var(--amber-light)' : 'var(--red-light)',
                              borderRadius: 8, padding: '8px 12px', fontSize: 13, lineHeight: 1.6,
                              color: result.awarded === result.available ? '#065f46' : result.awarded > 0 ? '#92400e' : '#991b1b'
                            }}>{result.feedback}</div>
                            {result.examTip && (
                              <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '7px 12px', fontSize: 13, color: '#1e40af' }}>
                                💡 {result.examTip}
                              </div>
                            )}
                          </div>
                        )}

                        <details style={{ fontSize: 13 }}>
                          <summary style={{ cursor: 'pointer', color: 'var(--blue)', fontWeight: 500, userSelect: 'none' }}>Show model answer</summary>
                          <div style={{ marginTop: 10, background: 'var(--green-light)', borderRadius: 8, padding: '8px 12px', color: '#065f46', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            <strong>Model answer:</strong>{'\n'}{q.modelAnswer}
                          </div>
                        </details>
                      </div>
                    )
                  })}
                </div>
              ))}

              {/* Submit for marking */}
              {answerMode === 'online' && !markingResults && (
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, marginTop: 8 }}
                  onClick={markPaper} disabled={marking}>
                  {marking ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Marking your full paper...</> : '✓ Submit paper for AI marking'}
                </button>
              )}

              {/* Results */}
              {markingResults && (
                <div className="card fade-in" style={{ marginTop: 12, background: 'var(--navy)', border: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'white', lineHeight: 1 }}>{markingResults.totalAwarded}/{markingResults.totalAvailable}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{pct}% · {practiceExam.paperTitle}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'var(--gold)', lineHeight: 1 }}>{markingResults.grade}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Grade</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 999, height: 8, marginBottom: 14, overflow: 'hidden' }}>
                    <div style={{ height: 8, borderRadius: 999, background: barColor, width: `${pct}%`, transition: 'width 1s ease' }} />
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 14 }}>{markingResults.summary}</p>

                  {/* Section performance */}
                  {markingResults.sectionPerformance?.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Performance by section</div>
                      {markingResults.sectionPerformance.map((s, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: i < markingResults.sectionPerformance.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{s.section}</div>
                          <div style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500 }}>{s.awarded}/{s.available}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Advice to next grade */}
                  {markingResults.adviceToReach && (
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)', marginBottom: 6 }}>To reach Grade {markingResults.gradeToReach}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{markingResults.adviceToReach}</div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn-gold" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
                      onClick={() => { setPracticeExam(null); setAnswers({}); setMarkingResults(null) }}>
                      Generate new paper →
                    </button>
                    <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                      onClick={() => { setActiveSection('official') }}>
                      See official past papers →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
