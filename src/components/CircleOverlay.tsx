import { useState, useRef, useCallback } from 'react'
import CircleOfFifths from './CircleOfFifths'
import { noteFromIndex, noteIndex } from '../data/notes'
import type { NoteName } from '../data/notes'
import { CHORDS } from '../data/chords'
import { DIATONIC_CHORD_QUALITIES, KEY_SIGNATURES, RELATIVE_MINORS } from '../data/theory'
import { SCALE_DEGREE_COLORS } from '../data/colors'

interface CircleOverlayProps {
  selectedRoot: NoteName
  onRootChange: (root: NoteName) => void
  onChordSelect?: (chordName: string) => void
  onClose: () => void
}

const MIN_WIDTH = 240
const MAX_WIDTH = 500

function getKeySignatureLabel(key: NoteName): string {
  const sig = KEY_SIGNATURES[key]
  if (sig.sharps === 0 && sig.flats === 0) return '0 sharps, 0 flats'
  if (sig.sharps > 0) return `${sig.sharps} sharp${sig.sharps > 1 ? 's' : ''}`
  return `${sig.flats} flat${sig.flats > 1 ? 's' : ''}`
}

type Interaction = 'drag' | 'resize'

export default function CircleOverlay({ selectedRoot, onRootChange, onChordSelect, onClose }: CircleOverlayProps) {
  const relativeMinor = RELATIVE_MINORS[selectedRoot]
  const [pos, setPos] = useState(() => ({
    x: Math.max(20, window.innerWidth - 300),
    y: 80,
  }))
  const [width, setWidth] = useState(280)
  const [minimized, setMinimized] = useState(false)
  const interactionRef = useRef<{
    type: Interaction
    startX: number
    startY: number
    origX: number
    origY: number
    origWidth: number
  } | null>(null)

  const diatonicChords = DIATONIC_CHORD_QUALITIES.map((dq, i) => {
    const chordRootIndex = (noteIndex(selectedRoot) + dq.intervalFromRoot) % 12
    const chordRoot = noteFromIndex(chordRootIndex)
    const chordDef = CHORDS.find(c => c.name === dq.quality)
    const symbol = chordDef?.symbol ?? ''
    return {
      numeral: dq.numeral,
      name: `${chordRoot}${symbol}`,
      quality: dq.quality,
      color: SCALE_DEGREE_COLORS[i],
    }
  })

  const handleDragDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('svg g[class*="cursor"]')) return
    e.preventDefault()
    interactionRef.current = { type: 'drag', startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y, origWidth: width }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [pos, width])

  const handleResizeDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    interactionRef.current = { type: 'resize', startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y, origWidth: width }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [pos, width])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!interactionRef.current) return
    const dx = e.clientX - interactionRef.current.startX
    const dy = e.clientY - interactionRef.current.startY

    if (interactionRef.current.type === 'drag') {
      setPos({ x: interactionRef.current.origX + dx, y: interactionRef.current.origY + dy })
    } else {
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, interactionRef.current.origWidth + dx))
      setWidth(newWidth)
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    interactionRef.current = null
  }, [])

  const isLarge = width > 350

  return (
    <div
      className="fixed z-50 touch-none animate-fade-in"
      style={{ left: pos.x, top: pos.y }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="bg-black/60 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl shadow-black/40 relative"
        style={{ width: minimized ? 'auto' : width }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-white/10"
          onPointerDown={handleDragDown}
        >
          <span className="text-white/70 text-xs font-medium select-none">Circle of Fifths</span>
          <div className="flex gap-1">
            <button
              onClick={() => setMinimized(prev => !prev)}
              className="text-white/40 hover:text-white/80 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-xs transition-colors"
            >
              {minimized ? '▢' : '—'}
            </button>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/80 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-sm transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            <div className="p-3 flex flex-col gap-2">
              {/* Circle */}
              <div className="w-full">
                <CircleOfFifths selectedKey={selectedRoot} onSelectKey={onRootChange} />
              </div>

              {/* Key info */}
              <div className="text-center">
                <p className={`text-white font-semibold ${isLarge ? 'text-base' : 'text-sm'}`}>
                  {selectedRoot} Major — {getKeySignatureLabel(selectedRoot)}
                </p>
                <p className={`text-white/40 ${isLarge ? 'text-sm' : 'text-xs'}`}>
                  Relative minor: {relativeMinor}m
                </p>
              </div>

              {/* Diatonic chords */}
              <div className={`flex justify-center flex-wrap ${isLarge ? 'gap-1.5' : 'gap-1'}`}>
                {diatonicChords.map(chord => (
                  <button
                    key={chord.numeral}
                    onClick={() => onChordSelect?.(chord.quality)}
                    className={`flex flex-col items-center rounded font-medium border border-white/10 bg-white/5 hover:bg-white/15 transition-all text-white/70 hover:text-white ${isLarge ? 'px-2.5 py-1 text-sm' : 'px-1.5 py-0.5 text-xs'}`}
                  >
                    <span className={`opacity-50 ${isLarge ? 'text-[10px]' : 'text-[8px]'}`}>{chord.numeral}</span>
                    <span className={isLarge ? 'text-xs' : 'text-[11px]'}>{chord.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resize handle — bottom-right corner */}
            <div
              className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize touch-none"
              onPointerDown={handleResizeDown}
            >
              <svg className="w-4 h-4 absolute bottom-1 right-1 text-white/20" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="7" cy="12" r="1.5" />
                <circle cx="12" cy="7" r="1.5" />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
