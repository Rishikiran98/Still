'use client';

import { useState } from 'react';
import { Screen, AppSettings } from '@/lib/types';
import { ACCENT_OPTIONS } from '@/lib/data';
import { hexA } from '@/lib/utils';

interface NavProps {
  screen: Screen;
  settings: AppSettings;
  onSettings: (s: Partial<AppSettings>) => void;
  onGoWrite: () => void;
  onGoto: (s: Screen) => void;
}

const NAV_ITEMS: [Screen, string][] = [
  ['capture', 'Write'],
  ['surfacing', 'Connections'],
  ['story', 'Story'],
  ['themes', 'Themes'],
];

export default function Nav({ screen, settings, onSettings, onGoWrite, onGoto }: NavProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const activeNav = screen === 'detail' ? 'story' : screen;
  const A = settings.accent;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '24px 36px', zIndex: 50,
    }}>
      {/* Logo */}
      <div
        onClick={onGoWrite}
        style={{
          fontFamily: "'Newsreader', serif",
          fontWeight: 400, fontSize: 21, letterSpacing: '.02em',
          color: '#e8e2d4', cursor: 'pointer', fontStyle: 'italic',
          userSelect: 'none',
        }}
      >
        still<span style={{ color: A }}>.</span>
      </div>

      {/* Right side: nav items + settings */}
      <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
        {NAV_ITEMS.map(([key, label]) => (
          <span
            key={key}
            onClick={() => onGoto(key)}
            style={{
              fontFamily: "'Spline Sans Mono', monospace",
              fontSize: '10.5px', letterSpacing: '.16em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'color .3s',
              color: activeNav === key ? '#e8e2d4' : '#615b4f',
              userSelect: 'none',
            }}
          >
            {label}
          </span>
        ))}

        {/* Settings button */}
        <div style={{ position: 'relative' }}>
          <span
            onClick={() => setSettingsOpen(o => !o)}
            title="Appearance &amp; tone"
            style={{
              fontFamily: "'Spline Sans Mono', monospace",
              fontSize: '13px', cursor: 'pointer', color: '#615b4f',
              transition: 'color .3s', lineHeight: 1, userSelect: 'none',
            }}
          >
            ⚙
          </span>

          {settingsOpen && (
            <>
              <div
                onClick={() => setSettingsOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 99 }}
              />
              <div style={{
                position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                width: 240, background: '#1a1812',
                border: '1px solid rgba(232,226,212,.1)', borderRadius: 4,
                padding: '20px 20px 18px', zIndex: 100,
                boxShadow: '0 16px 48px rgba(0,0,0,.5)',
              }}>
                {/* Accent */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', color: '#7c7666', marginBottom: 10 }}>Accent</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {ACCENT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { onSettings({ accent: opt.value }); setSettingsOpen(false); }}
                        title={opt.label}
                        style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: opt.value, border: 'none', cursor: 'pointer',
                          outline: settings.accent === opt.value ? `2px solid ${opt.value}` : '2px solid transparent',
                          outlineOffset: 2,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Show readings */}
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c7666' }}>Show readings</div>
                  <button
                    onClick={() => onSettings({ showReadings: !settings.showReadings })}
                    style={{
                      width: 36, height: 20, borderRadius: 10,
                      background: settings.showReadings ? A : '#333',
                      border: 'none', cursor: 'pointer', position: 'relative',
                      transition: 'background .3s',
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: 2,
                      left: settings.showReadings ? 18 : 2,
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#fff', transition: 'left .3s',
                    }} />
                  </button>
                </div>

                {/* Mirror tone */}
                <div>
                  <div style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c7666', marginBottom: 8 }}>Mirror tone</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['gentle', 'unflinching'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => onSettings({ mirrorTone: t })}
                        style={{
                          fontFamily: "'Spline Sans Mono', monospace", fontSize: 9, letterSpacing: '.1em',
                          textTransform: 'uppercase', padding: '5px 10px', borderRadius: 2, border: 'none',
                          cursor: 'pointer',
                          background: settings.mirrorTone === t ? hexA(A, 0.2) : 'transparent',
                          color: settings.mirrorTone === t ? '#e8e2d4' : '#7c7666',
                          outline: settings.mirrorTone === t ? `1px solid ${hexA(A, 0.5)}` : '1px solid transparent',
                          transition: 'all .3s',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
