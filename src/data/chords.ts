export interface ChordDefinition {
  name: string
  symbol: string
  intervals: number[]
  category: 'triad' | 'seventh' | 'extended' | 'suspended'
}

export const CHORDS: ChordDefinition[] = [
  { name: 'Major', symbol: '', intervals: [0, 4, 7], category: 'triad' },
  { name: 'Minor', symbol: 'm', intervals: [0, 3, 7], category: 'triad' },
  { name: 'Diminished', symbol: 'dim', intervals: [0, 3, 6], category: 'triad' },
  { name: 'Augmented', symbol: 'aug', intervals: [0, 4, 8], category: 'triad' },
  { name: 'Dominant 7th', symbol: '7', intervals: [0, 4, 7, 10], category: 'seventh' },
  { name: 'Major 7th', symbol: 'maj7', intervals: [0, 4, 7, 11], category: 'seventh' },
  { name: 'Minor 7th', symbol: 'm7', intervals: [0, 3, 7, 10], category: 'seventh' },
  { name: 'Diminished 7th', symbol: 'dim7', intervals: [0, 3, 6, 9], category: 'seventh' },
  { name: 'Half-Dim 7th', symbol: 'm7b5', intervals: [0, 3, 6, 10], category: 'seventh' },
  { name: 'Minor-Major 7th', symbol: 'mMaj7', intervals: [0, 3, 7, 11], category: 'seventh' },
  { name: 'Add 9', symbol: 'add9', intervals: [0, 4, 7, 14], category: 'extended' },
  { name: 'Suspended 2nd', symbol: 'sus2', intervals: [0, 2, 7], category: 'suspended' },
  { name: 'Suspended 4th', symbol: 'sus4', intervals: [0, 5, 7], category: 'suspended' },
]

export const INTERVAL_LABELS: Record<number, string> = {
  0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4',
  6: 'b5', 7: '5', 8: '#5', 9: '6', 10: 'b7', 11: '7',
  12: '8', 13: 'b9', 14: '9',
}

export function getInversion(intervals: number[], inversion: number): number[] {
  const notes = [...intervals]
  for (let i = 0; i < inversion; i++) {
    const lowest = notes.shift()!
    notes.push(lowest + 12)
  }
  return notes
}
