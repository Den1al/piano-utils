import type { ReactNode } from 'react'
import type { NoteName, NoteNaming } from '../data/notes'
import type { KeyHighlight } from './PianoKeyboard'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import PianoKeyboard from './PianoKeyboard'
import PageHint from './PageHint'

interface LegendItem {
  color: string
  label: string
}

interface LayoutProps {
  selectedRoot: NoteName
  onRootChange: (note: NoteName) => void
  noteNaming: NoteNaming
  onCycleNaming: () => void
  activeRoute: string
  onNavigate: (route: string) => void
  onCircleToggle: () => void
  highlights: KeyHighlight[]
  hintText: string
  hintLegend?: LegendItem[]
  playButtons: ReactNode
  children: ReactNode
}

export default function Layout({
  selectedRoot,
  onRootChange,
  noteNaming,
  onCycleNaming,
  activeRoute,
  onNavigate,
  onCircleToggle,
  highlights,
  hintText,
  hintLegend,
  playButtons,
  children,
}: LayoutProps) {
  return (
    <div className="h-full bg-black text-white">
      <div className="flex flex-col h-full">
        <TopBar selectedRoot={selectedRoot} onRootChange={onRootChange} noteNaming={noteNaming} onCycleNaming={onCycleNaming} />

        <div className="flex-1 flex flex-col pt-14 pb-14 min-h-0">
          {/* Selectors — scrollable, absorbs extra space */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {children}
          </div>

          {/* Hint + Play — pinned above keyboard */}
          <div className="shrink-0 flex items-center gap-3 px-4 pt-2 pb-3">
            <div className="flex-1 min-w-0">
              <PageHint text={hintText} legend={hintLegend} />
            </div>
            <div className="flex gap-1.5 shrink-0">
              {playButtons}
            </div>
          </div>

          {/* Keyboard — pinned to bottom, fixed height */}
          <div className="shrink-0 pl-4 pr-16 pb-1" style={{ height: 'calc(50% - 8px)' }}>
            <PianoKeyboard highlightedNotes={highlights} octaves={2} noteNaming={noteNaming} />
          </div>
        </div>

        <BottomNav activeRoute={activeRoute} onNavigate={onNavigate} onCircleToggle={onCircleToggle} />
      </div>
    </div>
  )
}
