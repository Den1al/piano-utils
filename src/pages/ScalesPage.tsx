import PianoKeyboard from '../components/PianoKeyboard'
import type { KeyHighlight } from '../components/PianoKeyboard'
import ScaleSelector from '../components/ScaleSelector'
import HandToggle from '../components/HandToggle'
import { getScaleNotes } from '../data/notes'
import type { NoteName } from '../data/notes'
import { SCALES, MAJOR_SCALE_FINGERINGS, getDefaultFingering } from '../data/scales'

const SCALE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#6366f1', '#f97316', '#06b6d4']

interface ScalesPageProps {
  selectedRoot: NoteName
  selectedScale: string
  onScaleChange: (scale: string) => void
  hand: 'rh' | 'lh'
  onHandChange: (hand: 'rh' | 'lh') => void
}

export default function ScalesPage({
  selectedRoot,
  selectedScale,
  onScaleChange,
  hand,
  onHandChange,
}: ScalesPageProps) {
  const scaleDef = SCALES.find(s => s.name === selectedScale) ?? SCALES[0]
  const scaleNotes = getScaleNotes(selectedRoot, scaleDef.intervals)

  const fingering =
    scaleDef.name === 'Major' && MAJOR_SCALE_FINGERINGS[selectedRoot]
      ? MAJOR_SCALE_FINGERINGS[selectedRoot]
      : getDefaultFingering(scaleDef.intervals.length)

  const fingers = hand === 'rh' ? fingering.rh : fingering.lh

  const highlights: KeyHighlight[] = scaleNotes.map((note, i) => ({
    note,
    color: SCALE_COLORS[i % SCALE_COLORS.length],
    label: fingers[i] != null ? String(fingers[i]) : undefined,
  }))

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-4">
      {/* Top: ScaleSelector + HandToggle */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <ScaleSelector selected={selectedScale} onSelect={onScaleChange} />
        </div>
        <div className="flex-shrink-0 pt-4">
          <HandToggle hand={hand} onToggle={onHandChange} />
        </div>
      </div>

      {/* Middle: Piano keyboard */}
      <div className="w-full max-w-3xl mx-auto">
        <PianoKeyboard highlightedNotes={highlights} octaves={2} />
      </div>

      {/* Bottom: Note chips */}
      <div className="flex gap-2 justify-center flex-wrap">
        {scaleNotes.map((note, i) => (
          <span
            key={`${note}-${i}`}
            className="px-3 py-1.5 rounded text-sm font-medium bg-white/10 backdrop-blur border border-white/10 text-white"
            style={{
              borderColor: SCALE_COLORS[i % SCALE_COLORS.length] + '80',
              boxShadow: `0 0 8px ${SCALE_COLORS[i % SCALE_COLORS.length]}30`,
            }}
          >
            {note}
          </span>
        ))}
      </div>
    </div>
  )
}
