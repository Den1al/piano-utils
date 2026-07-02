import type { NoteName } from '../data/notes'
import { ENHARMONIC_NAMES } from '../data/notes'
import { CIRCLE_OF_FIFTHS, RELATIVE_MINORS } from '../data/theory'

interface CircleOfFifthsProps {
  selectedKey: NoteName
  onSelectKey: (key: NoteName) => void
}

const OUTER_RADIUS = 150
const INNER_RADIUS = 105
const NODE_RADIUS = 22
const MINOR_NODE_RADIUS = 17

export default function CircleOfFifths({ selectedKey, onSelectKey }: CircleOfFifthsProps) {
  function getPosition(index: number, radius: number) {
    const angle = (index * 30 - 90) * (Math.PI / 180)
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    }
  }

  const relativeMinor = RELATIVE_MINORS[selectedKey]

  return (
    <svg viewBox="-200 -200 400 400" className="w-full h-full">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ring outlines */}
      <circle
        cx={0}
        cy={0}
        r={OUTER_RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1}
      />
      <circle
        cx={0}
        cy={0}
        r={INNER_RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={1}
      />

      {/* Key nodes */}
      {CIRCLE_OF_FIFTHS.map((key, i) => {
        const outer = getPosition(i, OUTER_RADIUS)
        const inner = getPosition(i, INNER_RADIUS)
        const isSelected = key === selectedKey
        const minor = RELATIVE_MINORS[key]
        const isMinorSelected = minor === relativeMinor && isSelected

        const displayName = ENHARMONIC_NAMES[key].includes('/')
          ? ENHARMONIC_NAMES[key].split('/')[0]
          : key

        return (
          <g key={key}>
            {/* Connecting line between major and minor */}
            <line
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />

            {/* Major key node */}
            <g
              onClick={() => onSelectKey(key)}
              className="cursor-pointer"
              style={{ transition: 'transform 0.2s ease' }}
            >
              <circle
                cx={outer.x}
                cy={outer.y}
                r={isSelected ? NODE_RADIUS + 2 : NODE_RADIUS}
                fill={isSelected ? '#3b82f6' : 'rgba(255,255,255,0.1)'}
                stroke={isSelected ? '#60a5fa' : 'rgba(255,255,255,0.15)'}
                strokeWidth={isSelected ? 2 : 1}
                filter={isSelected ? 'url(#glow)' : undefined}
                className="transition-all duration-300"
              />
              <text
                x={outer.x}
                y={outer.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)'}
                fontSize={isSelected ? 14 : 13}
                fontWeight={isSelected ? 700 : 500}
                className="pointer-events-none select-none"
              >
                {displayName}
              </text>
            </g>

            {/* Minor key node */}
            <g
              onClick={() => onSelectKey(key)}
              className="cursor-pointer"
            >
              <circle
                cx={inner.x}
                cy={inner.y}
                r={isMinorSelected ? MINOR_NODE_RADIUS + 1 : MINOR_NODE_RADIUS}
                fill={isMinorSelected ? '#6366f1' : 'rgba(255,255,255,0.06)'}
                stroke={isMinorSelected ? '#818cf8' : 'rgba(255,255,255,0.1)'}
                strokeWidth={isMinorSelected ? 1.5 : 0.5}
                filter={isMinorSelected ? 'url(#glow)' : undefined}
                className="transition-all duration-300"
              />
              <text
                x={inner.x}
                y={inner.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isMinorSelected ? '#ffffff' : 'rgba(255,255,255,0.6)'}
                fontSize={11}
                fontWeight={isMinorSelected ? 600 : 400}
                className="pointer-events-none select-none"
              >
                {minor}m
              </text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}
