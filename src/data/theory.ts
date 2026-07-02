import type { NoteName } from './notes'

export const CIRCLE_OF_FIFTHS: NoteName[] = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'
]

export const RELATIVE_MINORS: Record<NoteName, NoteName> = {
  'C': 'A', 'G': 'E', 'D': 'B', 'A': 'F#', 'E': 'C#', 'B': 'G#',
  'F#': 'D#', 'C#': 'A#', 'G#': 'F', 'D#': 'C', 'A#': 'G', 'F': 'D',
}

export const KEY_SIGNATURES: Record<NoteName, { sharps: number; flats: number }> = {
  'C':  { sharps: 0, flats: 0 },
  'G':  { sharps: 1, flats: 0 },
  'D':  { sharps: 2, flats: 0 },
  'A':  { sharps: 3, flats: 0 },
  'E':  { sharps: 4, flats: 0 },
  'B':  { sharps: 5, flats: 0 },
  'F#': { sharps: 6, flats: 0 },
  'C#': { sharps: 7, flats: 0 },
  'F':  { sharps: 0, flats: 1 },
  'A#': { sharps: 0, flats: 2 },
  'D#': { sharps: 0, flats: 3 },
  'G#': { sharps: 0, flats: 4 },
}

export const DIATONIC_CHORD_QUALITIES = [
  { numeral: 'I', quality: 'Major', intervalFromRoot: 0 },
  { numeral: 'ii', quality: 'Minor', intervalFromRoot: 2 },
  { numeral: 'iii', quality: 'Minor', intervalFromRoot: 4 },
  { numeral: 'IV', quality: 'Major', intervalFromRoot: 5 },
  { numeral: 'V', quality: 'Major', intervalFromRoot: 7 },
  { numeral: 'vi', quality: 'Minor', intervalFromRoot: 9 },
  { numeral: 'vii°', quality: 'Diminished', intervalFromRoot: 11 },
]
