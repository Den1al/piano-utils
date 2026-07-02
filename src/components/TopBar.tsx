import type { NoteName, NoteNaming } from '../data/notes'
import NoteSelector from './NoteSelector'

interface TopBarProps {
  selectedRoot: NoteName
  onRootChange: (note: NoteName) => void
  noteNaming: NoteNaming
  onCycleNaming: () => void
}

const NAMING_LABELS: Record<NoteNaming, string> = {
  letters: 'ABC',
  solfege: 'Do Re',
  both: 'A/Do',
}

export default function TopBar({ selectedRoot, onRootChange, noteNaming, onCycleNaming }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[rgba(28,28,30,0.72)] backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.08]">
      <div className="flex items-center px-3 sm:px-4 py-2 gap-2">
        <h1 className="text-sm sm:text-base font-semibold text-white whitespace-nowrap tracking-tight">
          Piano Utils
        </h1>
        <button
          onClick={onCycleNaming}
          className="min-h-[32px] px-2 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap bg-white/[0.08] text-white/70 active:bg-white/[0.15] border border-white/[0.06]"
          title="Cycle note naming: Letters, Solfege, Both"
        >
          {NAMING_LABELS[noteNaming]}
        </button>
        <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none">
          <NoteSelector selected={selectedRoot} onSelect={onRootChange} noteNaming={noteNaming} />
        </div>
      </div>
    </div>
  )
}
