import { Entry, SurfacingMode, StoryShape, EchoCard, SurfacingLayout, StoryPos, StoryLinkData } from './types';
import { THEME_COLORS, LEX, SEED_ENTRIES } from './data';

export function hexA(hex: string, a: number): string {
  const h = (hex || '#c9a24b').replace('#', '');
  const f = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(f, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

export function themeColor(t: string, accent: string): string {
  const c = THEME_COLORS[t];
  return (!c || c === 'accent') ? accent : c;
}

export function tagThemes(text: string): string[] {
  const t = (text || '').toLowerCase();
  const out: string[] = [];
  for (const k in LEX) {
    if (LEX[k].some(w => t.includes(w))) out.push(k);
  }
  return out.length ? out.slice(0, 3) : ['reflection'];
}

export function shortDate(d: Date): string {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function timeStr(d: Date): string {
  let h = d.getHours();
  const ap = h < 12 ? 'am' : 'pm';
  h = h % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, '0')}${ap}`;
}

export function spark(months: number[]) {
  const W = 170, H = 34, n = months.length;
  const max = Math.max(...months, 1);
  const pts = months.map((m, i) => {
    const x = (i / (n - 1)) * W;
    const y = H - 3 - (m / max) * (H - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const area = `0,${H} ${pts.join(' ')} ${W},${H}`;
  return { sparkPoints: pts.join(' '), areaPoints: area };
}

export function relMeta(rel?: string) {
  if (rel === 'strong') return { op: 0.5, w: 1.7, label: 'a strong thread', color: '#c9a24b' };
  if (rel === 'medium') return { op: 0.32, w: 1.2, label: 'a clear thread', color: '#a89668' };
  return { op: 0.2, w: 0.9, label: 'a faint thread', color: '#7c7666' };
}

export function computeLayout(
  mode: SurfacingMode,
  W: number,
  entries: Entry[],
  accent: string,
  mirrorTone: 'gentle' | 'unflinching'
): SurfacingLayout {
  const r = (n: number) => Math.round(n);

  let cur: { left: number; top: number; width: number };
  let rawEchoes: Array<Entry & { i: number; pos: { left: number; top: number; width: number }; threadD: string; ax?: number }>;

  if (mode === 'margin') {
    const curW = r(W * 0.385), curRight = 40 + curW;
    cur = { left: 40, top: 40, width: curW };
    const ex = r(W * 0.585), ew = W - ex - 36, ch = 150, gap = 24;
    rawEchoes = entries.map((e, i) => {
      const top = 40 + i * (ch + gap), cy = top + ch / 2, aY = 128 + i * 120;
      return {
        ...e, i,
        pos: { left: ex, top, width: ew },
        threadD: `M ${curRight} ${aY} C ${curRight + 95} ${aY}, ${ex - 95} ${cy}, ${ex} ${cy}`,
      };
    });
  } else if (mode === 'constellation') {
    const curW = r(W * 0.31);
    cur = { left: 40, top: 212, width: curW };
    const ax = 40 + curW, ay = 362, px = r(W * 0.66);
    const rx = r(W * 0.225), ry = 238, ew = r(W * 0.235);
    const angs = [-48, -15, 20, 52];
    rawEchoes = entries.map((e, i) => {
      const a = angs[i] * Math.PI / 180;
      const cx = px + rx * Math.cos(a), cy = ay + ry * Math.sin(a);
      let left = r(cx - ew / 2);
      left = Math.min(left, W - ew - 20);
      return {
        ...e, i,
        pos: { left, top: r(cy - 66), width: ew },
        threadD: `M ${ax} ${ay} C ${ax + (cx - ax) * 0.42} ${ay}, ${cx - 110} ${cy}, ${cx} ${cy}`,
      };
    });
  } else {
    // timeline
    const curW = r(W * 0.385), curRight = 40 + curW;
    cur = { left: 40, top: 40, width: curW };
    const ax = r(W * 0.625), lx = ax + 42, ew = W - lx - 36, ch = 132, gap = 26;
    const order = ['e1', 'e2', 'e5', 'e6'];
    rawEchoes = order.map((id, i) => {
      const e = entries.find(x => x.id === id) || entries[i];
      const top = 58 + i * (ch + gap), cy = top + 30, aY = 120 + i * 128;
      return {
        ...e, i, ax,
        pos: { left: lx, top, width: ew },
        threadD: `M ${curRight} ${aY} C ${curRight + 90} ${aY}, ${ax - 60} ${cy}, ${lx} ${cy}`,
      };
    });
  }

  const echoes: EchoCard[] = rawEchoes.map(e => {
    const m = relMeta(e.rel);
    return {
      ...e,
      relLabel: m.label,
      relColor: e.rel === 'strong' ? accent : m.color,
      displayReason: mirrorTone === 'unflinching'
        ? (e.reasonSharp || e.reason || '')
        : (e.reason || ''),
    };
  });

  return { cur, echoes };
}

export function computeStoryLayout(
  entries: Entry[],
  W: number,
  shape: StoryShape
): { links: StoryLinkData[]; pos: StoryPos[]; H: number } {
  const N = entries.length;
  const H = 540, pad = 72, cx = W / 2, cy = H / 2 - 4;

  const links: StoryLinkData[] = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const shared = entries[i].themes.filter(t => entries[j].themes.includes(t));
      if (shared.length) links.push({ a: i, b: j, w: shared.length, theme: shared[0] });
    }
  }

  const degree = entries.map((_, i) =>
    links.filter(l => l.a === i || l.b === i).reduce((s, l) => s + l.w, 0)
  );
  const maxDeg = Math.max(1, ...degree);
  const clampX = (x: number) => Math.max(pad, Math.min(W - pad, x));
  const clampY = (y: number) => Math.max(pad, Math.min(H - pad, y));
  const sc = Math.min(W, 820) / 820;

  const themeList = ['restlessness','attention','stillness','rest','honesty','patience','mornings','reflection'];

  const pos: StoryPos[] = entries.map((e, i) => {
    let x: number, y: number;
    if (shape === 'spiral') {
      const ang = i * 2.39996, rr = (46 + 54 * Math.sqrt(i)) * sc;
      x = cx + rr * Math.cos(ang); y = cy + rr * Math.sin(ang) * 0.86;
    } else if (shape === 'timeline') {
      const x0 = pad + (N > 1 ? (N - 1 - i) / (N - 1) : 0.5) * (W - pad * 2);
      const band = themeList.indexOf(e.themes[0]);
      x = x0; y = cy + ((band % 5) - 2) * 52;
    } else {
      const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
      const rr = (0.62 - (degree[i] / maxDeg) * 0.24) * Math.min(W - pad * 2, H - pad * 2) * 0.62 + 46;
      x = cx + rr * Math.cos(ang); y = cy + rr * Math.sin(ang) * 0.92;
    }
    return {
      x: clampX(x!), y: clampY(y!),
      r: Math.max(9, Math.min(26, 9 + Math.sqrt(degree[i]) * 3.4)),
    };
  });

  return { links, pos, H };
}

const JOURNAL_KEY = 'still.journal.v1';

export function loadJournal(): Entry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]');
  } catch {
    return [];
  }
}

export function persistJournal(journal: Entry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
  } catch {}
}

export function saveEntry(draft: string, journal: Entry[]): { entry: Entry | null; journal: Entry[] } {
  const t = (draft || '').trim();
  if (!t) return { entry: null, journal };
  if (journal.length && journal[0].text === t) return { entry: journal[0], journal };

  const now = new Date();
  const entry: Entry = {
    id: 'u' + Date.now(),
    user: true,
    date: shortDate(now),
    year: '' + now.getFullYear(),
    text: t,
    themes: tagThemes(t),
    revisions: [{ when: shortDate(now) + ' · ' + timeStr(now), note: 'First written' }],
  };
  const newJournal = [entry, ...journal];
  persistJournal(newJournal);
  return { entry, journal: newJournal };
}

export function allEntries(journal: Entry[]): Entry[] {
  return [...journal, ...SEED_ENTRIES];
}

export function byId(id: string, journal: Entry[]): Entry | undefined {
  return allEntries(journal).find(e => e.id === id);
}
