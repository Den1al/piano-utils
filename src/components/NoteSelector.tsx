import { NOTE_NAMES, displayNoteName } from '../data/notes'
import type { NoteName, NoteNaming } from '../data/notes'

interface NoteSelectorProps {
  selected: NoteName
  onSelect: (note: NoteName) => void
  noteNaming?: NoteNaming
}

export default function NoteSelector({ selected, onSelect, noteNaming = 'letters' }: NoteSelectorProps) {
  return (
    <div className="flex gap-0.5 overflow-x-auto">
      {NOTE_NAMES.map(note => (
        <button
          key={note}
          onClick={() => onSelect(note)}
          className={`min-h-[36px] px-2 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] ${
            note === selected
              ? 'bg-[#0a84ff] text-white'
              : 'bg-white/[0.08] text-white/70 active:bg-white/[0.15]'
          }`}
        >
          {displayNoteName(note, noteNaming)}
        </button>
      ))}
    </div>
  )
}
