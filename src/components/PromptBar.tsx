'use client';

import React, { isValidElement, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowDown01Icon,
  Attachment01Icon,
  Calendar03Icon,
  Cancel01Icon,
  ChartLineData01Icon,
  File02Icon,
  Globe02Icon,
  HelpCircleIcon,
  Mail01Icon,
  Mic01Icon,
  PlusSignIcon,
  SparklesIcon,
  Tick02Icon,
  BookOpen01Icon,
  Image01Icon,
  UserCheck01Icon,
  Award01Icon,
} from '@hugeicons/core-free-icons';
import './PromptBar.css';
import VoicePill from './VoicePill';
import BranchedMenu, { BranchedMenuSection, BranchedMenuItem } from './BranchedMenu';

const ARROW_UP = [12, 4.5, 18.5, 11, 14.25, 11, 14.25, 19.5, 9.75, 19.5, 9.75, 11, 5.5, 11];
const SQUARE = [12, 6, 18, 6, 18, 12, 18, 18, 6, 18, 6, 12, 6, 6];
const EASE_IN_OUT = [0.77, 0, 0.175, 1];
const LINE = 22;
const EDGE = 11;

export interface MenuBranch {
  id: string;
  name: string;
  icon: any;
  items: Array<{
    key: string;
    name: string;
    description: string;
    action?: string;
    promptTemplate?: string;
  }>;
}

// Navigation Tabs corresponding directly to image_9ef17bd7.png / image_1cbb64ea.png
export const IMAGE_NAV_TABS = [
  { id: 'syllabi', label: 'UNEB Syllabi & Labs', icon: BookOpen01Icon },
  { id: 'chat', label: 'NEXUS Examiner Chat', icon: UserCheck01Icon },
  { id: 'diagrams', label: '1K/2K/4K Study Photos & Diagrams', icon: Image01Icon },
  { id: 'pulse', label: 'UNEB News & Exam Centers', icon: Globe02Icon },
  { id: 'workspace', label: 'Google Workspace Hub', icon: File02Icon },
  { id: 'leaderboard', label: 'Candidate Leaderboard', icon: Award01Icon },
];

// Branched menu corresponding to the options in the user's images, featuring Lower School & Upper School modules
export const BRANCHED_MENU_SECTIONS: MenuBranch[] = [
  {
    id: 'lower-school',
    name: 'Lower School Modules (PLE P.1 - P.7)',
    icon: BookOpen01Icon,
    items: [
      { key: 'ple-sci', name: 'PLE Integrated Science (P.1 - P.7)', description: 'Human body systems, plant growth, hygiene, diseases & immunization', promptTemplate: 'Explain the PLE Integrated Science syllabus standards for ' },
      { key: 'ple-math', name: 'PLE Primary Mathematics (P.1 - P.7)', description: 'Fractions, percentages, integers, sets, geometry, algebra, money (UGX) & time', promptTemplate: 'Solve this PLE Primary 7 Mathematics problem step-by-step: ' },
      { key: 'ple-sst', name: 'PLE Social Studies (SST) & RE', description: 'Uganda & East Africa geography, physical features, early history, civic governance & CRE/IRE', promptTemplate: 'Provide the UNEB PLE Social Studies (SST) marking criteria for ' },
      { key: 'ple-eng', name: 'PLE English Language (P.1 - P.7)', description: 'Comprehension passages, active/passive voice, direct/indirect speech, composition & letter writing', promptTemplate: 'Guide me through the PLE English grammar rule for ' },
      { key: 'ple-mock', name: 'PLE Division 1 Mock Drills & Scoring Guide', description: 'Aggregates 4–12 master criteria, Section A (40m) & Section B (60m) strategy', action: 'role_ple', promptTemplate: 'What are the chief examiner requirements for Division 1 in PLE ' },
      { key: 'ple-foundations', name: 'Lower Primary P.1 - P.5 Foundations', description: 'Foundational literacy, numeracy, local environment & hygiene competencies', promptTemplate: 'Provide lower primary teaching guidelines for ' },
    ],
  },
  {
    id: 'upper-school',
    name: 'Upper School Modules (UCE S.1 - S.4 & UACE)',
    icon: SparklesIcon,
    items: [
      { key: 'uce-phys', name: 'UCE Physics 535', description: 'Snell\'s law, Ohm\'s law, prism refraction, mechanics, Archimedes & floatation, wave motion', promptTemplate: 'Provide step-by-step UCE Physics 535 derivation for ' },
      { key: 'uce-bio', name: 'UCE Biology 553', description: 'Photosynthesis, genetics & Mendel\'s laws, mammalian double circulation, respiration, ecology', promptTemplate: 'Detail the UNEB Biology 553 marking scheme for ' },
      { key: 'uce-chem', name: 'UCE Chemistry 545', description: 'Bohr atomic structure, mole concept & stoichiometry, acids/bases/salts, electrolysis', promptTemplate: 'Explain the UCE Chemistry 545 calculation for ' },
      { key: 'uce-math', name: 'UCE Mathematics 456', description: 'Quadratic curves, circle theorems, vectors & 2x2 matrices, trigonometry & statistics', promptTemplate: 'Solve with full UNEB Mathematics 456 steps: ' },
      { key: 'uce-geo', name: 'UCE Geography 273/1 & 273/2', description: 'East African Rift Valley faulting, volcanicity, drainage basins, glaciations, photograph work', promptTemplate: 'Explain the formation under UNEB Geography 273/1 of ' },
      { key: 'uce-hist', name: 'UCE History & Political Education', description: 'East African kingdoms, 1894/1900 Uganda Agreement, African nationalism, Constitution & democracy', promptTemplate: 'Analyze under UNEB History & Political Education: ' },
      { key: 'uce-ict', name: 'UCE ICT & Computer Studies 840', description: 'Computer hardware architecture, network topologies, spreadsheet formulas, database querying', promptTemplate: 'Guide me on UCE ICT practical paper standard for ' },
      { key: 'uace-sci', name: 'UACE Advanced Sciences (Physics 510, Chem 525, Bio 530, Math P425)', description: 'Advanced calculus, rigid body mechanics, organic mechanisms, cellular biochemistry', promptTemplate: 'Provide UACE Advanced Level standard solution for ' },
    ],
  },
  {
    id: 'labs',
    name: 'UNEB Science Labs & Experiments',
    icon: SparklesIcon,
    items: [
      { key: 'lab-phys', name: 'Physics Mechanics & Optics Practicals', description: 'Simple pendulum periodic time, triangular prism ray-tracing, metre bridge resistance', promptTemplate: 'Explain the UNEB Physics practical procedure and precautions for ' },
      { key: 'lab-bio', name: 'Biology Food Tests & Specimen Drawings', description: 'Benedict\'s reducing sugars, iodine starch, biuret protein test, microscope magnification', promptTemplate: 'Provide the laboratory report and table format for Biology ' },
      { key: 'lab-chem', name: 'Chemistry Titration & Qualitative Analysis', description: 'Standard Na2CO3 vs HCl titration, cation/anion salt analysis (Fe2+, Fe3+, Cu2+, SO4 2-)', promptTemplate: 'Provide the step-by-step Chemistry volumetric analysis calculation for ' },
    ],
  },
  {
    id: 'chat',
    name: 'NEXUS Examiner Chat',
    icon: UserCheck01Icon,
    items: [
      { key: 'role-senior', name: 'Senior UNEB Chief Examiner', description: 'Comprehensive national marking scheme and exam guidelines', action: 'role_general', promptTemplate: 'As Senior UNEB Chief Examiner, explain ' },
      { key: 'role-ple', name: 'PLE P.7 Chief Marker', description: 'PLE Section A & B scoring to secure Aggregates 4-12', action: 'role_ple', promptTemplate: 'As PLE Chief Marker, evaluate ' },
      { key: 'role-uce', name: 'UCE S.4 Senior Marker', description: 'NLSC competency & Distinction 1 criteria', action: 'role_uce', promptTemplate: 'As UCE Senior Marker, analyze ' },
      { key: 'role-reg', name: 'UNEB Act 2021 Officer', description: 'Anti-malpractice law, registration, candidate rights', action: 'role_regulations', promptTemplate: 'Under UNEB Act 2021 regulations, clarify ' },
    ],
  },
  {
    id: 'diagrams',
    name: '1K/2K/4K Study Photos & Diagrams',
    icon: Image01Icon,
    items: [
      { key: 'diag-heart', name: 'Human Heart 4 Chambers', description: 'Double circulation & labeled valves vector diagram', action: 'diag_heart', promptTemplate: 'Generate diagram of Human Heart double circulation' },
      { key: 'diag-prism', name: 'Glass Prism Refraction', description: 'Incident ray, normal, deviation angle & Snell\'s law', action: 'diag_prism', promptTemplate: 'Generate diagram of Glass Prism light refraction' },
      { key: 'diag-circuit', name: 'Electric Circuit & Ohm\'s Law', description: 'Ammeter in series, voltmeter in parallel, battery', action: 'diag_circuit', promptTemplate: 'Generate diagram of Electric Circuit with Ohm\'s law' },
      { key: 'diag-atom', name: 'Carbon Atom Bohr Model', description: 'Nucleus, protons, neutrons, K & L electron shells', action: 'diag_atom', promptTemplate: 'Generate diagram of Atomic Structure Bohr model' },
      { key: 'diag-leaf', name: 'Photosynthesis Leaf T.S.', description: 'Palisade mesophyll, stomata guard cells & equation', action: 'diag_leaf', promptTemplate: 'Generate diagram of Leaf Transverse Section photosynthesis' },
      { key: 'diag-rift', name: 'East Africa Rift Valley', description: 'Tensional forces, graben floor, Rwenzori horst', action: 'diag_rift', promptTemplate: 'Generate diagram of East Africa Rift Valley faulting' },
    ],
  },
  {
    id: 'pulse',
    name: 'UNEB News & Exam Centers',
    icon: Globe02Icon,
    items: [
      { key: 'news-tt', name: 'Official Exam Timetable', description: 'PLE, UCE, and UACE national schedule updates', promptTemplate: 'What is the current UNEB national exam timetable schedule?' },
      { key: 'news-centers', name: 'Registered Exam Centers', description: 'Verified secondary & primary school centers across Uganda', promptTemplate: 'How can candidates verify registered UNEB examination centers?' },
      { key: 'news-malpractice', name: 'UNEB Act 2021 Malpractice Penalties', description: 'Legal consequences, fines, and candidate integrity', promptTemplate: 'Summarize candidate penalties for exam malpractice under UNEB Act 2021' },
    ],
  },
  {
    id: 'workspace',
    name: 'Google Workspace Hub',
    icon: File02Icon,
    items: [
      { key: 'ws-drive', name: 'Save Study Notes to Drive', description: 'Export revision sheet directly to Google Drive', action: 'nav_workspace' },
      { key: 'ws-mail', name: 'Email Summary via Gmail', description: 'Send revision summary to student or study group', action: 'nav_workspace' },
      { key: 'ws-cal', name: 'Schedule Calendar Study Drill', description: 'Book a candidate revision session on Google Calendar', action: 'nav_workspace' },
      { key: 'ws-tasks', name: 'Add to Google Tasks', description: 'Track UNEB past-paper assignments on Google Tasks', action: 'nav_workspace' },
    ],
  },
];

const DEFAULT_COMMANDS = [
  { key: 'summarize', name: '/summarize', description: 'Digest key points for UNEB revision' },
  { key: 'solve', name: '/solve', description: 'Solve step-by-step with full marking steps' },
  { key: 'diagram', name: '/diagram', description: 'Request a labeled syllabus blueprint' },
  { key: 'quiz', name: '/quiz', description: 'Challenge me with a past paper question' },
  { key: 'rules', name: '/rules', description: 'Explain UNEB Act 2021 candidate rules' },
];

const DEFAULT_MODELS = [
  { key: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite', tag: 'Fast' },
  { key: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash', tag: 'Standard' },
  { key: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', tag: 'General' },
  { key: 'gemini-4-argon', name: 'Gemini 4 Argon', tag: 'Deep Thinking' },
];

const DEFAULT_EFFORTS = ['Low', 'Medium', 'High', 'Extra', 'Max'];

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const pathAt = (a: number[], b: number[], t: number) => {
  let d = '';
  for (let i = 0; i < a.length; i += 2) {
    d += `${i ? 'L' : 'M'}${mix(a[i], b[i], t).toFixed(2)} ${mix(a[i + 1], b[i + 1], t).toFixed(2)}`;
  }
  return `${d}Z`;
};

const parseToken = (draft: string) => {
  const m = /(^|\s)([@/])([\w-]*)$/.exec(draft);
  if (!m) return null;
  return { kind: m[2] === '@' ? 'at' : 'slash', query: m[3].toLowerCase(), start: m.index + m[1].length };
};

const renderIcon = (icon: any, size: number) =>
  isValidElement(icon) ? icon : <HugeiconsIcon icon={icon} size={size} strokeWidth={1.8} />;

function SendGlyph({ busy, morphDuration, squash, tilt }: { busy: boolean; morphDuration: number; squash: number; tilt: number }) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const dir = useRef(busy ? 1 : -1);
  const t = useMotionValue(busy ? 1 : 0);

  useEffect(() => {
    const target = busy ? 1 : 0;
    dir.current = busy ? 1 : -1;
    if (t.get() === target) return undefined;
    const controls = animate(
      t as any,
      target as any,
      reduce ? { duration: 0 } : { duration: morphDuration / 1000, ease: EASE_IN_OUT as any }
    );
    return () => controls.stop();
  }, [busy, morphDuration, reduce, t]);

  useMotionValueEvent(t, 'change', (v: number) => {
    pathRef.current?.setAttribute('d', pathAt(ARROW_UP, SQUARE, v));
    const goo = reduce ? 0 : Math.sin(v * Math.PI);
    const sx = 1 - squash * goo;
    if (svgRef.current) {
      svgRef.current.style.transform = goo ? `rotate(${dir.current * tilt * goo}deg) scale(${sx}, ${1 / sx})` : '';
    }
  });

  return (
    <svg
      ref={svgRef}
      className="prompt-bar__glyph"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path ref={pathRef} d={pathAt(ARROW_UP, SQUARE, t.get())} />
    </svg>
  );
}

export interface PromptBarProps {
  placeholder?: string;
  branches?: MenuBranch[];
  commands?: Array<{ key: string; name: string; description: string }>;
  models?: Array<{ key: string; name: string; tag: string }>;
  defaultModel?: string;
  efforts?: string[];
  defaultEffort?: string;
  onEffortChange?: (effort: string) => void;
  onModelChange?: (modelKey: string) => void;
  onSelectAction?: (action: string, meta?: any) => void;
  busy?: boolean;
  onSend?: (text: string, meta: any) => void;
  onStop?: () => void;
  onAttach?: () => Promise<string | string[] | null> | string | string[] | null;
  onVoiceTranscribe?: (text: string) => void;
  background?: string;
  color?: string;
  menuBackground?: string;
  sparkColor?: string;
  sparkBoost?: number;
  width?: number;
  radius?: number;
  maxRows?: number;
  morphDuration?: number;
  squash?: number;
  tilt?: number;
  pressScale?: number;
  className?: string;
}

export default function PromptBar({
  placeholder = 'Ask anything across UNEB syllabus (PLE / UCE / UACE)...',
  branches = BRANCHED_MENU_SECTIONS,
  commands = DEFAULT_COMMANDS,
  models = DEFAULT_MODELS,
  defaultModel = 'gemini-flash-lite-latest',
  efforts = DEFAULT_EFFORTS,
  defaultEffort = 'Medium',
  onEffortChange,
  onModelChange,
  onSelectAction,
  busy = false,
  onSend,
  onStop,
  onAttach,
  onVoiceTranscribe,
  background = '#18181b',
  color = '#f5f5f5',
  menuBackground = '#1e293b',
  sparkColor = '#ef4444',
  sparkBoost = 1,
  width = 680,
  radius = 16,
  maxRows = 5,
  morphDuration = 240,
  squash = 0.12,
  tilt = 8,
  pressScale = 0.96,
  className = ''
}: PromptBarProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const glowRef = useRef<HTMLSpanElement | null>(null);
  const sparkRef = useRef<HTMLCanvasElement | null>(null);
  const typing = useRef({ energy: 0, strokes: 0 });
  const boost = useRef(sparkBoost);
  boost.current = sparkBoost;
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastOpen = useRef<string | null>(null);
  const latest = useRef<any>({});
  latest.current = { onSend, onStop, onAttach, onEffortChange, onModelChange, onSelectAction, onVoiceTranscribe };

  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [modelKey, setModelKey] = useState(defaultModel);
  const [plusOpen, setPlusOpen] = useState(false);
  const [activeBranchId, setActiveBranchId] = useState<string>('lower-school');
  const [activeNavTab, setActiveNavTab] = useState<string>('syllabi');
  const [modelOpen, setModelOpen] = useState(false);
  const [effortOpen, setEffortOpen] = useState(false);
  const [effortIndex, setEffortIndex] = useState(() => {
    const i = efforts.indexOf(defaultEffort);
    return i >= 0 ? i : Math.max(0, Math.floor((efforts.length - 1) / 2));
  });
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(0);
  const [pressed, setPressed] = useState(false);

  const model = models.find(m => m.key === modelKey) ?? models[0];
  const token = dismissed ? null : parseToken(draft);
  const open = plusOpen ? 'branched' : (token?.kind ?? (modelOpen ? 'model' : effortOpen ? 'effort' : null));
  const query = plusOpen ? '' : (token?.query ?? '');

  // Full branched menu tree sections for BranchedMenu component
  const branchedMenuItems: BranchedMenuSection[] = useMemo(() => {
    return branches.map(b => ({
      label: b.name,
      value: b.id,
      icon: b.icon,
      children: b.items.map(it => ({
        value: it.key,
        label: it.name,
        icon: b.icon,
        description: it.description,
        action: it.action,
        promptTemplate: it.promptTemplate,
      })),
    }));
  }, [branches]);

  // Filter branches according to active top tab from image
  const filteredBranchedMenuItems: BranchedMenuSection[] = useMemo(() => {
    if (activeNavTab === 'syllabi') {
      return branchedMenuItems.filter(b => b.value === 'lower-school' || b.value === 'upper-school' || b.value === 'labs');
    }
    if (activeNavTab === 'chat') {
      return branchedMenuItems.filter(b => b.value === 'chat');
    }
    if (activeNavTab === 'diagrams') {
      return branchedMenuItems.filter(b => b.value === 'diagrams');
    }
    if (activeNavTab === 'pulse') {
      return branchedMenuItems.filter(b => b.value === 'pulse');
    }
    if (activeNavTab === 'workspace') {
      return branchedMenuItems.filter(b => b.value === 'workspace');
    }
    return branchedMenuItems;
  }, [activeNavTab, branchedMenuItems]);

  const activeBranchIndex = branches.findIndex(b => b.id === activeBranchId);

  // Flattened list when searching or filtering
  const activeBranch = branches.find(b => b.id === activeBranchId) || branches[0];

  const list = useMemo(() => {
    if (open === 'branched') {
      return activeBranch.items.map(item => ({
        ...item,
        branchId: activeBranch.id,
      }));
    }
    if (open === 'at') {
      const allItems: any[] = [];
      branches.forEach(b => {
        b.items.forEach(it => {
          if (it.name.toLowerCase().includes(query) || it.description.toLowerCase().includes(query)) {
            allItems.push({ ...it, branchName: b.name });
          }
        });
      });
      return allItems;
    }
    if (open === 'slash') {
      return commands.filter(c => c.name.replace(/^\//, '').toLowerCase().startsWith(query));
    }
    if (open === 'model') return models;
    return [];
  }, [open, query, branches, activeBranch, commands, models]);

  const cursor = Math.min(active, Math.max(0, list.length - 1));
  const canSend = draft.trim().length > 0 || attachments.length > 0;
  const armed = busy || canSend;
  const level = efforts[effortIndex] ?? '';
  const maxed = efforts.length > 1 && effortIndex === efforts.length - 1;

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });
  const closeMenus = useCallback(() => {
    setPlusOpen(false);
    setModelOpen(false);
    setEffortOpen(false);
  }, []);

  useLayoutEffect(() => {
    const glow = glowRef.current;
    if (!glow || !open || open === 'effort') return;
    const row = rowRefs.current[cursor];
    if (!row) {
      glow.style.opacity = '0';
      return;
    }
    const fresh = lastOpen.current !== open;
    lastOpen.current = open;
    if (fresh) glow.style.transition = 'none';
    glow.style.top = `${row.offsetTop}px`;
    glow.style.height = `${row.offsetHeight}px`;
    glow.style.opacity = '1';
    if (fresh) {
      void glow.offsetHeight;
      glow.style.transition = '';
    }
  }, [open, cursor, list, activeBranchId]);

  useEffect(() => {
    if (!open) lastOpen.current = null;
  }, [open]);

  useEffect(() => {
    if (!plusOpen && !modelOpen && !effortOpen) return undefined;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeMenus();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [plusOpen, modelOpen, effortOpen, closeMenus]);

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = '0px';
    const max = LINE * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }, [draft, maxRows]);

  // Spark canvas animation for maximum effort
  useEffect(() => {
    const canvas = sparkRef.current;
    if (!maxed || reduce || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    typing.current.strokes = 0;
    let raf = 0;
    let last = performance.now();
    let w = 0;
    let h = 0;
    let due = 0;
    let speed = 1;
    let pulse = 0;
    const parts: any[] = [];
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (burst: boolean) => {
      parts.push({
        x: Math.random() * w,
        y: burst ? h * (0.2 + Math.random() * 0.8) : h + 3,
        r: 0.9 + Math.random() * 1.1,
        vy: -(7 + Math.random() * 9),
        sway: (Math.random() - 0.5) * 10,
        phase: Math.random() * Math.PI * 2,
        life: burst ? Math.random() * 1.2 : 0,
        span: 2.4 + Math.random() * 2.4
      });
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const typed = typing.current;
      const gain = boost.current;
      typed.energy *= Math.exp(-dt / 0.8);
      pulse *= Math.exp(-dt / 0.16);
      if (typed.strokes > 0) {
        typed.strokes = 0;
        if (gain > 0) pulse = 1;
      }
      const energy = typed.energy * gain;
      speed += (1 + energy * 6 - speed) * (1 - Math.exp(-dt / 0.15));
      due += dt;
      while (due > 0.14) {
        due -= 0.14;
        if (parts.length < 30) spawn(false);
      }
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = sparkColor;
      ctx.shadowColor = sparkColor;
      ctx.shadowBlur = 6 + energy * 10 + pulse * 6;
      for (let i = parts.length - 1; i >= 0; i -= 1) {
        const p = parts[i];
        p.life += dt;
        if (p.life > p.span) {
          parts.splice(i, 1);
          continue;
        }
        const k = p.life / p.span;
        const twinkle = 0.7 + 0.3 * Math.sin((now / 160) * (1 + energy) + p.phase);
        p.y += p.vy * dt * speed;
        if (p.y < -4) {
          p.y = h + 3;
          p.x = Math.random() * w;
        }
        const edge = Math.min(1, Math.max(0, p.y / 14), Math.max(0, (h - p.y) / 14));
        ctx.globalAlpha = Math.min(1, Math.sin(k * Math.PI) * (0.9 + energy * 0.25) * twinkle) * edge;
        ctx.beginPath();
        ctx.arc(
          p.x + Math.sin((now / 900) * (1 + energy * 0.8) + p.phase) * p.sway,
          p.y,
          p.r * twinkle * (1 + energy * 0.35),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    resize();
    for (let i = 0; i < 26; i += 1) spawn(true);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      ctx.clearRect(0, 0, w, h);
    };
  }, [maxed, reduce, sparkColor]);

  const setEffort = (i: number) => {
    const next = Math.max(0, Math.min(efforts.length - 1, i));
    if (next === effortIndex) return;
    setEffortIndex(next);
    latest.current.onEffortChange?.(efforts[next]);
  };

  const effortFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const k = (e.clientX - rect.left - EDGE) / Math.max(1, rect.width - 2 * EDGE);
    setEffort(Math.round(k * (efforts.length - 1)));
  };

  const onEffortKey = (e: React.KeyboardEvent) => {
    const step =
      e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
    if (step) {
      e.preventDefault();
      setEffort(effortIndex + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setEffort(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setEffort(efforts.length - 1);
    } else if (e.key === 'Escape') {
      setEffortOpen(false);
      focusInput();
    }
  };

  const stepAt = (i: number) => `calc(${EDGE}px + (100% - ${EDGE * 2}px) * ${i / Math.max(1, efforts.length - 1)})`;
  const fillAt = (i: number) => (i === efforts.length - 1 ? '100%' : `calc(${stepAt(i)} + 7px)`);

  const pick = (row: any) => {
    if (open === 'model') {
      setModelKey(row.key);
      setModelOpen(false);
      latest.current.onModelChange?.(row.key);
      focusInput();
      return;
    }

    if (row.action) {
      latest.current.onSelectAction?.(row.action, row);
    }

    const head = token ? draft.slice(0, token.start) : draft;
    if (row.promptTemplate) {
      setDraft(`${head}${row.promptTemplate}`);
    } else if (open === 'slash') {
      setDraft(`${head}${row.name} `);
    } else if (open === 'at' || open === 'branched') {
      setDraft(`${head}@${row.name} `);
    }

    setPlusOpen(false);
    setDismissed(false);
    focusInput();
  };

  const send = () => {
    if (!canSend || busy) return;
    latest.current.onSend?.(draft.trim(), { attachments, model, effort: level });
    setDraft('');
    setAttachments([]);
    setDismissed(false);
    closeMenus();
    focusInput();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (open && list.length) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((cursor + (e.key === 'ArrowDown' ? 1 : list.length - 1)) % list.length);
        return;
      }
      if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'Tab') {
        e.preventDefault();
        pick(list[cursor]);
        return;
      }
    }
    if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        setDismissed(true);
        closeMenus();
      }
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey && !(e.nativeEvent as any).isComposing) {
      e.preventDefault();
      send();
    }
  };

  const down = (e: React.PointerEvent) => {
    if (e.button !== 0 || !armed) return;
    setPressed(true);
  };
  const up = () => setPressed(false);

  return (
    <div
      ref={rootRef}
      className={`prompt-bar${className ? ` ${className}` : ''}`}
      data-busy={busy ? '' : undefined}
      data-max={maxed ? '' : undefined}
      style={{
        ['--pb-bg' as any]: background,
        ['--pb-ink' as any]: color,
        ['--pb-menu' as any]: menuBackground,
        ['--pb-w' as any]: `${width}px`,
        ['--pb-radius' as any]: `${radius}px`,
        ['--pb-spark' as any]: sparkColor,
        ['--pb-press' as any]: pressScale
      }}
    >
      {/* Pop-up Menus (Branched Menu from image, Slash commands, Models, Effort) */}
      {open ? (
        <div
          className="prompt-bar__menu"
          role={open === 'effort' ? 'dialog' : 'listbox'}
          aria-label={
            open === 'branched' || open === 'at'
              ? 'UNEB Modules & Sources'
              : open === 'slash'
              ? 'Commands'
              : open === 'model'
              ? 'Models'
              : 'Effort'
          }
          data-kind={open}
        >
          {open === 'effort' ? (
            <>
              <div className="prompt-bar__effort-head">
                <span className="prompt-bar__effort-title">UNEB Analytical Effort</span>
                <span className="prompt-bar__effort-level">{level}</span>
                <span className="prompt-bar__effort-help" title="Higher effort activates deep reasoning and multi-step derivations">
                  <HugeiconsIcon icon={HelpCircleIcon} size={14} strokeWidth={1.8} />
                </span>
              </div>
              <div className="prompt-bar__effort-ends">
                <span>Fast Recall</span>
                <span>Deep Proof &amp; Rubric</span>
              </div>
              <div
                className="prompt-bar__effort-track"
                role="slider"
                tabIndex={0}
                aria-label="Effort"
                aria-valuemin={0}
                aria-valuemax={efforts.length - 1}
                aria-valuenow={effortIndex}
                aria-valuetext={level}
                style={{
                  ['--pb-effort-x' as any]: stepAt(effortIndex),
                  ['--pb-effort-fill' as any]: fillAt(effortIndex)
                }}
                onPointerDown={e => {
                  if (e.button !== 0) return;
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {}
                  e.currentTarget.focus({ preventScroll: true });
                  effortFromPointer(e);
                }}
                onPointerMove={e => {
                  if (e.buttons & 1) effortFromPointer(e);
                }}
                onKeyDown={onEffortKey}
              >
                <span className="prompt-bar__effort-fill" />
                {efforts.map((label, i) => (
                  <i key={label} className="prompt-bar__effort-dot" style={{ left: stepAt(i) }} />
                ))}
                <span className="prompt-bar__effort-thumb" />
              </div>
            </>
          ) : open === 'branched' ? (
            <div className="prompt-bar__branched-wrap p-1.5">
              <div className="flex items-center justify-between px-2.5 py-1.5 mb-2 border-b border-slate-800 bg-slate-900/90 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <HugeiconsIcon icon={BookOpen01Icon} size={15} strokeWidth={2} className="text-red-500" />
                    {activeNavTab === 'syllabi'
                      ? 'UNEB Syllabi & Labs (Lower & Upper School)'
                      : activeNavTab === 'chat'
                      ? 'NEXUS Examiner Chat Personas'
                      : activeNavTab === 'diagrams'
                      ? '1K/2K/4K Textbook Blueprints'
                      : activeNavTab === 'pulse'
                      ? 'UNEB News, Timetables & Centers'
                      : activeNavTab === 'workspace'
                      ? 'Google Workspace Hub'
                      : activeNavTab === 'leaderboard'
                      ? 'Candidate Goals Leaderboard'
                      : 'UNEB Examination Syllabus Tree'}
                  </span>
                  <span className="text-[10px] bg-red-950 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-mono font-semibold">
                    {activeNavTab === 'syllabi' ? 'PLE & UCE/UACE' : activeNavTab.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Click branch to expand &amp; select</span>
              </div>

              <div className="max-h-[380px] overflow-y-auto pr-1">
                <BranchedMenu
                  items={filteredBranchedMenuItems}
                  defaultOpen={[0, 1]}
                  defaultActive={list[0]?.key || ''}
                  onSelect={(val, item) => {
                    pick(item);
                  }}
                  accentColor="#ef4444"
                  lineColor="#334155"
                  rowHeight={34}
                  indent={36}
                  fontSize={12}
                />
              </div>
            </div>
          ) : (
            <>
              <span ref={glowRef} className="prompt-bar__glow" aria-hidden="true" />
              <div className="space-y-0.5">
                {list.map((row, i) => (
                  <button
                    key={row.key}
                    ref={el => {
                      rowRefs.current[i] = el;
                    }}
                    type="button"
                    role="option"
                    aria-selected={i === cursor}
                    className="prompt-bar__row"
                    onMouseDown={e => e.preventDefault()}
                    onPointerEnter={() => setActive(i)}
                    onClick={() => pick(row)}
                  >
                    <span className="prompt-bar__row-name">{row.name}</span>
                    {row.description ? <span className="prompt-bar__row-desc">{row.description}</span> : null}
                    {open === 'model' ? (
                      <>
                        <span className="prompt-bar__row-tag">{row.tag}</span>
                        <span className="prompt-bar__row-check" data-on={row.key === model?.key ? '' : undefined}>
                          <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2.5} />
                        </span>
                      </>
                    ) : null}
                  </button>
                ))}
              </div>
              {list.length === 0 ? <div className="prompt-bar__empty">No matches for “{query}”</div> : null}
            </>
          )}
        </div>
      ) : null}

      {/* Top Options Bar directly corresponding to user images (image_e21259e7.png & image_9ef17bd7.png) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-1.5 scrollbar-none px-0.5">
        {IMAGE_NAV_TABS.map(tab => {
          const isSelected = activeNavTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (activeNavTab === tab.id && plusOpen) {
                  setPlusOpen(false);
                  return;
                }
                setActiveNavTab(tab.id);
                if (tab.id === 'syllabi') setActiveBranchId('lower-school');
                else if (tab.id === 'chat') setActiveBranchId('chat');
                else if (tab.id === 'diagrams') setActiveBranchId('diagrams');
                else if (tab.id === 'pulse') setActiveBranchId('pulse');
                else if (tab.id === 'workspace') {
                  setActiveBranchId('workspace');
                  if (latest.current.onSelectAction) latest.current.onSelectAction('nav_workspace');
                }
                setModelOpen(false);
                setEffortOpen(false);
                setPlusOpen(true);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-red-600 hover:bg-red-500 text-white font-bold shadow-[0_2px_12px_rgba(239,68,68,0.4)] border-red-500/60'
                  : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 border-transparent'
              }`}
              title={tab.label}
            >
              {renderIcon(tab.icon, 14)}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main input container */}
      <div
        className="prompt-bar__field"
        role="presentation"
        data-max={maxed ? '' : undefined}
      >
        <canvas ref={sparkRef} className="prompt-bar__sparks" aria-hidden="true" />

        {/* Attachment chips */}
        {attachments.length > 0 ? (
          <div className="prompt-bar__chips">
            {attachments.map((file, i) => (
              <span key={`${file}-${i}`} className="prompt-bar__chip">
                <HugeiconsIcon icon={File02Icon} size={12} strokeWidth={2} />
                <span className="prompt-bar__chip-name">{file}</span>
                <button
                  type="button"
                  className="prompt-bar__chip-x"
                  aria-label={`Remove ${file}`}
                  onClick={() => setAttachments(a => a.filter((_, j) => j !== i))}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={10} strokeWidth={2.5} />
                </button>
              </span>
            ))}
          </div>
        ) : null}

        {/* Text Area */}
        <textarea
          ref={inputRef}
          className="prompt-bar__input"
          rows={1}
          value={draft}
          placeholder={placeholder}
          aria-label="Prompt"
          onChange={e => {
            setDraft(e.target.value);
            typing.current.energy = Math.min(1.6, typing.current.energy + 0.22);
            typing.current.strokes = Math.min(4, typing.current.strokes + 1);
            setDismissed(false);
            closeMenus();
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />

        {/* Bottom tool bar */}
        <div className="prompt-bar__bar">
          {/* Branched Menu Trigger (+) */}
          <button
            type="button"
            className="prompt-bar__tool"
            aria-label="UNEB Branched Menu"
            aria-expanded={plusOpen}
            data-on={plusOpen ? '' : undefined}
            onMouseDown={e => e.preventDefault()}
            onClick={() => {
              setModelOpen(false);
              setEffortOpen(false);
              setActive(0);
              setPlusOpen(v => !v);
            }}
            title="Browse UNEB Examination Branches (Syllabi, Diagrams, Roles, News)"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} />
          </button>

          {/* Model Switcher */}
          {models.length > 0 ? (
            <button
              type="button"
              className="prompt-bar__pick"
              aria-label="Choose model"
              aria-expanded={modelOpen}
              data-on={modelOpen ? '' : undefined}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                setPlusOpen(false);
                setEffortOpen(false);
                setActive(Math.max(0, models.indexOf(model)));
                setModelOpen(v => !v);
                focusInput();
              }}
            >
              <span>{model.name}</span>
              <HugeiconsIcon icon={ArrowDown01Icon} size={12} strokeWidth={2.4} />
            </button>
          ) : null}

          {/* Effort Slider Button */}
          {efforts.length > 0 ? (
            <button
              type="button"
              className="prompt-bar__pick"
              aria-label="Choose effort"
              aria-expanded={effortOpen}
              data-on={effortOpen ? '' : undefined}
              data-max={maxed ? '' : undefined}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                setPlusOpen(false);
                setModelOpen(false);
                setEffortOpen(v => !v);
                focusInput();
              }}
              title="Adjust reasoning effort"
            >
              <HugeiconsIcon icon={SparklesIcon} size={13} strokeWidth={2} />
              <span>{level}</span>
            </button>
          ) : null}

          <span className="prompt-bar__spacer" />

          {/* Voice Pill dictation integration */}
          <div className="flex items-center">
            <VoicePill
              size={28}
              accentColor="#ef4444"
              background="rgba(255,255,255,0.06)"
              iconColor="#f87171"
              onStop={({ reason, duration }) => {
                if (reason !== 'cancel') {
                  // Simulate speech transcription or invoke voice recording
                  latest.current.onVoiceTranscribe?.('Explain how blood circulation in the human heart works for PLE science');
                }
              }}
            />
          </div>

          {/* Morphing Send Button */}
          <button
            type="button"
            className="prompt-bar__send"
            disabled={!armed}
            aria-label={busy ? 'Stop' : 'Send'}
            data-armed={armed ? '' : undefined}
            data-pressed={pressed ? '' : undefined}
            onMouseDown={e => e.preventDefault()}
            onPointerDown={down}
            onPointerUp={up}
            onPointerCancel={up}
            onPointerLeave={up}
            onClick={() => {
              if (busy) latest.current.onStop?.();
              else send();
            }}
          >
            <SendGlyph busy={busy} morphDuration={morphDuration} squash={squash} tilt={tilt} />
          </button>
        </div>
      </div>
    </div>
  );
}
