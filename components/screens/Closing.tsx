'use client';

import { CSSProperties, useState } from 'react';
import { Entry } from '@/lib/types';
import { hexA } from '@/lib/utils';

interface ClosingProps {
  takeaways: string[];
  lastOpened: Entry | null;
  accent: string;
  onBegin: () => void;
  onStay: () => void;
}

const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

/**
 * The session's natural end. Not a pause, not a streak, not "see you tomorrow"
 * — a deliberate stopping place that names what you walked away with and then
 * gets out of the way. The one screen whose job is to NOT keep you here.
 */
export default function Closing({ takeaways, lastOpened, accent, onBegin, onStay }: ClosingProps) {
  const excerpt = lastOpened
    ? (lastOpened.text.length > 150 ? lastOpened.text.slice(0, 150).trimEnd() + '…' : lastOpened.text)
    : null;

  return (
    <div style={{
      position: 'relative', zIndex: 10, minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '120px 32px 100px', textAlign: 'center',
      animation: 'fadeIn .9s ease both',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ ...mono, fontSize: 10.5, letterSpacing: '.24em', textTransform: 'uppercase', color: accent, marginBottom: 22 }}>
          The session ends here
        </div>

        <div style={{ ...serif, fontWeight: 300, fontStyle: 'italic', fontSize: 38, lineHeight: 1.3, color: '#f0eadc', marginBottom: 40 }}>
          Enough for today.
        </div>

        {/* What you walked away with */}
        {takeaways.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: excerpt ? 34 : 44, alignItems: 'center' }}>
            {takeaways.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline', maxWidth: 460, textAlign: 'left' }}>
                <span style={{ color: hexA(accent, 0.7), ...mono, fontSize: 11, flexShrink: 0, transform: 'translateY(-1px)' }}>—</span>
                <span style={{ ...serif, fontWeight: 300, fontSize: 17, lineHeight: 1.5, color: '#d8d2c4' }}>{t}</span>
              </div>
            ))}
          </div>
        )}

        {/* The thread you followed, in your own words */}
        {excerpt && (
          <div style={{ borderTop: '1px solid rgba(232,226,212,.08)', borderBottom: '1px solid rgba(232,226,212,.08)', padding: '24px 0', marginBottom: 40 }}>
            <div style={{ ...mono, fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', color: '#7c7666', marginBottom: 12 }}>
              You followed a thread back to {lastOpened!.date}, {lastOpened!.year}
            </div>
            <div style={{ ...serif, fontStyle: 'italic', fontWeight: 300, fontSize: 19, lineHeight: 1.55, color: '#e3ddcf' }}>
              “{excerpt}”
            </div>
          </div>
        )}

        {/* The honest framing — no hook, no scoreboard */}
        <div style={{ ...mono, fontSize: 10.5, letterSpacing: '.04em', color: '#615b4f', lineHeight: 1.85, maxWidth: 440, margin: '0 auto 40px' }}>
          A stopping place, not a pause. Nothing here keeps score, and nothing is
          asking you to come back. Return when you have something to set down.
        </div>

        {/* Actions — leaving is the default; staying is the quiet option */}
        <div style={{ display: 'flex', gap: 26, alignItems: 'center', justifyContent: 'center' }}>
          <BeginButton onBegin={onBegin} accent={accent} />
          <span
            onClick={onStay}
            style={{ ...mono, fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#514c42', cursor: 'pointer', transition: 'color .3s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#7c7666')}
            onMouseLeave={e => (e.currentTarget.style.color = '#514c42')}
          >
            ← not yet
          </span>
        </div>
      </div>
    </div>
  );
}

function BeginButton({ onBegin, accent }: { onBegin: () => void; accent: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onClick={onBegin}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase',
        color: '#e8e2d4',
        border: `1px solid ${hovered ? accent : hexA(accent, 0.45)}`,
        background: hovered ? hexA(accent, 0.12) : 'transparent',
        padding: '11px 22px', borderRadius: 2, cursor: 'pointer',
        transition: 'all .3s',
      }}
    >
      Begin again
    </span>
  );
}
