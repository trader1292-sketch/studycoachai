// Generates inline SVG diagrams for GCSE questions
// Detects question type and draws the appropriate diagram

export function generateDiagram(question, topic) {
  const q = question.toLowerCase()
  const t = (topic || '').toLowerCase()

  // Right-angled triangle
  if (q.includes('right') && (q.includes('triangle') || q.includes('angle'))) {
    const nums = question.match(/[\d.]+/g) || ['3', '4', '5']
    return rightAngledTriangle(nums[0], nums[1], nums[2])
  }
  // Sine / cosine rule triangle (non-right-angled)
  if (q.includes('sine rule') || q.includes('cosine rule') || (q.includes('triangle') && !q.includes('right'))) {
    return generalTriangle()
  }
  // Force diagram
  if ((t.includes('force') || q.includes('force') || q.includes('newton')) && !q.includes('electric')) {
    return forceDiagram(question)
  }
  // Circuit diagram hint
  if (q.includes('circuit') || q.includes('resistor') || q.includes('ammeter')) {
    return circuitHint()
  }
  // Wave diagram
  if (q.includes('wave') || q.includes('wavelength') || q.includes('frequency')) {
    return waveDiagram()
  }
  // Distance-time or speed-time graph
  if (q.includes('distance-time') || q.includes('speed-time') || q.includes('velocity-time')) {
    return graphHint()
  }
  // Trig graph
  if (q.includes('sin(') || q.includes('cos(') || q.includes('tan(') || (t.includes('trig') && q.includes('graph'))) {
    return trigGraph()
  }
  return null // no diagram needed
}

// ── Right-angled triangle ────────────────────────────────────────────────────
function rightAngledTriangle(a, b, c) {
  return `<svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg" style="max-width:260px;width:100%">
    <style>.lbl{font-family:Georgia,serif;font-size:14px;fill:#1A56DB}.sq{fill:none;stroke:#374151;stroke-width:1.5}.dim{font-family:Georgia,serif;font-size:12px;fill:#6B7280}.theta{font-family:Georgia,serif;font-size:15px;fill:#E02424;font-style:italic}</style>
    <!-- Triangle -->
    <polygon points="30,170 230,170 30,40" fill="#EBF1FF" stroke="#1A56DB" stroke-width="2"/>
    <!-- Right angle box -->
    <rect x="30" y="150" width="18" height="18" class="sq"/>
    <!-- Labels -->
    <text x="130" y="190" text-anchor="middle" class="dim">Adjacent = ${a || '?'}</text>
    <text x="16" y="108" text-anchor="middle" class="dim" transform="rotate(-90,16,108)">Opposite = ${b || '?'}</text>
    <text x="140" y="95" text-anchor="middle" class="dim" transform="rotate(-33,140,95)">Hypotenuse = ${c || '?'}</text>
    <!-- Theta angle -->
    <path d="M 30,170 Q 70,170 55,148" fill="none" stroke="#E02424" stroke-width="1.5"/>
    <text x="68" y="168" class="theta">θ</text>
    <!-- Title -->
    <text x="130" y="18" text-anchor="middle" style="font-family:Georgia,serif;font-size:11px;fill:#9CA3AF">Right-angled triangle</text>
  </svg>`
}

// ── General triangle (sine/cosine rule) ─────────────────────────────────────
function generalTriangle() {
  return `<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" style="max-width:280px;width:100%">
    <style>.lbl{font-family:Georgia,serif;font-size:13px;fill:#1A56DB}.ang{font-family:Georgia,serif;font-size:13px;fill:#E02424;font-style:italic}</style>
    <polygon points="50,170 230,170 140,40" fill="#EBF1FF" stroke="#1A56DB" stroke-width="2"/>
    <!-- Side labels -->
    <text x="140" y="190" text-anchor="middle" class="lbl">c</text>
    <text x="82" y="108" text-anchor="middle" class="lbl">b</text>
    <text x="196" y="108" text-anchor="middle" class="lbl">a</text>
    <!-- Angle labels -->
    <text x="44" y="168" class="ang">C</text>
    <text x="136" y="34" class="ang">B</text>
    <text x="232" y="168" class="ang">A</text>
    <text x="140" y="18" text-anchor="middle" style="font-family:Georgia,serif;font-size:11px;fill:#9CA3AF">Triangle (sides a,b,c — angles A,B,C opposite)</text>
  </svg>`
}

// ── Force diagram ────────────────────────────────────────────────────────────
function forceDiagram(question) {
  const hasGravity = question.toLowerCase().includes('weight') || question.toLowerCase().includes('gravity')
  const hasFriction = question.toLowerCase().includes('friction')
  return `<svg viewBox="0 0 260 220" xmlns="http://www.w3.org/2000/svg" style="max-width:260px;width:100%">
    <style>.lbl{font-family:Georgia,serif;font-size:12px;fill:#374151}.arr{stroke:#1A56DB;stroke-width:2.5;marker-end:url(#ah)}</style>
    <defs>
      <marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#1A56DB"/>
      </marker>
      <marker id="ahr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#E02424"/>
      </marker>
    </defs>
    <!-- Object box -->
    <rect x="100" y="90" width="60" height="40" fill="#DBEAFE" stroke="#1A56DB" stroke-width="2" rx="4"/>
    <text x="130" y="115" text-anchor="middle" style="font-family:Georgia,serif;font-size:12px;fill:#1A56DB">Object</text>
    <!-- Applied force (right) -->
    <line x1="160" y1="110" x2="220" y2="110" class="arr"/>
    <text x="222" y="114" class="lbl">F (applied)</text>
    <!-- Weight (down) -->
    ${hasGravity ? `<line x1="130" y1="130" x2="130" y2="180" stroke="#E02424" stroke-width="2.5" marker-end="url(#ahr)"/>
    <text x="134" y="196" class="lbl" style="fill:#E02424">W = mg</text>` : ''}
    <!-- Normal (up) -->
    <line x1="130" y1="90" x2="130" y2="40" stroke="#059669" stroke-width="2.5" marker-end="url(#ah)"/>
    <text x="134" y="30" class="lbl" style="fill:#059669">Normal</text>
    <!-- Friction (left) -->
    ${hasFriction ? `<line x1="100" y1="110" x2="50" y2="110" stroke="#D97706" stroke-width="2.5" marker-end="url(#ah)"/>
    <text x="6" y="114" class="lbl" style="fill:#D97706">Friction</text>` : ''}
    <text x="130" y="18" text-anchor="middle" style="font-family:Georgia,serif;font-size:11px;fill:#9CA3AF">Force diagram — add your values</text>
  </svg>`
}

// ── Circuit hint ─────────────────────────────────────────────────────────────
function circuitHint() {
  return `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" style="max-width:280px;width:100%">
    <style>.lbl{font-family:Georgia,serif;font-size:11px;fill:#374151}</style>
    <!-- Simple series circuit -->
    <rect x="20" y="20" width="240" height="140" rx="4" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="1"/>
    <!-- Wires -->
    <polyline points="40,90 40,40 240,40 240,90" fill="none" stroke="#374151" stroke-width="2"/>
    <polyline points="40,90 40,140 240,140 240,90" fill="none" stroke="#374151" stroke-width="2"/>
    <!-- Battery -->
    <line x1="40" y1="75" x2="40" y2="105" stroke="#374151" stroke-width="4"/>
    <line x1="48" y1="82" x2="48" y2="98" stroke="#374151" stroke-width="2"/>
    <text x="12" y="96" class="lbl">+</text>
    <!-- Resistor -->
    <rect x="100" y="32" width="50" height="16" fill="white" stroke="#1A56DB" stroke-width="1.5" rx="2"/>
    <text x="125" y="45" text-anchor="middle" class="lbl" style="fill:#1A56DB">R</text>
    <!-- Bulb/component -->
    <circle cx="200" cy="40" r="10" fill="white" stroke="#E02424" stroke-width="1.5"/>
    <text x="200" y="44" text-anchor="middle" class="lbl" style="fill:#E02424">L</text>
    <!-- Ammeter -->
    <circle cx="140" cy="140" r="10" fill="white" stroke="#059669" stroke-width="1.5"/>
    <text x="140" y="144" text-anchor="middle" class="lbl" style="fill:#059669">A</text>
    <!-- Labels -->
    <text x="130" y="165" text-anchor="middle" style="font-family:Georgia,serif;font-size:10px;fill:#9CA3AF">Circuit diagram — sketch your own based on the question</text>
  </svg>`
}

// ── Wave diagram ─────────────────────────────────────────────────────────────
function waveDiagram() {
  const pts = []
  for (let x = 0; x <= 260; x += 2) {
    const y = 80 + 40 * Math.sin((x / 260) * 4 * Math.PI)
    pts.push(`${x + 10},${y}`)
  }
  return `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" style="max-width:280px;width:100%">
    <style>.lbl{font-family:Georgia,serif;font-size:11px;fill:#374151}</style>
    <!-- Axes -->
    <line x1="10" y1="80" x2="275" y2="80" stroke="#D1D5DB" stroke-width="1"/>
    <line x1="10" y1="10" x2="10" y2="160" stroke="#D1D5DB" stroke-width="1"/>
    <!-- Wave -->
    <polyline points="${pts.join(' ')}" fill="none" stroke="#1A56DB" stroke-width="2.5"/>
    <!-- Labels -->
    <text x="145" y="175" text-anchor="middle" class="lbl">← wavelength (λ) →</text>
    <text x="275" y="84" class="lbl">→</text>
    <!-- Amplitude arrow -->
    <line x1="75" y1="80" x2="75" y2="40" stroke="#E02424" stroke-width="1.5" stroke-dasharray="4,2"/>
    <text x="78" y="58" class="lbl" style="fill:#E02424">A</text>
    <text x="130" y="18" text-anchor="middle" style="font-family:Georgia,serif;font-size:11px;fill:#9CA3AF">Wave — λ=wavelength, A=amplitude, f=frequency</text>
  </svg>`
}

// ── Trig graph ───────────────────────────────────────────────────────────────
function trigGraph() {
  const pts = []
  for (let i = 0; i <= 360; i += 3) {
    const x = 20 + (i / 360) * 240
    const y = 80 - 50 * Math.sin((i * Math.PI) / 180)
    pts.push(`${x},${y}`)
  }
  return `<svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" style="max-width:280px;width:100%">
    <style>.lbl{font-family:Georgia,serif;font-size:11px;fill:#374151}</style>
    <rect x="0" y="0" width="280" height="175" fill="#F9FAFB" rx="4"/>
    <!-- Grid -->
    <line x1="20" y1="80" x2="265" y2="80" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="20" y1="10" x2="20" y2="155" stroke="#E5E7EB" stroke-width="1"/>
    <!-- Tick marks -->
    <line x1="80" y1="77" x2="80" y2="83" stroke="#9CA3AF" stroke-width="1"/>
    <text x="78" y="95" class="lbl">90°</text>
    <line x1="140" y1="77" x2="140" y2="83" stroke="#9CA3AF" stroke-width="1"/>
    <text x="132" y="95" class="lbl">180°</text>
    <line x1="200" y1="77" x2="200" y2="83" stroke="#9CA3AF" stroke-width="1"/>
    <text x="192" y="95" class="lbl">270°</text>
    <line x1="260" y1="77" x2="260" y2="83" stroke="#9CA3AF" stroke-width="1"/>
    <text x="252" y="95" class="lbl">360°</text>
    <!-- y-axis labels -->
    <text x="4" y="34" class="lbl">1</text>
    <text x="1" y="130" class="lbl">-1</text>
    <!-- Sine curve -->
    <polyline points="${pts.join(' ')}" fill="none" stroke="#1A56DB" stroke-width="2"/>
    <text x="22" y="25" class="lbl" style="fill:#1A56DB">y = sin(x)</text>
    <text x="140" y="165" text-anchor="middle" style="font-family:Georgia,serif;font-size:10px;fill:#9CA3AF">sin(x) graph — adapts to your question</text>
  </svg>`
}

// ── Graph hint ───────────────────────────────────────────────────────────────
function graphHint() {
  return `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" style="max-width:280px;width:100%">
    <style>.lbl{font-family:Georgia,serif;font-size:11px;fill:#374151}</style>
    <rect x="0" y="0" width="280" height="180" fill="#F9FAFB" rx="4"/>
    <!-- Axes -->
    <line x1="40" y1="20" x2="40" y2="150" stroke="#374151" stroke-width="2"/>
    <line x1="40" y1="150" x2="260" y2="150" stroke="#374151" stroke-width="2"/>
    <!-- Arrow heads -->
    <polygon points="40,15 35,25 45,25" fill="#374151"/>
    <polygon points="265,150 255,145 255,155" fill="#374151"/>
    <!-- Example line -->
    <line x1="40" y1="150" x2="160" y2="60" stroke="#1A56DB" stroke-width="2"/>
    <line x1="160" y1="60" x2="260" y2="60" stroke="#1A56DB" stroke-width="2" stroke-dasharray="6,3"/>
    <!-- Labels -->
    <text x="30" y="12" class="lbl">d/s</text>
    <text x="255" y="165" class="lbl">t</text>
    <text x="130" y="172" text-anchor="middle" style="font-family:Georgia,serif;font-size:10px;fill:#9CA3AF">Sketch your graph — label axes with units</text>
  </svg>`
}
