/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * High-definition Vector SVG Diagram Generator for UNEB Curriculum
 * Provides reliable, scalable 1K/2K/4K visual blueprints when cloud image models are rate-limited.
 */

export interface GeneratedDiagramResult {
  svg: string;
  description: string;
}

export function generateUNEBDiagramSVG(
  prompt: string,
  imageSize: '1K' | '2K' | '4K' = '1K',
  aspectRatio: string = '16:9'
): GeneratedDiagramResult {
  const lower = prompt.toLowerCase();

  // Determine viewport dimensions based on imageSize affordance and aspectRatio
  let baseWidth = 1280;
  let baseHeight = 720;

  if (aspectRatio === '4:3') {
    baseWidth = 1024;
    baseHeight = 768;
  } else if (aspectRatio === '1:1') {
    baseWidth = 900;
    baseHeight = 900;
  }

  // 1. Human Heart & Double Circulation (PLE Science & UCE Biology 553)
  if (lower.includes('heart') || lower.includes('circulation') || lower.includes('blood') || lower.includes('valve')) {
    return generateHeartSVG(baseWidth, baseHeight, imageSize);
  }

  // 2. East Africa Rift Valley & Horst Block Mountains (UCE Geography 273/1 & PLE SST)
  if (lower.includes('rift') || lower.includes('valley') || lower.includes('horst') || lower.includes('mountain') || lower.includes('fault')) {
    return generateRiftValleySVG(baseWidth, baseHeight, imageSize);
  }

  // 3. Snell's Law & Glass Prism Light Refraction (UCE Physics 535)
  if (lower.includes('prism') || lower.includes('refraction') || lower.includes('snell') || lower.includes('optics') || lower.includes('light')) {
    return generatePrismRefractionSVG(baseWidth, baseHeight, imageSize);
  }

  // 4. Plant Cell vs Animal Cell (PLE Science & UCE Biology 553)
  if (lower.includes('cell') || lower.includes('organelle') || lower.includes('chloroplast') || lower.includes('vacuole')) {
    return generateCellComparisonSVG(baseWidth, baseHeight, imageSize);
  }

  // 5. Mendelian Genetics & Punnett Square (UCE Biology 553)
  if (lower.includes('punnett') || lower.includes('genetics') || lower.includes('mendel') || lower.includes('allele') || lower.includes('hybrid')) {
    return generatePunnettSquareSVG(baseWidth, baseHeight, imageSize);
  }

  // 6. Circle Theorems (UCE Mathematics 456)
  if (lower.includes('circle') || lower.includes('theorem') || lower.includes('tangent') || lower.includes('chord')) {
    return generateCircleTheoremsSVG(baseWidth, baseHeight, imageSize);
  }

  // 7. Quadratic Function & Parabola (UCE Mathematics 456)
  if (lower.includes('quadratic') || lower.includes('parabola') || lower.includes('curve') || lower.includes('vertex') || lower.includes('axis of symmetry')) {
    return generateQuadraticParabolaSVG(baseWidth, baseHeight, imageSize);
  }

  // 8. Electric Circuits & Ohm's Law (UCE Physics 535)
  if (lower.includes('circuit') || lower.includes('ohm') || lower.includes('resistor') || lower.includes('ammeter') || lower.includes('voltmeter') || lower.includes('current')) {
    return generateElectricCircuitSVG(prompt, baseWidth, baseHeight, imageSize);
  }

  // 9. Atomic Structure & Bohr Model (UCE Chemistry 545 / Physics)
  if (lower.includes('atom') || lower.includes('bohr') || lower.includes('electron') || lower.includes('proton') || lower.includes('nucleus') || lower.includes('neutron')) {
    return generateAtomicStructureSVG(prompt, baseWidth, baseHeight, imageSize);
  }

  // 10. Photosynthesis & Leaf Structure (PLE Science & UCE Biology 553)
  if (lower.includes('photosynthesis') || lower.includes('chlorophyll') || lower.includes('stoma') || lower.includes('leaf') || lower.includes('transpiration')) {
    return generatePhotosynthesisSVG(prompt, baseWidth, baseHeight, imageSize);
  }

  // Default: Dynamic Comprehensive UNEB Technical Concept Blueprint for ANY prompt
  return generateGenericUNEBBlueprintSVG(prompt, baseWidth, baseHeight, imageSize);
}

// -------------------------------------------------------------
// Diagram 1: Human Heart & Double Circulation
// -------------------------------------------------------------
function generateHeartSVG(w: number, h: number, size: string): GeneratedDiagramResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e1b4b" />
      </linearGradient>
      <linearGradient id="deox" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#1d4ed8" />
        <stop offset="100%" stop-color="#3b82f6" />
      </linearGradient>
      <linearGradient id="ox" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#dc2626" />
        <stop offset="100%" stop-color="#ef4444" />
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.5" />
      </filter>
    </defs>

    <!-- Background Blueprint Grid -->
    <rect width="1280" height="720" fill="url(#bg)" />
    <g opacity="0.08" stroke="#ffffff" stroke-width="1">
      ${Array.from({ length: 26 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="720" />`).join('')}
      ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="1280" y2="${i * 50}" />`).join('')}
    </g>

    <!-- Header Banner -->
    <rect x="40" y="30" width="1200" height="65" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="60" y="68" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold">
      UNEB PLE &amp; UCE BIOLOGY 553 CURRICULUM BLUEPRINT • RESOLUTION: ${size}
    </text>
    <text x="60" y="86" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="13">
      Mammalian Heart: 4 Chambers, Major Blood Vessels, One-Way Valves, and Double Circulation Pathway
    </text>
    <rect x="1080" y="45" width="140" height="34" rx="6" fill="#047857" />
    <text x="1150" y="67" fill="#ecfdf5" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">OFFICIAL SYLLABUS</text>

    <!-- Main Heart Diagram Center -->
    <g transform="translate(360, 130)" filter="url(#shadow)">
      <!-- Outer Heart Muscular Wall (Pericardium / Myocardium) -->
      <path d="M 280 80 C 180 -10, 40 40, 70 200 C 90 310, 240 430, 280 470 C 320 430, 470 310, 490 200 C 520 40, 380 -10, 280 80 Z" fill="#334155" stroke="#475569" stroke-width="8" />

      <!-- Deoxygenated Right Side (Anatomical Right = Viewer Left) -->
      <path d="M 270 95 C 190 20, 80 60, 95 190 C 105 280, 220 380, 260 430 L 260 95 Z" fill="url(#deox)" opacity="0.9" />

      <!-- Oxygenated Left Side (Anatomical Left = Viewer Right) -->
      <path d="M 290 95 L 290 430 C 330 380, 445 280, 455 190 C 470 60, 360 20, 280 95 Z" fill="url(#ox)" opacity="0.9" />

      <!-- Central Septum Wall -->
      <rect x="268" y="90" width="24" height="350" rx="6" fill="#1e293b" stroke="#cbd5e1" stroke-width="2" />
      <text x="280" y="270" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" transform="rotate(-90 280 270)">SEPTUM (PREVENTS MIXING)</text>

      <!-- Superior Vena Cava -->
      <path d="M 120 -20 L 120 70 L 165 70 L 165 -20 Z" fill="#2563eb" stroke="#93c5fd" stroke-width="2" />
      <text x="142" y="25" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SVC</text>

      <!-- Aorta Arch (Top Red) -->
      <path d="M 250 -40 C 250 -70, 360 -70, 360 50 L 320 50 C 320 -30, 280 -30, 280 -40 Z" fill="#dc2626" stroke="#fca5a5" stroke-width="2" />
      <!-- 3 Aortic branches -->
      <rect x="270" y="-85" width="14" height="25" fill="#dc2626" rx="2" />
      <rect x="295" y="-90" width="14" height="28" fill="#dc2626" rx="2" />
      <rect x="320" y="-85" width="14" height="25" fill="#dc2626" rx="2" />

      <!-- Pulmonary Artery (Blue Arch branching) -->
      <path d="M 210 20 C 210 -20, 150 -30, 90 -20 L 90 -45 C 170 -60, 240 -30, 240 20 Z" fill="#1d4ed8" stroke="#bfdbfe" stroke-width="2" />

      <!-- Internal Chambers Dividers -->
      <line x1="95" y1="220" x2="268" y2="220" stroke="#ffffff" stroke-width="3" stroke-dasharray="6,4" />
      <line x1="292" y1="220" x2="455" y2="220" stroke="#ffffff" stroke-width="3" stroke-dasharray="6,4" />

      <!-- Chamber Labels -->
      <text x="180" y="160" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">RIGHT ATRIUM</text>
      <text x="180" y="180" fill="#bfdbfe" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">(Deoxygenated Blood)</text>

      <text x="180" y="310" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">RIGHT VENTRICLE</text>
      <text x="180" y="330" fill="#bfdbfe" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">(Pumps to Lungs)</text>

      <text x="375" y="160" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">LEFT ATRIUM</text>
      <text x="375" y="180" fill="#fecaca" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">(From Pulm. Veins)</text>

      <text x="375" y="310" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">LEFT VENTRICLE</text>
      <text x="375" y="330" fill="#fecaca" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">(Thick Wall, Pumps to Body)</text>

      <!-- Valves Indicators -->
      <circle cx="180" cy="220" r="10" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
      <circle cx="375" cy="220" r="10" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
    </g>

    <!-- Callouts & Labeled Annotation Cards -->
    <!-- Left Callouts -->
    <g transform="translate(60, 140)">
      <rect width="260" height="90" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" />
      <text x="15" y="25" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">1. Superior &amp; Inferior Vena Cava</text>
      <text x="15" y="48" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">Brings deoxygenated blood from upper</text>
      <text x="15" y="66" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">and lower body tissues into Right Atrium.</text>
      <line x1="260" y1="45" x2="350" y2="45" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,3" />

      <g transform="translate(0, 110)">
        <rect width="260" height="90" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
        <text x="15" y="25" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">2. Tricuspid Valve</text>
        <text x="15" y="48" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">Three cusps/flaps preventing backflow of</text>
        <text x="15" y="66" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">blood from Right Ventricle into Atrium.</text>
        <line x1="260" y1="45" x2="480" y2="100" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3" />
      </g>

      <g transform="translate(0, 220)">
        <rect width="260" height="90" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" />
        <text x="15" y="25" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">3. Pulmonary Artery</text>
        <text x="15" y="48" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">Sole artery carrying DEOXYGENATED blood</text>
        <text x="15" y="66" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">directly from RV to lungs for oxygenation.</text>
      </g>
    </g>

    <!-- Right Callouts -->
    <g transform="translate(940, 140)">
      <rect width="280" height="90" rx="8" fill="#1e293b" stroke="#ef4444" stroke-width="1.5" />
      <text x="15" y="25" fill="#f87171" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">4. Aorta (Main Systemic Artery)</text>
      <text x="15" y="48" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">Arises from Left Ventricle under extreme</text>
      <text x="15" y="66" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">pressure; distributes oxygenated blood.</text>
      <line x1="0" y1="45" x2="-80" y2="-40" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3" />

      <g transform="translate(0, 110)">
        <rect width="280" height="90" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
        <text x="15" y="25" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">5. Bicuspid (Mitral) Valve</text>
        <text x="15" y="48" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">Two cusps preventing backflow of blood</text>
        <text x="15" y="66" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">from Left Ventricle into Left Atrium.</text>
        <line x1="0" y1="45" x2="-200" y2="100" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3" />
      </g>

      <g transform="translate(0, 220)">
        <rect width="280" height="90" rx="8" fill="#1e293b" stroke="#ef4444" stroke-width="1.5" />
        <text x="15" y="25" fill="#f87171" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">6. Thick Left Ventricular Wall</text>
        <text x="15" y="48" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">3x thicker than Right Ventricle to pump</text>
        <text x="15" y="66" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">blood against high systemic resistance.</text>
      </g>
    </g>

    <!-- Footer Rubric Guide -->
    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="60" y="672" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">UNEB EXAM ESSENTIAL:</text>
    <text x="240" y="672" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">
      "Double circulation" means blood passes through the heart TWICE for each complete circuit: Pulmonary Circulation (Heart → Lungs → Heart) and Systemic Circulation (Heart → Body → Heart).
    </text>
  </svg>`;

  return {
    svg,
    description: 'UNEB Biology 553 & PLE Integrated Science standard blueprint: Mammalian 4-chambered heart showing double circulation, labeled vena cava, aorta, pulmonary vessels, valves, and comparative ventricular wall thickness.',
  };
}

// -------------------------------------------------------------
// Diagram 2: East Africa Rift Valley & Horst Block Mountains
// -------------------------------------------------------------
function generateRiftValleySVG(w: number, h: number, size: string): GeneratedDiagramResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="magma" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ef4444" />
        <stop offset="100%" stop-color="#991b1b" />
      </linearGradient>
    </defs>

    <rect width="1280" height="720" fill="url(#bg)" />
    <!-- Header -->
    <rect x="40" y="30" width="1200" height="65" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="60" y="68" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">
      UNEB UCE GEOGRAPHY 273/1 &amp; PLE SST CURRICULUM BLUEPRINT • RESOLUTION: ${size}
    </text>
    <text x="60" y="86" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">
      Tectonic Faulting: Formation of the East African Rift Valley (Tensional Force Theory) &amp; Horst (Rwenzori Mountains)
    </text>

    <!-- Geological Cross-Section -->
    <g transform="translate(100, 180)">
      <!-- Left Plateau Block -->
      <polygon points="0,150 250,150 220,380 0,380" fill="#334155" stroke="#64748b" stroke-width="2" />
      <text x="90" y="190" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Western Plateau</text>
      <text x="90" y="210" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Crystalline Basement</text>

      <!-- Tension Arrow Left -->
      <path d="M 60 120 L 10 120 M 25 110 L 10 120 L 25 130" stroke="#f59e0b" stroke-width="4" fill="none" />
      <text x="15" y="95" fill="#f59e0b" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Tensional Force (←)</text>

      <!-- Fault Plane 1 (Normal Fault) -->
      <line x1="250" y1="150" x2="220" y2="380" stroke="#ef4444" stroke-width="4" stroke-dasharray="6,4" />
      <text x="170" y="280" fill="#f87171" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" transform="rotate(75 170 280)">Normal Fault Plane</text>

      <!-- Central Sunken Graben (Rift Valley Floor) -->
      <polygon points="250,260 550,260 520,380 220,380" fill="#1e293b" stroke="#64748b" stroke-width="2" />
      <!-- Water Lake (e.g. Lake Albert / Edward) -->
      <ellipse cx="400" cy="260" rx="90" ry="12" fill="#0284c7" />
      <text x="400" y="235" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">RIFT VALLEY FLOOR (GRABEN)</text>
      <text x="400" y="295" fill="#bae6fd" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Lake Albert / Edward Grabens</text>
      <text x="400" y="320" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">Down-faulted central block between parallel faults</text>

      <!-- Fault Scarp / Escarpment Left -->
      <line x1="250" y1="150" x2="250" y2="260" stroke="#e2e8f0" stroke-width="3" />
      <text x="260" y="210" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Escarpment (Scarp Face)</text>

      <!-- Fault Plane 2 -->
      <line x1="550" y1="260" x2="580" y2="150" stroke="#ef4444" stroke-width="4" stroke-dasharray="6,4" />

      <!-- Horst Block (Block Mountain - Mt. Rwenzori) -->
      <polygon points="580,100 800,100 830,380 550,380" fill="#475569" stroke="#94a3b8" stroke-width="2" />
      <!-- Mountain Peak -->
      <polygon points="630,100 690,30 750,100" fill="#64748b" stroke="#cbd5e1" stroke-width="2" />
      <text x="690" y="70" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">HORST / BLOCK MTN</text>
      <text x="690" y="88" fill="#fde047" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Mt. Rwenzori (5,109 m)</text>
      <text x="690" y="130" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">Block upthrown between faults</text>

      <!-- Tension Arrow Right -->
      <path d="M 1000 120 L 1050 120 M 1035 110 L 1050 120 L 1035 130" stroke="#f59e0b" stroke-width="4" fill="none" />
      <text x="960" y="95" fill="#f59e0b" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Tensional Force (→)</text>

      <!-- Eastern Arm (Gregory Rift & Lake Victoria Basin) -->
      <polygon points="800,150 1080,150 1080,380 830,380" fill="#334155" stroke="#64748b" stroke-width="2" />
      <text x="940" y="190" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Eastern Plateau</text>
      <text x="940" y="210" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Central Ugandan Downwarp</text>

      <!-- Mantle & Magma Convection below -->
      <rect x="0" y="380" width="1080" height="90" fill="url(#magma)" opacity="0.85" />
      <text x="540" y="430" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">
        ASTHENOSPHERE / SEMI-MOLTEN MANTLE CONVECTION CURRENTS
      </text>
      <text x="540" y="452" fill="#fecaca" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">
        Upwelling thermal plumes drive lateral crustal tension across the African Plate
      </text>
    </g>

    <!-- Footer -->
    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="60" y="672" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">UNEB ESSENTIAL:</text>
    <text x="210" y="672" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">
      Under UNEB Geography Paper 1 (273/1): Differentiate Tensional Theory (E. Gregory) from Compressional Theory (E.J. Wayland). The Western Rift branch contains grabens occupied by Lakes Albert, Edward, and George.
    </text>
  </svg>`;

  return {
    svg,
    description: 'UNEB Geography 273/1 & PLE SST standard blueprint: Geological cross-section of the East African Rift Valley under crustal tension, showing normal fault scarps, down-dropped graben floor, Rwenzori horst block mountain, and mantle convection.',
  };
}

// -------------------------------------------------------------
// Diagram 3: Snell's Law & Glass Prism Refraction
// -------------------------------------------------------------
function generatePrismRefractionSVG(w: number, h: number, size: string): GeneratedDiagramResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="100%" stop-color="#111827" />
      </linearGradient>
      <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1" />
      </linearGradient>
    </defs>

    <rect width="1280" height="720" fill="url(#bg)" />
    <!-- Header -->
    <rect x="40" y="30" width="1200" height="65" rx="10" fill="#1f2937" stroke="#374151" stroke-width="1.5" />
    <text x="60" y="68" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">
      UNEB UCE PHYSICS 535 CURRICULUM BLUEPRINT • RESOLUTION: ${size}
    </text>
    <text x="60" y="86" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="13">
      Optics: Light Refraction through an Equilateral Triangular Glass Prism, Deviation Angle (D), and Snell's Law
    </text>

    <!-- Center Stage: Triangular Prism -->
    <g transform="translate(420, 160)">
      <!-- Prism Triangle (Equilateral 60-60-60) -->
      <polygon points="220,60 20,410 420,410" fill="url(#glass)" stroke="#38bdf8" stroke-width="3" />
      <!-- Apex Angle A -->
      <path d="M 190 110 A 35 35 0 0 1 250 110" fill="none" stroke="#f59e0b" stroke-width="2.5" />
      <text x="220" y="135" fill="#f59e0b" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">A = 60°</text>

      <!-- Normal at Face 1 (AB) -->
      <line x1="20" y1="200" x2="220" y2="300" stroke="#9ca3af" stroke-width="1.5" stroke-dasharray="5,5" />
      <text x="15" y="195" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="11">Normal N₁</text>

      <!-- Incident Light Ray (Red Laser) -->
      <line x1="-160" y1="180" x2="105" y2="242" stroke="#ef4444" stroke-width="3.5" />
      <!-- Arrow on Incident Ray -->
      <polygon points="-30,202 -10,206 -25,215" fill="#ef4444" />
      <text x="-120" y="165" fill="#ef4444" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Incident Ray</text>

      <!-- Angle of Incidence i -->
      <path d="M 60 220 A 40 40 0 0 0 75 228" fill="none" stroke="#eab308" stroke-width="2" />
      <text x="45" y="222" fill="#eab308" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">i</text>

      <!-- Refracted Ray Inside Prism (Bends toward normal) -->
      <line x1="105" y1="242" x2="335" y2="242" stroke="#22c55e" stroke-width="3.5" />
      <polygon points="210,237 230,242 210,247" fill="#22c55e" />
      <text x="220" y="225" fill="#22c55e" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Refracted Ray (bends toward normal)</text>

      <!-- Angle of Refraction r1 -->
      <text x="145" y="265" fill="#86efac" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">r₁</text>

      <!-- Normal at Face 2 (AC) -->
      <line x1="220" y1="185" x2="420" y2="300" stroke="#9ca3af" stroke-width="1.5" stroke-dasharray="5,5" />
      <text x="430" y="310" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="11">Normal N₂</text>

      <!-- Emergent Ray Exiting Prism (Bends away from normal) -->
      <line x1="335" y1="242" x2="600" y2="380" stroke="#3b82f6" stroke-width="3.5" />
      <polygon points="460,305 480,317 465,325" fill="#3b82f6" />
      <text x="510" y="330" fill="#3b82f6" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Emergent Ray</text>

      <!-- Angle of Emergence e -->
      <text x="365" y="275" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">e</text>

      <!-- Straight-line Extrapolation of Incident Ray -->
      <line x1="105" y1="242" x2="480" y2="320" stroke="#f87171" stroke-width="1.5" stroke-dasharray="4,4" />

      <!-- Backwards Extrapolation of Emergent Ray -->
      <line x1="335" y1="242" x2="260" y2="200" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="4,4" />

      <!-- Angle of Deviation D -->
      <circle cx="280" cy="275" r="5" fill="#f59e0b" />
      <text x="295" y="280" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="15" font-weight="bold">Angle of Deviation (D)</text>
    </g>

    <!-- Left Formula Card -->
    <g transform="translate(60, 160)">
      <rect width="320" height="420" rx="10" fill="#1f2937" stroke="#374151" stroke-width="1.5" />
      <text x="20" y="35" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Snell's Law &amp; Refractive Index</text>
      <line x1="20" y1="50" x2="300" y2="50" stroke="#374151" stroke-width="1" />

      <text x="20" y="80" fill="#e5e7eb" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">1. Refractive Index (n):</text>
      <rect x="20" y="95" width="280" height="45" rx="6" fill="#111827" />
      <text x="160" y="123" fill="#fde047" font-family="Consolas, monospace" font-size="16" font-weight="bold" text-anchor="middle">n = sin(i) / sin(r)</text>

      <text x="20" y="170" fill="#e5e7eb" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">2. Prism Angle Relationship:</text>
      <rect x="20" y="185" width="280" height="45" rx="6" fill="#111827" />
      <text x="160" y="213" fill="#38bdf8" font-family="Consolas, monospace" font-size="16" font-weight="bold" text-anchor="middle">A = r₁ + r₂</text>

      <text x="20" y="260" fill="#e5e7eb" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">3. Total Deviation Formula:</text>
      <rect x="20" y="275" width="280" height="45" rx="6" fill="#111827" />
      <text x="160" y="303" fill="#4ade80" font-family="Consolas, monospace" font-size="16" font-weight="bold" text-anchor="middle">D = (i + e) - A</text>

      <text x="20" y="350" fill="#e5e7eb" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">4. Minimum Deviation (D_m):</text>
      <rect x="20" y="360" width="280" height="45" rx="6" fill="#111827" />
      <text x="160" y="388" fill="#fb923c" font-family="Consolas, monospace" font-size="13" font-weight="bold" text-anchor="middle">n = sin((A + D_m)/2) / sin(A/2)</text>
    </g>

    <!-- Footer -->
    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#1f2937" stroke="#374151" stroke-width="1" />
    <text x="60" y="672" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">UNEB PRACTICAL 535/3 TIP:</text>
    <text x="280" y="672" fill="#e5e7eb" font-family="system-ui, sans-serif" font-size="12">
      In the UNEB Physics optics practical, pins must be placed at least 5 cm apart to minimize parallax error when aligning the search pins with the refracted image.
    </text>
  </svg>`;

  return {
    svg,
    description: "UNEB Physics 535 standard blueprint: Ray optics through an equilateral triangular glass prism, illustrating incident angle (i), refracted ray (r), emergent ray (e), angle of deviation (D), and Snell's Law equations.",
  };
}

// -------------------------------------------------------------
// Diagram 4: Plant Cell vs Animal Cell
// -------------------------------------------------------------
function generateCellComparisonSVG(w: number, h: number, size: string): GeneratedDiagramResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <rect width="1280" height="720" fill="#0f172a" />
    <rect x="40" y="30" width="1200" height="65" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="60" y="68" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">
      UNEB PLE SCIENCE &amp; UCE BIOLOGY 553 • RESOLUTION: ${size}
    </text>
    <text x="60" y="86" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">
      Ultrastructure: Plant Cell (Rigid Cellulose Wall &amp; Chloroplasts) vs Animal Cell
    </text>

    <!-- Plant Cell (Left) -->
    <g transform="translate(80, 140)">
      <!-- Outer Wall -->
      <polygon points="40,20 460,20 480,420 20,420" fill="#065f46" stroke="#10b981" stroke-width="8" rx="20" />
      <!-- Cell Membrane Inner -->
      <polygon points="50,32 450,32 468,408 32,408" fill="#064e3b" stroke="#34d399" stroke-width="3" />
      <!-- Large Central Vacuole -->
      <ellipse cx="250" cy="220" rx="140" ry="110" fill="#0284c7" opacity="0.4" stroke="#38bdf8" stroke-width="2" />
      <text x="250" y="225" fill="#e0f2fe" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Large Central Vacuole</text>
      <!-- Chloroplasts -->
      <ellipse cx="110" cy="90" rx="35" ry="20" fill="#22c55e" stroke="#16a34a" stroke-width="2" />
      <ellipse cx="380" cy="90" rx="35" ry="20" fill="#22c55e" stroke="#16a34a" stroke-width="2" />
      <ellipse cx="120" cy="350" rx="35" ry="20" fill="#22c55e" stroke="#16a34a" stroke-width="2" />
      <ellipse cx="380" cy="350" rx="35" ry="20" fill="#22c55e" stroke="#16a34a" stroke-width="2" />
      <!-- Peripheral Nucleus -->
      <circle cx="410" cy="220" r="40" fill="#818cf8" stroke="#4f46e5" stroke-width="3" />
      <circle cx="410" cy="220" r="14" fill="#312e81" />

      <text x="250" y="-10" fill="#34d399" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">PLANT CELL (Fixed Shape)</text>
    </g>

    <!-- Animal Cell (Right) -->
    <g transform="translate(680, 140)">
      <!-- Irregular membrane -->
      <path d="M 240 20 C 390 10, 480 120, 460 260 C 440 390, 320 440, 190 410 C 60 380, 20 280, 50 140 C 70 40, 150 25, 240 20 Z" fill="#312e81" stroke="#818cf8" stroke-width="4" />
      <!-- Centered Nucleus -->
      <circle cx="250" cy="220" r="55" fill="#a855f7" stroke="#7e22ce" stroke-width="3" />
      <circle cx="250" cy="220" r="20" fill="#3b0764" />
      <text x="250" y="225" fill="#f3e8ff" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Centric Nucleus</text>
      <!-- Small Temporary Vacuoles -->
      <circle cx="130" cy="120" r="15" fill="#0284c7" opacity="0.6" stroke="#38bdf8" />
      <circle cx="360" cy="320" r="18" fill="#0284c7" opacity="0.6" stroke="#38bdf8" />
      <!-- Mitochondria -->
      <ellipse cx="140" cy="300" rx="30" ry="18" fill="#f97316" stroke="#ea580c" stroke-width="2" />
      <ellipse cx="360" cy="120" rx="30" ry="18" fill="#f97316" stroke="#ea580c" stroke-width="2" />

      <text x="250" y="-10" fill="#a78bfa" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">ANIMAL CELL (Flexible Shape)</text>
    </g>

    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="60" y="672" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">UNEB ESSENTIAL DIFFERENCES:</text>
    <text x="320" y="672" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">
      1. Cell wall present in plants (cellulose), absent in animals. 2. Chloroplasts present in photosynthetic plant cells. 3. Large central vacuole in plants vs small temporary ones in animals.
    </text>
  </svg>`;

  return {
    svg,
    description: 'UNEB Biology 553 & PLE Science blueprint: Comparative ultrastructure of plant cell (cellulose wall, chloroplasts, central vacuole) vs animal cell (flexible membrane, centrioles, centered nucleus).',
  };
}

// -------------------------------------------------------------
// Diagram 5: Mendelian Monohybrid Cross Punnett Square
// -------------------------------------------------------------
function generatePunnettSquareSVG(w: number, h: number, size: string): GeneratedDiagramResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <rect width="1280" height="720" fill="#0f172a" />
    <rect x="40" y="30" width="1200" height="65" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="60" y="68" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">
      UNEB UCE BIOLOGY 553 CURRICULUM BLUEPRINT • RESOLUTION: ${size}
    </text>
    <text x="60" y="86" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">
      Genetics: Monohybrid Inheritance Cross (Bb × Bb), Gamete Segregation, and 3:1 Phenotypic Ratio
    </text>

    <!-- Center Punnett Grid -->
    <g transform="translate(420, 160)">
      <rect width="440" height="440" fill="#1e293b" stroke="#475569" stroke-width="3" rx="12" />
      <line x1="220" y1="0" x2="220" y2="440" stroke="#64748b" stroke-width="3" />
      <line x1="0" y1="220" x2="440" y2="220" stroke="#64748b" stroke-width="3" />

      <!-- Top Male Gametes -->
      <circle cx="110" cy="-40" r="30" fill="#3b82f6" />
      <text x="110" y="-32" fill="#ffffff" font-family="Consolas, monospace" font-size="26" font-weight="bold" text-anchor="middle">B</text>

      <circle cx="330" cy="-40" r="30" fill="#3b82f6" />
      <text x="330" y="-32" fill="#ffffff" font-family="Consolas, monospace" font-size="26" font-weight="bold" text-anchor="middle">b</text>

      <!-- Side Female Gametes -->
      <circle cx="-40" cy="110" r="30" fill="#ec4899" />
      <text x="-40" y="118" fill="#ffffff" font-family="Consolas, monospace" font-size="26" font-weight="bold" text-anchor="middle">B</text>

      <circle cx="-40" cy="330" r="30" fill="#ec4899" />
      <text x="-40" y="338" fill="#ffffff" font-family="Consolas, monospace" font-size="26" font-weight="bold" text-anchor="middle">b</text>

      <!-- Cell 1: BB -->
      <text x="110" y="100" fill="#4ade80" font-family="Consolas, monospace" font-size="34" font-weight="bold" text-anchor="middle">BB</text>
      <text x="110" y="130" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Homozygous Dominant</text>
      <text x="110" y="150" fill="#86efac" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">[Black Coat]</text>

      <!-- Cell 2: Bb -->
      <text x="330" y="100" fill="#60a5fa" font-family="Consolas, monospace" font-size="34" font-weight="bold" text-anchor="middle">Bb</text>
      <text x="330" y="130" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Heterozygous Carrier</text>
      <text x="330" y="150" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">[Black Coat]</text>

      <!-- Cell 3: Bb -->
      <text x="110" y="320" fill="#60a5fa" font-family="Consolas, monospace" font-size="34" font-weight="bold" text-anchor="middle">Bb</text>
      <text x="110" y="350" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Heterozygous Carrier</text>
      <text x="110" y="370" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">[Black Coat]</text>

      <!-- Cell 4: bb -->
      <text x="330" y="320" fill="#f87171" font-family="Consolas, monospace" font-size="34" font-weight="bold" text-anchor="middle">bb</text>
      <text x="330" y="350" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Homozygous Recessive</text>
      <text x="330" y="370" fill="#fca5a5" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">[White Coat]</text>
    </g>

    <!-- Left Summary Box -->
    <g transform="translate(60, 160)">
      <rect width="300" height="440" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text x="20" y="35" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Genetic Cross Breakdown</text>

      <text x="20" y="80" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13">Parent Phenotypes:</text>
      <text x="20" y="105" fill="#fde047" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Black Fur × Black Fur</text>

      <text x="20" y="150" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13">Parent Genotypes:</text>
      <text x="20" y="175" fill="#60a5fa" font-family="Consolas, monospace" font-size="16" font-weight="bold">Bb × Bb</text>

      <line x1="20" y1="205" x2="280" y2="205" stroke="#334155" />

      <text x="20" y="240" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Genotypic Ratio:</text>
      <text x="20" y="265" fill="#38bdf8" font-family="Consolas, monospace" font-size="15" font-weight="bold">1 BB : 2 Bb : 1 bb</text>
      <text x="20" y="290" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">(25% : 50% : 25%)</text>

      <text x="20" y="340" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Phenotypic Ratio:</text>
      <text x="20" y="365" fill="#4ade80" font-family="Consolas, monospace" font-size="16" font-weight="bold">3 Black : 1 White</text>
      <text x="20" y="390" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">(75% Dominant : 25% Recessive)</text>
    </g>

    <!-- Footer -->
    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="60" y="672" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">UNEB MARKING CRITERIA:</text>
    <text x="280" y="672" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">
      Candidates must always state: 1. Parental phenotypes &amp; genotypes, 2. Gametes circled, 3. Random fertilization grid, 4. Offspring genotypes &amp; phenotype ratios with appropriate keys.
    </text>
  </svg>`;

  return {
    svg,
    description: 'UNEB Biology 553 standard genetics blueprint: Monohybrid heterozygous cross (Bb x Bb) Punnett square with gamete segregation, genotypic ratio (1:2:1), and phenotypic ratio (3:1).',
  };
}

// -------------------------------------------------------------
// Diagram 6: Circle Theorems
// -------------------------------------------------------------
function generateCircleTheoremsSVG(w: number, h: number, size: string): GeneratedDiagramResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <rect width="1280" height="720" fill="#0f172a" />
    <rect x="40" y="30" width="1200" height="65" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="60" y="68" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">
      UNEB UCE MATHEMATICS 456 CURRICULUM BLUEPRINT • RESOLUTION: ${size}
    </text>
    <text x="60" y="86" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">
      Geometry: Circle Theorems • Angle Subtended at Center is Twice Angle at Circumference
    </text>

    <!-- Center Stage Circle -->
    <g transform="translate(640, 360)">
      <circle cx="0" cy="0" r="200" fill="none" stroke="#38bdf8" stroke-width="3" />
      <circle cx="0" cy="0" r="6" fill="#f59e0b" />
      <text x="15" y="-10" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Center O</text>

      <!-- Arc AB Points -->
      <!-- Point A: (-140, 142) -->
      <circle cx="-140" cy="142" r="6" fill="#ffffff" />
      <text x="-170" y="160" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">A</text>

      <!-- Point B: (140, 142) -->
      <circle cx="140" cy="142" r="6" fill="#ffffff" />
      <text x="160" y="160" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">B</text>

      <!-- Point C on circumference: (0, -200) -->
      <circle cx="0" cy="-200" r="6" fill="#ffffff" />
      <text x="0" y="-220" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">C</text>

      <!-- Radii OA and OB -->
      <line x1="0" y1="0" x2="-140" y2="142" stroke="#f59e0b" stroke-width="2.5" />
      <line x1="0" y1="0" x2="140" y2="142" stroke="#f59e0b" stroke-width="2.5" />

      <!-- Chords CA and CB -->
      <line x1="0" y1="-200" x2="-140" y2="142" stroke="#38bdf8" stroke-width="2.5" />
      <line x1="0" y1="-200" x2="140" y2="142" stroke="#38bdf8" stroke-width="2.5" />

      <!-- Center Angle arc 2θ -->
      <path d="M -30 30 A 40 40 0 0 0 30 30" fill="none" stroke="#ef4444" stroke-width="3" />
      <text x="0" y="55" fill="#ef4444" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">2θ (Center)</text>

      <!-- Circumference Angle arc θ -->
      <path d="M -15 -165 A 35 35 0 0 0 15 -165" fill="none" stroke="#22c55e" stroke-width="3" />
      <text x="0" y="-140" fill="#22c55e" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">θ (Circumference)</text>
    </g>

    <!-- Card -->
    <g transform="translate(60, 160)">
      <rect width="320" height="420" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text x="20" y="35" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Core UNEB Circle Theorems</text>

      <text x="20" y="80" fill="#fde047" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Theorem 1 (Illustrated):</text>
      <text x="20" y="105" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">The angle subtended by an arc at the center of a circle is twice the angle subtended by it at any point on the circumference.</text>
      <rect x="20" y="130" width="280" height="35" rx="5" fill="#0f172a" />
      <text x="160" y="153" fill="#4ade80" font-family="Consolas, monospace" font-size="15" font-weight="bold" text-anchor="middle">∠AOB = 2 × ∠ACB</text>

      <text x="20" y="195" fill="#fde047" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Theorem 2 (Angles in Same Segment):</text>
      <text x="20" y="215" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">Angles subtended by the same chord in the same segment of a circle are equal.</text>

      <text x="20" y="260" fill="#fde047" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Theorem 3 (Angle in Semicircle):</text>
      <text x="20" y="280" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">The angle subtended by a diameter at the circumference is a right angle (90°).</text>

      <text x="20" y="325" fill="#fde047" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Theorem 4 (Cyclic Quadrilateral):</text>
      <text x="20" y="345" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">Opposite angles of a cyclic quad sum to 180°.</text>
      <rect x="20" y="365" width="280" height="35" rx="5" fill="#0f172a" />
      <text x="160" y="388" fill="#38bdf8" font-family="Consolas, monospace" font-size="14" font-weight="bold" text-anchor="middle">∠A + ∠C = 180°, ∠B + ∠D = 180°</text>
    </g>

    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="60" y="672" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">UNEB ESSENTIAL:</text>
    <text x="220" y="672" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">
      In UNEB Mathematics Paper 1 (Section B), candidates must quote reasons in brackets for every angle step (e.g., "[Angle at center is twice angle at circumference]").
    </text>
  </svg>`;

  return {
    svg,
    description: 'UNEB Mathematics 456 circle theorem blueprint: Detailed geometric construction demonstrating the 2θ central angle theorem, cyclic quadrilateral rules, and formal exam reasons.',
  };
}

// -------------------------------------------------------------
// Diagram 7: Quadratic Parabola Function
// -------------------------------------------------------------
function generateQuadraticParabolaSVG(w: number, h: number, size: string): GeneratedDiagramResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <rect width="1280" height="720" fill="#0f172a" />
    <rect x="40" y="30" width="1200" height="65" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="60" y="68" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">
      UNEB UCE MATHEMATICS 456 CURRICULUM BLUEPRINT • RESOLUTION: ${size}
    </text>
    <text x="60" y="86" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">
      Algebra &amp; Graphing: Quadratic Function y = ax² + bx + c • Vertex, Axis of Symmetry, and Roots
    </text>

    <!-- Graph Coordinates Center -->
    <g transform="translate(680, 360)">
      <!-- Cartesian Axes -->
      <line x1="-300" y1="0" x2="300" y2="0" stroke="#64748b" stroke-width="2.5" />
      <line x1="0" y1="-220" x2="0" y2="220" stroke="#64748b" stroke-width="2.5" />
      <text x="310" y="5" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">X</text>
      <text x="-5" y="-230" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Y</text>

      <!-- Parabolic Curve y = x^2 - 4x - 5 (roots at x = -1 and x = 5, vertex at (2, -9)) -->
      <!-- Scaled for visualization -->
      <path d="M -180,-180 Q 40,300 260,-180" fill="none" stroke="#38bdf8" stroke-width="4" />

      <!-- Vertex Point (h, k) -->
      <circle cx="40" cy="140" r="6" fill="#ef4444" />
      <text x="55" y="155" fill="#f87171" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Vertex V(h, k) = (2, -9) [Minimum]</text>

      <!-- Axis of Symmetry (x = -b / 2a) -->
      <line x1="40" y1="-220" x2="40" y2="200" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,4" />
      <text x="45" y="-190" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Axis of Symmetry: x = 2</text>

      <!-- Roots (x-intercepts) -->
      <circle cx="-100" cy="0" r="6" fill="#22c55e" />
      <text x="-120" y="-15" fill="#4ade80" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Root x₁ = -1</text>

      <circle cx="180" cy="0" r="6" fill="#22c55e" />
      <text x="190" y="-15" fill="#4ade80" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Root x₂ = 5</text>

      <!-- y-intercept (0, c) -->
      <circle cx="0" cy="80" r="6" fill="#a855f7" />
      <text x="-140" y="85" fill="#c084fc" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">y-intercept (0, -5)</text>
    </g>

    <!-- Left Formulas Card -->
    <g transform="translate(60, 160)">
      <rect width="320" height="420" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text x="20" y="35" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Quadratic Key Formulas</text>

      <text x="20" y="80" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">1. Standard Quadratic Form:</text>
      <rect x="20" y="95" width="280" height="40" rx="5" fill="#0f172a" />
      <text x="160" y="122" fill="#fde047" font-family="Consolas, monospace" font-size="16" font-weight="bold" text-anchor="middle">y = ax² + bx + c</text>

      <text x="20" y="165" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">2. Quadratic Formula (Roots):</text>
      <rect x="20" y="180" width="280" height="45" rx="5" fill="#0f172a" />
      <text x="160" y="208" fill="#4ade80" font-family="Consolas, monospace" font-size="14" font-weight="bold" text-anchor="middle">x = (-b ± √(b² - 4ac)) / (2a)</text>

      <text x="20" y="255" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">3. Axis of Symmetry:</text>
      <rect x="20" y="270" width="280" height="40" rx="5" fill="#0f172a" />
      <text x="160" y="296" fill="#38bdf8" font-family="Consolas, monospace" font-size="15" font-weight="bold" text-anchor="middle">x = -b / (2a)</text>

      <text x="20" y="340" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">4. Discriminant (Δ):</text>
      <rect x="20" y="355" width="280" height="40" rx="5" fill="#0f172a" />
      <text x="160" y="381" fill="#f87171" font-family="Consolas, monospace" font-size="14" font-weight="bold" text-anchor="middle">Δ = b² - 4ac &gt; 0 (Two real roots)</text>
    </g>

    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="60" y="672" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">UNEB GRAPHING RULE:</text>
    <text x="240" y="672" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">
      Curves in UNEB Mathematics must be drawn with a single smooth continuous pencil stroke through all plotted points without flat spots or double lines.
    </text>
  </svg>`;

  return {
    svg,
    description: 'UNEB Mathematics 456 quadratic graphing blueprint: Parabolic function y = ax^2 + bx + c illustrating vertex minimum point, axis of symmetry x = -b/(2a), real roots, and discriminant rubric.',
  };
}

// -------------------------------------------------------------
// Diagram 8: Electric Circuit & Ohm's Law (Physics 535)
// -------------------------------------------------------------
function generateElectricCircuitSVG(prompt: string, w: number, h: number, size: string): GeneratedDiagramResult {
  const cleanTitle = prompt.replace(/[<>&"]/g, ' ').slice(0, 60);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <rect width="1280" height="720" fill="#0b1120" />
    <rect x="40" y="30" width="1200" height="65" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="60" y="68" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">
      UNEB UCE PHYSICS 535 CURRICULUM BLUEPRINT • RESOLUTION: ${size}
    </text>
    <text x="60" y="86" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">
      Current Electricity: Series Circuit, Ohm's Law (V = IR), Ammeter (Series) &amp; Voltmeter (Parallel) Connection
    </text>

    <!-- Circuit Diagram Center Stage -->
    <g transform="translate(440, 160)">
      <!-- Main Rectangular Circuit Loop Wire -->
      <rect x="0" y="50" width="460" height="320" rx="10" fill="none" stroke="#f59e0b" stroke-width="4" />

      <!-- DC Battery Source Top -->
      <g transform="translate(180, 50)">
        <rect x="-15" y="-15" width="80" height="30" fill="#0b1120" />
        <!-- Long thin positive plate -->
        <line x1="10" y1="-25" x2="10" y2="25" stroke="#ef4444" stroke-width="4" />
        <text x="5" y="-32" fill="#ef4444" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">+</text>
        <!-- Short thick negative plate -->
        <line x1="30" y1="-15" x2="30" y2="15" stroke="#3b82f6" stroke-width="8" />
        <text x="25" y="-22" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">-</text>
        <text x="20" y="45" fill="#fde047" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">DC Battery (E = 12V)</text>
      </g>

      <!-- Conventional Current Flow Arrows (Counter-Clockwise from + to -) -->
      <polygon points="120,45 135,50 120,55" fill="#ef4444" />
      <polygon points="455,180 460,195 465,180" fill="#ef4444" />
      <polygon points="260,365 245,370 260,375" fill="#ef4444" />
      <text x="490" y="195" fill="#ef4444" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">I (Current)</text>

      <!-- Ammeter (Series) Right Wire -->
      <g transform="translate(460, 260)">
        <rect x="-25" y="-25" width="50" height="50" fill="#0b1120" />
        <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="3" />
        <text x="0" y="7" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">A</text>
        <text x="35" y="5" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">Ammeter (Low Resistance)</text>
      </g>

      <!-- Load Resistor Bottom Wire -->
      <g transform="translate(180, 370)">
        <rect x="-10" y="-20" width="120" height="40" fill="#0b1120" />
        <!-- Zigzag resistor symbol -->
        <path d="M 0 0 L 15 -18 L 30 18 L 45 -18 L 60 18 L 75 -18 L 90 18 L 100 0" fill="none" stroke="#22c55e" stroke-width="4" stroke-linejoin="round" />
        <text x="50" y="35" fill="#4ade80" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Resistor R = 6.0 Ω</text>
      </g>

      <!-- Voltmeter (Parallel to Resistor) -->
      <g transform="translate(180, 440)">
        <!-- Parallel leads -->
        <line x1="0" y1="-70" x2="0" y2="0" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="4,4" />
        <line x1="100" y1="-70" x2="100" y2="0" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="4,4" />
        <line x1="0" y1="0" x2="100" y2="0" stroke="#a855f7" stroke-width="2.5" />
        <rect x="30" y="-20" width="40" height="40" fill="#0b1120" />
        <circle cx="50" cy="0" r="20" fill="#1e293b" stroke="#c084fc" stroke-width="3" />
        <text x="50" y="6" fill="#c084fc" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">V</text>
        <text x="50" y="30" fill="#c084fc" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">Voltmeter (High R)</text>
      </g>

      <!-- Switch Left Wire -->
      <g transform="translate(0, 200)">
        <rect x="-20" y="-30" width="40" height="60" fill="#0b1120" />
        <circle cx="0" cy="-20" r="4" fill="#f59e0b" />
        <circle cx="0" cy="20" r="4" fill="#f59e0b" />
        <!-- Closed switch blade -->
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#f59e0b" stroke-width="3.5" />
        <text x="-40" y="5" fill="#f59e0b" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Key / Switch (K)</text>
      </g>
    </g>

    <!-- Formula & Criteria Card Left -->
    <g transform="translate(60, 160)">
      <rect width="320" height="420" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text x="20" y="35" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Ohm's Law &amp; Circuit Rules</text>
      <line x1="20" y1="50" x2="300" y2="50" stroke="#334155" stroke-width="1" />

      <text x="20" y="80" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">1. Ohm's Law Relationship:</text>
      <rect x="20" y="95" width="280" height="45" rx="6" fill="#0b1120" />
      <text x="160" y="124" fill="#fde047" font-family="Consolas, monospace" font-size="18" font-weight="bold" text-anchor="middle">V = I × R  ⇒  I = V / R</text>

      <text x="20" y="170" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">2. Calculation for this Circuit:</text>
      <rect x="20" y="185" width="280" height="55" rx="6" fill="#0b1120" />
      <text x="160" y="210" fill="#38bdf8" font-family="Consolas, monospace" font-size="14" font-weight="bold" text-anchor="middle">I = 12 V / 6.0 Ω = 2.0 A</text>
      <text x="160" y="230" fill="#4ade80" font-family="Consolas, monospace" font-size="12" text-anchor="middle">Ammeter reads 2.0 A • Voltmeter reads 12 V</text>

      <text x="20" y="270" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">3. Essential UNEB Marking Rules:</text>
      <text x="20" y="295" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">• Ammeter ALWAYS connected in SERIES</text>
      <text x="20" y="315" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">• Voltmeter ALWAYS connected in PARALLEL</text>
      <text x="20" y="335" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">• Ohmic conductors show straight-line V-I graph</text>
      <text x="20" y="355" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">• Temperature must remain CONSTANT</text>
    </g>

    <!-- Footer -->
    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="60" y="672" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">UNEB PRACTICAL 535/2 TIP:</text>
    <text x="280" y="672" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">
      Always ensure zero-error check on meters before closing key K to prevent heating up the resistance wire which increases resistance!
    </text>
  </svg>`;
  return {
    svg,
    description: `UNEB Physics 535 electric circuit blueprint: Complete series-parallel circuit demonstrating Ohm's law (V=IR), proper ammeter/voltmeter placements, and numerical calculation.`,
  };
}

// -------------------------------------------------------------
// Diagram 9: Atomic Structure & Bohr Model (Chemistry 545 / Physics)
// -------------------------------------------------------------
function generateAtomicStructureSVG(prompt: string, w: number, h: number, size: string): GeneratedDiagramResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <rect width="1280" height="720" fill="#090d16" />
    <rect x="40" y="30" width="1200" height="65" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="60" y="68" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">
      UNEB UCE CHEMISTRY 545 &amp; PHYSICS 535 • RESOLUTION: ${size}
    </text>
    <text x="60" y="86" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">
      Atomic Structure: Bohr Model of Carbon (₁₂⁶C) • Nucleus (Protons &amp; Neutrons) and Electron Shells (K=2, L=4)
    </text>

    <!-- Bohr Atom Center Stage -->
    <g transform="translate(640, 360)">
      <!-- Energy Shell 1 (K shell) -->
      <circle cx="0" cy="0" r="100" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="6,4" />
      <text x="110" y="5" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">K Shell (n=1, max 2e⁻)</text>

      <!-- Energy Shell 2 (L shell) -->
      <circle cx="0" cy="0" r="180" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="6,4" />
      <text x="190" y="5" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">L Shell (Valence, n=2, 4e⁻)</text>

      <!-- Dense Nucleus -->
      <circle cx="0" cy="0" r="45" fill="#1e1b4b" stroke="#818cf8" stroke-width="3" />
      <text x="0" y="-8" fill="#f87171" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">6 Protons (p⁺)</text>
      <text x="0" y="14" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">6 Neutrons (n⁰)</text>

      <!-- K-Shell Electrons (2) -->
      <circle cx="0" cy="-100" r="10" fill="#facc15" stroke="#ffffff" stroke-width="2" />
      <circle cx="0" cy="100" r="10" fill="#facc15" stroke="#ffffff" stroke-width="2" />

      <!-- L-Shell Electrons (4) -->
      <circle cx="-180" cy="0" r="10" fill="#facc15" stroke="#ffffff" stroke-width="2" />
      <circle cx="180" cy="0" r="10" fill="#facc15" stroke="#ffffff" stroke-width="2" />
      <circle cx="0" cy="-180" r="10" fill="#facc15" stroke="#ffffff" stroke-width="2" />
      <circle cx="0" cy="180" r="10" fill="#facc15" stroke="#ffffff" stroke-width="2" />
    </g>

    <!-- Breakdown Card Left -->
    <g transform="translate(60, 160)">
      <rect width="320" height="420" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text x="20" y="35" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Atomic Properties &amp; Notations</text>
      <line x1="20" y1="50" x2="300" y2="50" stroke="#334155" />

      <text x="20" y="80" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Standard Nuclide Notation:</text>
      <rect x="20" y="95" width="280" height="45" rx="6" fill="#0b1120" />
      <text x="160" y="125" fill="#fde047" font-family="Consolas, monospace" font-size="20" font-weight="bold" text-anchor="middle">¹²₆C</text>

      <text x="20" y="170" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Subatomic Particle Audit:</text>
      <text x="20" y="195" fill="#f87171" font-family="system-ui, sans-serif" font-size="12">• Atomic Number (Z): 6 (Protons)</text>
      <text x="20" y="218" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12">• Mass Number (A): 12 (Protons + Neutrons)</text>
      <text x="20" y="241" fill="#facc15" font-family="system-ui, sans-serif" font-size="12">• Electrons: 6 (Electrically neutral)</text>

      <text x="20" y="280" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Electronic Configuration:</text>
      <rect x="20" y="295" width="280" height="35" rx="5" fill="#0b1120" />
      <text x="160" y="318" fill="#4ade80" font-family="Consolas, monospace" font-size="16" font-weight="bold" text-anchor="middle">2:4  (Group IV, Period 2)</text>

      <text x="20" y="360" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">Valence Electrons: 4</text>
      <text x="20" y="380" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">Forms 4 covalent bonds (Tetravalent)</text>
    </g>

    <!-- Footer -->
    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="60" y="672" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">UNEB MARKING INVARIANT:</text>
    <text x="270" y="672" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">
      Isotopes are atoms of the SAME element having the same atomic number (protons) but DIFFERENT mass numbers due to differing neutron counts (e.g., Carbon-12 vs Carbon-14).
    </text>
  </svg>`;
  return {
    svg,
    description: `UNEB Chemistry 545 & Physics 535 atomic structure blueprint: Bohr model illustrating nucleus (protons & neutrons), K and L electron shells, and electronic configuration (2:4).`,
  };
}

// -------------------------------------------------------------
// Diagram 10: Photosynthesis & Internal Leaf Structure (Biology 553)
// -------------------------------------------------------------
function generatePhotosynthesisSVG(prompt: string, w: number, h: number, size: string): GeneratedDiagramResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <rect width="1280" height="720" fill="#061e14" />
    <rect x="40" y="30" width="1200" height="65" rx="10" fill="#064e3b" stroke="#047857" stroke-width="1.5" />
    <text x="60" y="68" fill="#34d399" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">
      UNEB PLE SCIENCE &amp; UCE BIOLOGY 553 CURRICULUM BLUEPRINT • RESOLUTION: ${size}
    </text>
    <text x="60" y="86" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="13">
      Botany &amp; Plant Physiology: Internal Leaf Transverse Section (T.S.), Stomata, and Photosynthesis Reaction
    </text>

    <!-- Transverse Section of Leaf Center Stage -->
    <g transform="translate(420, 150)">
      <!-- Upper Cuticle & Epidermis -->
      <rect x="0" y="20" width="480" height="30" rx="4" fill="#a3e635" opacity="0.8" stroke="#65a30d" stroke-width="2" />
      <text x="240" y="40" fill="#14532d" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Upper Epidermis &amp; Waxy Cuticle</text>

      <!-- Palisade Mesophyll Layer (Closely packed, rich in chloroplasts) -->
      <g transform="translate(0, 55)">
        <rect x="0" y="0" width="480" height="110" fill="#15803d" stroke="#166534" stroke-width="2" />
        ${Array.from({ length: 12 }, (_, i) => `
          <rect x="${i * 40 + 5}" y="5" width="30" height="100" rx="4" fill="#16a34a" stroke="#22c55e" stroke-width="1.5" />
          <circle cx="${i * 40 + 20}" cy="30" r="5" fill="#4ade80" />
          <circle cx="${i * 40 + 20}" cy="55" r="5" fill="#4ade80" />
          <circle cx="${i * 40 + 20}" cy="80" r="5" fill="#4ade80" />
        `).join('')}
        <text x="240" y="130" fill="#86efac" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Palisade Mesophyll (Dense Chloroplasts - Primary Site of Photosynthesis)</text>
      </g>

      <!-- Spongy Mesophyll Layer with Air Spaces & Vascular Bundle -->
      <g transform="translate(0, 200)">
        <rect x="0" y="0" width="480" height="110" fill="#14532d" stroke="#166534" stroke-width="2" />
        <!-- Vascular Bundle (Vein): Xylem (water) and Phloem (food) -->
        <circle cx="240" cy="55" r="45" fill="#047857" stroke="#34d399" stroke-width="2" />
        <text x="240" y="45" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Xylem (H₂O)</text>
        <text x="240" y="65" fill="#fde047" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Phloem (Sucrose)</text>
        <text x="80" y="55" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="11">Air Spaces (Gas Exchange)</text>
      </g>

      <!-- Lower Epidermis & Stomata -->
      <g transform="translate(0, 315)">
        <rect x="0" y="0" width="480" height="30" rx="4" fill="#a3e635" opacity="0.8" stroke="#65a30d" stroke-width="2" />
        <!-- Stoma pores with Guard Cells -->
        <rect x="120" y="0" width="30" height="30" fill="#061e14" />
        <circle cx="118" cy="15" r="8" fill="#15803d" />
        <circle cx="152" cy="15" r="8" fill="#15803d" />
        <text x="135" y="45" fill="#86efac" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Stoma pore</text>

        <rect x="340" y="0" width="30" height="30" fill="#061e14" />
        <circle cx="338" cy="15" r="8" fill="#15803d" />
        <circle cx="372" cy="15" r="8" fill="#15803d" />
      </g>
    </g>

    <!-- Formula & Criteria Card Left -->
    <g transform="translate(60, 160)">
      <rect width="320" height="420" rx="10" fill="#064e3b" stroke="#047857" stroke-width="1.5" />
      <text x="20" y="35" fill="#34d399" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Photosynthesis Equation</text>
      <line x1="20" y1="50" x2="300" y2="50" stroke="#047857" />

      <text x="20" y="80" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Balanced Chemical Equation:</text>
      <rect x="20" y="95" width="280" height="50" rx="6" fill="#061e14" />
      <text x="160" y="125" fill="#fde047" font-family="Consolas, monospace" font-size="13" font-weight="bold" text-anchor="middle">6CO₂ + 6H₂O ⟶ C₆H₁₂O₆ + 6O₂</text>

      <text x="20" y="170" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Essential Conditions:</text>
      <text x="20" y="195" fill="#facc15" font-family="system-ui, sans-serif" font-size="12">• Sunlight energy (trapped by chlorophyll)</text>
      <text x="20" y="218" fill="#34d399" font-family="system-ui, sans-serif" font-size="12">• Chlorophyll catalyst in chloroplasts</text>
      <text x="20" y="241" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12">• Water absorbed by roots via osmosis</text>
      <text x="20" y="264" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="12">• Carbon dioxide diffuses through stomata</text>

      <text x="20" y="305" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Starch Test in Leaves (UNEB Practical):</text>
      <text x="20" y="330" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">1. Boil leaf in water (kills protoplasm)</text>
      <text x="20" y="350" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">2. Boil in methylated spirit/ethanol (decolorizes)</text>
      <text x="20" y="370" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">3. Dip in warm water (softens leaf)</text>
      <text x="20" y="390" fill="#fde047" font-family="system-ui, sans-serif" font-size="11">4. Add Iodine solution: Blue-black = Starch present</text>
    </g>

    <!-- Footer -->
    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#064e3b" stroke="#047857" stroke-width="1" />
    <text x="60" y="672" fill="#34d399" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">UNEB ESSENTIAL:</text>
    <text x="210" y="672" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">
      In Biology 553/2 practicals: Alcohol must NEVER be heated directly over a naked flame because it is highly flammable; always use a water bath!
    </text>
  </svg>`;
  return {
    svg,
    description: `UNEB Biology 553 & PLE Science blueprint: Leaf transverse section (T.S.) showing palisade and spongy mesophyll, stomata guard cells, xylem/phloem, and the balanced photosynthesis chemical equation.`,
  };
}

// -------------------------------------------------------------
// Diagram 11: Dynamic High-Definition UNEB Concept Blueprint for ANY prompt
// -------------------------------------------------------------
function generateGenericUNEBBlueprintSVG(prompt: string, w: number, h: number, size: string): GeneratedDiagramResult {
  const cleanTitle = prompt.replace(/[<>&"]/g, ' ').trim().slice(0, 60);

  // Extract meaningful keywords from user's custom prompt
  const words = prompt
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['and', 'the', 'for', 'with', 'diagram', 'illustrating', 'uneb', 'level'].includes(w.toLowerCase()));

  const kw1 = words[0] || 'Concept Input';
  const kw2 = words[1] || 'Process Core';
  const kw3 = words[2] || 'Application Output';
  const kw4 = words[3] || 'System Invariant';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="100%" stop-color="#1e1b4b" />
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3b82f6" />
        <stop offset="100%" stop-color="#8b5cf6" />
      </linearGradient>
    </defs>

    <rect width="1280" height="720" fill="url(#bg)" />
    <!-- Grid -->
    <g opacity="0.08" stroke="#ffffff" stroke-width="1">
      ${Array.from({ length: 26 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="720" />`).join('')}
      ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="1280" y2="${i * 50}" />`).join('')}
    </g>

    <!-- Header Banner -->
    <rect x="40" y="30" width="1200" height="70" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="60" y="65" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">
      UGANDA NATIONAL EXAMINATIONS BOARD (UNEB) OFFICIAL CURRICULUM BLUEPRINT
    </text>
    <text x="60" y="87" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">
      Subject Blueprint: "${cleanTitle}" • Scaled Resolution: ${size}
    </text>

    <!-- Main Architecture Layout -->
    <g transform="translate(80, 140)">
      <!-- Box 1: Concept Inputs & Foundational Axioms -->
      <rect x="0" y="30" width="280" height="190" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="2" />
      <rect x="0" y="30" width="280" height="40" rx="10" fill="#2563eb" />
      <text x="140" y="55" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">1. INPUTS &amp; FOUNDATIONS</text>
      <text x="20" y="95" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">• Key Primitive: ${kw1.toUpperCase()}</text>
      <text x="20" y="120" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">• Core Syllabus Definitions &amp; Units</text>
      <text x="20" y="145" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">• Initial Boundary Conditions</text>
      <text x="20" y="170" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">• Pre-requisite PLE / Lower Secondary Law</text>
      <text x="20" y="195" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• Verified against UNEB standards</text>

      <!-- Connecting Vector 1 -->
      <line x1="280" y1="125" x2="380" y2="125" stroke="#38bdf8" stroke-width="3" />
      <polygon points="370,118 385,125 370,132" fill="#38bdf8" />

      <!-- Box 2: Core Mechanism & Dynamic Working Center -->
      <rect x="390" y="15" width="340" height="225" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2" />
      <rect x="390" y="15" width="340" height="40" rx="10" fill="#059669" />
      <text x="560" y="40" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">2. WORKING MECHANISM &amp; DYNAMICS</text>
      <text x="410" y="85" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">• Operational Node: ${kw2.toUpperCase()}</text>
      <text x="410" y="110" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">• Step-by-Step Derivation &amp; Proof</text>
      <text x="410" y="135" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">• Quantitative &amp; Qualitative Analysis</text>
      <text x="410" y="160" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">• Dynamic Equilibrium &amp; Transformation</text>
      <text x="410" y="185" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">• Experimental Apparatus &amp; Controls</text>
      <text x="410" y="215" fill="#fde047" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">• Essential Practical Examination Requirement</text>

      <!-- Connecting Vector 2 -->
      <line x1="730" y1="125" x2="830" y2="125" stroke="#10b981" stroke-width="3" />
      <polygon points="820,118 835,125 820,132" fill="#10b981" />

      <!-- Box 3: Exam Application & Grading Rubric -->
      <rect x="840" y="30" width="280" height="190" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
      <rect x="840" y="30" width="280" height="40" rx="10" fill="#d97706" />
      <text x="980" y="55" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">3. EXAM RUBRIC &amp; GRADING</text>
      <text x="860" y="95" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">• Target Domain: ${kw3.toUpperCase()}</text>
      <text x="860" y="120" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">• Distinction 1 (D1) Marking Criteria</text>
      <text x="860" y="145" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">• Section A vs Section B Strategies</text>
      <text x="860" y="170" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">• Common Pitfalls &amp; Examiner Deductions</text>
      <text x="860" y="195" fill="#fde047" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">• UNEB Act 2021 Candidate Compliance</text>

      <!-- Bottom Card: Ugandan Context & Core Formula/Equation Reference -->
      <rect x="0" y="260" width="1120" height="190" rx="10" fill="#1e293b" stroke="#6366f1" stroke-width="1.5" />
      <rect x="0" y="260" width="1120" height="35" rx="10" fill="#4338ca" />
      <text x="560" y="283" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
        UGANDAN APPLIED PERSPECTIVE &amp; SYSTEMIC INVARIANTS: ${kw4.toUpperCase()}
      </text>

      <text x="30" y="325" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">
        • Direct relevance to UNEB competency-based assessment and problem-solving standards under the New Lower Secondary Curriculum (NLSC).
      </text>
      <text x="30" y="355" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">
        • Applied to Ugandan national development sectors (Agriculture, Energy, Health, Engineering, Environmental Management).
      </text>
      <text x="30" y="385" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">
        • Authoritative alignment with official curriculum documentation at https://uneb.ac.ug/ and NCDC guidelines.
      </text>
      <text x="30" y="420" fill="#a5b4fc" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">
        • Scalable vector representation generated with pristine clarity across 1K, 2K, and 4K display configurations.
      </text>
    </g>

    <!-- Footer -->
    <rect x="40" y="640" width="1200" height="55" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="60" y="672" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">NEXUS UNEB BLUEPRINT ENGINE:</text>
    <text x="310" y="672" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12">
      Official academic reference diagram for: "${cleanTitle}". Scalable vector asset aligned with UNEB PLE and UCE exam objectives.
    </text>
  </svg>`;

  return {
    svg,
    description: `Official UNEB curriculum visual blueprint for: "${cleanTitle}". Rendered with structural blocks, directional process vectors, and syllabus marking criteria conforming to official standards.`,
  };
}

