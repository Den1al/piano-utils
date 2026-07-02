export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

export const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const ENHARMONIC_NAMES: Record<NoteName, string> = {
  'C': 'C', 'C#': 'C#/Db', 'D': 'D', 'D#': 'D#/Eb', 'E': 'E',
  'F': 'F', 'F#': 'F#/Gb', 'G': 'G', 'G#': 'G#/Ab', 'A': 'A',
  'A#': 'A#/Bb', 'B': 'B',
}

export function noteIndex(note: NoteName): number {
  return NOTE_NAMES.indexOf(note)
}

export function noteFromIndex(index: number): NoteName {
  return NOTE_NAMES[((index % 12) + 12) % 12]
}

export function getScaleNotes(root: NoteName, intervals: number[]): NoteName[] {
  const rootIdx = noteIndex(root)
  return intervals.map(i => noteFromIndex(rootIdx + i))
}
