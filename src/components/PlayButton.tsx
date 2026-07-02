import { useState } from 'react'

interface PlayButtonProps {
  onPlay: () => void | Promise<void>
  label?: string
}

export default function PlayButton({ onPlay, label = 'Play' }: PlayButtonProps) {
  const [playing, setPlaying] = useState(false)

  async function handleClick() {
    if (playing) return
    setPlaying(true)
    try {
      await onPlay()
    } finally {
      setPlaying(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={playing}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur border transition-all duration-200 ${
        playing
          ? 'bg-blue-500/30 border-blue-400/50 text-white'
          : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/20 active:scale-95'
      }`}
    >
      <span className="text-base">{playing ? '...' : '▶'}</span>
      {label}
    </button>
  )
}
