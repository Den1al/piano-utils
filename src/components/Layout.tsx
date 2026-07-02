import { type ReactNode, useState, useCallback } from 'react'
import type { NoteName, NoteNaming } from '../data/notes'
import type { KeyHighlight } from './PianoKeyboard'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import PianoKeyboard from './PianoKeyboard'
import PageHint from './PageHint'
import { setSustain, setMuted } from '../audio/synth'

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
  startOctave: number
  onOctaveChange: (octave: number) => void
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
  startOctave,
  onOctaveChange,
  children,
}: LayoutProps) {
  const [sustain, _setSustain] = useState(false)
  const toggleSustain = useCallback(() => {
    _setSustain(prev => {
      setSustain(!prev)
      return !prev
    })
  }, [])
  const cutSound = useCallback(() => {
    setMuted(true)
    setTimeout(() => setMuted(false), 50)
  }, [])

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
            <div className="flex-1 min-w-0 hidden sm:block">
              <PageHint text={hintText} legend={hintLegend} />
            </div>
            <div className="flex gap-1.5 shrink-0">
              {playButtons}
            </div>
          </div>

          {/* Octave selector + Sustain */}
          <div className="shrink-0 flex items-center justify-center gap-3 px-4 py-0.5">
            <button
              onClick={() => onOctaveChange(startOctave - 1)}
              disabled={startOctave <= 1}
              className="w-7 h-7 rounded-lg bg-white/[0.08] text-white/70 active:bg-white/[0.15] disabled:opacity-30 text-xs font-bold transition-colors"
            >
              ◀
            </button>
            <span className="text-xs text-white/50 font-medium min-w-[60px] text-center">
              C{startOctave}–C{startOctave + 2}
            </span>
            <button
              onClick={() => onOctaveChange(startOctave + 1)}
              disabled={startOctave >= 6}
              className="w-7 h-7 rounded-lg bg-white/[0.08] text-white/70 active:bg-white/[0.15] disabled:opacity-30 text-xs font-bold transition-colors"
            >
              ▶
            </button>
            <button
              onClick={toggleSustain}
              className={`ml-2 min-h-[28px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                sustain
                  ? 'bg-[#0a84ff] text-white'
                  : 'bg-white/[0.08] text-white/50 active:bg-white/[0.15]'
              }`}
            >
              Sustain
            </button>
            <button
              onClick={cutSound}
              className="min-h-[28px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors bg-white/[0.08] text-white/50 active:bg-red-500/80 active:text-white"
            >
              Cut
            </button>
          </div>

          {/* Keyboard — pinned to bottom, fixed height, full width */}
          <div className="shrink-0 px-2 sm:px-4 pb-1 h-[35%] sm:h-[calc(50%-8px)]">
            <PianoKeyboard highlightedNotes={highlights} octaves={2} startOctave={startOctave} noteNaming={noteNaming} />
          </div>
        </div>

        <BottomNav activeRoute={activeRoute} onNavigate={onNavigate} onCircleToggle={onCircleToggle} />
      </div>
    </div>
  )
}
