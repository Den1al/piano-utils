# Piano Utils

A quick-reference web app for piano practice — scales with fingerings, chords with inversions, arpeggios, and an interactive circle of fifths. Designed for iPad propped at the piano, works on any screen.

**[Try it live](https://den1al.github.io/piano-utils/)**

## Features

- **Scales** — 14 scale types with RH/LH fingerings, colored by scale degree
- **Chords** — Triads, 7ths, suspended, extended chords with inversions and interval labels
- **Arpeggios** — 2-octave patterns with ascending and descending playback
- **Circle of Fifths** — Floating widget showing key relationships, signatures, and diatonic chords
- **Note naming** — Toggle between letter names (C, D, E), solfege (Do, Re, Mi), or both
- **Audio** — Real piano samples (FluidR3 Grand Piano) with hall reverb
- **No scrolling** — App-like layout with a fixed keyboard that stays in place across all views

## Tech

React 19, TypeScript, Tailwind CSS v4, Vite, Web Audio API. Deployed on GitHub Pages.

## Development

```bash
npm install
npm run dev
```

Requires Node 22+.
