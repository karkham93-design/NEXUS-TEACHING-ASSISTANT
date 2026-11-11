import React, { isValidElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  Globe,
  Briefcase,
  Trophy,
  GraduationCap,
  FlaskConical,
  Award,
  ShieldCheck,
  Lock,
  Sparkles,
  Compass,
  Layers,
  ExternalLink,
  Calendar,
  Mail,
  Flame,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import './BranchedMenu.css';

export interface BranchedMenuItem {
  value: string;
  label: string;
  icon?: any;
  description?: string;
  action?: string;
  promptTemplate?: string;
}

export interface BranchedMenuSection {
  label: string;
  value?: string;
  icon?: any;
  children?: BranchedMenuItem[];
}

export const UNEB_BRANCHED_NAV_ITEMS: BranchedMenuSection[] = [
  {
    label: 'UNEB Syllabi & Labs',
    value: 'lessons',
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      {
        value: 'syllabi_all',
        label: 'All Examination Modules',
        icon: <BookOpen className="w-3.5 h-3.5" />,
        description: 'Complete PLE & UCE Syllabi'
      },
      {
        value: 'syllabi_ple',
        label: 'Primary Level (PLE P.1 - P.7)',
        icon: <GraduationCap className="w-3.5 h-3.5" />,
        description: 'Integrated Science & Math'
      },
      {
        value: 'syllabi_uce',
        label: 'Secondary Level (UCE S.1 - S.4)',
        icon: <FileText className="w-3.5 h-3.5" />,
        description: 'New Curriculum (NLSC) Standards'
      },
      {
        value: 'syllabi_labs',
        label: 'Science Practicals & Labs',
        icon: <FlaskConical className="w-3.5 h-3.5" />,
        description: 'Interactive Physics & Chemistry'
      }
    ]
  },
  {
    label: 'NEXUS Examiner Chat',
    value: 'chat',
    icon: <MessageSquare className="w-4 h-4" />,
    children: [
      {
        value: 'chat_senior',
        label: 'Senior Chief Examiner',
        icon: <Award className="w-3.5 h-3.5" />,
        description: 'Marking Guides & Scoring Logic'
      },
      {
        value: 'chat_ple',
        label: 'PLE P.7 Chief Marker',
        icon: <GraduationCap className="w-3.5 h-3.5" />,
        description: 'Primary Leaving Exam Strategies'
      },
      {
        value: 'chat_uce',
        label: 'UCE S.4 Senior Marker',
        icon: <ShieldCheck className="w-3.5 h-3.5" />,
        description: 'New Competency-Based Scoring'
      },
      {
        value: 'chat_reg',
        label: 'UNEB Act 2021 Officer',
        icon: <Lock className="w-3.5 h-3.5" />,
        description: 'Regulations & Examination Law'
      }
    ]
  },
  {
    label: '1K/2K/4K Textbook Diagrams',
    value: 'diagrams',
    icon: <ImageIcon className="w-4 h-4" />,
    children: [
      {
        value: 'diag_studio',
        label: 'Visual Blueprint Studio',
        icon: <ImageIcon className="w-3.5 h-3.5" />,
        description: 'Instant Vector & Neural Engine'
      },
      {
        value: 'diag_bio',
        label: 'Mammalian Circulatory System',
        icon: <Sparkles className="w-3.5 h-3.5" />,
        description: 'Heart Chambers & Blood Flow'
      },
      {
        value: 'diag_phys',
        label: 'Light Refraction & Snell\'s Law',
        icon: <Compass className="w-3.5 h-3.5" />,
        description: 'Prism Optics & Ray Tracing'
      },
      {
        value: 'diag_math',
        label: 'Quadratic Parabola Curves',
        icon: <Layers className="w-3.5 h-3.5" />,
        description: 'Cartesian Graphs & Vertex Roots'
      }
    ]
  },
  {
    label: 'UNEB News & Exam Centers',
    value: 'pulse',
    icon: <Globe className="w-4 h-4" />,
    children: [
      {
        value: 'pulse_timetables',
        label: 'Official Exam Timetables',
        icon: <Calendar className="w-3.5 h-3.5" />,
        description: 'National PLE, UCE & UACE Dates'
      },
      {
        value: 'pulse_registration',
        label: 'e-Registration Portal',
        icon: <ExternalLink className="w-3.5 h-3.5" />,
        description: 'Candidate Bio-Data Verification'
      },
      {
        value: 'pulse_centers',
        label: 'Approved Exam Centers',
        icon: <ShieldCheck className="w-3.5 h-3.5" />,
        description: 'National Exam Center Directory'
      }
    ]
  },
  {
    label: 'Google Workspace Hub',
    value: 'workspace',
    icon: <Briefcase className="w-4 h-4" />,
    children: [
      {
        value: 'ws_drive',
        label: 'Google Drive Study Notes',
        icon: <Briefcase className="w-3.5 h-3.5" />,
        description: 'Auto-Sync Revision Blueprints'
      },
      {
        value: 'ws_gmail',
        label: 'Gmail Revision Recaps',
        icon: <Mail className="w-3.5 h-3.5" />,
        description: 'Weekly Subject Knowledge Digest'
      },
      {
        value: 'ws_calendar',
        label: 'Calendar Study Drills',
        icon: <Calendar className="w-3.5 h-3.5" />,
        description: 'Examination Revision Timetable'
      },
      {
        value: 'ws_tasks',
        label: 'Google Tasks Revision List',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        description: 'Syllabus Chapter Milestones'
      }
    ]
  },
  {
    label: 'Candidate Leaderboard',
    value: 'leaderboard',
    icon: <Trophy className="w-4 h-4" />,
    children: [
      {
        value: 'lb_rankings',
        label: 'National Candidate Rankings',
        icon: <Trophy className="w-3.5 h-3.5" />,
        description: 'Live Points, Scores & Standings'
      },
      {
        value: 'lb_goals',
        label: 'Revision Goals & Streaks',
        icon: <Flame className="w-3.5 h-3.5" />,
        description: 'Daily Revision Milestones'
      },
      {
        value: 'lb_badges',
        label: 'Certified Syllabus Badges',
        icon: <Award className="w-3.5 h-3.5" />,
        description: 'National Curriculum Honors'
      }
    ]
  }
];

const PAD = 6;
const MARK = 16;

const renderIcon = (icon: any) =>
  isValidElement(icon) ? icon : <HugeiconsIcon icon={icon} size={15} strokeWidth={1.8} />;

const toSet = (open: any): Set<number> =>
  new Set(Array.isArray(open) ? open : typeof open === 'number' && open >= 0 ? [open] : []);

export interface BranchedMenuProps {
  items?: BranchedMenuSection[];
  defaultOpen?: number | number[];
  defaultActive?: string;
  onSelect?: (value: string, item: any) => void;
  onToggle?: (index: number, isOpen: boolean) => void;
  color?: string;
  accentColor?: string;
  lineColor?: string;
  width?: number | string;
  rowHeight?: number;
  indent?: number;
  trunk?: number;
  radius?: number;
  lineWidth?: number;
  fontSize?: number;
  drawDuration?: number;
  foldDuration?: number;
  className?: string;
}

export default function BranchedMenu({
  items = UNEB_BRANCHED_NAV_ITEMS,
  defaultOpen = 0,
  defaultActive = '',
  onSelect,
  onToggle,
  color = '#f5f5f5',
  accentColor = '#ef4444',
  lineColor = '#3f3f46',
  width = '100%',
  rowHeight = 36,
  indent = 38,
  trunk = 14,
  radius = 10,
  lineWidth = 1.5,
  fontSize = 13,
  drawDuration = 380,
  foldDuration = 260,
  className = ''
}: BranchedMenuProps) {
  const [open, setOpen] = useState<Set<number>>(() => toSet(defaultOpen));
  const [active, setActive] = useState<string>(() => {
    if (defaultActive) return defaultActive;
    const first = items.find((it, i) => it.children && toSet(defaultOpen).has(i));
    return first?.value ?? first?.children?.[0]?.value ?? '';
  });

  // Keep active and open section in sync when defaultActive changes externally
  useEffect(() => {
    if (defaultActive) {
      setActive(defaultActive);
      const secIdx = items.findIndex(
        (it) => it.value === defaultActive || it.children?.some((kid) => kid.value === defaultActive)
      );
      if (secIdx >= 0) {
        setOpen((prev) => new Set([...prev, secIdx]));
      }
    }
  }, [defaultActive, items]);

  const navRef = useRef<HTMLElement | null>(null);
  const heads = useRef<Array<HTMLButtonElement | null>>([]);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const latest = useRef<{ onSelect?: (value: string, item: any) => void; onToggle?: (i: number, open: boolean) => void }>({});
  latest.current = { onSelect, onToggle };

  const activeSection = items.findIndex(
    (it) => it.value === active || it.children?.some((kid) => kid.value === active)
  );
  const markerShown = activeSection >= 0;

  useLayoutEffect(() => {
    const place = (glide: boolean) => {
      const m = markerRef.current;
      const el = heads.current[activeSection];
      if (!m) return;
      const on = markerShown && el;
      if (!glide) m.style.transition = 'none';
      if (on && el) {
        m.style.top = `${el.offsetTop + (el.offsetHeight - MARK) / 2}px`;
      }
      m.toggleAttribute('data-on', Boolean(on));
      if (!glide) {
        void m.offsetHeight;
        m.style.transition = '';
      }
    };

    place(true);
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      place(false);
    });
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [activeSection, markerShown, items, fontSize, rowHeight]);

  const select = (value: string, item: any) => {
    setActive(value);
    latest.current.onSelect?.(value, item);
  };

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      const isOpen = !next.has(i);
      if (isOpen) next.add(i);
      else next.delete(i);
      latest.current.onToggle?.(i, isOpen);
      return next;
    });
  };

  const r = Math.min(radius, rowHeight / 2 - 2);
  const endX = indent - 8;
  const rowY = (k: number) => PAD + k * rowHeight + rowHeight / 2;
  const branch = (k: number) => `M ${trunk} ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const reach = (k: number) => `M ${trunk} 0 V ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const length = (k: number) => rowY(k) - r + (Math.PI * r) / 2 + (endX - trunk - r);

  return (
    <nav
      ref={navRef}
      className={`branched-menu${className ? ` ${className}` : ''}`}
      style={{
        ['--bm-w' as any]: typeof width === 'number' ? `${width}px` : width,
        ['--bm-ink' as any]: color,
        ['--bm-accent' as any]: accentColor,
        ['--bm-line' as any]: lineColor,
        ['--bm-font' as any]: `${fontSize}px`,
        ['--bm-row' as any]: `${rowHeight}px`,
        ['--bm-indent' as any]: `${indent}px`,
        ['--bm-line-w' as any]: lineWidth,
        ['--bm-draw' as any]: `${drawDuration}ms`,
        ['--bm-fold' as any]: `${foldDuration}ms`
      }}
    >
      <span ref={markerRef} className="branched-menu__marker" aria-hidden="true" />
      {items.map((item, i) => {
        const kids = item.children;
        const isOpen = kids ? open.has(i) : false;
        const itemVal = item.value ?? item.label;
        const isHeadActive = itemVal === active || kids?.some((k) => k.value === active);
        const bodyH = kids ? PAD * 2 + kids.length * rowHeight : 0;

        return (
          <div key={itemVal} className="branched-menu__section" data-open={isOpen ? '' : undefined}>
            <button
              ref={(el) => {
                heads.current[i] = el;
              }}
              type="button"
              className="branched-menu__head"
              aria-expanded={kids ? isOpen : undefined}
              aria-current={isHeadActive ? 'true' : undefined}
              data-active={isHeadActive ? '' : undefined}
              onClick={() => {
                select(itemVal, item);
                if (kids) toggle(i);
              }}
            >
              <span className="flex items-center gap-2.5 truncate">
                {item.icon ? (
                  <span className={`transition-colors shrink-0 ${isHeadActive ? 'text-red-500' : 'text-slate-400'}`}>
                    {renderIcon(item.icon)}
                  </span>
                ) : null}
                <span className="truncate">{item.label}</span>
              </span>
              {kids ? (
                <span
                  className={`text-[10px] text-slate-400 font-mono transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-90 text-red-500 font-bold' : ''
                  }`}
                >
                  ▶
                </span>
              ) : null}
            </button>
            {kids ? (
              <div className="branched-menu__body">
                <div className="branched-menu__fold">
                  <div className="branched-menu__tree" style={{ height: bodyH }}>
                    <svg className="branched-menu__lines" width={indent} height={bodyH} aria-hidden="true">
                      <path className="branched-menu__base" d={`M ${trunk} 0 V ${rowY(kids.length - 1) - r}`} />
                      {kids.map((kid, k) => (
                        <path key={kid.value} className="branched-menu__base" d={branch(k)} />
                      ))}
                      {kids.map((kid, k) => (
                        <path
                          key={kid.value}
                          className="branched-menu__reach"
                          d={reach(k)}
                          style={{
                            strokeDasharray: length(k),
                            strokeDashoffset: kid.value === active ? 0 : length(k)
                          }}
                        />
                      ))}
                    </svg>
                    {kids.map((kid) => {
                      const isKidActive = kid.value === active;
                      return (
                        <button
                          key={kid.value}
                          type="button"
                          className="branched-menu__item"
                          aria-current={isKidActive ? 'true' : undefined}
                          data-active={isKidActive ? '' : undefined}
                          tabIndex={isOpen ? 0 : -1}
                          onClick={() => select(kid.value, kid)}
                          title={kid.description || kid.label}
                        >
                          {kid.icon ? (
                            <span className="branched-menu__icon" aria-hidden="true">
                              {renderIcon(kid.icon)}
                            </span>
                          ) : null}
                          <span className="branched-menu__label">{kid.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
