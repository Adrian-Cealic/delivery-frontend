import { cn } from '@/lib/utils'

interface PatternBadgeProps {
  pattern: string
  className?: string
}

export default function PatternBadge({ pattern, className }: PatternBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-400 ring-1 ring-inset ring-indigo-500/30',
        className
      )}
    >
      {pattern}
    </span>
  )
}
