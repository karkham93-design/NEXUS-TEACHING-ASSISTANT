const memoryLocalStore = new Map<string, string>();
const memorySessionStore = new Map<string, string>();

export type StorageKind = 'local' | 'session';

function getBackingStorage(kind: StorageKind, customStorage?: Storage | null): Storage | null {
  if (customStorage !== undefined) return customStorage;
  if (typeof window === 'undefined') return null;
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function safeStorageGet(
  key: string,
  kind: StorageKind = 'local',
  customStorage?: Storage | null
): string | null {
  const mem = kind === 'session' ? memorySessionStore : memoryLocalStore;
  const store = getBackingStorage(kind, customStorage);
  if (store) {
    try {
      const value = store.getItem(key);
      if (value !== null) return value;
    } catch {
      // Blocked storage (e.g., Safari Private Mode or strict iframe sandbox)
    }
  }
  return mem.has(key) ? mem.get(key)! : null;
}

export function safeStorageSet(
  key: string,
  value: string,
  kind: StorageKind = 'local',
  customStorage?: Storage | null
): boolean {
  const mem = kind === 'session' ? memorySessionStore : memoryLocalStore;
  mem.set(key, value);
  const store = getBackingStorage(kind, customStorage);
  if (!store) return false;
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeStorageRemove(
  key: string,
  kind: StorageKind = 'local',
  customStorage?: Storage | null
): boolean {
  const mem = kind === 'session' ? memorySessionStore : memoryLocalStore;
  mem.delete(key);
  const store = getBackingStorage(kind, customStorage);
  if (!store) return false;
  try {
    store.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function clearMemoryStorageFallbacks(): void {
  memoryLocalStore.clear();
  memorySessionStore.clear();
}

export function prefersReducedMotionSafe(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    return Boolean(window.matchMedia('(prefers-reduced-motion: reduce)')?.matches);
  } catch {
    return false;
  }
}

export function parseCssColorToRgb(
  value: string | undefined,
  fallback: [number, number, number] = [1, 1, 1]
): [number, number, number] {
  if (!value) return fallback;
  const raw = value.trim();

  // Fast hex parser (#rgb or #rrggbb)
  const hexMatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(raw);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16) / 255,
        parseInt(hex[1] + hex[1], 16) / 255,
        parseInt(hex[2] + hex[2], 16) / 255,
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }

  // rgb(...) / rgba(...)
  const rgbMatch = /^rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)/i.exec(raw);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, Number(rgbMatch[1]))) / 255;
    const g = Math.min(255, Math.max(0, Number(rgbMatch[2]))) / 255;
    const b = Math.min(255, Math.max(0, Number(rgbMatch[3]))) / 255;
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return [r, g, b];
    }
  }

  return fallback;
}

export function observeElementResize(element: Element, onResize: () => void): () => void {
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => onResize());
    observer.observe(element);
    return () => observer.disconnect();
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }
  return () => {};
}

export function observeElementVisibility(
  element: Element,
  onVisibilityChange: (visible: boolean) => void
): () => void {
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      onVisibilityChange(entries.some((entry) => entry.isIntersecting));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }
  onVisibilityChange(true);
  return () => {};
}
