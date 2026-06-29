'use client';

import { CSSProperties } from 'react';

interface CaptureProps {
  draft: string;
  onDraftChange: (v: string) => void;
  onSurface: () => void;
  onNewEntry: () => void;
  accent: string;
}

export default function Capture({ draft, onDraftChange, onSurface, onNewEntry, accent }: CaptureProps) {
  const today = new Date();
  const dayNames = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
  const monthNames = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  const todayLabel = `${dayNames[today.getDay()]} · ${monthNames[today.getMonth()]} ${today.getDate()}`;
  const listening = (draft || '').trim().length > 40;

  const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
  const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

  return (
    <div style={{
      position: 'relative', zIndex: 10, minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '150px 32px 80px',
    }}>
      <div style={{ width: '100%', maxWidth: 660 }}>
        {/* Date header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 34 }}>
          <div style={{ ...mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: '#7c7666' }}>
            {todayLabel}
          </div>
          <span
            onClick={onNewEntry}
            style={{
              ...mono, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase',
              color: '#615b4f', cursor: 'pointer', transition: 'color .3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = accent)}
            onMouseLeave={e => (e.currentTarget.style.color = '#615b4f')}
          >
            + new reflection
          </span>
        </div>

        {/* Textarea */}
        <textarea
          value={draft}
          onChange={e => onDraftChange(e.target.value)}
          placeholder="Begin where you are…"
          style={{
            width: '100%', minHeight: 300, background: 'transparent',
            border: 'none', outline: 'none', resize: 'none',
            ...serif, fontWeight: 300, fontSize: 25, lineHeight: 1.72,
            color: '#e8e2d4', letterSpacing: '.005em',
          }}
        />

        {/* Bottom bar */}
        <div style={{
          marginTop: 30, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24, minHeight: 42,
          borderTop: '1px solid rgba(232,226,212,.07)', paddingTop: 22,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...mono, fontSize: 11.5, letterSpacing: '.04em', color: '#7c7666' }}>
            {listening && (
              <>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: accent,
                  display: 'inline-block', animation: 'softPulse 2.4s ease-in-out infinite',
                }} />
                <span>
                  listening · <span style={{ color: accent }}>4 echoes</span> nearby
                </span>
              </>
            )}
          </div>

          {listening && (
            <SaveButton onSurface={onSurface} accent={accent} />
          )}
        </div>

        {/* Append-only note */}
        <div style={{ marginTop: 26, ...mono, fontSize: 10.5, letterSpacing: '.05em', color: '#514c42', lineHeight: 1.7, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          <span style={{ color: '#6b6557' }}>⌖</span>
          <span>This saves as a new reflection. Earlier versions are kept — nothing you write is ever overwritten.</span>
        </div>
      </div>
    </div>
  );
}

function SaveButton({ onSurface, accent }: { onSurface: () => void; accent: string }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.currentTarget.style.background = `rgba(${hexChannels(accent)},0.12)`;
    e.currentTarget.style.borderColor = accent;
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.currentTarget.style.background = 'transparent';
    e.currentTarget.style.borderColor = `rgba(${hexChannels(accent)},0.45)`;
  };

  return (
    <span
      onClick={onSurface}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        fontFamily: "'Spline Sans Mono', monospace", fontSize: 11.5,
        letterSpacing: '.12em', textTransform: 'uppercase',
        color: '#e8e2d4',
        border: `1px solid rgba(${hexChannels(accent)},0.45)`,
        padding: '11px 20px', borderRadius: 2, cursor: 'pointer',
        whiteSpace: 'nowrap', transition: 'all .3s',
      }}
    >
      Save &amp; surface connections →
    </span>
  );
}

function hexChannels(hex: string): string {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(f, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
