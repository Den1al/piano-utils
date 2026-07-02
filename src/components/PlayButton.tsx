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
      className={`flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] ${
        playing
          ? 'bg-[#0a84ff] text-white'
          : 'bg-[#1c1c1e] border border-white/[0.08] text-white/80 active:bg-[#2c2c2e]'
      }`}
    >
      <span className="text-base">{playing ? '...' : '▶'}</span>
      {label}
    </button>
  )
}
