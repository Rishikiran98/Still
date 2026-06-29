'use client';

import { useState, useEffect, useCallback } from 'react';
import { Screen, SurfacingMode, StoryShape, AppSettings, Entry, SessionState } from '@/lib/types';
import { DEFAULT_DRAFT, SEED_ENTRIES, THEMES } from '@/lib/data';
import {
  hexA, loadJournal, persistJournal, tagThemes, shortDate, timeStr,
  computeLayout, computeStoryLayout, allEntries, byId,
} from '@/lib/utils';

import Nav from '@/components/Nav';
import Capture from '@/components/screens/Capture';
import Surfacing from '@/components/screens/Surfacing';
import EntryDetail from '@/components/screens/EntryDetail';
import Themes from '@/components/screens/Themes';
import Story from '@/components/screens/Story';
import Closing from '@/components/screens/Closing';

const EMPTY_SESSION: SessionState = { wrote: false, surfaced: false, openedIds: [] };

const DEFAULT_SETTINGS: AppSettings = {
  accent: '#bf8170',
  showReadings: true,
  mirrorTone: 'gentle',
};

export default function StillApp() {
  const [screen, setScreen] = useState<Screen>('capture');
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [mode, setMode] = useState<SurfacingMode>('margin');
  const [activeId, setActiveId] = useState('e1');
  const [journal, setJournal] = useState<Entry[]>([]);
  const [storyShape, setStoryShape] = useState<StoryShape>('web');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [session, setSession] = useState<SessionState>(EMPTY_SESSION);
  const [W, setW] = useState(900);
  const [mounted, setMounted] = useState(false);

  // Load journal + compute W on mount
  useEffect(() => {
    setJournal(loadJournal());
    function updateW() {
      setW(Math.min(1180, Math.max(800, window.innerWidth - 72)));
    }
    updateW();
    window.addEventListener('resize', updateW);
    setMounted(true);
    return () => window.removeEventListener('resize', updateW);
  }, []);

  // Apply accent CSS variables
  useEffect(() => {
    if (!mounted) return;
    const A = settings.accent;
    document.documentElement.style.setProperty('--accent', A);
    document.documentElement.style.setProperty('--accent-soft', hexA(A, 0.13));
    document.documentElement.style.setProperty('--accent-dim', hexA(A, 0.22));
    document.documentElement.style.setProperty('--accent-line', hexA(A, 0.45));
    document.documentElement.style.setProperty('--accent-text', hexA(A, 0.62));
  }, [settings.accent, mounted]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const saveDraft = useCallback(() => {
    const t = (draft || '').trim();
    if (!t) return;
    const j = journal;
    if (j.length && j[0].text === t) {
      setSession(p => ({ ...p, surfaced: true }));
      setScreen('surfacing');
      return;
    }
    const now = new Date();
    const entry: Entry = {
      id: 'u' + Date.now(),
      user: true,
      date: shortDate(now),
      year: '' + now.getFullYear(),
      text: t,
      themes: tagThemes(t),
      revisions: [{ when: shortDate(now) + ' · ' + timeStr(now), note: 'First written' }],
    };
    const newJournal = [entry, ...j];
    persistJournal(newJournal);
    setJournal(newJournal);
    setSession(p => ({ ...p, wrote: true, surfaced: true }));
    setScreen('surfacing');
  }, [draft, journal]);

  const newEntry = useCallback(() => {
    setDraft('');
    setScreen('capture');
  }, []);

  const openDetail = useCallback((id: string) => {
    setSession(p => p.openedIds.includes(id) ? p : { ...p, openedIds: [...p.openedIds, id] });
    setActiveId(id);
    setScreen('detail');
  }, []);

  const goto = useCallback((s: Screen) => {
    // Reaching the surfacing view at all is value delivered — it counts.
    if (s === 'surfacing') setSession(p => ({ ...p, surfaced: true }));
    setScreen(s);
  }, []);

  const closeSession = useCallback(() => setScreen('closing'), []);

  const beginAgain = useCallback(() => {
    setSession(EMPTY_SESSION);
    setDraft('');
    setScreen('capture');
  }, []);

  // Compute layout values
  const entries = allEntries(journal);
  const surfW = Math.min(1120, W);
  const layout = computeLayout(mode, surfW, SEED_ENTRIES, settings.accent, settings.mirrorTone);
  const storyLayout = computeStoryLayout(entries, W, storyShape);

  // Detail entry
  const ae = byId(activeId, journal) || SEED_ENTRIES[0];
  const linkedEntries: Array<{ entry: Entry; reason: string }> = (() => {
    if (ae.links) {
      return ae.links.flatMap(l => {
        const linked = byId(l.id, journal);
        if (!linked) return [];
        const reason = settings.mirrorTone === 'unflinching'
          ? (l.reasonSharp || l.reason || '')
          : (l.reason || '');
        return [{ entry: linked, reason }];
      });
    }
    // Computed neighbours for user-written entries
    return entries
      .filter(x => x.id !== ae.id && x.themes.some(t => ae.themes.includes(t)))
      .slice(0, 3)
      .map(t => {
        const shared = t.themes.find(x => ae.themes.includes(x));
        return {
          entry: t,
          reason: `Shares the thread of "${shared}" — the app's reading, not a label you chose.`,
        };
      });
  })();

  // What the user walked away with this session — named plainly at the close.
  const sessionTakeaways: string[] = [];
  if (session.wrote) sessionTakeaways.push('You set down a new reflection — kept, and never overwritten.');
  if (session.surfaced) sessionTakeaways.push('The app noticed older entries leaning toward it — its reading, offered quietly.');
  if (session.openedIds.length) {
    sessionTakeaways.push(
      session.openedIds.length === 1
        ? 'You followed a thread back into your own past words.'
        : `You followed ${session.openedIds.length} threads back into your own past words.`
    );
  }
  const lastOpened = session.openedIds.length
    ? byId(session.openedIds[session.openedIds.length - 1], journal) ?? null
    : null;

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh', background: '#15140f', color: '#e8e2d4',
      fontFamily: "'Newsreader', Georgia, serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient light overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: [
          `radial-gradient(120% 90% at 50% -10%, ${hexA(settings.accent, 0.05)}, transparent 55%)`,
          'radial-gradient(100% 80% at 50% 120%, rgba(0,0,0,.5), transparent 60%)',
        ].join(', '),
      }} />

      <Nav
        screen={screen}
        settings={settings}
        onSettings={updateSettings}
        onGoWrite={() => goto('capture')}
        onGoto={goto}
      />

      {screen === 'capture' && (
        <Capture
          draft={draft}
          onDraftChange={setDraft}
          onSurface={saveDraft}
          onNewEntry={newEntry}
          accent={settings.accent}
        />
      )}

      {screen === 'surfacing' && (
        <Surfacing
          draft={draft}
          mode={mode}
          setMode={setMode}
          cur={layout.cur}
          echoes={layout.echoes}
          W={surfW}
          settings={settings}
          onOpenDetail={openDetail}
          onClose={closeSession}
        />
      )}

      {screen === 'detail' && (
        <EntryDetail
          entry={ae}
          linkedEntries={linkedEntries}
          settings={settings}
          onBack={() => goto('story')}
          onOpenDetail={openDetail}
          onClose={closeSession}
        />
      )}

      {screen === 'themes' && (
        <Themes
          themes={THEMES}
          accent={settings.accent}
        />
      )}

      {screen === 'story' && (
        <Story
          entries={entries}
          pos={storyLayout.pos}
          links={storyLayout.links}
          storyH={storyLayout.H}
          W={W}
          shape={storyShape}
          setShape={setStoryShape}
          accent={settings.accent}
          onOpenDetail={openDetail}
          journalCount={journal.length}
        />
      )}

      {screen === 'closing' && (
        <Closing
          takeaways={sessionTakeaways}
          lastOpened={lastOpened}
          accent={settings.accent}
          onBegin={beginAgain}
          onStay={() => goto('story')}
        />
      )}
    </div>
  );
}
