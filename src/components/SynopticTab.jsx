import React, { useState } from 'react'
import { callClaude, parseJSON } from '../lib/claude.js'

// ── Six-mark structures by subject ──────────────────────────────────────────
const SIX_MARK_STRUCTURES = {
  Physics: {
    types: [
      {
        name: 'Describe and Explain a Process',
        structure: [
          'What happens first (with specific detail)',
          'Why it happens (scientific reason)',
          'What happens next as a result',
          'Why that happens',
          'Overall conclusion or summary',
          'Link to equation or quantitative point if possible',
        ],
        example: 'Describe and explain what happens to the resistance of a filament bulb as it heats up.',
        modelAnswer: `As the filament bulb is switched on, the current causes the filament to heat up.
As temperature increases, the metal ions in the tungsten filament vibrate with greater amplitude.
This means electrons moving through the filament collide more frequently with the vibrating ions.
Each collision transfers energy from the electrons to the ions, reducing the electrons' kinetic energy.
This increased resistance to electron flow means resistance increases with temperature.
Therefore the I-V graph for a filament bulb is curved — not a straight line — showing resistance is not constant.`,
        commonErrors: [
          'Saying "resistance increases because it gets hotter" — this describes, it doesn\'t explain',
          'Forgetting to mention ion vibration — this is the key science',
          'Not linking back to the I-V graph or Ohm\'s law',
          'Writing in bullet points — extended response needs prose',
        ],
      },
      {
        name: 'Compare Two Things',
        structure: [
          'State what A does / is',
          'State what B does / is',
          'Link with "whereas", "however", "in contrast"',
          'Give the scientific reason for the difference',
          'Give a second comparison point',
          'Overall conclusion: which is better/more efficient and why',
        ],
        example: 'Compare the energy efficiency of an LED bulb and a filament bulb.',
        modelAnswer: `Both an LED bulb and a filament bulb convert electrical energy to light energy, however they differ significantly in efficiency.
A filament bulb converts only around 5% of electrical energy to useful light energy, whereas an LED converts approximately 90%.
This is because a filament bulb works by heating a tungsten wire to extremely high temperatures, which wastes the majority of energy as thermal energy radiated in all directions.
In contrast, an LED produces light through electroluminescence — electrons recombine with holes in a semiconductor, emitting photons directly with very little heat produced.
Therefore an LED is significantly more efficient. For the same light output, an LED requires approximately 80% less electrical power than a filament bulb, making it far more cost-effective over its lifetime.`,
        commonErrors: [
          'Only describing one of the two — must compare BOTH',
          'Not using comparison language: "both", "whereas", "however", "in contrast"',
          'Not giving the scientific reason for the difference',
          'Finishing without a conclusion',
        ],
      },
      {
        name: 'Evaluate an Experiment',
        structure: [
          'State the method clearly (1-2 sentences)',
          'Identify 1-2 strengths with explanation',
          'Identify 1-2 limitations/sources of error',
          'Classify each error (random or systematic)',
          'Suggest a specific improvement for each limitation',
          'Overall conclusion: is the method valid/reliable?',
        ],
        example: 'Evaluate a student\'s method for measuring specific heat capacity of aluminium.',
        modelAnswer: `The student heated an aluminium block using an immersion heater and recorded the temperature rise over time, measuring current and voltage to calculate energy input using E = VIt, then finding c using E = mcΔT.
A strength of this method is that measuring both current and voltage allows precise calculation of energy input, rather than assuming efficiency of the heater.
However, a significant limitation is heat loss to the surroundings — not all the electrical energy transfers to the aluminium block. This is a systematic error that causes the calculated value of c to always be higher than the accepted value of 900 J/kg°C.
This could be improved by wrapping the block in insulation (e.g. polystyrene) to minimise heat loss.
A second limitation is the thermometer position — if placed too close to the heater, the temperature reading will be higher than the average block temperature. Using multiple thermometers and averaging would improve this.
Overall, the method is valid but will give a value 10-30% higher than accepted, so improvements to insulation are essential for reliable results.`,
        commonErrors: [
          'Only listing limitations without explaining WHY they cause an error',
          'Not classifying errors as random or systematic',
          'Vague improvements: "be more careful" — must be specific',
          'No overall conclusion',
        ],
      },
    ],
  },
  Chemistry: {
    types: [
      {
        name: 'Explain a Chemical Process',
        structure: [
          'State what is happening at the particle/ion level',
          'Explain the forces or bonds involved',
          'Describe what breaks/forms and why',
          'Link to energy change (exo/endothermic)',
          'Give the equation if relevant',
          'Explain the effect on observable properties',
        ],
        example: 'Explain why ionic compounds have high melting points.',
        modelAnswer: `Ionic compounds are made up of oppositely charged ions arranged in a giant ionic lattice structure, such as Na⁺ and Cl⁻ in sodium chloride.
These ions are held together by strong electrostatic forces of attraction acting in all directions throughout the lattice.
To melt an ionic compound, these electrostatic forces must be overcome so that the ions can move freely.
Because these forces are very strong — acting between many ions simultaneously across the entire lattice — a large amount of energy is required to break them.
This means a high temperature, and therefore high melting point, is needed.
For example, sodium chloride has a melting point of 801°C, compared to a simple covalent molecule like water (0°C) where only weak intermolecular forces need to be overcome.`,
        commonErrors: [
          'Saying "strong bonds" without specifying electrostatic forces of attraction',
          'Not mentioning the lattice structure',
          'Confusing ionic bonds with covalent bonds',
          'Not comparing to another type of bonding for context',
        ],
      },
      {
        name: 'Plan or Evaluate a Chemical Method',
        structure: [
          'State the aim clearly',
          'List key steps in logical order',
          'Identify control variables',
          'Identify and explain sources of error',
          'Suggest specific improvements',
          'Conclude whether results would be valid/reliable',
        ],
        example: 'Plan an investigation to find how concentration affects the rate of reaction between sodium thiosulfate and hydrochloric acid.',
        modelAnswer: `The aim is to investigate how concentration of sodium thiosulfate affects the rate of reaction with HCl, measured by the time for a cross to become invisible.
I would prepare five concentrations of sodium thiosulfate (0.2, 0.4, 0.6, 0.8, 1.0 mol/dm³) by diluting with distilled water, keeping the total volume constant at 50cm³.
A cross would be drawn on paper beneath a conical flask. A fixed volume of HCl (10cm³, 1.0 mol/dm³) would be added to each concentration in turn, and the time for the cross to disappear recorded.
Rate would be calculated as 1/time. Control variables include temperature, volume of HCl, and the same observer judging disappearance.
A limitation is that judging when the cross disappears is subjective — different observers may stop the timer at different points. Using a colorimeter to measure absorbance would give more objective, precise results.
Repeating each concentration three times and averaging would reduce the effect of random errors.`,
        commonErrors: [
          'Not controlling all variables',
          'Forgetting to calculate rate = 1/time',
          'Vague evaluation: "be more careful" instead of specific improvements',
          'Not explaining WHY each control variable matters',
        ],
      },
    ],
  },
  Biology: {
    types: [
      {
        name: 'Explain a Biological Process',
        structure: [
          'State the overall function/purpose',
          'Describe what happens step by step (use correct terminology)',
          'Explain why each step happens (mechanism)',
          'Link to adaptations where relevant',
          'Give a consequence or end result',
          'Link to wider body system if possible',
        ],
        example: 'Explain how the structure of an alveolus is adapted for efficient gas exchange.',
        modelAnswer: `Alveoli are tiny air sacs in the lungs responsible for gas exchange — transferring oxygen into the blood and removing carbon dioxide.
They have a very large surface area due to their small spherical shape and the large number present (approximately 700 million), maximising the rate of diffusion.
The walls of alveoli are only one cell thick (squamous epithelium), creating a very short diffusion distance so gases can diffuse rapidly down their concentration gradients.
A rich network of capillaries surrounds each alveolus, maintaining a steep concentration gradient — oxygen diffuses from high concentration in the alveolus to low concentration in the blood, while CO₂ moves in the opposite direction.
The capillaries have walls that are also just one cell thick, further reducing diffusion distance.
Ventilation (breathing) constantly replenishes the oxygen in alveoli and removes CO₂, maintaining steep concentration gradients. Together, these adaptations maximise the rate of gas exchange to meet the body's demands during exercise.`,
        commonErrors: [
          'Saying "thin walls" without stating HOW thin (one cell thick)',
          'Not explaining concentration gradient — just saying "high to low"',
          'Forgetting to mention how the gradient is maintained (ventilation/blood flow)',
          'Listing features without explaining HOW each one helps',
        ],
      },
      {
        name: 'Evaluate Evidence or Data',
        structure: [
          'Describe the overall trend in the data',
          'Quote specific data values to support your point',
          'Identify any anomalies',
          'Suggest a biological explanation for the trend',
          'Identify a limitation of the data/study',
          'Conclude with a justified overall statement',
        ],
        example: 'The table shows photosynthesis rate at different light intensities. Evaluate the data.',
        modelAnswer: `The data shows that as light intensity increases from 0 to 40 klux, the rate of photosynthesis increases proportionally, rising from 0 to 28 arbitrary units — a 100% increase for each doubling of light intensity.
This suggests that light intensity is the limiting factor in this range, as there is sufficient CO₂ and the temperature is adequate for enzyme activity.
Above 40 klux, however, the rate plateaus at approximately 30 units despite further increases in light intensity to 80 klux. This indicates that another factor has become limiting — most likely CO₂ concentration or temperature.
An anomalous result appears at 60 klux (28 units), which is slightly below the expected plateau value; this may be due to experimental error such as variation in the number of bubbles counted.
A limitation of this data is that only one plant was used, so results may not be representative. Repeating with multiple plants of the same species would improve reliability.
Overall, the data supports the concept of limiting factors in photosynthesis, though further investigation at constant CO₂ and temperature would be needed to confirm.`,
        commonErrors: [
          'Describing trends without quoting specific values',
          'Not identifying the anomaly',
          'Not suggesting what the limiting factor might be',
          'Concluding without justification',
        ],
      },
    ],
  },
  Maths: {
    types: [
      {
        name: 'Multi-step Problem Solving',
        structure: [
          'Identify what is being asked',
          'State which formula(s) or method you will use',
          'Show each step of working clearly',
          'State units at each stage',
          'Check your answer makes sense',
          'State the final answer clearly with units',
        ],
        example: 'A cone has radius 6cm and slant height 10cm. Find the total surface area.',
        modelAnswer: `I need to find the total surface area = curved surface area + base area.
Curved surface area = πrl where r = 6cm, l = 10cm
CSA = π × 6 × 10 = 60π cm²

For the base: area = πr² = π × 6² = 36π cm²

Total surface area = 60π + 36π = 96π cm² = 301.6 cm² (to 1 d.p.)

Check: the base alone would be about 113cm², so 301.6cm² for the total seems reasonable.`,
        commonErrors: [
          'Forgetting to add the base area',
          'Using diameter instead of radius',
          'Not showing the formula before substituting',
          'Forgetting units in the final answer',
        ],
      },
    ],
  },
}

// ── Synoptic topic links ──────────────────────────────────────────────────────
const SYNOPTIC_LINKS = {
  Physics: [
    { topics: ['Waves', 'Atomic Structure'], theme: 'Electromagnetic radiation and nuclear physics', description: 'How EM waves are produced by atomic transitions, radioactive decay and nuclear reactions' },
    { topics: ['Electricity', 'Magnetism & Electromagnetism'], theme: 'Generators and motors', description: 'How electromagnetic induction links electricity generation with magnetic fields' },
    { topics: ['Forces & Motion', 'Energy'], theme: 'Work done and energy transfer', description: 'How forces do work and transfer between energy stores' },
    { topics: ['Waves', 'Electricity'], theme: 'Medical technology', description: 'X-rays, ultrasound, MRI — linking waves with electrical equipment' },
    { topics: ['Particle Model', 'Energy', 'Atomic Structure'], theme: 'Nuclear power', description: 'Fission releases energy stored in nuclear bonds, heats water, drives turbines' },
    { topics: ['Space Physics', 'Waves', 'Atomic Structure'], theme: 'Stellar physics', description: 'Stars emit EM radiation, nuclear fusion, red-shift as evidence for Big Bang' },
  ],
  Chemistry: [
    { topics: ['Atomic Structure', 'Bonding & Structure'], theme: 'Properties from structure', description: 'How atomic structure determines bonding type which determines properties' },
    { topics: ['Quantitative Chemistry', 'Rates of Reaction'], theme: 'Industrial chemistry', description: 'Yield, atom economy, rate — all factors in industrial chemical production' },
    { topics: ['Chemical Changes', 'Energy Changes'], theme: 'Electrochemistry', description: 'Electrolysis, fuel cells — linking redox chemistry with energy' },
    { topics: ['Organic Chemistry', 'Rates of Reaction'], theme: 'Polymerisation', description: 'Addition and condensation polymerisation — rate and mechanism' },
    { topics: ['Analysis & Atmosphere', 'Chemical Changes'], theme: 'Environmental chemistry', description: 'Testing for pollutants, carbon cycle, combustion products' },
  ],
  Biology: [
    { topics: ['Cell Biology', 'Organisation'], theme: 'Transport in organisms', description: 'Cell membrane, osmosis, diffusion — link to blood, xylem and phloem' },
    { topics: ['Bioenergetics', 'Organisation'], theme: 'Food and energy', description: 'Photosynthesis → glucose → respiration → energy for all life processes' },
    { topics: ['Homeostasis', 'Inheritance'], theme: 'Diabetes and genetics', description: 'Insulin regulation, Type 1 vs 2 diabetes, genetic inheritance patterns' },
    { topics: ['Infection & Response', 'Homeostasis'], theme: 'Immune system', description: 'How pathogens are detected, antibody production, vaccination' },
    { topics: ['Ecology', 'Bioenergetics'], theme: 'Carbon and energy cycles', description: 'Photosynthesis and respiration drive the carbon cycle and energy flow in ecosystems' },
    { topics: ['Evolution', 'Cell Biology'], theme: 'Antibiotic resistance', description: 'Natural selection operating at the cellular level — gene mutation and bacterial evolution' },
  ],
}

export default function SynopticTab({ subject, switchTab }) {
  const [localSubject, setLocalSubject] = useState(subject || 'GCSE Physics')
  const [activeSection, setActiveSection] = useState('sixmark')
  const [selectedStructure, setSelectedStructure] = useState(null)
  const [practiceMode, setPracticeMode] = useState(false)
  const [practiceQ, setPracticeQ] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedLink, setSelectedLink] = useState(null)
  const [synopticQ, setSynopticQ] = useState(null)
  const [synopticAnswer, setSynopticAnswer] = useState('')
  const [synopticFeedback, setSynopticFeedback] = useState(null)
  const [synopticLoading, setSynopticLoading] = useState(false)

  const subjectShort = localSubject.replace('GCSE ', '').replace(' (AQA)', '').replace(' (Edexcel)', '').split(' ')[0]
  const structures = (SIX_MARK_STRUCTURES[subjectShort] || SIX_MARK_STRUCTURES.Physics).types
  const synopticLinks = SYNOPTIC_LINKS[subjectShort] || SYNOPTIC_LINKS.Physics

  const ALL_SUBJECTS = [
    'GCSE Physics', 'GCSE Chemistry', 'GCSE Biology',
    'GCSE Maths', 'GCSE English Literature', 'GCSE English Language',
  ]

  // Generate a 6-mark practice question
  const generateSixMark = async (structure) => {
    setLoading(true)
    setPracticeQ(null)
    setAnswer('')
    setFeedback(null)

    const prompt = `Generate ONE 6-mark extended response question for GCSE ${subjectShort}.
Question type: ${structure.name}
Structure required: ${structure.structure.join(' → ')}

The question should:
- Be worth exactly 6 marks
- Require the student to write continuous prose (not bullet points)
- Be realistic for a ${subjectShort} GCSE Higher tier paper
- Require linking multiple concepts

Return ONLY valid JSON:
{
  "question": "full question text — include any context, data or scenario needed",
  "topic": "main topic area",
  "marks": 6,
  "levelDescriptors": {
    "level3": "5-6 marks: what a level 3 answer includes (detailed, coherent, all key points)",
    "level2": "3-4 marks: what a level 2 answer includes (some correct points, some gaps)",
    "level1": "1-2 marks: what a level 1 answer includes (basic points only)"
  },
  "markPoints": ["key mark point 1", "key mark point 2", "key mark point 3", "key mark point 4", "key mark point 5", "key mark point 6"],
  "modelAnswer": "a full 6-mark model answer written in continuous prose"
}`

    try {
      const raw = await callClaude(prompt, '', 1200)
      setPracticeQ(parseJSON(raw))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Mark a 6-mark answer
  const markSixMark = async () => {
    if (!practiceQ || !answer.trim()) return
    setLoading(true)
    setFeedback(null)

    const prompt = `You are a GCSE ${subjectShort} examiner marking a 6-mark extended response question.
This question uses a level-of-response marking scheme (not point-by-point).

Question: ${practiceQ.question}
Level descriptors:
- Level 3 (5-6): ${practiceQ.levelDescriptors?.level3}
- Level 2 (3-4): ${practiceQ.levelDescriptors?.level2}
- Level 1 (1-2): ${practiceQ.levelDescriptors?.level1}
Key mark points: ${practiceQ.markPoints?.join(', ')}
Model answer: ${practiceQ.modelAnswer}

Student's answer: ${answer}

Return ONLY valid JSON:
{
  "level": 2,
  "awarded": 4,
  "available": 6,
  "levelJustification": "why this answer is level 2 and not level 3",
  "whatTheyGotRight": ["point 1 they covered well", "point 2"],
  "whatWasMissing": ["key point they missed 1", "key point they missed 2"],
  "qualityOfWriting": "comment on clarity, use of scientific terminology, structure",
  "improvedParagraph": "rewrite their weakest paragraph to show how it could be improved",
  "gradeAdvice": "specific advice: to reach level 3, they need to..."
}`

    try {
      const raw = await callClaude(prompt, '', 1000)
      setFeedback(parseJSON(raw))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Generate synoptic question
  const generateSynoptic = async (link) => {
    setSynopticLoading(true)
    setSynopticQ(null)
    setSynopticAnswer('')
    setSynopticFeedback(null)

    const prompt = `Generate a synoptic GCSE ${subjectShort} question that links MULTIPLE topics together.
This is the hardest type of exam question — it appears at the END of papers and targets Grade 7-9 students.

Topics to link: ${link.topics.join(' and ')}
Theme: ${link.theme}
Description: ${link.description}

The question should:
- Require knowledge from BOTH topics to answer fully
- Be worth 5-8 marks total (can be split into parts a, b, c)
- Include a real-world context or scenario
- Have one part that most students would answer well, and one part that only Grade 7-9 students would answer fully

Return ONLY valid JSON:
{
  "scenario": "the real-world context or scenario introduced at the start",
  "parts": [
    {
      "part": "a",
      "question": "question text",
      "marks": 2,
      "topicTested": "mainly which topic",
      "modelAnswer": "mark scheme answer",
      "difficulty": "Grade 4-5"
    },
    {
      "part": "b",
      "question": "question text requiring BOTH topics",
      "marks": 4,
      "topicTested": "links both topics",
      "modelAnswer": "mark scheme answer showing the link",
      "difficulty": "Grade 7-9"
    }
  ],
  "synopticLink": "the key connection between the two topics that makes this synoptic",
  "whyStudentsFail": "the specific reason Grade 5-6 students lose marks on this type of question"
}`

    try {
      const raw = await callClaude(prompt, '', 1500)
      setSynopticQ(parseJSON(raw))
    } catch (e) {
      console.error(e)
    } finally {
      setSynopticLoading(false)
    }
  }

  // Mark synoptic answer
  const markSynoptic = async () => {
    if (!synopticQ || !synopticAnswer.trim()) return
    setSynopticLoading(true)
    setSynopticFeedback(null)

    const totalMarks = synopticQ.parts?.reduce((s, p) => s + p.marks, 0) || 6
    const prompt = `Mark this synoptic GCSE ${subjectShort} answer.

Scenario: ${synopticQ.scenario}
Questions and model answers:
${synopticQ.parts?.map(p => `Part ${p.part} [${p.marks} marks]: ${p.question}\nModel: ${p.modelAnswer}`).join('\n\n')}

Student's answer: ${synopticAnswer}
Key synoptic link required: ${synopticQ.synopticLink}

Return ONLY valid JSON:
{
  "totalAwarded": 4,
  "totalAvailable": ${totalMarks},
  "madeTheSynopticLink": true,
  "feedback": "specific feedback on their answer",
  "synopticLinkFeedback": "did they connect the two topics? What was missing?",
  "grade9Addition": "what a grade 9 student would have added"
}`

    try {
      const raw = await callClaude(prompt, '', 800)
      setSynopticFeedback(parseJSON(raw))
    } catch (e) {
      console.error(e)
    } finally {
      setSynopticLoading(false)
    }
  }

  return (
    <div>
      {/* Subject selector */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <label className="label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Subject:</label>
        <select className="select-field" value={localSubject}
          onChange={e => { setLocalSubject(e.target.value); setSelectedStructure(null); setPracticeQ(null); setFeedback(null); setSelectedLink(null); setSynopticQ(null) }}
          style={{ maxWidth: 280, marginBottom: 0 }}>
          {ALL_SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 12, padding: 4, gap: 4, marginBottom: 20, maxWidth: 500 }}>
        {[
          { key: 'sixmark', label: '📝 6-Mark Structure Trainer' },
          { key: 'synoptic', label: '🔗 Synoptic Questions' },
        ].map(opt => (
          <button key={opt.key} onClick={() => { setActiveSection(opt.key); setSelectedStructure(null); setPracticeQ(null); setFeedback(null); setSelectedLink(null); setSynopticQ(null) }} style={{
            flex: 1, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
            background: activeSection === opt.key ? 'white' : 'transparent',
            color: activeSection === opt.key ? 'var(--navy)' : 'var(--gray-500)',
            boxShadow: activeSection === opt.key ? '0 1px 4px rgba(0,0,0,0.12)' : 'none'
          }}>{opt.label}</button>
        ))}
      </div>

      {/* ══ SIX-MARK TRAINER ══════════════════════════════════════════════════ */}
      {activeSection === 'sixmark' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,280px) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>

          {/* Left: structure selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card">
              <h2 style={{ fontSize: 17, fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 6 }}>6-Mark Structure Trainer</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14, lineHeight: 1.5 }}>
                These questions use level-of-response marking. Structure is everything. Pick a type to master it.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {structures.map((s, i) => (
                  <div key={s.name} onClick={() => { setSelectedStructure(s); setPracticeMode(false); setPracticeQ(null); setFeedback(null); setAnswer('') }}
                    style={{
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                      background: selectedStructure?.name === s.name ? 'var(--navy)' : 'var(--gray-50)',
                      border: `1px solid ${selectedStructure?.name === s.name ? 'var(--navy)' : 'var(--gray-200)'}`,
                      transition: 'all 0.15s'
                    }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: selectedStructure?.name === s.name ? 'white' : 'var(--navy)', marginBottom: 2 }}>
                      {i + 1}. {s.name}
                    </div>
                    <div style={{ fontSize: 11, color: selectedStructure?.name === s.name ? 'rgba(255,255,255,0.6)' : 'var(--gray-400)' }}>
                      6 marks · Level of response
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ background: 'var(--gold-light)', border: '1px solid #fcd34d' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>⭐ Why 6-mark questions matter</div>
              <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
                Every GCSE paper has 1-3 extended response questions worth 5-6 marks each.
                These use <strong>level-of-response marking</strong> — the examiner judges the overall quality,
                not individual points. Structure is the difference between Level 1 (2 marks) and Level 3 (6 marks).
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div>
            {!selectedStructure && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', gap: 12 }}>
                <div style={{ fontSize: 52 }}>📝</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gray-300)' }}>Select a question type</div>
                <div style={{ fontSize: 14, color: 'var(--gray-400)', maxWidth: 340, lineHeight: 1.6 }}>
                  6-mark questions are marked differently to all other questions. Learn the structure, then practise it.
                </div>
              </div>
            )}

            {selectedStructure && (
              <div className="fade-in">
                {/* Header */}
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>6-Mark Question Type</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--navy)' }}>{selectedStructure.name}</h3>
                    </div>
                    <span className="tag tag-navy">Level of Response · 6 marks</span>
                  </div>
                  <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 10, padding: 4, gap: 4 }}>
                    {[{ key: false, label: '📖 Learn the structure' }, { key: true, label: '✏️ Practice it' }].map(opt => (
                      <button key={String(opt.key)} onClick={() => { setPracticeMode(opt.key); if (opt.key) generateSixMark(selectedStructure) }} style={{
                        flex: 1, padding: '9px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                        background: practiceMode === opt.key ? 'white' : 'transparent',
                        color: practiceMode === opt.key ? 'var(--navy)' : 'var(--gray-500)',
                        boxShadow: practiceMode === opt.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
                      }}>{opt.label}</button>
                    ))}
                  </div>
                </div>

                {/* ── LEARN MODE ── */}
                {!practiceMode && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Structure */}
                    <div className="card">
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 10 }}>📋 The structure — memorise this</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {selectedStructure.structure.map((step, i) => (
                          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--navy)', color: 'white', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                            <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6, paddingTop: 3 }}>{step}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Example question */}
                    <div className="card" style={{ background: 'var(--gray-50)', border: '1.5px solid var(--gray-200)' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Example question</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.6 }}>{selectedStructure.example} [6 marks]</div>
                    </div>

                    {/* Level descriptors */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                      {[
                        { level: 'Level 3', marks: '5–6', color: '#065f46', bg: 'var(--green-light)', desc: 'Detailed, well-structured response covering all key points with clear scientific reasoning throughout' },
                        { level: 'Level 2', marks: '3–4', color: '#92400e', bg: 'var(--amber-light)', desc: 'Some correct points with partial reasoning. Some gaps or lacks full explanation' },
                        { level: 'Level 1', marks: '1–2', color: '#991b1b', bg: 'var(--red-light)', desc: 'Basic points only. Mostly descriptive with little scientific explanation' },
                      ].map(l => (
                        <div key={l.level} style={{ background: l.bg, borderRadius: 10, padding: '12px 14px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: l.color, marginBottom: 2 }}>{l.level}</div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: l.color, marginBottom: 6, fontFamily: 'var(--font-display)' }}>{l.marks} marks</div>
                          <div style={{ fontSize: 12, color: l.color, lineHeight: 1.5 }}>{l.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* Model answer */}
                    <div className="card" style={{ background: 'var(--green-light)', border: '1px solid #6ee7b7' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 8 }}>✓ Model Level 3 answer (6 marks)</div>
                      <div style={{ fontSize: 13, color: '#065f46', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selectedStructure.modelAnswer}</div>
                    </div>

                    {/* Common errors */}
                    <div className="card" style={{ background: 'var(--red-light)', border: '1px solid #fca5a5' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#991b1b', marginBottom: 8 }}>❌ Why students lose marks</div>
                      {selectedStructure.commonErrors.map((e, i) => (
                        <div key={i} style={{ fontSize: 13, color: '#991b1b', padding: '4px 0', borderBottom: i < selectedStructure.commonErrors.length - 1 ? '1px solid #fca5a5' : 'none', lineHeight: 1.5 }}>
                          • {e}
                        </div>
                      ))}
                    </div>

                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 14 }}
                      onClick={() => { setPracticeMode(true); generateSixMark(selectedStructure) }}>
                      Practice a real question →
                    </button>
                  </div>
                )}

                {/* ── PRACTICE MODE ── */}
                {practiceMode && (
                  <div>
                    {loading && !practiceQ && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
                        <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
                        <div style={{ fontSize: 14, color: 'var(--gray-500)' }}>Generating 6-mark question...</div>
                      </div>
                    )}

                    {practiceQ && (
                      <div className="fade-in">
                        {/* Structure reminder */}
                        <div style={{ background: 'var(--blue-light)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#1e40af' }}>
                          <strong>Structure:</strong> {selectedStructure.structure.join(' → ')}
                        </div>

                        {/* Question */}
                        <div className="card" style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                            <div style={{ flex: 1 }}>
                              <span className="tag tag-blue" style={{ marginBottom: 8, display: 'inline-block' }}>{practiceQ.topic}</span>
                              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.7 }}>{practiceQ.question}</p>
                            </div>
                            <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', flexShrink: 0 }}>[6 marks]</div>
                          </div>
                        </div>

                        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 6 }}>
                          Write a continuous prose answer (not bullet points). Aim for 3-5 clear sentences minimum.
                        </div>
                        <textarea className="textarea-field" placeholder="Write your extended response here. Remember: Point → Reason → Link throughout. Aim for 3-5 sentences minimum..."
                          value={answer} onChange={e => setAnswer(e.target.value)} style={{ minHeight: 180, marginBottom: 12 }} />

                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: 14 }}
                            onClick={markSixMark} disabled={loading || !answer.trim()}>
                            {loading ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Marking...</> : '✓ Submit for level marking'}
                          </button>
                          <button className="btn-secondary" style={{ fontSize: 13 }}
                            onClick={() => { generateSixMark(selectedStructure); setAnswer(''); setFeedback(null) }}>
                            New question
                          </button>
                        </div>

                        {feedback && (
                          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {/* Level result */}
                            <div className="card" style={{
                              background: feedback.level >= 3 ? 'var(--green-light)' : feedback.level >= 2 ? 'var(--amber-light)' : 'var(--red-light)',
                              border: `1.5px solid ${feedback.level >= 3 ? '#6ee7b7' : feedback.level >= 2 ? '#fcd34d' : '#fca5a5'}`
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: feedback.level >= 3 ? 'var(--green)' : feedback.level >= 2 ? 'var(--amber)' : 'var(--red)' }}>
                                  Level {feedback.level} — {feedback.awarded}/{feedback.available} marks
                                </div>
                              </div>
                              <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--gray-700)' }}>{feedback.levelJustification}</div>
                            </div>

                            {/* What they got right */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                              <div className="card" style={{ background: 'var(--green-light)' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#065f46', marginBottom: 6 }}>✓ What you covered well</div>
                                {feedback.whatTheyGotRight?.map((p, i) => <div key={i} style={{ fontSize: 13, color: '#065f46', padding: '3px 0' }}>• {p}</div>)}
                              </div>
                              <div className="card" style={{ background: 'var(--red-light)' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#991b1b', marginBottom: 6 }}>✗ What was missing</div>
                                {feedback.whatWasMissing?.map((p, i) => <div key={i} style={{ fontSize: 13, color: '#991b1b', padding: '3px 0' }}>• {p}</div>)}
                              </div>
                            </div>

                            {/* Writing quality */}
                            {feedback.qualityOfWriting && (
                              <div className="card" style={{ background: 'var(--blue-light)' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#1e40af', marginBottom: 4 }}>Quality of scientific writing</div>
                                <div style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>{feedback.qualityOfWriting}</div>
                              </div>
                            )}

                            {/* Improved paragraph */}
                            {feedback.improvedParagraph && (
                              <div className="card" style={{ background: 'var(--green-light)', border: '1px solid #6ee7b7' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#065f46', marginBottom: 6 }}>✓ How to improve this section</div>
                                <div style={{ fontSize: 13, color: '#065f46', lineHeight: 1.7, fontStyle: 'italic' }}>{feedback.improvedParagraph}</div>
                              </div>
                            )}

                            {/* Grade advice */}
                            {feedback.gradeAdvice && (
                              <div className="card" style={{ background: 'var(--gold-light)', border: '1px solid #fcd34d' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>⭐ To reach the next level</div>
                                <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>{feedback.gradeAdvice}</div>
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
                                onClick={() => { generateSixMark(selectedStructure); setAnswer(''); setFeedback(null) }}>
                                Try another question →
                              </button>
                              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
                                onClick={() => { setPracticeMode(false) }}>
                                Back to structure
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ SYNOPTIC QUESTIONS ════════════════════════════════════════════════ */}
      {activeSection === 'synoptic' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,300px) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card">
              <h2 style={{ fontSize: 17, fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 6 }}>Synoptic Questions</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14, lineHeight: 1.5 }}>
                These link 2+ topics together. They appear at the end of papers and separate Grade 7 from Grade 9.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {synopticLinks.map((link, i) => (
                  <div key={i} onClick={() => { setSelectedLink(link); setSynopticQ(null); setSynopticAnswer(''); setSynopticFeedback(null) }}
                    style={{
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                      background: selectedLink?.theme === link.theme ? 'var(--navy)' : 'var(--gray-50)',
                      border: `1px solid ${selectedLink?.theme === link.theme ? 'var(--navy)' : 'var(--gray-200)'}`,
                      transition: 'all 0.15s'
                    }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                      {link.topics.map(t => (
                        <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: selectedLink?.theme === link.theme ? 'rgba(255,255,255,0.2)' : 'var(--blue-light)', color: selectedLink?.theme === link.theme ? 'white' : '#1e40af', fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: selectedLink?.theme === link.theme ? 'white' : 'var(--navy)', marginBottom: 2 }}>{link.theme}</div>
                    <div style={{ fontSize: 11, color: selectedLink?.theme === link.theme ? 'rgba(255,255,255,0.6)' : 'var(--gray-400)', lineHeight: 1.4 }}>{link.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ background: 'var(--red-light)', border: '1px solid #fca5a5' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#991b1b', marginBottom: 6 }}>Why students fail synoptic questions</div>
              <div style={{ fontSize: 13, color: '#991b1b', lineHeight: 1.6 }}>
                They answer using only ONE topic instead of linking both. The marks for synoptic questions are specifically awarded for making the connection between topics — knowing each topic individually is not enough.
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            {!selectedLink && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', gap: 12 }}>
                <div style={{ fontSize: 52 }}>🔗</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gray-300)' }}>Select a topic link</div>
                <div style={{ fontSize: 14, color: 'var(--gray-400)', maxWidth: 360, lineHeight: 1.6 }}>
                  Synoptic questions combine two topics. The skill is seeing the connection — and writing about both.
                </div>
              </div>
            )}

            {selectedLink && (
              <div className="fade-in">
                {/* Header */}
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>🔗 Synoptic Question</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)', marginBottom: 8 }}>{selectedLink.theme}</h3>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {selectedLink.topics.map(t => <span key={t} className="tag tag-blue">{t}</span>)}
                    <span className="tag tag-red">Grade 7–9</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 14 }}>{selectedLink.description}</div>
                  <button className="btn-primary" style={{ justifyContent: 'center', width: '100%', padding: '12px', fontSize: 14 }}
                    onClick={() => generateSynoptic(selectedLink)} disabled={synopticLoading}>
                    {synopticLoading ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Generating synoptic question...</> : '⚡ Generate synoptic question'}
                  </button>
                </div>

                {synopticQ && (
                  <div className="fade-in">
                    {/* Synoptic link banner */}
                    <div style={{ background: 'var(--navy)', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔗 The synoptic link to make</div>
                      <div style={{ fontSize: 14, color: 'white', lineHeight: 1.6 }}>{synopticQ.synopticLink}</div>
                      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gold)' }}>⚠️ {synopticQ.whyStudentsFail}</div>
                    </div>

                    {/* Scenario */}
                    {synopticQ.scenario && (
                      <div className="card" style={{ background: 'var(--gray-50)', borderLeft: '3px solid var(--blue)', marginBottom: 14 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Context</div>
                        <div style={{ fontSize: 14, color: 'var(--gray-800)', lineHeight: 1.7 }}>{synopticQ.scenario}</div>
                      </div>
                    )}

                    {/* Question parts */}
                    {synopticQ.parts?.map((part, i) => (
                      <div key={part.part} className="card" style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                              <span style={{ background: 'var(--navy)', color: 'white', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>({part.part})</span>
                              <span className="tag tag-blue" style={{ fontSize: 11 }}>{part.topicTested}</span>
                              <span className={`tag ${part.difficulty?.includes('9') ? 'tag-red' : 'tag-amber'}`} style={{ fontSize: 11 }}>{part.difficulty}</span>
                            </div>
                            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.7 }}>{part.question}</p>
                          </div>
                          <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', flexShrink: 0 }}>
                            [{part.marks} marks]
                          </div>
                        </div>
                        <details style={{ fontSize: 13 }}>
                          <summary style={{ cursor: 'pointer', color: 'var(--blue)', fontWeight: 500, userSelect: 'none' }}>Show model answer</summary>
                          <div style={{ marginTop: 10, background: 'var(--green-light)', borderRadius: 8, padding: '8px 12px', color: '#065f46', lineHeight: 1.7, fontSize: 13 }}>
                            {part.modelAnswer}
                          </div>
                        </details>
                      </div>
                    ))}

                    {/* Answer box */}
                    <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 6 }}>
                      Write your answers to all parts. Remember to make the synoptic link between: <strong>{selectedLink.topics.join(' and ')}</strong>
                    </div>
                    <textarea className="textarea-field" placeholder="Write your answers here, making sure to link both topics together..."
                      value={synopticAnswer} onChange={e => setSynopticAnswer(e.target.value)} style={{ minHeight: 160, marginBottom: 12 }} />

                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                      <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: 14 }}
                        onClick={markSynoptic} disabled={synopticLoading || !synopticAnswer.trim()}>
                        {synopticLoading ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Marking...</> : '✓ Mark my answer'}
                      </button>
                      <button className="btn-secondary" style={{ fontSize: 13 }}
                        onClick={() => { generateSynoptic(selectedLink); setSynopticAnswer(''); setSynopticFeedback(null) }}>
                        New question
                      </button>
                    </div>

                    {synopticFeedback && (
                      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div className="card" style={{ background: 'var(--navy)', border: 'none' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'white' }}>
                              {synopticFeedback.totalAwarded}/{synopticFeedback.totalAvailable} marks
                            </div>
                            <div style={{ padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 500, background: synopticFeedback.madeTheSynopticLink ? '#6ee7b7' : '#fca5a5', color: synopticFeedback.madeTheSynopticLink ? '#065f46' : '#991b1b' }}>
                              {synopticFeedback.madeTheSynopticLink ? '✓ Made the synoptic link' : '✗ Synoptic link missing'}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 10 }}>{synopticFeedback.feedback}</div>
                          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
                            <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, marginBottom: 4 }}>Synoptic link feedback</div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{synopticFeedback.synopticLinkFeedback}</div>
                          </div>
                          {synopticFeedback.grade9Addition && (
                            <div style={{ background: 'rgba(245,166,35,0.15)', borderRadius: 8, padding: '10px 12px' }}>
                              <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, marginBottom: 4 }}>⭐ Grade 9 addition</div>
                              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{synopticFeedback.grade9Addition}</div>
                            </div>
                          )}
                        </div>
                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
                          onClick={() => { generateSynoptic(selectedLink); setSynopticAnswer(''); setSynopticFeedback(null) }}>
                          Try another synoptic question →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
