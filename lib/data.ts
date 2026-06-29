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

  // ── A fuller history, so the graph and themes feel alive from the first open ──
  {
    id: 'e3', date: 'Jan 9', year: '2026',
    text: 'I told her I was fine. It wasn’t a lie exactly — more that I hadn’t checked.',
    themes: ['honesty', 'attention'],
    revisions: [{ when: 'Jan 9 · 10:12pm', note: 'First written' }],
    links: [{ id: 'e8', reason: 'The same reflex: smoothing things over before you’ve looked at them.' }],
  },
  {
    id: 'e4', date: 'Oct 22', year: '2025',
    text: 'Took the long way home for no reason and felt like myself for the first time in days.',
    themes: ['rest', 'patience'],
    revisions: [{ when: 'Oct 22 · 6:40pm', note: 'First written' }],
  },
  {
    id: 'e7', date: 'Apr 2', year: '2026',
    text: 'I noticed the light on the wall before I noticed my phone. Small, but I’m counting it.',
    themes: ['attention', 'mornings'],
    revisions: [
      { when: 'Apr 2 · 7:05am', note: 'First written' },
      { when: 'Apr 2 · 7:20am', note: 'Added the last sentence' },
    ],
    links: [{ id: 'e2', reason: 'Both are small wins for attention over the phone.' }],
  },
  {
    id: 'e8', date: 'Sep 15', year: '2025',
    text: 'Said yes to three things I didn’t want. The wanting-to-be-liked is louder than I admit.',
    themes: ['honesty', 'restlessness'],
    revisions: [{ when: 'Sep 15 · 11:48pm', note: 'First written' }],
    links: [{ id: 'e1', reason: 'The motion you mistake for progress is partly other people’s asks.' }],
  },
  {
    id: 'e9', date: 'Feb 1', year: '2026',
    text: 'Slept nine hours and woke up guilty. Wrote that down to see how strange it looks.',
    themes: ['rest', 'honesty'],
    revisions: [{ when: 'Feb 1 · 8:30am', note: 'First written' }],
    links: [{ id: 'e5', reason: 'Rest as something you have to earn — here it is again, in the guilt.' }],
  },
  {
    id: 'e10', date: 'Dec 28', year: '2025',
    text: 'A whole year, and the thing I kept circling was permission. To stop. To want less.',
    themes: ['patience', 'reflection'],
    revisions: [{ when: 'Dec 28 · 9:00pm', note: 'First written — year’s end' }],
  },
  {
    id: 'e11', date: 'Mar 20', year: '2026',
    text: 'The kettle, the window, the ten quiet minutes before anyone needs me. That’s the hour I’d keep.',
    themes: ['mornings', 'stillness'],
    revisions: [{ when: 'Mar 20 · 6:50am', note: 'First written' }],
    links: [{ id: 'e2', reason: 'The same morning quiet, named as the thing worth protecting.' }],
  },
  {
    id: 'e12', date: 'Nov 11', year: '2025',
    text: 'Busy is the costume tiredness wears so no one asks if I’m okay.',
    themes: ['restlessness', 'rest'],
    revisions: [{ when: 'Nov 11 · 10:30pm', note: 'First written' }],
    links: [{ id: 'e1', reason: 'Motion-as-hiding, said plainly.' }],
  },
  {
    id: 'e13', date: 'May 6', year: '2026',
    text: 'Reread January’s entries. I sound like someone asking for help in a language only I can read.',
    themes: ['attention', 'reflection'],
    revisions: [{ when: 'May 6 · 9:15pm', note: 'First written' }],
  },
  {
    id: 'e14', date: 'Jan 27', year: '2026',
    text: 'Trying to force the insight is just restlessness wearing a thoughtful face.',
    themes: ['patience', 'restlessness'],
    revisions: [{ when: 'Jan 27 · 7:55pm', note: 'First written' }],
    links: [{ id: 'e6', reason: 'The sea doesn’t force it either.' }],
  },
  {
    id: 'e15', date: 'Oct 3', year: '2025',
    text: 'The silence wasn’t empty. I just wasn’t used to being the only one in it.',
    themes: ['stillness', 'honesty'],
    revisions: [{ when: 'Oct 3 · 8:40pm', note: 'First written' }],
  },
];

/** The four entries that lean toward the current reflection on the Surfacing
 *  screen — the curated echoes, each with a relation strength and a reason. */
export const SURFACING_ECHOES = SEED_ENTRIES.filter(e => e.rel);

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
