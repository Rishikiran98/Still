'use client';

import { CSSProperties, ReactNode } from 'react';
import { hexA } from '@/lib/utils';
import { READING_MARK } from '@/lib/data';

const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

interface ReadingProps {
  accent: string;
  children: ReactNode;
  /** Labelled block (Surfacing) or compact inline marker (Detail link reasons). */
  variant?: 'block' | 'inline';
  label?: string;
}

/**
 * The single, consistent way the app speaks in its own voice. Everything it
 * infers passes through here so the seam between the user's verbatim words and
 * the app's reading is always visible and always the same. Inference is
 * visually secondary by construction — muted, italic, marked, never asserted as
 * fact.
 */
export default function Reading({ accent, children, variant = 'block', label }: ReadingProps) {
  if (variant === 'inline') {
    return (
      <div style={{
        ...serif, fontStyle: 'italic', fontSize: 13, color: '#9c9484',
        lineHeight: 1.45, display: 'flex', gap: 7, alignItems: 'baseline',
      }}>
        <span style={{ ...mono, fontStyle: 'normal', fontSize: 9, color: hexA(accent, 0.6), flexShrink: 0 }}>
          {READING_MARK}
        </span>
        <span>{children}</span>
      </div>
    );
  }

  return (
    <div style={{ borderTop: `1px dashed ${hexA(accent, 0.22)}`, paddingTop: 11 }}>
      {label && (
        <div style={{
          ...mono, fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase',
          color: '#8a7a4a', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: hexA(accent, 0.7) }}>{READING_MARK}</span>
          {label}
        </div>
      )}
      <div style={{ ...serif, fontStyle: 'italic', fontWeight: 300, fontSize: 13.5, lineHeight: 1.45, color: '#9c9484' }}>
        {children}
      </div>
    </div>
  );
}
