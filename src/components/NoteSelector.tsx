import { NOTE_NAMES, type NoteName } from '../data/notes'

interface NoteSelectorProps {
  selected: NoteName
  onSelect: (note: NoteName) => void
}

export default function NoteSelector({ selected, onSelect }: NoteSelectorProps) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {NOTE_NAMES.map(note => (
        <button
          key={note}
          onClick={() => onSelect(note)}
          className={`px-2 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
            note === selected
              ? 'bg-blue-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20 text-white'
              : 'bg-white/10 backdrop-blur border border-transparent text-white/70 hover:bg-white/20'
          }`}
        >
          {note}
        </button>
      ))}
    </div>
  )
}
