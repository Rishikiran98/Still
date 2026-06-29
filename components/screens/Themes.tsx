'use client';

import { CSSProperties } from 'react';
import { ThemeData } from '@/lib/types';
import { spark } from '@/lib/utils';

interface ThemesProps {
  themes: ThemeData[];
  accent: string;
}

export default function Themes({ themes, accent }: ThemesProps) {
  const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
  const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

  return (
    <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '118px 32px 80px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ ...mono, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: accent, marginBottom: 14 }}>
          Threads over time
        </div>
        <div style={{ ...serif, fontStyle: 'italic', fontWeight: 300, fontSize: 24, lineHeight: 1.5, color: '#cfc8b8', maxWidth: 580, marginBottom: 8 }}>
          Patterns the app gathered from across your reflections.
        </div>
        <div style={{ ...mono, fontSize: 10.5, letterSpacing: '.04em', color: '#7c7666', marginBottom: 50 }}>
          These are the app's interpretations — not labels you chose.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {themes.map(theme => {
            const { sparkPoints, areaPoints } = spark(theme.months);
            return (
              <div key={theme.name} style={{
                display: 'grid', gridTemplateColumns: '1fr 180px 64px',
                gap: 34, alignItems: 'center',
                padding: '24px 0', borderTop: '1px solid rgba(232,226,212,.07)',
              }}>
                <div>
                  <div style={{ ...serif, fontWeight: 300, fontSize: 22, color: '#e8e2d4', marginBottom: 5 }}>
                    {theme.name}
                  </div>
                  <div style={{ ...serif, fontStyle: 'italic', fontSize: 14, color: '#8f877a' }}>
                    "…{theme.excerpt}…"
                  </div>
                </div>

                <svg viewBox="0 0 170 34" style={{ width: 170, height: 34, overflow: 'visible' }}>
                  <polygon
                    points={areaPoints}
                    style={{ fill: 'var(--accent-soft, rgba(201,162,75,.08))' }}
                  />
                  <polyline
                    points={sparkPoints}
                    style={{ fill: 'none', stroke: accent, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.8 }}
                  />
                </svg>

                <div style={{ textAlign: 'right', ...mono, fontSize: 11, letterSpacing: '.04em', color: '#cfc8b8' }}>
                  {theme.count}
                  <span style={{ color: '#514c42', fontSize: 9, display: 'block', letterSpacing: '.1em', marginTop: 3 }}>
                    entries
                  </span>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: '1px solid rgba(232,226,212,.07)' }} />
        </div>
      </div>
    </div>
  );
}
