/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Local Curriculum Knowledge Engine for UNEB Teaching Assistant (NEXUS)
 * Provides reliable, immediate, syllabus-accurate answers when external AI APIs
 * experience transient timeouts or high-demand conditions.
 */

export function generateCurriculumChatFallback(userQuery: string, role: string = 'general'): string {
  const query = userQuery.toLowerCase();

  // 1. Human Heart & Circulatory System (PLE Science & UCE Biology 553)
  if (query.includes('heart') || query.includes('circulation') || query.includes('blood') || query.includes('valve') || query.includes('artery') || query.includes('vein')) {
    return `### 🩺 NEXUS UNEB Biology / PLE Science Academic Guide: The Mammalian Circulatory System

**1. Double Circulation Concept:**
In humans and mammals, blood passes through the heart **twice** for each complete circuit of the body:
- **Pulmonary Circulation:** Deoxygenated blood is pumped from the Right Ventricle $\\to$ Pulmonary Artery $\\to$ Lungs (for oxygenation) $\\to$ Pulmonary Vein $\\to$ Left Atrium.
- **Systemic Circulation:** Oxygenated blood is pumped from the Left Ventricle $\\to$ Aorta under high pressure $\\to$ Body tissues $\\to$ Vena Cava $\\to$ Right Atrium.

**2. Chambers and Comparative Thickness:**
- **Atria (Auricles):** Upper receiving chambers with relatively thin muscular walls.
- **Ventricles:** Lower pumping chambers. The **Left Ventricle** has a muscular wall approximately $3\\times$ thicker than the Right Ventricle because it must pump blood through the high systemic peripheral resistance of the entire body, whereas the right ventricle only pumps to the nearby lungs.

**3. Heart Valves & One-Way Blood Flow:**
- **Tricuspid Valve:** Located between Right Atrium and Right Ventricle (prevents backflow during ventricular systole).
- **Bicuspid (Mitral) Valve:** Located between Left Atrium and Left Ventricle.
- **Semi-Lunar Valves:** Located at the entrance to the Aorta and Pulmonary Artery (prevent backflow into ventricles during diastole).

**💡 UNEB Marking Invariant:**
Always remember: The **Pulmonary Artery** is the *only* artery carrying deoxygenated blood, and the **Pulmonary Vein** is the *only* vein carrying oxygenated blood!`;
  }

  // 2. Snell's Law & Refraction (UCE Physics 535)
  if (query.includes('snell') || query.includes('refraction') || query.includes('prism') || query.includes('optics') || query.includes('light') || query.includes('critical angle')) {
    return `### 💡 NEXUS UNEB Physics (535) Academic Guide: Light Refraction & Snell's Law

**1. Law Statement:**
Snell's Law states that: *"For a given pair of media and a given light frequency, the ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant."*

$$\\frac{\\sin i}{\\sin r} = n \\quad \\text{(where } n \\text{ is the refractive index)}$$

**2. Critical Angle ($c$) & Total Internal Reflection (T.I.R):**
- When light travels from an optically **denser** to a **rarer** medium (e.g. glass $\\to$ air), the refracted ray bends away from the normal.
- At the **critical angle ($c$)**, the angle of refraction is exactly $90^\\circ$.
- Formula: $n = \\frac{1}{\\sin c}$
- **Two Essential Conditions for Total Internal Reflection (UNEB Standard Question):**
  1. Light must travel from an optically denser medium to an optically less dense medium.
  2. The angle of incidence must exceed the critical angle ($i > c$).

**💡 Practical Paper (535/3) Parallax Rule:**
In the glass prism or block practical, optical pins must be separated by at least $5\\text{ cm}$ to minimize alignment parallax errors.`;
  }

  // 3. Rift Valley & Horst Block Mountains (UCE Geography 273/1 & PLE SST)
  if (query.includes('rift') || query.includes('valley') || query.includes('horst') || query.includes('fault') || query.includes('rwenzori') || query.includes('mountain') || query.includes('plateau')) {
    return `### 🌍 NEXUS UNEB Geography (273/1) & PLE SST Guide: East African Faulting & Landforms

**1. Formation of the Rift Valley (Tensional Force Theory - E. Gregory):**
- Convective heat currents in the semi-molten asthenosphere drag crustal tectonic blocks in opposite lateral directions (crustal tension).
- Parallel normal fault lines develop across the crustal block.
- Continued pulling apart causes the central middle block to subside/drop down by gravity between the faults, forming a steep-sided flat-floored trough known as a **Graben (Rift Valley Floor)**.
- The exposed steep sides are **Fault Scarps (Escarpments)** like the Butiaba and Bunyoro escarpments.

**2. Horst / Block Mountains (e.g. Mt. Rwenzori):**
- A central block of land forced or left standing high between parallel fault lines when surrounding blocks drop or compress upwards.
- **Mt. Rwenzori (Margherita Peak, 5,109 m):** Non-volcanic block mountain composed of ancient Precambrian metamorphic rocks.

**💡 UNEB Paper 1 Distinction Rule:**
Differentiate between the **Western Arm** (running through Uganda containing Lakes Albert, Edward, George, and Tanganyika) and the **Eastern / Gregory Rift** (running through Kenya and Tanzania).`;
  }

  // 4. Mendelian Genetics & Punnett Squares (UCE Biology 553)
  if (query.includes('genetics') || query.includes('punnett') || query.includes('mendel') || query.includes('allele') || query.includes('dominant') || query.includes('recessive')) {
    return `### 🧬 NEXUS UNEB Biology (553) Guide: Mendelian Genetics & Monohybrid Crosses

**1. Core Syllabus Terminology:**
- **Allele:** Alternative forms of a gene occupying the same locus on homologous chromosomes.
- **Dominant:** An allele that expresses its phenotype in both homozygous ($BB$) and heterozygous ($Bb$) conditions.
- **Recessive:** An allele that only expresses its phenotype in the homozygous state ($bb$).
- **Phenotype:** Observable physical or biochemical characteristics of an organism.
- **Genotype:** Genetic makeup/allele combination of an organism.

**2. Standard Monohybrid Cross ($Bb \\times Bb$):**
- **Parental Phenotypes:** Heterozygous $\\times$ Heterozygous
- **Parental Genotypes:** $Bb \\times Bb$
- **Gametes:** $(B), (b) \\times (B), (b)$
- **Offspring Genotypes:** $1\\, BB : 2\\, Bb : 1\\, bb$ (Genotypic ratio $1 : 2 : 1$)
- **Offspring Phenotypes:** $3\\text{ Dominant} : 1\\text{ Recessive}$ (Phenotypic ratio $3 : 1$)

**💡 UNEB Marking Step Checklist (4 Marks Total):**
1. State Parental Phenotypes. 2. State Parental Genotypes. 3. Circle Gametes clearly. 4. Tabulate Punnett Grid with fertilization fusion. 5. Explicitly state the phenotypic ratio.`;
  }

  // 5. Quadratic Equations & Coordinate Geometry (UCE Mathematics 456)
  if (query.includes('quadratic') || query.includes('parabola') || query.includes('formula') || query.includes('roots') || query.includes('equation') || query.includes('math')) {
    return `### 📐 NEXUS UNEB Mathematics (456) Guide: Quadratic Equations & Parabolas

**1. General Quadratic Form:**
$$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$

**2. The Quadratic Formula (Section A & B Core):**
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

**3. Discriminant ($\\Delta = b^2 - 4ac$):**
- $\\Delta > 0$: Two distinct real roots (parabola crosses x-axis twice).
- $\\Delta = 0$: One repeated real root (parabola touches x-axis at vertex).
- $\\Delta < 0$: No real roots (parabola does not intersect x-axis).

**4. Parabolic Graph Properties:**
- **Axis of Symmetry:** $x = -\\frac{b}{2a}$
- **Vertex / Turning Point:** $\\left(-\\frac{b}{2a}, f\\left(-\\frac{b}{2a}\\right)\\right)$
- If $a > 0$, the parabola opens upwards (minimum vertex). If $a < 0$, it opens downwards (maximum vertex).

**💡 UNEB Graphing Rule:**
Always plot calculated coordinate points with neat crosses ($\\times$) and join them with a single, smooth, continuous curve. Never use a ruler to join points on a curve!`;
  }

  // 6. UNEB Grading & Examination Act 2021
  if (query.includes('uneb') || query.includes('act 2021') || query.includes('grade') || query.includes('aggregate') || query.includes('division') || query.includes('malpractice') || query.includes('ple') || query.includes('uce')) {
    return `### 📜 NEXUS UNEB Official Policy & Examination Regulations Guide

**1. Official UNEB 9-Point Grading Scale:**
- **D1 (Distinction 1):** $80\\% - 100\\%$ (1 point)
- **D2 (Distinction 2):** $75\\% - 79\\%$ (2 points)
- **C3 - C6 (Credit):** $50\\% - 74\\%$ (3 to 6 points)
- **P7 - P8 (Pass):** $40\\% - 49\\%$ (7 to 8 points)
- **F9 (Fail):** $0\\% - 39\\%$ (9 points)

**2. PLE Division Benchmarks (4 Core Subjects: Science, Math, SST, English):**
- **Division 1:** Aggregates **4 to 12**
- **Division 2:** Aggregates **13 to 24**
- **Division 3:** Aggregates **25 to 28**
- **Division 4:** Aggregates **29 to 32**
- **Ungraded (U):** Aggregates **33 to 36**

**3. UNEB Act 2021 (Anti-Malpractice Law):**
- Section 25 stipulates that possessing unauthorized materials, copying, impersonation, or leaking exam papers carries a fine of up to **2,000 currency points (UGX 40 million)** or imprisonment up to **5 to 10 years**, or both.
- Candidate results for the entire sitting can be cancelled under Section 26 if malpractice is proven by the Board.`;
  }

  // Default General Syllabus Response
  return `### 🎓 NEXUS Teaching Assistant - Candidate Master Guidance

Thank you for your question. As your dedicated Uganda National Examinations Board (UNEB - https://uneb.ac.ug/) AI Teaching Assistant:

1. **Syllabus Focus:** Every concept in NEXUS Teaching Assistant is directly aligned with the official National Curriculum Development Centre (NCDC) and UNEB assessment guidelines for Primary (PLE) and Secondary (UCE/UACE).
2. **Examiner Strategy:** Focus on clarity, standard SI units, step-by-step mathematical working, and labeled scientific diagrams.
3. **Interactive Tools:** You can explore the **UNEB Syllabi & Labs** tab for interactive concept steppers, generate **1K/2K/4K Visual Blueprints**, or listen via voice synthesis.

Feel free to ask a specific past paper question in **Science, Mathematics, Physics (535), Chemistry (545), Biology (553), Geography (273), or UNEB Examination Regulations**!`;
}
