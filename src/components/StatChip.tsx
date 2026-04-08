import { cn } from '@/lib/utils'

interface StatChipProps {
  label: string
  value: string | number
  color?: 'default' | 'success' | 'warning' | 'danger' | 'accent'
}

const colorMap = {
  default: 'bg-zinc-800/60 text-zinc-400',
  success: 'bg-emerald-500/15 text-emerald-400',
  warning: 'bg-yellow-500/15 text-yellow-400',
  danger: 'bg-red-500/15 text-red-400',
  accent: 'bg-indigo-500/15 text-indigo-400',
}

export default function StatChip({ label, value, color = 'default' }: StatChipProps) {
  return (
    <div className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs', colorMap[color])}>
      <span className="font-semibold">{value}</span>
      <span className="opacity-70">{label}</span>
    </div>
  )
}
