import { cn } from '@/lib/utils'

interface StatusStepperProps {
  steps: string[]
  current: string
  failed?: boolean
  compact?: boolean
}

export default function StatusStepper({ steps, current, failed = false, compact = false }: StatusStepperProps) {
  const currentIdx = steps.findIndex(s => s.toLowerCase() === current.toLowerCase())

  return (
    <div className={cn('flex items-center gap-0', compact ? 'text-[10px]' : 'text-xs')}>
      {steps.map((step, i) => {
        const isDone = i < currentIdx
        const isActive = i === currentIdx
        const isFailed = failed && isActive

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'rounded-full border-2',
                  compact ? 'h-2 w-2' : 'h-3 w-3',
                  isDone && 'border-indigo-500 bg-indigo-500',
                  isActive && !isFailed && 'border-indigo-400 bg-indigo-400/30',
                  isFailed && 'border-red-500 bg-red-500/30',
                  !isDone && !isActive && 'border-zinc-700 bg-transparent'
                )}
              />
              {!compact && (
                <span
                  className={cn(
                    'whitespace-nowrap',
                    isDone && 'text-indigo-400',
                    isActive && !isFailed && 'text-zinc-200',
                    isFailed && 'text-red-400',
                    !isDone && !isActive && 'text-zinc-600'
                  )}
                >
                  {step}
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={cn('h-px mx-1', compact ? 'w-3' : 'w-6', isDone ? 'bg-indigo-500' : 'bg-zinc-800')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
