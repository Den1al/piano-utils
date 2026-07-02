interface LegendItem {
  color: string
  label: string
}

interface PageHintProps {
  text: string
  legend?: LegendItem[]
}

export default function PageHint({ text, legend }: PageHintProps) {
  return (
    <div className="flex flex-col gap-1.5 bg-[#1c1c1e] rounded-xl px-4 py-2.5 border border-white/[0.06]">
      <p className="text-white/70 text-sm leading-relaxed">{text}</p>
      {legend && (
        <div className="flex gap-3 flex-wrap">
          {legend.map(item => (
            <span key={item.label} className="flex items-center gap-1.5 text-xs text-white/60">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
