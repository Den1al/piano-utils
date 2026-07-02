import type { ReactNode } from 'react'
import type { NoteName } from '../data/notes'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

interface LayoutProps {
  selectedRoot: NoteName
  onRootChange: (note: NoteName) => void
  activeRoute: string
  onNavigate: (route: string) => void
  onCircleToggle: () => void
  children: ReactNode
}

export default function Layout({
  selectedRoot,
  onRootChange,
  activeRoute,
  onNavigate,
  onCircleToggle,
  children,
}: LayoutProps) {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-teal-900 bg-[length:200%_200%] animate-gradient-shift" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar selectedRoot={selectedRoot} onRootChange={onRootChange} />
        <main className="flex-1 flex flex-col overflow-auto pt-16 pb-20">
          {children}
        </main>
        <BottomNav activeRoute={activeRoute} onNavigate={onNavigate} onCircleToggle={onCircleToggle} />
      </div>
    </div>
  )
}
