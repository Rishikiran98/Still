'use client';

import { CSSProperties, useState, useEffect } from 'react';
import { SurfacingMode, EchoCard, AppSettings } from '@/lib/types';
import { hexA } from '@/lib/utils';
import Reading from '@/components/Reading';

interface SurfacingProps {
  draft: string;
  mode: SurfacingMode;
  setMode: (m: SurfacingMode) => void;
  cur: { left: number; top: number; width: number };
  echoes: EchoCard[];
  W: number;
  settings: AppSettings;
  onOpenDetail: (id: string) => void;
  onClose: () => void;
}

const STAGE_H = 720;

export default function Surfacing({
  draft, mode, setMode, cur, echoes, W, settings, onOpenDetail, onClose,
}: SurfacingProps) {
  const { accent, showReadings, mirrorTone } = settings;
  const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
  const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

  // The reveal: a brief "reading…" beat, then threads draw in and echoes fade
  // up one by one — so the connection lands as a moment, not a static layout.
  const [revealing, setRevealing] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealing(true), 850);
    return () => clearTimeout(t);
  }, []);

  const modeTabs: [SurfacingMode, string][] = [['margin','Margin'],['constellation','Constellation'],['timeline','Timeline']];

  const axisShow = mode === 'timeline';
  const axisX = echoes[0]?.ax ?? Math.round(W * 0.625);

  const readingLabel = mirrorTone === 'unflinching'
    ? "What you might be avoiding — the app's reading"
    : "Why it surfaced — the app's reading";
  const toneNote = mirrorTone === 'unflinching'
    ? "Set to reflect your patterns back plainly — the app errs toward honesty, even when it stings."
    : "Offered gently. The app stays close to your own words.";

  const svgViewBox = `0 0 ${W} ${STAGE_H}`;

  return (
    <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '104px 0 60px' }}>
      {/* Header */}
      <div style={{
        maxWidth: 1120, margin: '0 auto 18px', padding: '0 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24,
      }}>
        <div>
          <div style={{ ...mono, fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: accent, marginBottom: 7 }}>
            The app noticed
          </div>
          <div style={{ ...serif, fontStyle: 'italic', fontWeight: 300, fontSize: 23, color: '#cfc8b8' }}>
            Four past reflections lean toward this one.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', ...mono, fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase' }}>
          <span style={{ color: '#514c42' }}>arrange</span>
          {modeTabs.map(([k, label]) => (
            <ModeTab key={k} label={label} active={mode === k} accent={accent} onClick={() => setMode(k)} />
          ))}
        </div>
      </div>

      {/* Stage */}
      <div style={{ width: '100%' }}>
        <div style={{ width: W, height: STAGE_H, position: 'relative', margin: '0 auto' }}>
          {/* SVG threads */}
          <svg
            viewBox={svgViewBox}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 2 }}
          >
            {axisShow && (
              <line
                x1={axisX} y1={40} x2={axisX} y2={690}
                style={{ stroke: 'rgba(232,226,212,.1)', strokeWidth: 1, strokeDasharray: '2 5' }}
              />
            )}
            {echoes.map((echo, i) => (
              <path
                key={echo.id ?? i}
                d={echo.threadD}
                pathLength={1}
                style={{
                  fill: 'none',
                  stroke: hexA(accent, echo.rel === 'strong' ? 0.5 : echo.rel === 'medium' ? 0.32 : 0.2),
                  strokeWidth: echo.rel === 'strong' ? 1.7 : echo.rel === 'medium' ? 1.2 : 0.9,
                  strokeLinecap: 'round',
                  strokeDasharray: 1,
                  strokeDashoffset: revealing ? 0 : 1,
                  transition: `stroke-dashoffset .8s ease ${(0.15 + i * 0.13).toFixed(2)}s`,
                }}
              />
            ))}
          </svg>

          {/* Current entry */}
          <div style={{
            position: 'absolute', left: cur.left, top: cur.top, width: cur.width,
            zIndex: 4, opacity: 1,
            transition: 'left .85s cubic-bezier(.6,.05,.2,1), top .85s cubic-bezier(.6,.05,.2,1), width .6s ease',
          }}>
            <div style={{ position: 'relative', padding: '2px 4px' }}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, display: 'inline-block' }} />
                Today · just now
              </div>
              <div style={{ ...serif, fontWeight: 300, fontSize: 21, lineHeight: 1.62, color: '#f0eadc', letterSpacing: '.005em' }}>
                {draft}
              </div>
            </div>
          </div>

          {/* Echo cards */}
          {echoes.map((echo) => (
            <EchoCardEl
              key={echo.id}
              echo={echo}
              revealing={revealing}
              showReadings={showReadings}
              readingLabel={readingLabel}
              accent={accent}
              onOpen={() => onOpenDetail(echo.id)}
            />
          ))}

          {/* The "reading…" beat before the connections land */}
          {!revealing && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{ ...mono, fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: accent, display: 'flex', alignItems: 'center', gap: 4 }}>
                reading your words
                <span style={{ animation: 'readingDots 1.2s ease-in-out infinite' }}>·</span>
                <span style={{ animation: 'readingDots 1.2s ease-in-out .2s infinite' }}>·</span>
                <span style={{ animation: 'readingDots 1.2s ease-in-out .4s infinite' }}>·</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div style={{
        maxWidth: 1120, margin: '8px auto 0', padding: '0 32px',
        ...mono, fontSize: 10, letterSpacing: '.05em', color: '#514c42',
        lineHeight: 1.7, textAlign: 'center',
      }}>
        Connections and reasons are the app's interpretation, offered quietly. {toneNote}
      </div>

      {/* The session has a natural end — leave with what surfaced */}
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <CloseLink onClose={onClose} accent={accent} label="Enough for today — leave it here →" />
      </div>
    </div>
  );
}

export function CloseLink({ onClose, accent, label }: { onClose: () => void; accent: string; label: string }) {
  return (
    <span
      onClick={onClose}
      style={{
        fontFamily: "'Spline Sans Mono', monospace", fontSize: 10.5,
        letterSpacing: '.1em', textTransform: 'uppercase',
        color: '#615b4f', cursor: 'pointer', transition: 'color .3s',
        display: 'inline-block',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = accent)}
      onMouseLeave={e => (e.currentTarget.style.color = '#615b4f')}
    >
      {label}
    </span>
  );
}

function ModeTab({ label, active, accent, onClick }: { label: string; active: boolean; accent: string; onClick: () => void }) {
  return (
    <span
      onClick={onClick}
      style={{
        cursor: 'pointer', fontFamily: "'Spline Sans Mono', monospace",
        fontSize: '10.5px', letterSpacing: '.1em', textTransform: 'uppercase',
        color: active ? accent : '#7c7666',
        borderBottom: active ? `1px solid ${hexA(accent, 0.6)}` : '1px solid transparent',
        paddingBottom: 3, transition: 'color .3s',
      }}
    >
      {label}
    </span>
  );
}

function EchoCardEl({ echo, revealing, showReadings, readingLabel, accent, onOpen }: {
  echo: EchoCard;
  revealing: boolean;
  showReadings: boolean;
  readingLabel: string;
  accent: string;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
  const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

  // Each card fades up as its thread completes — staggered behind the reveal.
  return (
    <div style={{
      position: 'absolute',
      left: echo.pos.left, top: echo.pos.top, width: echo.pos.width,
      zIndex: 3,
      opacity: revealing ? 1 : 0,
      animation: revealing ? `echoSlide .8s cubic-bezier(.2,.7,.2,1) ${(0.25 + echo.i * 0.14).toFixed(2)}s both` : 'none',
      transition: 'left .85s cubic-bezier(.6,.05,.2,1), top .85s cubic-bezier(.6,.05,.2,1), width .6s ease, opacity .4s ease',
    }}>
      <div
        onClick={onOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#211e16' : '#1c1a14',
          border: `1px solid ${hovered ? 'rgba(201,162,75,.5)' : 'rgba(232,226,212,.08)'}`,
          borderRadius: 3, padding: '17px 20px 18px', cursor: 'pointer',
          transition: 'border-color .35s, transform .35s, background .35s',
          boxShadow: '0 8px 30px rgba(0,0,0,.35)',
          transform: hovered ? 'translateY(-2px)' : 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 11 }}>
          <span style={{ ...mono, fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: '#7c7666' }}>
            {echo.date}
          </span>
          <span style={{ ...mono, fontSize: 9.5, letterSpacing: '.08em', color: echo.relColor }}>
            {echo.relLabel}
          </span>
        </div>
        <div style={{ ...serif, fontWeight: 300, fontSize: 16.5, lineHeight: 1.52, color: '#e3ddcf', marginBottom: 14 }}>
          {echo.text}
        </div>
        {showReadings && (
          <Reading accent={accent} label={readingLabel}>
            {echo.displayReason}
          </Reading>
        )}
      </div>
    </div>
  );
}
