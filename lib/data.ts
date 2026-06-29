import { Entry, ThemeData } from './types';

export const DEFAULT_DRAFT =
  "I’ve been moving fast all week and I can’t tell if any of it mattered. I want to slow down, but I don’t know how to trust that slowing down isn’t just another word for falling behind.";

export const SEED_ENTRIES: Entry[] = [
  {
    id: 'e1', date: 'Mar 3', year: '2026', rel: 'strong',
    text: 'I keep mistaking motion for progress. Today I did six things and remembered none of them.',
    themes: ['restlessness', 'attention'],
    reason: 'Both name the gap between doing and meaning — the suspicion that being busy is hiding from something.',
    reasonSharp: 'You’ve written this exact worry three times now, and not once changed what you did the next day.',
    revisions: [
      { when: 'Mar 3 · 7:42am', note: 'First written' },
      { when: 'Mar 4 · 8:10am', note: 'Added the second sentence the next morning' },
    ],
    links: [
      { id: 'e5', reason: 'Both circle the fear that resting is failing.' },
      { id: 'e2', reason: 'Attention is the thing motion quietly costs you.' },
    ],
  },
  {
    id: 'e5', date: 'Dec 14', year: '2025', rel: 'strong',
    text: 'Rest still feels like something I have to earn. Who taught me that?',
    themes: ['rest', 'restlessness'],
    reason: 'A recurring worry that slowing down means falling behind — the same knot, asked a different way.',
    reasonSharp: '“Who taught me that?” keeps returning because you keep declining to answer it.',
    revisions: [{ when: 'Dec 14 · 9:14pm', note: 'First written' }],
    links: [
      { id: 'e1', reason: 'The motion you mistake for progress is the rest you won’t allow.' },
      { id: 'e6', reason: 'The sea rests without needing to earn it.' },
    ],
  },
  {
    id: 'e2', date: 'Feb 18', year: '2026', rel: 'medium',
    text: "The mornings I don’t reach for my phone are the mornings I actually hear myself think.",
    themes: ['stillness', 'mornings', 'attention'],
    reason: 'Stillness offered as a way back to yourself — the slowing-down you keep reaching toward.',
    reasonSharp: 'You already know what mornings do for you. You’ve decided that knowing isn’t the same as doing.',
    revisions: [
      { when: 'Feb 18 · 6:55am', note: 'First written' },
      { when: 'Feb 20 · 7:30am', note: 'Softened “silence” to “hear myself think”' },
    ],
    links: [
      { id: 'e1', reason: 'What motion takes, a quiet morning gives back.' },
      { id: 'e6', reason: 'Both trust a slower pace to arrive anyway.' },
    ],
  },
  {
    id: 'e6', date: 'Nov 30', year: '2025', rel: 'soft',
    text: "The sea doesn’t rush, and it still gets everywhere it needs to be.",
    themes: ['patience', 'stillness'],
    reason: 'An older image of unhurried arrival — a gentler answer to the same question you’re asking now.',
    reasonSharp: 'You wrote this when it was easy to believe. The test is whether it survives a busy week — like this one.',
    revisions: [{ when: 'Nov 30 · 8:02pm', note: 'First written' }],
    links: [
      { id: 'e5', reason: 'Permission to rest, borrowed from the tide.' },
      { id: 'e2', reason: 'Both are about trusting a slower pace.' },
    ],
  },
];

export const THEMES: ThemeData[] = [
  { name: 'restlessness', count: 9, excerpt: 'mistaking motion for progress', months: [1,2,1,3,1,1] },
  { name: 'stillness',    count: 7, excerpt: 'the mornings I hear myself think', months: [0,1,1,2,1,2] },
  { name: 'rest',         count: 5, excerpt: 'something I have to earn', months: [1,0,1,0,2,1] },
  { name: 'honesty',      count: 4, excerpt: 'I told her I was fine', months: [2,0,1,0,1,0] },
  { name: 'patience',     count: 3, excerpt: 'the sea doesn’t rush', months: [1,0,1,0,1,0] },
];

export const THEME_COLORS: Record<string, string> = {
  restlessness: 'accent',
  stillness: '#7f9b8e',
  rest: '#bf8170',
  attention: '#9a8fc0',
  honesty: '#c98a6b',
  patience: '#8a93a8',
  mornings: '#cbb26a',
  reflection: '#9c9484',
};

export const LEX: Record<string, string[]> = {
  restlessness: ['fast','busy','motion','rush','behind','scattered','racing','overwhelm','too much','spinning','hurry'],
  stillness: ['quiet','slow','still','calm','breathe','pause','silence','settle'],
  rest: ['rest','tired','earn','sleep','exhausted','break','weary','burn'],
  attention: ['notice','attention','present','focus','distract','phone','remember','forget','here'],
  honesty: ['honest','truth','admit','afraid','fear','pretend','fine','hide','mask'],
  patience: ['patient','wait','trust','eventually','time','slowly'],
  mornings: ['morning','wake','dawn','early','sunrise'],
};

/**
 * The recurring mark that flags anything the app inferred (a connection, a
 * reason, a pattern) — never the user's own words. Used everywhere a
 * construction appears so constructions stay unmistakably labelled as
 * constructions. The trust premise is "your truth is preserved"; this glyph
 * is the visible seam between your words and the app's reading of them.
 */
export const READING_MARK = '⊙';

export const ACCENT_OPTIONS = [
  { value: '#c9a24b', label: 'Gold' },
  { value: '#7f9b8e', label: 'Sage' },
  { value: '#bf8170', label: 'Clay' },
  { value: '#9a8fc0', label: 'Lavender' },
];
