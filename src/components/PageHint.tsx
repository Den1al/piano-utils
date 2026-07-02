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
    <div className="flex flex-col gap-1.5 bg-white/5 backdrop-blur rounded-lg px-3 py-2 border border-white/10">
      <p className="text-white/50 text-xs">{text}</p>
      {legend && (
        <div className="flex gap-2 flex-wrap">
          {legend.map(item => (
            <span key={item.label} className="flex items-center gap-1 text-[10px] text-white/40">
              <span
                className="w-2 h-2 rounded-full"
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
