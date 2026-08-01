import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Leaf, Users, Scale } from 'lucide-react'
import type { EsgAction } from '@/types/esg'

const PILLARS = [
  { key: 'Ambiental', label: 'Ambiental', color: 'bg-emerald-500', icon: Leaf },
  { key: 'Social', label: 'Social', color: 'bg-blue-500', icon: Users },
  { key: 'Governança', label: 'Governança', color: 'bg-violet-500', icon: Scale },
] as const

export function PillarProgress({ actions }: { actions: EsgAction[] }) {
  const data = PILLARS.map((p) => {
    const pillarActions = actions.filter((a) => a.pillar === p.key)
    const avg =
      pillarActions.length > 0
        ? Math.round(pillarActions.reduce((sum, a) => sum + a.progress, 0) / pillarActions.length)
        : 0
    return { ...p, progress: avg, count: pillarActions.length }
  })

  return (
    <Card className="shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Progresso por Pilar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {data.map((p) => (
          <div key={p.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p.icon className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{p.label}</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{p.progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700 ease-apple',
                  p.color,
                )}
                style={{ width: `${p.progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {p.count} ação{p.count !== 1 ? 'ões' : ''}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
