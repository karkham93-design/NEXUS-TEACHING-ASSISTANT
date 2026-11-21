export type LoginTrackId = 'all' | 'ple' | 'uce' | 'visuals' | 'leaderboard';

export interface LoginTrackPreset {
  id: LoginTrackId;
  name: string;
  subtitle: string;
  levelFilter: string;
  initialTab: 'lessons' | 'diagrams' | 'leaderboard' | 'chat';
  colors: string[];
  dots: [string, string, string];
}

export const LOGIN_TRACK_PRESETS: LoginTrackPreset[] = [
  {
    id: 'all',
    name: 'Full Curriculum',
    subtitle: 'All PLE & UCE/UACE Modules',
    levelFilter: 'All',
    initialTab: 'lessons',
    colors: ['#a855f7', '#6366f1', '#38bdf8', '#c084fc'],
    dots: ['#6366f1', '#a855f7', '#38bdf8'],
  },
  {
    id: 'ple',
    name: 'Primary (PLE)',
    subtitle: 'P.1 – P.7 Integrated Prep',
    levelFilter: 'Primary (PLE)',
    initialTab: 'lessons',
    colors: ['#0ea5e9', '#38bdf8', '#818cf8'],
    dots: ['#0284c7', '#38bdf8', '#818cf8'],
  },
  {
    id: 'uce',
    name: 'Secondary (UCE)',
    subtitle: 'S.1 – S.4 Sciences & Math',
    levelFilter: 'Secondary (UCE)',
    initialTab: 'lessons',
    colors: ['#7c3aed', '#c084fc', '#f472b6'],
    dots: ['#6d28d9', '#c084fc', '#f472b6'],
  },
  {
    id: 'visuals',
    name: '1K/2K/4K Studio',
    subtitle: 'Internet Photos & Diagrams',
    levelFilter: 'All',
    initialTab: 'diagrams',
    colors: ['#10b981', '#06b6d4', '#6366f1'],
    dots: ['#059669', '#06b6d4', '#6366f1'],
  },
  {
    id: 'leaderboard',
    name: 'Rankings',
    subtitle: 'National Candidate Board',
    levelFilter: 'All',
    initialTab: 'leaderboard',
    colors: ['#f59e0b', '#ec4899', '#8b5cf6'],
    dots: ['#d97706', '#ec4899', '#8b5cf6'],
  },
];

export const MAX_GUEST_NAME_LENGTH = 60;

export function normalizeGuestCandidateName(rawName: string): string {
  const collapsed = String(rawName || '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!collapsed) return 'Guest Candidate';
  return collapsed.slice(0, MAX_GUEST_NAME_LENGTH);
}

export function classifyGoogleAuthError(err: unknown): {
  kind: 'popup-blocked' | 'popup-closed' | 'network' | 'other';
  message: string;
} {
  const code = typeof err === 'object' && err !== null && 'code' in err ? String((err as any).code) : '';
  const msg =
    typeof err === 'object' && err !== null && 'message' in err
      ? String((err as any).message)
      : String(err || '');

  if (code === 'auth/popup-blocked' || msg.includes('popup-blocked')) {
    return {
      kind: 'popup-blocked',
      message: 'Your browser blocked the Google sign-in popup window. Allow popups, try redirect sign-in, or continue as a Guest Candidate below.',
    };
  }
  if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
    return {
      kind: 'other',
      message: 'Google Sign-In is restricted on this preview hostname (localhost/unlisted origin). Use the hosted preview URL or continue immediately as a Guest Candidate below.',
    };
  }
  if (code === 'auth/popup-closed-by-user' || msg.includes('popup-closed-by-user')) {
    return {
      kind: 'popup-closed',
      message: 'Google sign-in window was closed before completing authentication.',
    };
  }
  if (code === 'auth/network-request-failed' || msg.includes('network')) {
    return {
      kind: 'network',
      message: 'Network error while connecting to Google Sign-In. Check your connection or continue as a Guest Candidate.',
    };
  }
  return {
    kind: 'other',
    message: msg || 'Unable to complete Google sign-in. You can retry or continue as a Guest Candidate.',
  };
}

export function getTrackPresetById(id: string): LoginTrackPreset {
  return LOGIN_TRACK_PRESETS.find((t) => t.id === id) || LOGIN_TRACK_PRESETS[0];
}
