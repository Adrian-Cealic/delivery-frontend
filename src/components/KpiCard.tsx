import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  icon: LucideIcon
}

export default function KpiCard({ title, value, delta, deltaUp, icon: Icon }: KpiCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-zinc-50">{value}</p>
            {delta && (
              <p className={cn('mt-1 text-xs', deltaUp ? 'text-emerald-400' : 'text-red-400')}>
                {delta}
              </p>
            )}
          </div>
          <div className="rounded-md bg-zinc-800 p-2">
            <Icon className="h-4 w-4 text-zinc-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
