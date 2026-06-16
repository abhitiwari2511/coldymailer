export function SectionEyebrow({ label, tag }: { label: string; tag?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-brand" />
      <span className="text-white font-medium text-sm tracking-wide">{label}</span>
      {tag && (
        <span className="px-2 py-0.5 rounded-full border border-white/10 text-white/50 text-xs font-medium">
          {tag}
        </span>
      )}
    </div>
  )
}