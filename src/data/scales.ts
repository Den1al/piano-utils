export interface ScaleDefinition {
  name: string
  intervals: number[]
  category: 'common' | 'mode' | 'world' | 'other'
}

export const SCALES: ScaleDefinition[] = [
  { name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11], category: 'common' },
  { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10], category: 'common' },
  { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11], category: 'common' },
  { name: 'Melodic Minor', intervals: [0, 2, 3, 5, 7, 9, 11], category: 'common' },
  { name: 'Pentatonic Major', intervals: [0, 2, 4, 7, 9], category: 'common' },
  { name: 'Pentatonic Minor', intervals: [0, 3, 5, 7, 10], category: 'common' },
  { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10], category: 'common' },
  { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10], category: 'mode' },
  { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10], category: 'mode' },
  { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11], category: 'mode' },
  { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10], category: 'mode' },
  { name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10], category: 'mode' },
  { name: 'Double Harmonic', intervals: [0, 1, 4, 5, 7, 8, 11], category: 'world' },
  { name: 'Hijaz', intervals: [0, 1, 4, 5, 7, 8, 10], category: 'world' },
  { name: 'Hungarian Minor', intervals: [0, 2, 3, 6, 7, 8, 11], category: 'world' },
  { name: 'Mi Sheberach', intervals: [0, 2, 3, 6, 7, 9, 10], category: 'world' },
  { name: 'Whole Tone', intervals: [0, 2, 4, 6, 8, 10], category: 'other' },
  { name: 'Diminished', intervals: [0, 2, 3, 5, 6, 8, 9, 11], category: 'other' },
]

export type Fingering = number[]

export interface ScaleFingering {
  rh: Fingering
  lh: Fingering
}

// Standard major scale fingerings per root (RH ascending, LH ascending)
export const MAJOR_SCALE_FINGERINGS: Record<string, ScaleFingering> = {
  'C':  { rh: [1,2,3,1,2,3,4,5], lh: [5,4,3,2,1,3,2,1] },
  'D':  { rh: [1,2,3,1,2,3,4,5], lh: [5,4,3,2,1,3,2,1] },
  'E':  { rh: [1,2,3,1,2,3,4,5], lh: [5,4,3,2,1,3,2,1] },
  'G':  { rh: [1,2,3,1,2,3,4,5], lh: [5,4,3,2,1,3,2,1] },
  'A':  { rh: [1,2,3,1,2,3,4,5], lh: [5,4,3,2,1,3,2,1] },
  'F':  { rh: [1,2,3,4,1,2,3,4], lh: [5,4,3,2,1,3,2,1] },
  'B':  { rh: [1,2,3,1,2,3,4,5], lh: [4,3,2,1,4,3,2,1] },
  'C#': { rh: [2,3,1,2,3,4,1,2], lh: [3,2,1,4,3,2,1,3] },
  'D#': { rh: [3,1,2,3,4,1,2,3], lh: [2,1,4,3,2,1,3,2] },
  'F#': { rh: [2,3,4,1,2,3,1,2], lh: [4,3,2,1,3,2,1,4] },
  'G#': { rh: [2,3,1,2,3,1,2,3], lh: [3,2,1,3,2,1,3,2] },
  'A#': { rh: [4,1,2,3,1,2,3,4], lh: [3,2,1,4,3,2,1,3] },
}

export function getDefaultFingering(scaleLength: number): ScaleFingering {
  if (scaleLength === 5) {
    return { rh: [1, 2, 3, 1, 2, 3], lh: [3, 2, 1, 3, 2, 1] }
  }
  if (scaleLength === 6) {
    return { rh: [1, 2, 3, 1, 2, 3, 4], lh: [4, 3, 2, 1, 3, 2, 1] }
  }
  if (scaleLength === 8) {
    return { rh: [1, 2, 3, 1, 2, 3, 4, 1, 2], lh: [5, 4, 3, 2, 1, 4, 3, 2, 1] }
  }
  return { rh: [1, 2, 3, 1, 2, 3, 4, 5], lh: [5, 4, 3, 2, 1, 3, 2, 1] }
}
