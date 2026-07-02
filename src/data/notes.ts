export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

export type NoteNaming = 'letters' | 'solfege' | 'both'

export const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const SOLFEGE_NAMES: Record<NoteName, string> = {
  'C': 'Do', 'C#': 'Do#', 'D': 'Re', 'D#': 'Re#', 'E': 'Mi',
  'F': 'Fa', 'F#': 'Fa#', 'G': 'Sol', 'G#': 'Sol#', 'A': 'La',
  'A#': 'La#', 'B': 'Si',
}

export const ENHARMONIC_NAMES: Record<NoteName, string> = {
  'C': 'C', 'C#': 'C#/Db', 'D': 'D', 'D#': 'D#/Eb', 'E': 'E',
  'F': 'F', 'F#': 'F#/Gb', 'G': 'G', 'G#': 'G#/Ab', 'A': 'A',
  'A#': 'A#/Bb', 'B': 'B',
}

export function displayNoteName(note: NoteName, naming: NoteNaming): string {
  switch (naming) {
    case 'solfege': return SOLFEGE_NAMES[note]
    case 'both': return `${note}/${SOLFEGE_NAMES[note]}`
    default: return note
  }
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
