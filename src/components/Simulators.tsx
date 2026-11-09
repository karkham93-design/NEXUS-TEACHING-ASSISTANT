import React, { useState } from 'react';
import {
  Heart,
  Gauge,
  Compass,
  Lightbulb,
  FlaskConical,
  Dna,
  Calculator,
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { calculatePLEDivision, evaluateUNEBGrade } from '../utils/learning';

interface SimulatorProps {
  type: string;
}

export const ConceptSimulator: React.FC<SimulatorProps> = ({ type }) => {
  if (type === 'heart-circulation') return <HeartCirculationSimulator />;
  if (type === 'speed-time') return <SpeedTimeSimulator />;
  if (type === 'east-africa-geography') return <EastAfricaGeographySimulator />;
  if (type === 'ray-optics') return <RayOpticsSimulator />;
  if (type === 'mole-concept') return <MoleConceptSimulator />;
  if (type === 'punnett-genetics') return <PunnettGeneticsSimulator />;
  if (type === 'quadratic-solver') return <QuadraticSimulator />;
  if (type === 'uneb-grading') return <UNEBGradingSimulator />;
  return null;
};

/* 1. PLE Integrated Science: Human Circulatory System Stepper */
const HeartCirculationSimulator: React.FC = () => {
  const steps = [
    {
      title: 'Step 1: Deoxygenated Blood Returns via Vena Cava',
      chamber: 'Right Atrium',
      vessel: 'Superior & Inferior Vena Cava',
      oxygenated: false,
      desc: 'Blood carrying carbon dioxide and metabolic waste from the upper and lower body enters the Right Atrium through the Vena Cava under low pressure.',
    },
    {
      title: 'Step 2: Pumping through Tricuspid Valve into Right Ventricle',
      chamber: 'Right Ventricle',
      vessel: 'Tricuspid Valve (prevents backflow)',
      oxygenated: false,
      desc: 'The right atrium contracts, pushing deoxygenated blood through the open tricuspid valve into the muscular Right Ventricle.',
    },
    {
      title: 'Step 3: Pulmonary Artery Pumps Blood to Lungs',
      chamber: 'Pulmonary Artery -> Lungs',
      vessel: 'Pulmonary Artery (ONLY artery with deoxygenated blood)',
      oxygenated: false,
      desc: 'The Right Ventricle contracts, forcing blood past the semi-lunar valve through the Pulmonary Artery to the lungs for gaseous exchange (alveoli).',
    },
    {
      title: 'Step 4: Oxygenated Blood Returns via Pulmonary Vein',
      chamber: 'Left Atrium',
      vessel: 'Pulmonary Vein (ONLY vein with oxygenated blood)',
      oxygenated: true,
      desc: 'In the lungs, blood absorbs oxygen and expels carbon dioxide. Freshly oxygenated blood returns to the Left Atrium via the Pulmonary Vein.',
    },
    {
      title: 'Step 5: Left Ventricle Pumps Oxygenated Blood via Aorta to Body',
      chamber: 'Left Ventricle -> Aorta',
      vessel: 'Aorta (Largest artery in human body)',
      oxygenated: true,
      desc: 'The Left Ventricle, possessing the thickest muscular wall, contracts forcefully to pump oxygen-rich blood into the Aorta, supplying the entire body.',
    },
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const current = steps[stepIndex];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
          <h4 className="font-semibold text-white">PLE Science: Double Circulation Pathway Stepper</h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStepIndex((p) => Math.max(0, p - 1))}
            disabled={stepIndex === 0}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-xs text-slate-300"
          >
            Previous
          </button>
          <button
            onClick={() => setStepIndex((p) => Math.min(steps.length - 1, p + 1))}
            disabled={stepIndex === steps.length - 1}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 rounded text-xs text-white font-medium flex items-center gap-1"
          >
            <span>Next Blood Stage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setStepIndex(0)}
            className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className={`p-4 rounded-lg border mb-4 ${
        current.oxygenated
          ? 'bg-rose-950/40 border-rose-600/50 text-rose-200'
          : 'bg-blue-950/40 border-blue-600/50 text-blue-200'
      }`}>
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-xs uppercase tracking-wider">
            {current.oxygenated ? '❤️ OXYGENATED BLOOD (Bright Red)' : '💙 DEOXYGENATED BLOOD (Dark Red)'}
          </span>
          <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded font-mono">
            Stage {stepIndex + 1} of 5
          </span>
        </div>
        <h5 className="font-bold text-sm text-white mb-1">{current.title}</h5>
        <p className="text-xs text-slate-300 leading-relaxed">{current.desc}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[11px] mb-1">Active Heart Chamber / Target:</span>
          <span className="text-white font-bold">{current.chamber}</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[11px] mb-1">Vessel &amp; UNEB Exam Rule:</span>
          <span className="text-amber-300 font-semibold">{current.vessel}</span>
        </div>
      </div>
    </div>
  );
};

/* 2. PLE Mathematics: Speed, Distance, Time & Commercial Arithmetic */
const SpeedTimeSimulator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(120);
  const [speedKmh, setSpeedKmh] = useState<number>(60);
  const [restMinutes, setRestMinutes] = useState<number>(30);

  const travelTimeHours = distanceKm / Math.max(1, speedKmh);
  const totalTimeHours = travelTimeHours + restMinutes / 60;
  const overallAvgSpeed = distanceKm / totalTimeHours;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-indigo-400" />
          <h4 className="font-semibold text-white">PLE Math: Average Speed &amp; Journey Graph Calculator</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Distance (km):</label>
          <input
            type="number"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Cruising Speed (km/h):</label>
          <input
            type="number"
            value={speedKmh}
            onChange={(e) => setSpeedKmh(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Rest Stop (minutes):</label>
          <input
            type="number"
            value={restMinutes}
            onChange={(e) => setRestMinutes(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
        <div className="flex justify-between text-slate-300">
          <span>Actual Driving Time:</span>
          <span className="text-indigo-300">{travelTimeHours.toFixed(2)} hours ({Math.round(travelTimeHours * 60)} mins)</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Total Elapsed Time (with Rest):</span>
          <span className="text-amber-300">{totalTimeHours.toFixed(2)} hours</span>
        </div>
        <div className="flex justify-between text-slate-100 font-bold pt-2 border-t border-slate-800">
          <span className="text-emerald-400">UNEB Average Speed (Total Dist / Total Time):</span>
          <span className="text-emerald-300 text-sm">{overallAvgSpeed.toFixed(2)} km/h</span>
        </div>
      </div>
    </div>
  );
};

/* 3. PLE Social Studies: East Africa Physical Geography */
const EastAfricaGeographySimulator: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<'rift' | 'ruwenzori' | 'victoria' | 'elgon'>('rift');

  const data = {
    rift: {
      name: 'The Great East African Rift Valley (Western & Eastern Arms)',
      formation: 'Formed by Tectonic Faulting (Tension and Compression forces)',
      features: 'Steep escarpments, graben floor, lakes Albert, Edward, Tanganyika, George, Bunyonyi.',
      examRule: 'Western Arm passes through Uganda, DRC, Rwanda, Burundi, and Tanzania.',
    },
    ruwenzori: {
      name: 'Mt. Ruwenzori (Mountains of the Moon - 5,109m)',
      formation: 'Block Mountain / Horst formed when land between two parallel faults was uplifted.',
      features: 'Highest peak is Margherita on Mt. Stanley. Permanently snow-capped despite being on the Equator.',
      examRule: 'PLE distinction fact: Ruwenzori is NOT volcanic; it is an uplifted horst block.',
    },
    victoria: {
      name: 'Lake Victoria (Nalubaale - 68,800 sq km)',
      formation: 'Formed by Downwarping (Crustal Sagging / Basin depression)',
      features: 'Shallow fresh water lake, source of the River Nile (R. Kiira), shared by Uganda, Kenya, Tanzania.',
      examRule: 'Shallow basin unlike deep rift valley graben lakes.',
    },
    elgon: {
      name: 'Mt. Elgon (Wagagai Peak - 4,321m)',
      formation: 'Extinct Volcanic Mountain formed by lava and ash eruptions.',
      features: 'Has one of the largest intact calderas in the world. Fertile volcanic soils supporting Arabica coffee.',
      examRule: 'Shared between Eastern Uganda (Mbale/Kapchorwa) and Western Kenya.',
    },
  };

  const current = data[selectedFeature];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h4 className="font-semibold text-white">PLE SST: East African Physical Features &amp; Formations</h4>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: 'rift', label: 'Great Rift Valley' },
          { id: 'ruwenzori', label: 'Mt. Ruwenzori (Horst)' },
          { id: 'victoria', label: 'Lake Victoria (Downwarping)' },
          { id: 'elgon', label: 'Mt. Elgon (Volcano)' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedFeature(t.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              selectedFeature === t.id
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
        <h5 className="font-bold text-sm text-cyan-300">{current.name}</h5>
        <div className="text-slate-300">
          <strong className="text-white">Geological Formation: </strong>
          {current.formation}
        </div>
        <div className="text-slate-300">
          <strong className="text-white">Distinctive Characteristics: </strong>
          {current.features}
        </div>
        <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 font-mono text-[11px]">
          🎯 <strong>UNEB PLE Exam Rule:</strong> {current.examRule}
        </div>
      </div>
    </div>
  );
};

/* 4. UCE Physics: Snell's Law & Total Internal Reflection */
const RayOpticsSimulator: React.FC = () => {
  const [angleIncidence, setAngleIncidence] = useState<number>(30);
  const refractiveIndex = 1.5; // Crown glass

  // Snell's Law: sin r = (sin i) / n (air to glass)
  const sinR = Math.sin((angleIncidence * Math.PI) / 180) / refractiveIndex;
  const angleRefraction = (Math.asin(Math.min(1, sinR)) * 180) / Math.PI;

  // Critical angle for glass to air: sin c = 1 / n
  const criticalAngle = (Math.asin(1 / refractiveIndex) * 180) / Math.PI;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h4 className="font-semibold text-white">UCE Physics 535: Snells Law &amp; Critical Angle Refractometer</h4>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Angle of Incidence in Air (i): {angleIncidence}°</span>
          <span>Medium: Crown Glass (n = {refractiveIndex})</span>
        </div>
        <input
          type="range"
          min="0"
          max="80"
          value={angleIncidence}
          onChange={(e) => setAngleIncidence(Number(e.target.value))}
          className="w-full accent-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono">
        <div>
          <span className="text-slate-400 block text-[11px] mb-1">Angle of Refraction (r):</span>
          <span className="text-amber-300 font-bold text-sm">{angleRefraction.toFixed(2)}°</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] mb-1">Glass Critical Angle (c):</span>
          <span className="text-cyan-300 font-bold text-sm">{criticalAngle.toFixed(2)}°</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] mb-1">Light Speed in Glass:</span>
          <span className="text-emerald-300 font-bold text-sm">2.00 × 10⁸ m/s</span>
        </div>
      </div>
    </div>
  );
};

/* 5. UCE Chemistry: The Mole Concept & Gas Volume */
const MoleConceptSimulator: React.FC = () => {
  const [moles, setMoles] = useState<number>(0.5);

  const particles = moles * 6.022; // * 10^23
  const volumeStp = moles * 22.4;
  const volumeRtp = moles * 24.0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-emerald-400" />
          <h4 className="font-semibold text-white">UCE Chemistry 545: Mole Stoichiometry &amp; Molar Gas Volumes</h4>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-slate-400 mb-1">Amount of Substance (Moles): {moles} mol</label>
        <input
          type="range"
          min="0.1"
          max="5.0"
          step="0.1"
          value={moles}
          onChange={(e) => setMoles(Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono">
        <div>
          <span className="text-slate-400 block text-[11px] mb-1">Avogadro Particles:</span>
          <span className="text-emerald-300 font-bold text-sm">
            {particles.toFixed(2)} × 10²³
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] mb-1">Gas Volume at s.t.p:</span>
          <span className="text-indigo-300 font-bold text-sm">
            {volumeStp.toFixed(2)} dm³ ({Math.round(volumeStp * 1000)} cm³)
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] mb-1">Gas Volume at r.t.p:</span>
          <span className="text-amber-300 font-bold text-sm">
            {volumeRtp.toFixed(2)} dm³ ({Math.round(volumeRtp * 1000)} cm³)
          </span>
        </div>
      </div>
    </div>
  );
};

/* 6. UCE Biology: Punnett Genetics */
const PunnettGeneticsSimulator: React.FC = () => {
  const [parent1, setParent1] = useState<'TT' | 'Tt' | 'tt'>('Tt');
  const [parent2, setParent2] = useState<'TT' | 'Tt' | 'tt'>('Tt');

  const g1 = parent1.split('');
  const g2 = parent2.split('');

  const grid = [
    [g1[0] + g2[0], g1[1] + g2[0]],
    [g1[0] + g2[1], g1[1] + g2[1]],
  ];

  // Count tall vs dwarf
  const allOffspring = [grid[0][0], grid[0][1], grid[1][0], grid[1][1]];
  const tallCount = allOffspring.filter((o) => o.includes('T')).length;
  const dwarfCount = allOffspring.length - tallCount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-purple-400" />
          <h4 className="font-semibold text-white">UCE Biology 553: Mendelian Monohybrid Punnett Grid</h4>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Parent 1 Genotype:</label>
          <select
            value={parent1}
            onChange={(e) => setParent1(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
          >
            <option value="TT">TT (Homozygous Tall)</option>
            <option value="Tt">Tt (Heterozygous Tall)</option>
            <option value="tt">tt (Homozygous Dwarf)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Parent 2 Genotype:</label>
          <select
            value={parent2}
            onChange={(e) => setParent2(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
          >
            <option value="TT">TT (Homozygous Tall)</option>
            <option value="Tt">Tt (Heterozygous Tall)</option>
            <option value="tt">tt (Homozygous Dwarf)</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col items-center">
        <div className="grid grid-cols-2 gap-2 text-center font-mono text-sm font-bold w-48 mb-3">
          {allOffspring.map((gen, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border ${
                gen.includes('T')
                  ? 'bg-purple-950/60 border-purple-600/50 text-purple-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {gen}
            </div>
          ))}
        </div>
        <div className="text-xs font-semibold text-white">
          Phenotypic Ratio: <span className="text-purple-300">{tallCount} Tall : {dwarfCount} Dwarf</span>
        </div>
      </div>
    </div>
  );
};

/* 7. UCE Mathematics: Quadratic Solver */
const QuadraticSimulator: React.FC = () => {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-5);
  const [c, setC] = useState<number>(6);

  const discriminant = b * b - 4 * a * c;
  let root1: number | null = null;
  let root2: number | null = null;

  if (discriminant >= 0 && a !== 0) {
    root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <h4 className="font-semibold text-white">UCE Math 456: Quadratic Formula &amp; Discriminant Engine</h4>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Coefficient a (x²):</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Coefficient b (x):</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Constant c:</label>
          <input
            type="number"
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
        <div className="text-indigo-300 font-bold">
          Equation: {a}x² {b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`} {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0
        </div>
        <div className="text-slate-300">
          Discriminant (D = b² - 4ac): <span className="text-amber-300 font-bold">{discriminant}</span>{' '}
          {discriminant > 0 ? '(Two Distinct Real Roots)' : discriminant === 0 ? '(One Real Root)' : '(Complex / No Real Roots)'}
        </div>
        {root1 !== null && root2 !== null ? (
          <div className="text-emerald-300 font-bold pt-1 border-t border-slate-800">
            x₁ = {root1.toFixed(3)}, x₂ = {root2.toFixed(3)}
          </div>
        ) : (
          <div className="text-rose-400 pt-1">No real roots (D &lt; 0)</div>
        )}
      </div>
    </div>
  );
};

/* 8. UNEB Official Aggregates & Division Grading Simulator */
const UNEBGradingSimulator: React.FC = () => {
  const [level, setLevel] = useState<'PLE' | 'UCE'>('PLE');

  // PLE 4 subjects (Grades 1 to 9)
  const [eng, setEng] = useState<number>(2);
  const [math, setMath] = useState<number>(1);
  const [sci, setSci] = useState<number>(2);
  const [sst, setSst] = useState<number>(3);

  const pleAggregate = eng + math + sci + sst;
  const pleResult = calculatePLEDivision(pleAggregate);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h4 className="font-semibold text-white">Official UNEB Aggregate &amp; Division Grading Calculator</h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLevel('PLE')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              level === 'PLE' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            PLE (4 Papers)
          </button>
          <button
            onClick={() => setLevel('UCE')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              level === 'UCE' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            UCE (8 Best Papers)
          </button>
        </div>
      </div>

      {level === 'PLE' ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Select points for the 4 core Primary Leaving Examination papers (D1=1, D2=2 ... F9=9):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'English', val: eng, setter: setEng },
              { name: 'Mathematics', val: math, setter: setMath },
              { name: 'Integrated Science', val: sci, setter: setSci },
              { name: 'Social Studies (SST)', val: sst, setter: setSst },
            ].map((sub, i) => (
              <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="block text-[11px] text-slate-400 mb-1">{sub.name}</label>
                <select
                  value={sub.val}
                  onChange={(e) => sub.setter(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                >
                  <option value={1}>D1 (1 pt)</option>
                  <option value={2}>D2 (2 pts)</option>
                  <option value={3}>C3 (3 pts)</option>
                  <option value={4}>C4 (4 pts)</option>
                  <option value={5}>C5 (5 pts)</option>
                  <option value={6}>C6 (6 pts)</option>
                  <option value={7}>P7 (7 pts)</option>
                  <option value={8}>P8 (8 pts)</option>
                  <option value={9}>F9 (9 pts)</option>
                </select>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400">Total Aggregate:</span>
              <div className="text-2xl font-bold font-mono text-amber-300">
                {pleAggregate} Aggregates
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Official Result:</span>
              <div className="text-lg font-bold text-emerald-400">{pleResult.division}</div>
              <span className="text-[11px] text-slate-400 font-mono">{pleResult.remarks}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs">
          <h5 className="font-bold text-amber-300">UCE Division Requirements (Best 8 Subjects)</h5>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li><strong>Division 1:</strong> Total aggregate between 8 and 32 on the best 8 subjects, with at least a Credit in English, Math, and a Science.</li>
            <li><strong>Division 2:</strong> Total aggregate between 33 and 45.</li>
            <li><strong>Division 3:</strong> Total aggregate between 46 and 58.</li>
            <li><strong>Division 4:</strong> Passes in at least one subject with aggregate 59 to 68.</li>
            <li><strong>Division U:</strong> Failed (Requires re-sitting).</li>
          </ul>
        </div>
      )}
    </div>
  );
};
