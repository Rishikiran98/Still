'use client';

import { CSSProperties, useState, useRef, useEffect, useCallback, PointerEvent as ReactPointerEvent } from 'react';
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
  onSurprise: () => void;
}

interface SimNode { x: number; y: number; vx: number; vy: number; }

const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

export default function Story({
  entries, pos, links, storyH, W, shape, setShape, accent, onOpenDetail, journalCount, onSurprise,
}: StoryProps) {
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [, setFrame] = useState(0);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const sim = useRef<SimNode[]>([]);
  const targets = useRef<StoryPos[]>(pos);
  const radii = useRef<number[]>(pos.map(p => p.r));
  const drag = useRef<{ i: number; moved: number; id: string } | null>(null);
  const raf = useRef<number | null>(null);
  const tRef = useRef(0);

  // (Re)seed the simulation when the node set changes; otherwise just retarget
  // (so switching shape springs the existing nodes to their new homes).
  useEffect(() => {
    targets.current = pos;
    radii.current = pos.map(p => p.r);
    if (sim.current.length !== pos.length) {
      sim.current = pos.map(p => ({ x: p.x, y: p.y, vx: 0, vy: 0 }));
    }
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, shape]);

  const step = useCallback(() => {
    const nodes = sim.current;
    const tg = targets.current;
    const rs = radii.current;
    const N = nodes.length;
    tRef.current += 0.016;
    const t = tRef.current;

    const kT = 0.014, damp = 0.84;
    let energy = 0;

    for (let i = 0; i < N; i++) {
      const n = nodes[i];
      if (drag.current && drag.current.i === i) { energy += 1; continue; }

      // Spring toward home, with a tiny idle wander so nothing looks frozen.
      const tx = tg[i].x + Math.sin(t * 0.6 + i * 1.3) * 2.2;
      const ty = tg[i].y + Math.cos(t * 0.5 + i * 0.7) * 2.2;
      let ax = -kT * (n.x - tx);
      let ay = -kT * (n.y - ty);

      // Soft repulsion so nodes don't overlap.
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const dx = n.x - nodes[j].x, dy = n.y - nodes[j].y;
        const d2 = dx * dx + dy * dy;
        const min = rs[i] + rs[j] + 16;
        if (d2 < min * min && d2 > 0.01) {
          const d = Math.sqrt(d2), f = (min - d) / d * 0.06;
          ax += dx * f; ay += dy * f;
        }
      }

      // When a node is dragged, its linked neighbours lean toward it.
      const held = drag.current;
      if (held) {
        for (const l of links) {
          let other = -1;
          if (l.a === i && l.b === held.i) other = held.i;
          else if (l.b === i && l.a === held.i) other = held.i;
          if (other >= 0) {
            ax += (nodes[other].x - n.x) * 0.015;
            ay += (nodes[other].y - n.y) * 0.015;
          }
        }
      }

      n.vx = (n.vx + ax) * damp;
      n.vy = (n.vy + ay) * damp;
      n.x += n.vx; n.y += n.vy;
      energy += n.vx * n.vx + n.vy * n.vy;
    }

    setFrame(f => (f + 1) & 0xffff);

    // Keep running while there's motion, a drag, or idle wander to render.
    if (energy > 0.02 || drag.current) {
      raf.current = requestAnimationFrame(step);
    } else {
      raf.current = null;
    }
  }, [links]);

  const start = useCallback(() => {
    if (raf.current == null) raf.current = requestAnimationFrame(step);
  }, [step]);

  useEffect(() => {
    start();
    return () => { if (raf.current != null) cancelAnimationFrame(raf.current); raf.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map a screen point into SVG (viewBox) coordinates.
  const toSvg = (clientX: number, clientY: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: (clientX - r.left) * (W / r.width), y: (clientY - r.top) * (storyH / r.height) };
  };

  const onPointerDownNode = (i: number, id: string) => (e: ReactPointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { i, moved: 0, id };
    start();
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const p = toSvg(e.clientX, e.clientY);
    const n = sim.current[d.i];
    d.moved += Math.abs(p.x - n.x) + Math.abs(p.y - n.y);
    n.vx = p.x - n.x; n.vy = p.y - n.y;     // carry momentum on release
    n.x = p.x; n.y = p.y;
    start();
  };
  const endDrag = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    start();
    if (d.moved < 5) onOpenDetail(d.id);      // it was a click, not a drag
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const shapeTabs: [StoryShape, string][] = [['web','Web'],['spiral','Spiral'],['timeline','Timeline']];
  const hoverEntry = hoverNode ? entries.find(e => e.id === hoverNode) : null;
  const usedThemes = [...new Set(entries.flatMap(e => e.themes))];
  const legend = usedThemes.slice(0, 6).map(t => ({ name: t, color: themeColor(t, accent) }));
  const storyViewBox = `0 0 ${W} ${storyH}`;
  const nodes = sim.current.length === entries.length ? sim.current : pos.map(p => ({ x: p.x, y: p.y, vx: 0, vy: 0 }));

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
          <SurpriseButton onSurprise={onSurprise} accent={accent} />
          <span style={{ color: '#3a362e' }}>|</span>
          <span style={{ color: '#514c42' }}>shape</span>
          {shapeTabs.map(([k, label]) => (
            <ShapeTab key={k} label={label} active={shape === k} accent={accent} onClick={() => setShape(k)} />
          ))}
        </div>
      </div>

      {/* SVG constellation — draggable */}
      <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
        <svg
          ref={svgRef}
          viewBox={storyViewBox}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          style={{ width: '100%', height: storyH, overflow: 'visible', display: 'block', touchAction: 'none' }}
        >
          {/* Thread lines */}
          {links.map((ln, i) => {
            const a = nodes[ln.a], b = nodes[ln.b];
            if (!a || !b) return null;
            const col = themeColor(ln.theme, accent);
            const hl = hoverNode && (entries[ln.a]?.id === hoverNode || entries[ln.b]?.id === hoverNode);
            return (
              <line
                key={i}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                style={{ stroke: hl ? hexA(col, 0.65) : hexA(col, 0.16), strokeWidth: hl ? 1.7 : 1 }}
              />
            );
          })}

          {/* Nodes */}
          {entries.map((e, i) => {
            const p = nodes[i];
            const r = radii.current[i] ?? pos[i]?.r ?? 12;
            if (!p) return null;
            const col = themeColor(e.themes[0] || 'reflection', accent);
            const hovered = hoverNode === e.id;
            const dragging = drag.current?.i === i;

            return (
              <g
                key={e.id}
                onPointerDown={onPointerDownNode(i, e.id)}
                onMouseEnter={() => setHoverNode(e.id)}
                onMouseLeave={() => setHoverNode(null)}
                style={{ cursor: dragging ? 'grabbing' : 'grab' }}
              >
                <circle cx={p.x} cy={p.y} r={r + 5}
                  style={{ fill: 'none', stroke: col, strokeWidth: 1, opacity: e.user ? 0.5 : 0, pointerEvents: 'none' }} />
                <circle cx={p.x} cy={p.y} r={dragging ? r + 1.5 : r}
                  style={{
                    fill: e.user ? '#15140f' : hexA(col, 0.9),
                    stroke: col, strokeWidth: e.user ? 2 : 1.4,
                    opacity: (hoverNode && !hovered) ? 0.4 : 1,
                  }} />
                <text x={p.x} y={p.y + r + 14}
                  style={{
                    fontFamily: "'Spline Sans Mono', monospace", fontSize: 9, letterSpacing: '.08em',
                    fill: hovered ? '#e8e2d4' : '#857c6d', textAnchor: 'middle', pointerEvents: 'none',
                  }}>
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
              Drag a reflection to pull the web · click to open it · hover to read it in your own words
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

function SurpriseButton({ onSurprise, accent }: { onSurprise: () => void; accent: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onClick={onSurprise}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer', fontFamily: "'Spline Sans Mono', monospace",
        fontSize: '10.5px', letterSpacing: '.1em', textTransform: 'uppercase',
        color: hovered ? '#e8e2d4' : accent,
        border: `1px solid ${hovered ? accent : hexA(accent, 0.4)}`,
        background: hovered ? hexA(accent, 0.12) : 'transparent',
        padding: '6px 12px', borderRadius: 2, transition: 'all .3s',
      }}
    >
      ✦ Surprise me
    </span>
  );
}
