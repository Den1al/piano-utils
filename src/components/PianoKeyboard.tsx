import { displayNoteName } from '../data/notes'
import type { NoteName, NoteNaming } from '../data/notes'

export interface KeyHighlight {
  note: NoteName
  color?: string
  label?: string
}

export interface PianoKeyboardProps {
  highlightedNotes?: KeyHighlight[]
  octaves?: number
  startOctave?: number
  noteNaming?: NoteNaming
}

const WHITE_NOTES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

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
  noteNaming = 'letters',
}: PianoKeyboardProps) {
  const totalWhiteKeys = octaves * 7
  const whiteKeyWidth = 100 / totalWhiteKeys
  const blackKeyWidth = whiteKeyWidth * 0.6

  function getHighlight(note: NoteName): KeyHighlight | undefined {
    return highlightedNotes.find((h) => h.note === note)
  }

  const nameSize = noteNaming === 'both' ? 'text-[9px]' : 'text-xs'
  const blackNameSize = noteNaming === 'both' ? 'text-[8px]' : 'text-[10px]'

  return (
    <div
      className="relative w-full h-full select-none"
    >
      {/* White keys */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: octaves }, (_, oi) =>
          WHITE_NOTES.map((note) => {
            const hl = getHighlight(note)
            const color = hl?.color ?? '#3b82f6'
            const name = displayNoteName(note, noteNaming)
            return (
              <button
                key={`w-${startOctave + oi}-${note}`}
                className="relative flex-1 border border-[#2a2a2e] rounded-b-lg transition-colors duration-150 flex flex-col items-center justify-end pb-1.5 font-bold"
                style={{
                  background: hl
                    ? color
                    : 'linear-gradient(to bottom, #ffffff, #f0f0f0)',
                  boxShadow: hl
                    ? `inset 0 -2px 4px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.3)`
                    : '0 1px 3px rgba(0,0,0,0.2)',
                  color: hl ? '#fff' : '#666',
                }}
              >
                {hl?.label && <span className="text-lg leading-tight">{hl.label}</span>}
                <span className={`leading-tight ${hl?.label ? `${nameSize} opacity-80` : 'text-sm'}`}>{name}</span>
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
          const name = displayNoteName(note, noteNaming)
          return (
            <button
              key={`b-${startOctave + oi}-${note}`}
              className="absolute top-0 rounded-b-md transition-colors duration-150 flex flex-col items-center justify-end pb-1 font-bold z-10"
              style={{
                left: `${left}%`,
                width: `${blackKeyWidth}%`,
                height: '62%',
                background: hl
                  ? color
                  : 'linear-gradient(to bottom, #1a1a1e, #111114)',
                boxShadow: hl
                  ? 'inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)'
                  : '0 2px 4px rgba(0,0,0,0.4)',
                color: '#fff',
              }}
            >
              {hl?.label && <span className="text-sm leading-tight">{hl.label}</span>}
              <span className={`leading-tight ${hl?.label ? `${blackNameSize} opacity-80` : `${blackNameSize} opacity-80`}`}>{name}</span>
            </button>
          )
        }),
      )}
    </div>
  )
}
