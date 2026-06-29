export interface EntryLink {
  id: string;
  reason?: string;
  reasonSharp?: string;
}

export interface Revision {
  when: string;
  note: string;
}

export interface Entry {
  id: string;
  date: string;
  year: string;
  rel?: 'strong' | 'medium' | 'soft';
  text: string;
  themes: string[];
  reason?: string;
  reasonSharp?: string;
  revisions: Revision[];
  links?: EntryLink[];
  user?: boolean;
}

export interface ThemeData {
  name: string;
  count: number;
  excerpt: string;
  months: number[];
}

export type Screen = 'capture' | 'surfacing' | 'detail' | 'themes' | 'story' | 'closing';

/**
 * What the user did this session. Tracked so the session can offer a natural
 * end — the governing principle: the tool succeeds when you leave with
 * something, never when you stay. This is value-per-session, never engagement.
 */
export interface SessionState {
  wrote: boolean;        // set down a new reflection
  surfaced: boolean;     // saw the app surface connections
  openedIds: string[];   // followed a thread to a past entry
}
export type SurfacingMode = 'margin' | 'constellation' | 'timeline';
export type StoryShape = 'web' | 'spiral' | 'timeline';
export type MirrorTone = 'gentle' | 'unflinching';

export interface AppSettings {
  accent: string;
  showReadings: boolean;
  mirrorTone: MirrorTone;
}

export interface EchoCard extends Entry {
  i: number;
  pos: { left: number; top: number; width: number };
  threadD: string;
  ax?: number;
  relLabel: string;
  relColor: string;
  displayReason: string;
}

export interface SurfacingLayout {
  cur: { left: number; top: number; width: number };
  echoes: EchoCard[];
}

export interface StoryPos {
  x: number;
  y: number;
  r: number;
}

export interface StoryLinkData {
  a: number;
  b: number;
  w: number;
  theme: string;
}
