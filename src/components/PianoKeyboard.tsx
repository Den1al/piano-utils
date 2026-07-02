import type { NoteName } from '../data/notes'

export interface KeyHighlight {
  note: NoteName
  color?: string
  label?: string
}

export interface PianoKeyboardProps {
  highlightedNotes?: KeyHighlight[]
  octaves?: number
  startOctave?: number
}

const WHITE_NOTES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

/** Each black key sits at the boundary between two white keys. */
const BLACK_NOTES: { note: NoteName; boundary: number }[] = [
  { note: 'C#', boundary: 1 },
  { note: 'D#', boundary: 2 },
  { note: 'F#', boundary: 4 },
  { note: 'G#', boundary: 5 },
  { note: 'A#', boundary: 6 },
]

export default function PianoKeyboard({
  highlightedNotes = [],
  octaves = 2,
  startOctave = 4,
}: PianoKeyboardProps) {
  const totalWhiteKeys = octaves * 7
  const whiteKeyWidth = 100 / totalWhiteKeys
  const blackKeyWidth = whiteKeyWidth * 0.6

  function getHighlight(note: NoteName): KeyHighlight | undefined {
    return highlightedNotes.find((h) => h.note === note)
  }

  return (
    <div
      className="relative w-full select-none"
      style={{ aspectRatio: `${totalWhiteKeys} / 5` }}
    >
      {/* White keys */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: octaves }, (_, oi) =>
          WHITE_NOTES.map((note) => {
            const hl = getHighlight(note)
            const color = hl?.color ?? '#3b82f6'
            return (
              <button
                key={`w-${startOctave + oi}-${note}`}
                className="relative flex-1 border border-gray-300/50 rounded-b-lg transition-all duration-200 flex flex-col items-center justify-end pb-1 font-semibold"
                style={{
                  background: hl
                    ? color
                    : 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
                  boxShadow: hl
                    ? `0 0 12px ${color}40, 0 0 4px ${color}80, 0 2px 4px rgba(0,0,0,0.2)`
                    : '0 2px 4px rgba(0,0,0,0.15)',
                  color: hl ? '#fff' : '#888',
                }}
              >
                {hl?.label && <span className="text-sm leading-tight">{hl.label}</span>}
                <span className={`leading-tight ${hl?.label ? 'text-[10px] opacity-70' : 'text-xs'}`}>{note}</span>
              </button>
            )
          }),
        )}
      </div>

      {/* Black keys */}
      {Array.from({ length: octaves }, (_, oi) =>
        BLACK_NOTES.map(({ note, boundary }) => {
          const hl = getHighlight(note)
          const color = hl?.color ?? '#3b82f6'
          const left =
            (oi * 7 + boundary) * whiteKeyWidth - blackKeyWidth / 2
          return (
            <button
              key={`b-${startOctave + oi}-${note}`}
              className="absolute top-0 rounded-b-md transition-all duration-200 flex flex-col items-center justify-end pb-1 font-semibold z-10"
              style={{
                left: `${left}%`,
                width: `${blackKeyWidth}%`,
                height: '62%',
                background: hl
                  ? color
                  : 'linear-gradient(to bottom, #2a2a3e, #1a1a2e)',
                boxShadow: hl
                  ? `0 0 12px ${color}40, 0 0 4px ${color}80, 0 2px 4px rgba(0,0,0,0.4)`
                  : '0 2px 4px rgba(0,0,0,0.3)',
                color: '#fff',
              }}
            >
              {hl?.label && <span className="text-xs leading-tight">{hl.label}</span>}
              <span className={`leading-tight ${hl?.label ? 'text-[9px] opacity-70' : 'text-[10px] opacity-70'}`}>{note}</span>
            </button>
          )
        }),
      )}
    </div>
  )
}
