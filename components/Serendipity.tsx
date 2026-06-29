'use client';

import { CSSProperties, useState } from 'react';
import { SerendipityPick } from '@/lib/utils';
import { MirrorTone, Entry } from '@/lib/types';
import { hexA, themeColor } from '@/lib/utils';
import { READING_MARK } from '@/lib/data';

interface SerendipityProps {
  pick: SerendipityPick;
  accent: string;
  tone: MirrorTone;
  onAnother: () => void;
  onClose: () => void;
  onOpenDetail: (id: string) => void;
}

const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

/**
 * One unexpected connection the user never drew. A single "aha," then it stops
 * — play that ends in insight, never a feed. (The doc's "connect things I
 * didn't connect" moment.)
 */
export default function Serendipity({ pick, accent, tone, onAnother, onClose, onOpenDetail }: SerendipityProps) {
  const reason = tone === 'unflinching' ? pick.reasonSharp : pick.reasonGentle;
  const col = themeColor(pick.theme, accent);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32, background: 'rgba(8,8,6,.72)', backdropFilter: 'blur(3px)',
        animation: 'fadeIn .3s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 720, background: '#1a1812',
          border: '1px solid rgba(232,226,212,.1)', borderRadius: 5,
          padding: '34px 38px 30px', position: 'relative',
          boxShadow: '0 30px 90px rgba(0,0,0,.6)',
          animation: 'echoSlide .5s cubic-bezier(.2,.7,.2,1) both',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 26 }}>
          <div style={{ ...mono, fontSize: 10.5, letterSpacing: '.22em', textTransform: 'uppercase', color: accent }}>
            A thread you never drew
          </div>
          <span
            onClick={onClose}
            style={{ ...mono, fontSize: 14, color: '#615b4f', cursor: 'pointer', lineHeight: 1 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#cfc8b8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#615b4f')}
          >
            ✕
          </span>
        </div>

        {/* Two entries, joined by a thread */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 18, marginBottom: 24 }}>
          <EntrySide entry={pick.a} col={col} onOpen={() => onOpenDetail(pick.a.id)} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 30 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: col }} />
            <div style={{ width: 1, flex: 1, background: hexA(col, 0.4), margin: '4px 0' }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: col }} />
          </div>
          <EntrySide entry={pick.b} col={col} onOpen={() => onOpenDetail(pick.b.id)} />
        </div>

        {/* The reading */}
        <div style={{ borderTop: `1px dashed ${hexA(accent, 0.22)}`, paddingTop: 14, marginBottom: 26 }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: '#8a7a4a', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: hexA(accent, 0.7) }}>{READING_MARK}</span>
            What the app noticed — its reading
          </div>
          <div style={{ ...serif, fontStyle: 'italic', fontWeight: 300, fontSize: 16.5, lineHeight: 1.5, color: '#cfc8b8' }}>
            {reason}
          </div>
        </div>

        {/* Actions — one insight, then a deliberate choice. Not a feed. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
          <span
            onClick={onClose}
            style={{ ...mono, fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#615b4f', cursor: 'pointer', transition: 'color .3s' }}
            onMouseEnter={e => (e.currentTarget.style.color = accent)}
            onMouseLeave={e => (e.currentTarget.style.color = '#615b4f')}
          >
            Leave with this →
          </span>
          <AnotherButton onAnother={onAnother} accent={accent} />
        </div>
      </div>
    </div>
  );
}

function EntrySide({ entry, col, onOpen }: { entry: Entry; col: string; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, background: hovered ? '#211e16' : '#15140f',
        border: `1px solid ${hovered ? hexA(col, 0.5) : 'rgba(232,226,212,.08)'}`,
        borderRadius: 3, padding: '16px 18px', cursor: 'pointer', transition: 'all .3s',
      }}
    >
      <div style={{ ...mono, fontSize: 9.5, letterSpacing: '.15em', textTransform: 'uppercase', color: '#7c7666', marginBottom: 10 }}>
        {entry.date}, {entry.year}
      </div>
      <div style={{ ...serif, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: '#e3ddcf' }}>
        {entry.text}
      </div>
    </div>
  );
}

function AnotherButton({ onAnother, accent }: { onAnother: () => void; accent: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onClick={onAnother}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...mono, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase',
        color: '#e8e2d4',
        border: `1px solid ${hovered ? accent : hexA(accent, 0.45)}`,
        background: hovered ? hexA(accent, 0.12) : 'transparent',
        padding: '9px 18px', borderRadius: 2, cursor: 'pointer', transition: 'all .3s',
      }}
    >
      ↻ Surprise me again
    </span>
  );
}
