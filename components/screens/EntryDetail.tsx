'use client';

import { CSSProperties, useState } from 'react';
import { Entry, AppSettings } from '@/lib/types';
import { hexA } from '@/lib/utils';
import Reading from '@/components/Reading';
import { CloseLink } from '@/components/screens/Surfacing';

interface EntryDetailProps {
  entry: Entry;
  linkedEntries: Array<{ entry: Entry; reason: string }>;
  settings: AppSettings;
  onBack: () => void;
  onOpenDetail: (id: string) => void;
  onClose: () => void;
}

export default function EntryDetail({ entry, linkedEntries, settings, onBack, onOpenDetail, onClose }: EntryDetailProps) {
  const { accent, showReadings } = settings;
  const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
  const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

  const revisions = (entry.revisions || []).map((r, i) => ({
    ...r, dot: i === 0 ? accent : '#5c5648',
  }));

  return (
    <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '118px 32px 80px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 64, alignItems: 'start' }}>
        <div>
          {/* Back link */}
          <BackLink onClick={onBack} accent={accent} />

          {/* Date */}
          <div style={{ ...mono, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: accent, marginBottom: 22 }}>
            {entry.date}, {entry.year}
          </div>

          {/* Entry text */}
          <div style={{ ...serif, fontWeight: 300, fontSize: 30, lineHeight: 1.55, color: '#f0eadc', letterSpacing: '.004em' }}>
            {entry.text}
          </div>

          {/* Connections */}
          <div style={{ marginTop: 54, borderTop: '1px solid rgba(232,226,212,.08)', paddingTop: 26 }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#8a7a4a', marginBottom: 20 }}>
              Connections the app drew
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {linkedEntries.map(({ entry: linked, reason }) => (
                <LinkedEntry
                  key={linked.id}
                  linked={linked}
                  reason={reason}
                  showReadings={showReadings}
                  accent={accent}
                  onOpen={() => onOpenDetail(linked.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* History sidebar */}
        <aside style={{
          background: '#1a1812', border: '1px solid rgba(232,226,212,.07)',
          borderRadius: 3, padding: '22px 22px 24px',
        }}>
          <div style={{ ...mono, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#7c7666', marginBottom: 18 }}>
            History
          </div>
          <div style={{ position: 'relative', paddingLeft: 18 }}>
            <div style={{ position: 'absolute', left: 3, top: 6, bottom: 6, width: 1, background: hexA(accent, 0.25) }} />
            {revisions.map((rev, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: 20 }}>
                <span style={{
                  position: 'absolute', left: -18, top: 5,
                  width: 7, height: 7, borderRadius: '50%',
                  background: rev.dot, border: '1px solid #15140f',
                }} />
                <div style={{ ...mono, fontSize: 10.5, letterSpacing: '.04em', color: '#cfc8b8', marginBottom: 3 }}>
                  {rev.when}
                </div>
                <div style={{ ...serif, fontStyle: 'italic', fontSize: 13, color: '#8f877a', lineHeight: 1.45 }}>
                  {rev.note}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, borderTop: '1px solid rgba(232,226,212,.06)', paddingTop: 14, ...mono, fontSize: 9.5, letterSpacing: '.04em', color: '#514c42', lineHeight: 1.7 }}>
            Nothing is ever overwritten. Each edit is kept beside the words that came before it.
          </div>
        </aside>
      </div>

      {/* You followed a thread — that's a session. Offer the end. */}
      <div style={{ maxWidth: 980, margin: '56px auto 0', textAlign: 'center' }}>
        <CloseLink onClose={onClose} accent={accent} label="You found a thread — leave it here →" />
      </div>
    </div>
  );
}

function BackLink({ onClick, accent }: { onClick: () => void; accent: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Spline Sans Mono', monospace", fontSize: 10.5,
        letterSpacing: '.12em', textTransform: 'uppercase',
        color: hovered ? accent : '#7c7666',
        cursor: 'pointer', marginBottom: 38,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'color .3s',
      }}
    >
      ← back to your story
    </div>
  );
}

function LinkedEntry({ linked, reason, showReadings, accent, onOpen }: {
  linked: Entry; reason: string; showReadings: boolean; accent: string; onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const mono: CSSProperties = { fontFamily: "'Spline Sans Mono', monospace" };
  const serif: CSSProperties = { fontFamily: "'Newsreader', Georgia, serif" };

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: `16px 0 16px ${hovered ? 8 : 0}px`,
        borderBottom: '1px solid rgba(232,226,212,.05)',
        cursor: 'pointer', display: 'flex', gap: 18, alignItems: 'flex-start',
        transition: 'padding-left .3s',
      }}
    >
      <span style={{ ...mono, fontSize: 10, letterSpacing: '.12em', color: '#7c7666', whiteSpace: 'nowrap', paddingTop: 4, minWidth: 54 }}>
        {linked.date}
      </span>
      <div>
        <div style={{ ...serif, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: '#d8d2c4', marginBottom: 6 }}>
          {linked.text}
        </div>
        {showReadings && (
          <Reading variant="inline" accent={accent}>
            {reason}
          </Reading>
        )}
      </div>
    </div>
  );
}
