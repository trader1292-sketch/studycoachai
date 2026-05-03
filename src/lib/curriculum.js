// ─── Subject categories shown on the main selector ───────────────────────────
export const SUBJECT_CATEGORIES = ['Triple Science', 'Combined Science', 'Maths', 'Other Subjects']

// ─── Subjects per category ────────────────────────────────────────────────────
export const SUBJECTS_BY_TYPE = {
  'Triple Science': ['GCSE Physics', 'GCSE Chemistry', 'GCSE Biology'],
  'Combined Science': ['GCSE Combined Science (Physics)', 'GCSE Combined Science (Chemistry)', 'GCSE Combined Science (Biology)'],
  'Maths': ['GCSE Maths'],
  'Other Subjects': ['GCSE English Literature', 'GCSE English Language', 'GCSE History', 'GCSE Geography'],
  // keep 'Other' as alias so old code doesn't break
  'Other': ['GCSE Maths', 'GCSE English Literature', 'GCSE English Language', 'GCSE History', 'GCSE Geography'],
}

// Legacy export used by some components
export const SCIENCE_TYPES = ['Triple Science', 'Combined Science']

// ─── Exam boards ─────────────────────────────────────────────────────────────
export const BOARDS = ['AQA', 'Edexcel', 'OCR', 'WJEC']

// ─── CORRECT paper numbers per subject per board ──────────────────────────────
// Triple Science (Biology, Chemistry, Physics): ALL boards → Paper 1, Paper 2
// Combined Science: ALL boards → Paper 1, Paper 2 (per subject component)
// Maths AQA/Edexcel/OCR: Paper 1 (Non-calc), Paper 2 (Calc), Paper 3 (Calc)
// Maths WJEC: Paper 1 (Non-calc), Paper 2 (Calc)
// English Language/Literature: Paper 1, Paper 2
// History/Geography: Paper 1, Paper 2

// ─── Topics and sub-topics ───────────────────────────────────────────────────
export const CURRICULUM = {

  // ══ TRIPLE PHYSICS ══════════════════════════════════════════════════════════
  'GCSE Physics': {
    papers: { AQA: ['Paper 1', 'Paper 2'], Edexcel: ['Paper 1', 'Paper 2'], OCR: ['Paper 1', 'Paper 2'], WJEC: ['Paper 1', 'Paper 2'] },
    topics: {
      'Forces & Motion': [
        'Speed, velocity and acceleration',
        'Newton\'s First Law',
        'Newton\'s Second Law (F=ma)',
        'Newton\'s Third Law',
        'Resultant forces',
        'Momentum and conservation',
        'Stopping distances',
        'Terminal velocity',
        'Projectile motion',
        'Circular motion',
      ],
      'Energy': [
        'Energy stores and transfers',
        'Kinetic energy (KE = ½mv²)',
        'Gravitational potential energy (GPE = mgh)',
        'Elastic potential energy',
        'Conservation of energy',
        'Power and efficiency',
        'Specific heat capacity',
        'Specific latent heat',
      ],
      'Waves': [
        'Wave properties (frequency, wavelength, amplitude)',
        'Wave speed equation (v = fλ)',
        'Transverse and longitudinal waves',
        'Reflection and refraction',
        'Total internal reflection',
        'Electromagnetic spectrum',
        'Uses of EM waves',
        'Sound waves',
        'Ultrasound',
        'Doppler effect',
      ],
      'Electricity': [
        'Current, voltage and resistance',
        'Ohm\'s Law (V = IR)',
        'Series and parallel circuits',
        'Electrical power (P = IV)',
        'Energy and charge (E = QV)',
        'Resistors and components',
        'Mains electricity and AC/DC',
        'Domestic electricity and safety',
      ],
      'Magnetism & Electromagnetism': [
        'Magnetic fields',
        'Electromagnetism',
        'The motor effect (F = BIL)',
        'Fleming\'s left-hand rule',
        'Generators and alternators',
        'Transformers',
        'The National Grid',
      ],
      'Atomic Structure': [
        'Atomic model history',
        'Nuclear radiation (alpha, beta, gamma)',
        'Half-life',
        'Nuclear equations',
        'Fission and fusion',
        'Background radiation',
        'Uses of radiation',
        'Dangers of radiation',
      ],
      'Space Physics': [
        'The Solar System',
        'Life cycle of a star',
        'Orbital motion',
        'Red-shift and Big Bang',
        'Light years and distances',
      ],
      'Particle Model': [
        'States of matter',
        'Density (ρ = m/V)',
        'Pressure in gases',
        'Internal energy',
        'Changes of state',
      ],
    },
  },

  // ══ TRIPLE CHEMISTRY ════════════════════════════════════════════════════════
  'GCSE Chemistry': {
    papers: { AQA: ['Paper 1', 'Paper 2'], Edexcel: ['Paper 1', 'Paper 2'], OCR: ['Paper 1', 'Paper 2'], WJEC: ['Paper 1', 'Paper 2'] },
    topics: {
      'Atomic Structure & Periodic Table': [
        'Atomic structure (protons, neutrons, electrons)',
        'Isotopes',
        'Electronic configuration',
        'The Periodic Table',
        'Group 1 — Alkali metals',
        'Group 7 — Halogens',
        'Group 0 — Noble gases',
        'Transition metals',
      ],
      'Bonding & Structure': [
        'Ionic bonding',
        'Covalent bonding',
        'Metallic bonding',
        'Giant ionic structures',
        'Simple molecular structures',
        'Giant covalent structures',
        'Allotropes of carbon',
        'Nanoparticles',
      ],
      'Quantitative Chemistry': [
        'Relative atomic mass (Ar)',
        'Moles and molar mass',
        'Mole calculations',
        'Percentage composition',
        'Empirical formula',
        'Concentration calculations',
        'Titration calculations',
        'Yield and atom economy',
      ],
      'Chemical Changes': [
        'Reactivity series',
        'Displacement reactions',
        'Extraction of metals',
        'Oxidation and reduction',
        'Electrolysis',
        'Acids and alkalis',
        'Neutralisation reactions',
        'Making salts',
      ],
      'Energy Changes': [
        'Exothermic and endothermic reactions',
        'Bond energies',
        'Activation energy',
        'Fuel cells',
        'Calorimetry',
      ],
      'Rates of Reaction': [
        'Factors affecting rate',
        'Collision theory',
        'Catalysts',
        'Concentration and rate',
        'Temperature and rate',
        'Surface area and rate',
        'Reversible reactions',
        'Le Chatelier\'s principle',
      ],
      'Organic Chemistry': [
        'Hydrocarbons and alkanes',
        'Alkenes and addition reactions',
        'Polymers',
        'Crude oil and fractional distillation',
        'Alcohols',
        'Carboxylic acids',
        'Condensation polymerisation',
      ],
      'Analysis & Atmosphere': [
        'Flame tests',
        'Chemical tests for ions',
        'Chromatography',
        'The atmosphere',
        'Carbon footprint',
        'Water treatment',
      ],
    },
  },

  // ══ TRIPLE BIOLOGY ══════════════════════════════════════════════════════════
  'GCSE Biology': {
    papers: { AQA: ['Paper 1', 'Paper 2'], Edexcel: ['Paper 1', 'Paper 2'], OCR: ['Paper 1', 'Paper 2'], WJEC: ['Paper 1', 'Paper 2'] },
    topics: {
      'Cell Biology': [
        'Animal and plant cells',
        'Prokaryotic and eukaryotic cells',
        'Cell specialisation',
        'Microscopy and magnification',
        'Mitosis and cell cycle',
        'Stem cells',
        'Diffusion, osmosis and active transport',
      ],
      'Organisation': [
        'Tissues, organs and systems',
        'The digestive system',
        'Enzymes',
        'The heart and blood vessels',
        'Blood and blood cells',
        'Coronary heart disease',
        'Lung structure and gas exchange',
        'Plant transport systems (xylem & phloem)',
        'Transpiration',
      ],
      'Infection & Response': [
        'Pathogens and disease',
        'Viral diseases',
        'Bacterial diseases',
        'The immune system',
        'Vaccination',
        'Antibiotics',
        'Drug development and testing',
        'Monoclonal antibodies',
      ],
      'Bioenergetics': [
        'Photosynthesis equation and process',
        'Factors affecting photosynthesis',
        'Aerobic respiration',
        'Anaerobic respiration',
        'Response to exercise',
        'Metabolism',
      ],
      'Homeostasis': [
        'Principles of homeostasis',
        'The nervous system',
        'Synapses and reflexes',
        'The brain',
        'The eye',
        'Blood glucose regulation',
        'Diabetes (Type 1 and 2)',
        'The kidney and osmoregulation',
        'Hormones and the endocrine system',
        'Puberty and reproduction',
        'Contraception',
        'IVF',
      ],
      'Inheritance & Evolution': [
        'DNA structure and genes',
        'Protein synthesis',
        'Meiosis',
        'Monohybrid inheritance',
        'Genetic disorders',
        'Sex determination',
        'Variation',
        'Evolution and natural selection',
        'Classification',
        'Extinction',
      ],
      'Ecology': [
        'Ecosystems and habitats',
        'Food chains and webs',
        'Biotic and abiotic factors',
        'Adaptations',
        'Predator-prey cycles',
        'The carbon cycle',
        'The water cycle',
        'Biodiversity',
        'Human impact on ecosystems',
      ],
    },
  },

  // ══ COMBINED SCIENCE ════════════════════════════════════════════════════════
  'GCSE Combined Science (Physics)': {
    // Combined Science students sit Paper 1 and Paper 2 for each science component
    // AQA calls them Paper 5 & 6 internally but students/teachers refer to them as Paper 1 & Paper 2
    papers: { AQA: ['Paper 1', 'Paper 2'], Edexcel: ['Paper 1', 'Paper 2'], OCR: ['Paper 1', 'Paper 2'], WJEC: ['Paper 1', 'Paper 2'] },
    note: 'Combined Science — fewer topics and less depth than Triple Physics. Graded on a double award (e.g. 6-6).',
    topics: {
      'Forces': [
        'Speed and velocity',
        'Acceleration (a = Δv/t)',
        'Newton\'s Laws of motion',
        'Resultant forces',
        'Momentum (p = mv)',
        'Stopping distances',
        'Terminal velocity',
      ],
      'Energy': [
        'Energy stores and transfers',
        'Kinetic energy (KE = ½mv²)',
        'Gravitational potential energy (GPE = mgh)',
        'Efficiency',
        'Power (P = E/t)',
        'Specific heat capacity',
      ],
      'Waves': [
        'Wave properties',
        'Wave speed (v = fλ)',
        'Electromagnetic spectrum',
        'Uses of EM waves',
        'Sound and ultrasound',
      ],
      'Electricity': [
        'Current, voltage and resistance (V = IR)',
        'Series and parallel circuits',
        'Power (P = IV)',
        'Mains electricity',
      ],
      'Magnetism': [
        'Magnetic fields',
        'Electromagnetism',
        'The motor effect',
        'Generators',
      ],
      'Atomic Structure': [
        'Atomic model',
        'Radioactive decay',
        'Half-life',
        'Nuclear radiation types',
      ],
    },
  },

  'GCSE Combined Science (Chemistry)': {
    papers: { AQA: ['Paper 1', 'Paper 2'], Edexcel: ['Paper 1', 'Paper 2'], OCR: ['Paper 1', 'Paper 2'], WJEC: ['Paper 1', 'Paper 2'] },
    note: 'Combined Science — core topics only, less depth than Triple Chemistry.',
    topics: {
      'Atomic Structure': ['Atoms and isotopes', 'Electronic configuration', 'The Periodic Table', 'Group properties'],
      'Bonding': ['Ionic bonding', 'Covalent bonding', 'Metallic bonding', 'Properties of materials'],
      'Quantitative Chemistry': ['Moles', 'Mole calculations', 'Concentration', 'Yield'],
      'Chemical Changes': ['Reactivity series', 'Acids and bases', 'Electrolysis', 'Making salts'],
      'Energy Changes': ['Exo and endothermic', 'Bond energies'],
      'Rates & Equilibrium': ['Factors affecting rate', 'Collision theory', 'Reversible reactions'],
      'Organic Chemistry': ['Alkanes', 'Alkenes', 'Polymers', 'Crude oil'],
      'Atmosphere & Earth': ['The atmosphere', 'Carbon footprint', 'Earth\'s resources'],
    },
  },

  'GCSE Combined Science (Biology)': {
    papers: { AQA: ['Paper 1', 'Paper 2'], Edexcel: ['Paper 1', 'Paper 2'], OCR: ['Paper 1', 'Paper 2'], WJEC: ['Paper 1', 'Paper 2'] },
    note: 'Combined Science — core biology topics, less depth than Triple Biology.',
    topics: {
      'Cell Biology': ['Animal and plant cells', 'Microscopy', 'Mitosis', 'Diffusion and osmosis'],
      'Organisation': ['Digestive system', 'Enzymes', 'Heart and circulation', 'Lung gas exchange'],
      'Infection & Response': ['Pathogens', 'Immune system', 'Vaccination', 'Antibiotics'],
      'Bioenergetics': ['Photosynthesis', 'Aerobic respiration', 'Anaerobic respiration'],
      'Homeostasis': ['Nervous system', 'Blood glucose', 'Kidneys', 'Hormones'],
      'Inheritance': ['DNA and genes', 'Meiosis', 'Inheritance patterns', 'Evolution'],
      'Ecology': ['Ecosystems', 'Food chains', 'Carbon cycle', 'Human impact'],
    },
  },

  // ══ MATHS ════════════════════════════════════════════════════════════════════
  'GCSE Maths': {
    // AQA, Edexcel, OCR: 3 papers. WJEC: 2 papers.
    papers: {
      AQA: ['Paper 1 (Non-calc)', 'Paper 2 (Calc)', 'Paper 3 (Calc)'],
      Edexcel: ['Paper 1 (Non-calc)', 'Paper 2 (Calc)', 'Paper 3 (Calc)'],
      OCR: ['Paper 1 (Non-calc)', 'Paper 2 (Calc)', 'Paper 3 (Calc)'],
      WJEC: ['Paper 1 (Non-calc)', 'Paper 2 (Calc)'],
    },
    topics: {
      'Number': ['Place value and rounding', 'Fractions, decimals, percentages', 'Indices and surds', 'Standard form', 'HCF and LCM', 'Percentages and percentage change', 'Ratio and proportion'],
      'Algebra': ['Expanding and factorising', 'Solving equations', 'Forming equations', 'Sequences (nth term)', 'Inequalities', 'Simultaneous equations', 'Quadratic equations', 'Functions', 'Iteration'],
      'Geometry': ['Angles and parallel lines', 'Properties of shapes', 'Area and perimeter', 'Circles (area and circumference)', 'Volume and surface area', 'Congruence and similarity', 'Transformations', 'Vectors', 'Constructions and loci'],
      'Trigonometry': ['SOHCAHTOA', 'Sine and cosine rules', 'Area of a triangle (½ab sinC)', 'Exact trig values', '3D trigonometry', 'Graphs of trig functions'],
      'Statistics': ['Mean, median, mode, range', 'Frequency tables', 'Histograms', 'Box plots', 'Cumulative frequency', 'Scatter graphs and correlation'],
      'Probability': ['Basic probability', 'Relative frequency', 'Tree diagrams', 'Venn diagrams', 'Conditional probability'],
      'Graphs': ['Straight line graphs (y=mx+c)', 'Quadratic graphs', 'Cubic and reciprocal graphs', 'Distance-time and speed-time graphs', 'Real-life graphs'],
    },
  },

  // ══ ENGLISH LITERATURE ═══════════════════════════════════════════════════════
  'GCSE English Literature': {
    // AQA, Edexcel, OCR, WJEC: all have 2 papers
    papers: {
      AQA: ['Paper 1', 'Paper 2'],
      Edexcel: ['Paper 1', 'Paper 2'],
      OCR: ['Paper 1', 'Paper 2'],
      WJEC: ['Paper 1', 'Paper 2'],
    },
    topics: {
      'Shakespeare': ['Macbeth', 'Romeo and Juliet', 'The Merchant of Venice', 'Much Ado About Nothing', 'The Tempest'],
      '19th Century Novel': ['A Christmas Carol', 'Great Expectations', 'Jekyll and Hyde', 'The Sign of Four', 'Pride and Prejudice'],
      'Modern Drama': ['An Inspector Calls', 'Blood Brothers', 'The History Boys', 'DNA'],
      'Power & Conflict Poetry': ['Ozymandias', 'London', 'My Last Duchess', 'Charge of the Light Brigade', 'Exposure', 'Storm on the Island', 'Bayonet Charge', 'Remains', 'Poppies', 'War Photographer', 'Tissue', 'The Emigrée', 'Checking Out Me History', 'Kamikaze'],
      'Love & Relationships Poetry': ['Sonnet 29', 'Porphyria\'s Lover', 'Singh Song', 'Climbing My Grandfather', 'Neutral Tones', 'The Farmer\'s Bride', 'Walking Away', 'Letters from Yorkshire', 'Eden Rock', 'Follower', 'Before You Were Mine', 'Winter Swans', 'Brunel', 'Mother Any Distance'],
      'Unseen Poetry': ['Analysing unseen poems', 'Comparing unseen poems', 'Methods and techniques', 'Effect on the reader'],
      'Modern Prose': ['Of Mice and Men', 'Never Let Me Go', 'The Curious Incident', 'Lord of the Flies'],
    },
  },

  // ══ ENGLISH LANGUAGE ═════════════════════════════════════════════════════════
  'GCSE English Language': {
    papers: {
      AQA: ['Paper 1', 'Paper 2'],
      Edexcel: ['Paper 1', 'Paper 2'],
      OCR: ['Paper 1', 'Paper 2'],
      WJEC: ['Paper 1', 'Paper 2'],
    },
    topics: {
      'Reading — Fiction (Paper 1)': ['Identifying information and ideas', 'Language analysis', 'Structural analysis', 'Evaluating texts', 'Comparing writers\' methods'],
      'Reading — Non-fiction (Paper 2)': ['Summarising information', 'Analysing language', 'Comparing texts', 'Evaluating viewpoints', 'Synthesising sources'],
      'Writing — Descriptive/Narrative': ['Descriptive writing techniques', 'Narrative structure', 'Creating atmosphere', 'Characterisation', 'Using literary devices'],
      'Writing — Persuasive/Viewpoint': ['Rhetorical devices (AFOREST)', 'Structuring arguments', 'Counter-argument', 'Formal register', 'Speech writing'],
      'Language and Structure': ['Metaphor, simile, personification', 'Sentence structure', 'Paragraphing', 'Vocabulary choices', 'Punctuation for effect'],
      'Spoken Language (Endorsement)': ['Preparing a presentation', 'Responding to questions', 'Formal spoken language'],
    },
  },

  // ══ HISTORY ══════════════════════════════════════════════════════════════════
  'GCSE History': {
    papers: {
      AQA: ['Paper 1', 'Paper 2'],
      Edexcel: ['Paper 1', 'Paper 2'],
      OCR: ['Paper 1', 'Paper 2'],
      WJEC: ['Paper 1', 'Paper 2'],
    },
    topics: {
      'Medicine Through Time': ['Medieval medicine', 'Renaissance medicine', 'Industrial era medicine', 'Modern medicine', 'Surgery and anaesthesia', 'Public health'],
      'Germany 1890–1945': ['The Kaiser\'s Germany', 'World War One impact', 'Weimar Republic', 'Rise of Hitler', 'Nazi Germany', 'Persecution and the Holocaust'],
      'Cold War': ['Origins of the Cold War', 'Korean War', 'Cuban Missile Crisis', 'Berlin Wall', 'Vietnam War', 'End of the Cold War'],
      'Elizabethan England': ['Elizabeth I\'s reign', 'Religious settlement', 'Mary Queen of Scots', 'Spanish Armada', 'Poverty and exploration'],
      'Norman Conquest': ['Edward the Confessor', 'Battle of Hastings 1066', 'Norman government', 'Domesday Book', 'Norman Church'],
      'American West': ['Native Americans', 'Pioneers and settlers', 'Cowboys and cattle', 'The railroads', 'Conflict and law'],
      'Source Skills': ['Evaluating sources', 'Interpretation of evidence', 'Reliability and bias', 'Causation and consequence', 'Change and continuity'],
    },
  },

  // ══ GEOGRAPHY ════════════════════════════════════════════════════════════════
  'GCSE Geography': {
    papers: {
      AQA: ['Paper 1', 'Paper 2', 'Paper 3'],
      Edexcel: ['Paper 1', 'Paper 2', 'Paper 3'],
      OCR: ['Paper 1', 'Paper 2', 'Paper 3'],
      WJEC: ['Paper 1', 'Paper 2'],
    },
    topics: {
      'Natural Hazards': ['Tectonic hazards (earthquakes, volcanoes)', 'Atmospheric hazards (tropical storms, droughts)', 'Climate change', 'UK weather hazards'],
      'Living World': ['Ecosystems', 'Tropical rainforests', 'Hot deserts', 'Biodiversity and sustainability'],
      'Physical Landscapes UK': ['Coastal landscapes', 'River landscapes', 'Glacial landscapes'],
      'Urban Issues': ['Urbanisation', 'Cities in LICs (e.g. Rio)', 'Cities in HICs (e.g. Bristol)', 'Urban sustainability'],
      'Changing Economic World': ['Development gap', 'Economic development in LICs', 'UK economic change', 'Global tourism'],
      'Resource Management': ['Food security', 'Water security', 'Energy security'],
      'Fieldwork & Skills': ['Geographical skills', 'Map reading', 'Graph interpretation', 'Fieldwork techniques', 'Statistical skills'],
    },
  },
}

// ─── Formula sheets by subject/topic ─────────────────────────────────────────
export const FORMULA_SHEETS = {
  'GCSE Physics': {
    'Forces & Motion': [
      { formula: 'v = u + at', desc: 'Final velocity', vars: 'v=final vel, u=initial vel, a=acceleration, t=time' },
      { formula: 'v² = u² + 2as', desc: 'Velocity-displacement', vars: 'v=final vel, u=initial vel, a=acceleration, s=displacement' },
      { formula: 's = ut + ½at²', desc: 'Displacement', vars: 's=displacement, u=initial vel, t=time, a=acceleration' },
      { formula: 'F = ma', desc: 'Newton\'s Second Law', vars: 'F=force (N), m=mass (kg), a=acceleration (m/s²)' },
      { formula: 'p = mv', desc: 'Momentum', vars: 'p=momentum (kg m/s), m=mass (kg), v=velocity (m/s)' },
      { formula: 'W = mg', desc: 'Weight', vars: 'W=weight (N), m=mass (kg), g=9.8 m/s²' },
    ],
    'Energy': [
      { formula: 'KE = ½mv²', desc: 'Kinetic energy', vars: 'KE (J), m=mass (kg), v=velocity (m/s)' },
      { formula: 'GPE = mgh', desc: 'Gravitational potential energy', vars: 'GPE (J), m=mass (kg), g=9.8 m/s², h=height (m)' },
      { formula: 'P = E/t', desc: 'Power', vars: 'P=power (W), E=energy (J), t=time (s)' },
      { formula: 'Efficiency = useful output ÷ total input × 100%', desc: 'Efficiency', vars: '' },
      { formula: 'Q = mcΔT', desc: 'Specific heat capacity', vars: 'Q=energy (J), m=mass (kg), c=SHC (J/kg°C), ΔT=temp change' },
    ],
    'Waves': [
      { formula: 'v = fλ', desc: 'Wave speed', vars: 'v=speed (m/s), f=frequency (Hz), λ=wavelength (m)' },
      { formula: 'T = 1/f', desc: 'Period', vars: 'T=period (s), f=frequency (Hz)' },
    ],
    'Electricity': [
      { formula: 'V = IR', desc: 'Ohm\'s Law', vars: 'V=voltage (V), I=current (A), R=resistance (Ω)' },
      { formula: 'P = IV', desc: 'Power', vars: 'P=power (W), I=current (A), V=voltage (V)' },
      { formula: 'P = I²R', desc: 'Power (alternative)', vars: 'P=power (W), I=current (A), R=resistance (Ω)' },
      { formula: 'E = QV', desc: 'Energy', vars: 'E=energy (J), Q=charge (C), V=voltage (V)' },
      { formula: 'Q = It', desc: 'Charge', vars: 'Q=charge (C), I=current (A), t=time (s)' },
    ],
    'Magnetism & Electromagnetism': [
      { formula: 'F = BIL', desc: 'Motor force', vars: 'F=force (N), B=flux density (T), I=current (A), L=length (m)' },
      { formula: 'Vs/Vp = Ns/Np', desc: 'Transformer ratio', vars: 'Vs=secondary V, Vp=primary V, Ns=secondary turns, Np=primary turns' },
    ],
    'Atomic Structure': [
      { formula: 'A = Z + N', desc: 'Mass number', vars: 'A=mass number, Z=proton number, N=neutron number' },
    ],
    'Particle Model': [
      { formula: 'ρ = m/V', desc: 'Density', vars: 'ρ=density (kg/m³), m=mass (kg), V=volume (m³)' },
      { formula: 'p = F/A', desc: 'Pressure', vars: 'p=pressure (Pa), F=force (N), A=area (m²)' },
    ],
  },
  'GCSE Maths': {
    'Trigonometry': [
      { formula: 'sin θ = O/H', desc: 'SOHCAHTOA — Sine', vars: 'O=opposite, H=hypotenuse' },
      { formula: 'cos θ = A/H', desc: 'SOHCAHTOA — Cosine', vars: 'A=adjacent, H=hypotenuse' },
      { formula: 'tan θ = O/A', desc: 'SOHCAHTOA — Tangent', vars: 'O=opposite, A=adjacent' },
      { formula: 'a/sin A = b/sin B = c/sin C', desc: 'Sine rule', vars: 'a,b,c=sides, A,B,C=opposite angles' },
      { formula: 'a² = b² + c² − 2bc cos A', desc: 'Cosine rule', vars: 'a,b,c=sides, A=angle opposite side a' },
      { formula: 'Area = ½ab sin C', desc: 'Area of triangle', vars: 'a,b=two sides, C=included angle' },
    ],
    'Geometry': [
      { formula: 'Area of circle = πr²', desc: 'Circle area', vars: 'r=radius' },
      { formula: 'Circumference = 2πr', desc: 'Circle circumference', vars: 'r=radius' },
      { formula: 'Volume of sphere = (4/3)πr³', desc: 'Sphere volume', vars: 'r=radius' },
      { formula: 'Volume of cone = (1/3)πr²h', desc: 'Cone volume', vars: 'r=radius, h=height' },
    ],
    'Number': [
      { formula: 'Percentage change = (change/original) × 100', desc: 'Percentage change', vars: '' },
      { formula: 'Interest = P(1 + r/100)^n', desc: 'Compound interest', vars: 'P=principal, r=rate, n=years' },
    ],
  },
}

// ─── Past paper links by board, subject, year ─────────────────────────────────
export const PAST_PAPERS = {
  'AQA': {
    'GCSE Physics': [
      { year: 2023, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/' },
      { year: 2023, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/' },
      { year: 2022, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/' },
      { year: 2022, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/' },
      { year: 2019, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/' },
      { year: 2019, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/' },
      { year: 2018, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/' },
      { year: 2018, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/' },
    ],
    'GCSE Chemistry': [
      { year: 2023, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/' },
      { year: 2023, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/' },
      { year: 2022, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/' },
      { year: 2022, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/' },
      { year: 2019, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/' },
      { year: 2019, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/' },
      { year: 2018, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/' },
      { year: 2018, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/' },
    ],
    'GCSE Biology': [
      { year: 2023, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/' },
      { year: 2023, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/' },
      { year: 2022, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/' },
      { year: 2022, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/' },
      { year: 2019, paper: 'Paper 1', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/' },
      { year: 2019, paper: 'Paper 2', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/' },
    ],
    'GCSE Maths': [
      { year: 2023, paper: 'Paper 1 (Non-calc)', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2023, paper: 'Paper 2 (Calc)', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2023, paper: 'Paper 3 (Calc)', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2022, paper: 'Paper 1 (Non-calc)', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2022, paper: 'Paper 2 (Calc)', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2022, paper: 'Paper 3 (Calc)', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2019, paper: 'Paper 1 (Non-calc)', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2019, paper: 'Paper 2 (Calc)', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2018, paper: 'Paper 1 (Non-calc)', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2018, paper: 'Paper 2 (Calc)', url: 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
    ],
  },
  'Edexcel': {
    'GCSE Physics': [
      { year: 2023, paper: 'Paper 1', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/' },
      { year: 2023, paper: 'Paper 2', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/' },
      { year: 2022, paper: 'Paper 1', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/' },
      { year: 2022, paper: 'Paper 2', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/' },
      { year: 2019, paper: 'Paper 1', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/' },
      { year: 2019, paper: 'Paper 2', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-edexcel/' },
    ],
    'GCSE Maths': [
      { year: 2023, paper: 'Paper 1 (Non-calc)', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2023, paper: 'Paper 2 (Calc)', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2023, paper: 'Paper 3 (Calc)', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2022, paper: 'Paper 1 (Non-calc)', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2022, paper: 'Paper 2 (Calc)', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2019, paper: 'Paper 1 (Non-calc)', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
      { year: 2019, paper: 'Paper 2 (Calc)', url: 'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html', pmt: 'https://www.mathsgenie.co.uk/gcse.html' },
    ],
  },
  'OCR': {
    'GCSE Physics': [
      { year: 2023, paper: 'Paper 1', url: 'https://www.ocr.org.uk/administration/stage-5-certification/past-papers/', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-ocr/' },
      { year: 2023, paper: 'Paper 2', url: 'https://www.ocr.org.uk/administration/stage-5-certification/past-papers/', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-ocr/' },
      { year: 2022, paper: 'Paper 1', url: 'https://www.ocr.org.uk/administration/stage-5-certification/past-papers/', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-ocr/' },
      { year: 2022, paper: 'Paper 2', url: 'https://www.ocr.org.uk/administration/stage-5-certification/past-papers/', pmt: 'https://www.physicsandmathstutor.com/physics-revision/gcse-ocr/' },
    ],
  },
}

// ─── Resource links by topic (for post-marking suggestions) ──────────────────
export const TOPIC_RESOURCES = {
  // Physics
  'Forces & Motion': [
    { name: 'Physics & Maths Tutor — Forces', url: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/forces/', type: 'Notes + Questions' },
    { name: 'BBC Bitesize — Forces', url: 'https://www.bbc.co.uk/bitesize/topics/zh2xsbk', type: 'Explanations' },
    { name: 'Cognito — Forces videos', url: 'https://www.youtube.com/@CognitoYT', type: 'Video' },
  ],
  'Energy': [
    { name: 'Physics & Maths Tutor — Energy', url: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/energy/', type: 'Notes + Questions' },
    { name: 'BBC Bitesize — Energy', url: 'https://www.bbc.co.uk/bitesize/topics/zqxxsbk', type: 'Explanations' },
  ],
  'Waves': [
    { name: 'Physics & Maths Tutor — Waves', url: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/waves/', type: 'Notes + Questions' },
    { name: 'BBC Bitesize — Waves', url: 'https://www.bbc.co.uk/bitesize/topics/zxbg87h', type: 'Explanations' },
  ],
  'Electricity': [
    { name: 'Physics & Maths Tutor — Electricity', url: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/electricity/', type: 'Notes + Questions' },
    { name: 'BBC Bitesize — Electricity', url: 'https://www.bbc.co.uk/bitesize/topics/zgy39j6', type: 'Explanations' },
  ],
  'Atomic Structure': [
    { name: 'Physics & Maths Tutor — Atomic Structure', url: 'https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/atomic-structure/', type: 'Notes + Questions' },
    { name: 'BBC Bitesize — Atomic Structure', url: 'https://www.bbc.co.uk/bitesize/topics/zqbxbk7', type: 'Explanations' },
  ],
  // Maths
  'Trigonometry': [
    { name: 'Maths Genie — Trigonometry', url: 'https://www.mathsgenie.co.uk/trigonometry.html', type: 'Practice + Videos' },
    { name: 'Physics & Maths Tutor — Trig', url: 'https://www.physicsandmathstutor.com/maths-revision/gcse/', type: 'Notes + Questions' },
    { name: 'Corbettmaths — Trigonometry', url: 'https://corbettmaths.com/contents/', type: 'Videos + Worksheets' },
  ],
  'Algebra': [
    { name: 'Maths Genie — Algebra', url: 'https://www.mathsgenie.co.uk/algebra.html', type: 'Practice + Videos' },
    { name: 'Corbettmaths — Algebra', url: 'https://corbettmaths.com/contents/', type: 'Videos + Worksheets' },
  ],
  'Geometry': [
    { name: 'Maths Genie — Geometry', url: 'https://www.mathsgenie.co.uk/geometry.html', type: 'Practice + Videos' },
    { name: 'Corbettmaths — Geometry', url: 'https://corbettmaths.com/contents/', type: 'Videos + Worksheets' },
  ],
  'Number': [
    { name: 'Maths Genie — Number', url: 'https://www.mathsgenie.co.uk/number.html', type: 'Practice + Videos' },
    { name: 'BBC Bitesize — Number', url: 'https://www.bbc.co.uk/bitesize/topics/z3tbg82', type: 'Explanations' },
  ],
  // Chemistry
  'Quantitative Chemistry': [
    { name: 'Physics & Maths Tutor — Quantitative Chemistry', url: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/', type: 'Notes + Questions' },
    { name: 'BBC Bitesize — Quantitative Chemistry', url: 'https://www.bbc.co.uk/bitesize/topics/zps3gwx', type: 'Explanations' },
  ],
  'Bonding & Structure': [
    { name: 'Physics & Maths Tutor — Bonding', url: 'https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/', type: 'Notes + Questions' },
    { name: 'BBC Bitesize — Bonding', url: 'https://www.bbc.co.uk/bitesize/topics/z8xtmnb', type: 'Explanations' },
  ],
  // Default for anything not mapped
  'default': [
    { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com', type: 'Notes + Past Papers' },
    { name: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize/levels/z98jmp3', type: 'Explanations + Quizzes' },
    { name: 'Maths Genie', url: 'https://www.mathsgenie.co.uk', type: 'Practice Questions' },
    { name: 'Save My Exams', url: 'https://www.savemyexams.com', type: 'Exam practice' },
  ],
}
