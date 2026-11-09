import { QuizQuestion } from '../utils/learning';

export interface Lesson {
  id: string;
  level: 'Primary (PLE)' | 'Secondary (UCE)' | 'Secondary (UACE)' | 'UNEB Guidelines';
  subject: string;
  title: string;
  difficulty: 'Foundation' | 'Core Exam Standard' | 'Distinction Target';
  shortDesc: string;
  conceptSummary: string;
  keyExamPoints: string[];
  simulatorType: 'heart-circulation' | 'speed-time' | 'east-africa-geography' | 'ray-optics' | 'mole-concept' | 'punnett-genetics' | 'quadratic-solver' | 'uneb-grading';
  deepDive: string;
  quiz: QuizQuestion[];
  audioNarration: string;
  unebReference: string;
}

export const CURRICULUM_LESSONS: Lesson[] = [
  {
    id: 'ple-science-circulation',
    level: 'Primary (PLE)',
    subject: 'Integrated Science',
    title: 'The Human Circulatory System & Blood Functions',
    difficulty: 'Core Exam Standard',
    shortDesc: 'Double circulation, functions of Red & White blood cells, heart chambers, and blood vessels tested in PLE Section A & B.',
    conceptSummary:
      'The human circulatory system is a double circulation system where blood passes through the heart twice for every complete circuit (Pulmonary circulation to the lungs and Systemic circulation to the body). The heart consists of four chambers: Right Atrium, Right Ventricle, Left Atrium, and Left Ventricle. Deoxygenated blood enters the right side and is pumped to the lungs via the Pulmonary Artery; oxygenated blood returns via the Pulmonary Vein to the left side and is pumped to the rest of the body via the Aorta.',
    keyExamPoints: [
      'Pulmonary Artery is the ONLY artery carrying deoxygenated blood in the human body.',
      'Pulmonary Vein is the ONLY vein carrying oxygenated blood from the lungs.',
      'Left ventricle has the thickest muscular wall because it pumps blood against high pressure throughout the entire body.',
      'Red Blood Cells contain hemoglobin to transport oxygen; lack a nucleus to maximize space for hemoglobin.',
      'White Blood Cells (phagocytes and lymphocytes) defend the body by engulfing pathogens and producing antibodies.',
    ],
    simulatorType: 'heart-circulation',
    deepDive:
      'Common UNEB PLE Trap: Students often confuse the function of valves. Valves (Tricuspid, Bicuspid, and Semi-lunar) prevent the backflow of blood, maintaining one-directional flow under rhythmic heart contractions.',
    quiz: [
      {
        id: 'ple-sci-q1',
        question: 'Which blood vessel carries oxygenated blood from the lungs back to the left atrium of the heart?',
        options: ['Pulmonary Artery', 'Pulmonary Vein', 'Aorta', 'Vena Cava'],
        correctIndex: 1,
        explanation:
          'The Pulmonary Vein carries freshly oxygenated blood from the lungs to the left atrium of the heart.',
      },
      {
        id: 'ple-sci-q2',
        question: 'Why is the left ventricle wall much thicker than the right ventricle wall?',
        options: [
          'To protect the heart from physical injury',
          'To pump blood at high pressure throughout the entire body rather than just to the nearby lungs',
          'To store excess blood cells',
          'Because it contains deoxygenated blood',
        ],
        correctIndex: 1,
        explanation:
          'The left ventricle must generate enough contractile pressure to pump blood through the aorta to all extremities of the body.',
      },
    ],
    audioNarration:
      'Welcome to Primary Leaving Examination Integrated Science revision. Remember, humans have double circulation. Deoxygenated blood travels from the body into the right atrium, down to the right ventricle, and out to the lungs through the pulmonary artery. After picking up oxygen, it returns through the pulmonary vein into the left atrium.',
    unebReference: 'UNEB PLE Science Syllabus Section B: Humans and the Environment (Circulatory & Excretory Systems)',
  },
  {
    id: 'ple-math-speed-commercial',
    level: 'Primary (PLE)',
    subject: 'Mathematics',
    title: 'Speed, Distance, Time & Commercial Arithmetic',
    difficulty: 'Distinction Target',
    shortDesc: 'Master average speed with rest stops, travel graphs, profit/loss percentages, and simple interest for PLE Paper 1.',
    conceptSummary:
      'Speed represents distance covered per unit time: Speed = Total Distance / Total Time taken (including rest stops). When calculating average speed for a journey with breaks, always sum all individual distances and divide by the total elapsed time. For Commercial Arithmetic: Profit = Selling Price - Cost Price; Percentage Profit = (Profit / Cost Price) * 100%. Simple Interest (I) = (Principal * Rate * Time) / 100.',
    keyExamPoints: [
      'Average Speed formula: Total Distance ÷ Total Time (Ensure units match, e.g., km and hours).',
      'Converting km/h to m/s: Multiply by 5/18 (or multiply by 1000m and divide by 3600s).',
      'Converting m/s to km/h: Multiply by 18/5.',
      'Percentage profit is ALWAYS calculated over the Cost Price (CP), never the Selling Price (SP).',
    ],
    simulatorType: 'speed-time',
    deepDive:
      'Frequent UNEB Paper Question: A motorist drives from Kampala to Jinja (80 km) at 40 km/h, rests for 30 minutes, and returns at 80 km/h. What is the average speed? Total distance = 160 km. Time forward = 2h, rest = 0.5h, return = 1h. Total time = 3.5h. Average speed = 160 / 3.5 = 45.7 km/h.',
    quiz: [
      {
        id: 'ple-math-q1',
        question: 'A bus traveled from Kampala to Masaka (120 km) in 2 hours and returned in 3 hours. What was its average speed for the whole journey?',
        options: ['48 km/h', '50 km/h', '60 km/h', '40 km/h'],
        correctIndex: 0,
        explanation:
          'Total distance = 120 + 120 = 240 km. Total time = 2 + 3 = 5 hours. Average speed = 240 / 5 = 48 km/h.',
      },
    ],
    audioNarration:
      'In PLE Mathematics, never compute the average speed by simply averaging the two speeds. You must calculate the entire distance traveled and divide it by the total time taken.',
    unebReference: 'UNEB Primary Leaving Examination Mathematics: Measurements & Commercial Arithmetic',
  },
  {
    id: 'ple-sst-east-africa',
    level: 'Primary (PLE)',
    subject: 'Social Studies (SST)',
    title: 'Physical Features of East Africa & The Road to Independence',
    difficulty: 'Core Exam Standard',
    shortDesc: 'Formation of the Great Rift Valley, block vs volcanic mountains, lakes, Legco, and Uganda 1962 Independence milestones.',
    conceptSummary:
      'East Africa features diverse physical geography shaped by tectonic faulting (the Western and Eastern arms of the Great Rift Valley) and volcanism. Mountains like Mt. Ruwenzori are horsts/block mountains formed by faulting with compressional or tensional forces, while Mt. Elgon and Mt. Muhavura are volcanic mountains formed by magma eruptions. In history, the Legislative Council (LEGCO) established in 1921 gradually admitted African leaders (beginning in 1945 with Kawalya Kaggwa, Petero Nyangabyaki, and Yekonia Zirabamuzale), culminating in the 1961 Lancaster Conference and National Independence on October 9, 1962, led by Prime Minister Apollo Milton Obote.',
    keyExamPoints: [
      'Mt. Ruwenzori is a block mountain (horst); highest peak is Margherita on Mt. Stanley (5,109m).',
      'Lake Victoria was formed by downwarping (crustal depression), making it shallow compared to rift valley lakes.',
      'Rift valley lakes (Lake Albert, Lake Edward, Lake Tanganyika) are long, narrow, deep, with steep fault escarpments and few outlets.',
      'The 1900 Buganda Agreement instituted Mailo land, hut taxes, and consolidated British indirect rule.',
      'Uganda gained independence on October 9, 1962 with Apollo Milton Obote as executive Prime Minister.',
    ],
    simulatorType: 'east-africa-geography',
    deepDive:
      'Exam Distinction Tip: In SST questions on rift valleys, be prepared to draw and label tension vs compression fault lines, fault scarps, and graben troughs.',
    quiz: [
      {
        id: 'ple-sst-q1',
        question: 'Which of the following mountains in East Africa was formed by faulting (horst/block mountain)?',
        options: ['Mt. Elgon', 'Mt. Ruwenzori', 'Mt. Kilimanjaro', 'Mt. Moroto'],
        correctIndex: 1,
        explanation:
          'Mt. Ruwenzori is a block mountain (horst) formed when land between two parallel faults was pushed upwards by compressional forces.',
      },
    ],
    audioNarration:
      'For UNEB Social Studies, understand how downwarping created the expansive shallow basin of Lake Victoria, while tectonic faulting created the deep, elongated rift valley lakes like Albert and Edward.',
    unebReference: 'UNEB PLE Social Studies Syllabus: Physical Environment of East Africa & Political Developments in Uganda',
  },
  {
    id: 'uce-physics-optics-circuits',
    level: 'Secondary (UCE)',
    subject: 'Physics (535)',
    title: 'Light Refraction, Lenses & Current Electricity',
    difficulty: 'Core Exam Standard',
    shortDesc: 'Snells Law (n = sin i / sin r), critical angle, total internal reflection, convex lens ray diagrams, and Ohms law.',
    conceptSummary:
      'Refraction is the bending of light as it passes obliquely from one optical medium to another of different optical density due to a change in wave speed. Snells Law states that the ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant called the Refractive Index: n = sin(i) / sin(r). Total internal reflection occurs when light travels from an optically denser to a less dense medium and the angle of incidence exceeds the critical angle (sin c = 1 / n). In current electricity, Ohms Law states that electric current through a metallic conductor is directly proportional to the potential difference across it, provided temperature and other physical conditions remain constant (V = IR).',
    keyExamPoints: [
      'Snell’s Law equation: n1 * sin(theta1) = n2 * sin(theta2).',
      'Conditions for Total Internal Reflection: (1) Light must travel from denser to rarer medium; (2) Angle of incidence must be greater than critical angle.',
      'Convex (converging) lens produces a real, inverted image when object is placed beyond focal length (F); virtual and erect when object is between F and optical center.',
      'Equivalent resistance in Series: R_total = R1 + R2 + R3; in Parallel: 1/R_total = 1/R1 + 1/R2 + 1/R3.',
    ],
    simulatorType: 'ray-optics',
    deepDive:
      'UNEB UCE Practical Paper 535/3 & Theory Paper 535/1: Students must accurately plot graphs of sin i against sin r. The gradient equals the refractive index n of the glass block.',
    quiz: [
      {
        id: 'uce-phy-q1',
        question: 'What happens to a light ray passing from glass into air when the angle of incidence is greater than the critical angle?',
        options: [
          'It is refracted along the boundary at 90 degrees',
          'It is totally internally reflected back into the glass',
          'It is absorbed completely by the glass surface',
          'It speeds up and continues in a straight line without bending',
        ],
        correctIndex: 1,
        explanation:
          'When the angle of incidence in the denser medium exceeds the critical angle, all light is reflected back into the denser medium by Total Internal Reflection.',
      },
    ],
    audioNarration:
      'In UNEB UCE Physics Paper 1 and 2, remember that light bends towards the normal when moving into a denser medium because its speed decreases. In electric circuits, resistors in parallel always yield an equivalent resistance lower than the smallest resistor.',
    unebReference: 'UNEB Uganda Certificate of Education (UCE) Physics Syllabus 535: Geometrical Optics and Current Electricity',
  },
  {
    id: 'uce-chemistry-mole-periodic',
    level: 'Secondary (UCE)',
    subject: 'Chemistry (545)',
    title: 'The Mole Concept, Chemical Equations & Stoichiometry',
    difficulty: 'Distinction Target',
    shortDesc: 'Avogadros constant, molar mass, reacting mass calculations, molar gas volume (24 dm3 at r.t.p / 22.4 dm3 at s.t.p).',
    conceptSummary:
      'A mole is the amount of substance that contains as many elementary entities (atoms, molecules, ions) as there are atoms in exactly 12g of carbon-12, which is Avogadros number (6.022 x 10^23 particles). Number of moles (n) = Mass (g) / Molar Mass (Mr). For gases, 1 mole of any ideal gas occupies 22.4 dm³ (liters) at Standard Temperature and Pressure (s.t.p) and 24.0 dm³ at Room Temperature and Pressure (r.t.p). In titration stoichiometry: (M1 * V1) / n1 = (M2 * V2) / n2.',
    keyExamPoints: [
      'Molar Gas Volume at s.t.p = 22.4 dm³/mol (22400 cm³); at r.t.p = 24.0 dm³/mol (24000 cm³).',
      'Concentration in mol/dm³ (Molarity) = Moles of solute / Volume of solution in dm³.',
      'Concentration in g/dm³ = Molarity * Molar Mass.',
      'Always balance chemical equations before calculating mole ratios.',
    ],
    simulatorType: 'mole-concept',
    deepDive:
      'UNEB UCE Paper 545/2 Section B Standard Problem: Calculating the volume of carbon dioxide evolved when 5.0g of calcium carbonate reacts completely with excess hydrochloric acid at r.t.p. CaCO3 + 2HCl -> CaCl2 + H2O + CO2. Moles of CaCO3 = 5 / 100 = 0.05 mol. Mole ratio is 1:1, so moles of CO2 = 0.05. Volume = 0.05 * 24 dm³ = 1.2 dm³ (1200 cm³).',
    quiz: [
      {
        id: 'uce-chem-q1',
        question: 'What is the volume occupied by 0.5 moles of oxygen gas at room temperature and pressure (r.t.p)?',
        options: ['11.2 dm³', '12.0 dm³', '24.0 dm³', '22.4 dm³'],
        correctIndex: 1,
        explanation:
          'At r.t.p, 1 mole of gas occupies 24 dm³. Therefore, 0.5 moles occupies 0.5 * 24 = 12.0 dm³.',
      },
    ],
    audioNarration:
      'The mole is the universal bridge between grams on the balance and atoms reacting in the flask. Always check whether your UNEB exam question specifies standard temperature and pressure (22.4 liters) or room temperature and pressure (24 liters).',
    unebReference: 'UNEB UCE Chemistry 545: Chemical Calculations & The Mole Concept',
  },
  {
    id: 'uce-biology-genetics-photosynthesis',
    level: 'Secondary (UCE)',
    subject: 'Biology (553)',
    title: 'Mendelian Genetics, Cell Division & Photosynthesis',
    difficulty: 'Core Exam Standard',
    shortDesc: 'Monohybrid inheritance, Punnett squares, dominant vs recessive alleles, light and dark reactions of photosynthesis.',
    conceptSummary:
      'Gregor Mendels law of segregation states that alleles for a gene separate during gamete formation (meiosis) and reunite at fertilization. A monohybrid cross of two heterozygous individuals (Tt x Tt) yields a genotypic ratio of 1 TT : 2 Tt : 1 tt and a phenotypic ratio of 3 dominant to 1 recessive. In plant physiology, photosynthesis converts carbon dioxide and water into glucose and oxygen in the presence of sunlight and chlorophyll: 6CO2 + 6H2O -> C6H12O6 + 6O2. The Light-dependent stage occurs in thylakoids (splitting of water / photolysis), while the Light-independent stage (Calvin cycle) synthesizes glucose in the stroma.',
    keyExamPoints: [
      'Genotype: Genetic constitution of an organism (e.g., TT, Tt, tt).',
      'Phenotype: Observable physical characteristics resulting from genotype and environmental interaction.',
      'Heterozygous: Possessing two different alleles for a trait (Tt); Homozygous: Possessing identical alleles (TT or tt).',
      'In UNEB practical drawings, always state magnification (e.g., x2), use clean continuous lines, avoid shading, and draw horizontal guide lines.',
    ],
    simulatorType: 'punnett-genetics',
    deepDive:
      'UNEB UCE Biology Paper 553/2 Genetics Rules: Candidates must define parental genotypes, clearly show gametes with circles around alleles, construct the Punnett grid, and write both genotypic and phenotypic ratios.',
    quiz: [
      {
        id: 'uce-bio-q1',
        question: 'When crossing two heterozygous tall pea plants (Tt x Tt), what is the expected ratio of tall to dwarf offspring?',
        options: ['1:1', '3:1', '1:2:1', '4:0'],
        correctIndex: 1,
        explanation:
          'The monohybrid cross Tt x Tt results in genotypes TT, Tt, Tt, tt. Since TT and Tt are tall and only tt is dwarf, the phenotypic ratio is 3 tall : 1 dwarf.',
      },
    ],
    audioNarration:
      'When tackling genetics in UNEB Biology, never take shortcuts on the Punnett square. Clearly label parental phenotypes, parental genotypes, circle the gametes, and state both the genotypic and phenotypic ratios.',
    unebReference: 'UNEB UCE Biology 553: Genetics & Heredity, Plant Physiology',
  },
  {
    id: 'uce-math-quadratics-geometry',
    level: 'Secondary (UCE)',
    subject: 'Mathematics (456)',
    title: 'Quadratic Equations, Coordinate Geometry & Trigonometry',
    difficulty: 'Core Exam Standard',
    shortDesc: 'Factorization, quadratic formula, circle theorems, gradients, parallel/perpendicular lines, and sine/cosine rules.',
    conceptSummary:
      'Quadratic equations take the standard form ax² + bx + c = 0, solvable by factoring, completing the square, or the quadratic formula x = (-b ± sqrt(b² - 4ac)) / (2a). The discriminant D = b² - 4ac reveals roots: D > 0 (two distinct real roots), D = 0 (one repeated real root), D < 0 (no real roots). In Coordinate Geometry, the gradient m = (y2 - y1) / (x2 - x1); parallel lines have m1 = m2, while perpendicular lines satisfy m1 * m2 = -1. Circle theorems dictate that the angle subtended by an arc at the center is twice the angle subtended at the circumference.',
    keyExamPoints: [
      'Quadratic formula: x = (-b ± sqrt(b² - 4ac)) / (2a).',
      'Perpendicular line slope condition: m1 * m2 = -1 (Negative reciprocal).',
      'Sine rule: a / sin(A) = b / sin(B) = c / sin(C).',
      'Cosine rule: a² = b² + c² - 2bc * cos(A).',
      'Angle in a semicircle is always a right angle (90°).',
    ],
    simulatorType: 'quadratic-solver',
    deepDive:
      'UNEB UCE Paper 456/1 Section B: 12-mark questions frequently test combined quadratic curves with linear lines to find simultaneous intersection points graphically and algebraically.',
    quiz: [
      {
        id: 'uce-math-q1',
        question: 'If line L1 has a gradient of 2/3, what is the gradient of a line perpendicular to L1?',
        options: ['2/3', '-2/3', '-3/2', '3/2'],
        correctIndex: 2,
        explanation:
          'Perpendicular lines have slopes that multiply to -1: m2 = -1 / (2/3) = -3/2.',
      },
    ],
    audioNarration:
      'Mastering quadratic equations and coordinate geometry guarantees high scores in UNEB Paper 1. Remember the perpendicular line gradient formula and always verify both roots in your original equation.',
    unebReference: 'UNEB Uganda Certificate of Education (UCE) Mathematics 456: Algebra & Geometry',
  },
  {
    id: 'uneb-regulations-grading',
    level: 'UNEB Guidelines',
    subject: 'Examination Regulations',
    title: 'UNEB Act 2021, Malpractice Laws & Official Grading System',
    difficulty: 'Core Exam Standard',
    shortDesc: 'Understand Aggregates, Divisions 1 to U, e-registration, timetables, and strict penalties under UNEB Act 2021.',
    conceptSummary:
      'The Uganda National Examinations Board (UNEB) operates under the UNEB Act 2021. The grading system scores candidates from Distinction 1 (D1) to Fail 9 (F9). At PLE (Primary Leaving Examination), candidates take 4 papers (English, Math, Science, SST) with aggregates ranging from 4 (best) to 36 (worst), categorized into Division 1 (Agg 4-12), Division 2 (Agg 13-24), Division 3 (Agg 25-29), Division 4 (Agg 30-34), and Division U. At UCE (Uganda Certificate of Education), overall division is based on the best 8 subjects including core English, Mathematics, and Sciences. The UNEB Act 2021 introduces strict penalties: Section 25 imposes fines up to 40 million UGX and/or prison sentences up to 10 years for examination malpractice, unauthorized disclosure, or impersonation.',
    keyExamPoints: [
      'Official Portal: https://uneb.ac.ug/ for candidate e-registration, timetable verification, and results portal.',
      'PLE Division 1: Total aggregate between 4 and 12 across 4 subjects.',
      'UCE Division 1: Requires Credits in English, Math, Science, with aggregate 8 to 32 on best 8 subjects.',
      'UNEB Act 2021: Strict zero-tolerance to unauthorized exam materials, cellphones in examination halls, and collusion.',
      'Results Verification: Done officially via UNEB e-services portal or SMS shortcode *6600# upon release.',
    ],
    simulatorType: 'uneb-grading',
    deepDive:
      'Candidates must report to exam rooms 30 minutes before time with their official Index Number cards (Center Number / Candidate Number). Only non-programmable scientific calculators are permitted in specific UCE/UACE papers.',
    quiz: [
      {
        id: 'uneb-reg-q1',
        question: 'Under official UNEB PLE grading, what aggregate range qualifies a candidate for Division 1?',
        options: ['Aggregate 4 to 8', 'Aggregate 4 to 12', 'Aggregate 4 to 16', 'Aggregate 4 to 20'],
        correctIndex: 1,
        explanation:
          'In UNEB PLE, an aggregate score between 4 and 12 across the 4 core papers constitutes a Division 1 (First Grade) pass.',
      },
    ],
    audioNarration:
      'Every UNEB candidate must know their center number and index number. Prepare thoroughly, adhere strictly to the UNEB Act 2021 examination regulations, and aim for Division 1 distinctions.',
    unebReference: 'Uganda National Examinations Board (UNEB) Act 2021 & Official Grading Regulations (https://uneb.ac.ug/)',
  },
];
