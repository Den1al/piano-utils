// Unified color system — same interval always gets the same color across all pages
// Mapped by musical function, not arbitrary index

export const INTERVAL_COLORS: Record<string, string> = {
  'R':  '#3b82f6', // Root - blue
  '2':  '#8b5cf6', // 2nd - violet
  'b2': '#8b5cf6',
  'b3': '#ec4899', // 3rd - pink
  '3':  '#ec4899',
  '4':  '#f59e0b', // 4th - amber
  'b5': '#14b8a6', // 5th - teal
  '5':  '#14b8a6',
  '#5': '#14b8a6',
  '6':  '#6366f1', // 6th - indigo
  'b7': '#f97316', // 7th - orange
  '7':  '#f97316',
  '8':  '#3b82f6', // Octave = root
  'b9': '#8b5cf6',
  '9':  '#8b5cf6',
}

// Scale degree colors (0-indexed) — derived from interval colors for consistency
export const SCALE_DEGREE_COLORS = [
  '#3b82f6', // 1st (root) - blue
  '#8b5cf6', // 2nd - violet
  '#ec4899', // 3rd - pink
  '#f59e0b', // 4th - amber
  '#14b8a6', // 5th - teal
  '#6366f1', // 6th - indigo
  '#f97316', // 7th - orange
  '#06b6d4', // 8th (for 8-note scales like diminished) - cyan
]

// Legend items for each page context
export const SCALE_LEGEND = [
  { color: '#3b82f6', label: 'Root' },
  { color: '#8b5cf6', label: '2nd' },
  { color: '#ec4899', label: '3rd' },
  { color: '#f59e0b', label: '4th' },
  { color: '#14b8a6', label: '5th' },
  { color: '#6366f1', label: '6th' },
  { color: '#f97316', label: '7th' },
]

export const CHORD_LEGEND = [
  { color: '#3b82f6', label: 'Root' },
  { color: '#ec4899', label: '3rd' },
  { color: '#14b8a6', label: '5th' },
  { color: '#f97316', label: '7th' },
]
