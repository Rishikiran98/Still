'use client';

import { CSSProperties, useState } from 'react';
import { Entry, StoryShape, StoryPos, StoryLinkData } from '@/lib/types';
import { hexA, themeColor } from '@/lib/utils';

interface StoryProps {
  entries: Entry[];
  pos: StoryPos[];
  links: StoryLinkData[];
  storyH: number;
  W: number;
  shape: StoryShape;
  setShape: (s: StoryShape) => void;
  accent: string;
  onOpenDetail: (id: string) => void;
  journalCount: number;
}

export default function Story({
  entries, pos, links, storyH, W, shape, setShape, accent, onOpenDetail, journalCount,
}: StoryProps) {
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
  const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

  const shapeTabs: [StoryShape, string][] = [['web','Web'],['spiral','Spiral'],['timeline','Timeline']];
  const hoverEntry = hoverNode ? entries.find(e => e.id === hoverNode) : null;

  const usedThemes = [...new Set(entries.flatMap(e => e.themes))];
  const legend = usedThemes.slice(0, 6).map(t => ({
    name: t,
    color: themeColor(t, accent),
  }));

  const storyViewBox = `0 0 ${W} ${storyH}`;

  return (
    <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '104px 0 56px' }}>
      {/* Header */}
      <div style={{
        maxWidth: 1180, margin: '0 auto 4px', padding: '0 36px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24,
      }}>
        <div>
          <div style={{ ...mono, fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: accent, marginBottom: 8 }}>
            Your story · {entries.length} reflections
          </div>
          <div style={{ ...serif, fontStyle: 'italic', fontWeight: 300, fontSize: 25, color: '#cfc8b8' }}>
            Everything you have written, and the threads between.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', ...mono, fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase' }}>
          <span style={{ color: '#514c42' }}>shape</span>
          {shapeTabs.map(([k, label]) => (
            <ShapeTab key={k} label={label} active={shape === k} accent={accent} onClick={() => setShape(k)} />
          ))}
        </div>
      </div>

      {/* SVG constellation */}
      <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
        <svg viewBox={storyViewBox} style={{ width: '100%', height: storyH, overflow: 'visible', display: 'block' }}>
          {/* Thread lines */}
          {links.map((ln, i) => {
            const a = pos[ln.a], b = pos[ln.b];
            if (!a || !b) return null;
            const col = themeColor(ln.theme, accent);
            const hl = hoverNode && (entries[ln.a]?.id === hoverNode || entries[ln.b]?.id === hoverNode);
            return (
              <line
                key={i}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                style={{
                  stroke: hl ? hexA(col, 0.65) : hexA(col, 0.16),
                  strokeWidth: hl ? 1.7 : 1,
                  transition: 'stroke .3s, stroke-width .3s',
                }}
              />
            );
          })}

          {/* Nodes */}
          {entries.map((e, i) => {
            const p = pos[i];
            if (!p) return null;
            const col = themeColor(e.themes[0] || 'reflection', accent);
            const hovered = hoverNode === e.id;

            return (
              <g
                key={e.id}
                onClick={() => onOpenDetail(e.id)}
                onMouseEnter={() => setHoverNode(e.id)}
                onMouseLeave={() => setHoverNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer ring for user entries */}
                <circle
                  cx={p.x} cy={p.y} r={p.r + 5}
                  style={{ fill: 'none', stroke: col, strokeWidth: 1, opacity: e.user ? 0.5 : 0, pointerEvents: 'none' }}
                />
                {/* Main node */}
                <circle
                  cx={p.x} cy={p.y} r={p.r}
                  style={{
                    fill: e.user ? '#15140f' : hexA(col, 0.9),
                    stroke: col, strokeWidth: e.user ? 2 : 1.4,
                    cursor: 'pointer',
                    opacity: (hoverNode && !hovered) ? 0.4 : 1,
                    transition: 'opacity .3s',
                  }}
                />
                {/* Date label */}
                <text
                  x={p.x} y={p.y + p.r + 14}
                  style={{
                    fontFamily: "'Spline Sans Mono', monospace", fontSize: 9,
                    letterSpacing: '.08em', fill: hovered ? '#e8e2d4' : '#857c6d',
                    textAnchor: 'middle', pointerEvents: 'none',
                  }}
                >
                  {e.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover preview */}
        <div style={{ minHeight: 78, marginTop: 6, padding: '0 36px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {hoverEntry ? (
            <div style={{ maxWidth: 640, textAlign: 'center' }}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: hexA(accent, 0.62), marginBottom: 9 }}>
                {hoverEntry.date}, {hoverEntry.year}
              </div>
              <div style={{ ...serif, fontStyle: 'italic', fontWeight: 300, fontSize: 18, lineHeight: 1.5, color: '#e3ddcf' }}>
                "{hoverEntry.text}"
              </div>
            </div>
          ) : (
            <div style={{ ...mono, fontSize: 10.5, letterSpacing: '.06em', color: '#514c42' }}>
              Hover a reflection to read it in your own words · click to open it
            </div>
          )}
        </div>

        {/* Legend + footer */}
        <div style={{ maxWidth: 1180, margin: '4px auto 0', padding: '0 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
            {legend.map(lg => (
              <span key={lg.name} style={{ display: 'flex', alignItems: 'center', gap: 7, ...mono, fontSize: 9.5, letterSpacing: '.06em', textTransform: 'uppercase', color: '#857c6d' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: lg.color, display: 'inline-block' }} />
                {lg.name}
              </span>
            ))}
          </div>
          <div style={{ ...mono, fontSize: 10, letterSpacing: '.04em', color: '#514c42' }}>
            {journalCount} written by you · larger node = more connected · the threads are the app's reading
          </div>
        </div>
      </div>
    </div>
  );
}

function ShapeTab({ label, active, accent, onClick }: { label: string; active: boolean; accent: string; onClick: () => void }) {
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
