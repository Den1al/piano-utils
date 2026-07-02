import type { NoteName } from '../data/notes'
import NoteSelector from './NoteSelector'

interface TopBarProps {
  selectedRoot: NoteName
  onRootChange: (note: NoteName) => void
}

export default function TopBar({ selectedRoot, onRootChange }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-white whitespace-nowrap">
          ♪ Piano Utils
        </h1>
        <NoteSelector selected={selectedRoot} onSelect={onRootChange} />
      </div>
    </div>
  )
}
