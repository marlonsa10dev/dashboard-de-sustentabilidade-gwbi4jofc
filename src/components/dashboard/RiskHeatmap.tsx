import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { RiskRecord } from '@/types/esg'

const getCellColor = (score: number) => {
  if (score <= 4) return 'bg-emerald-500/80 text-white'
  if (score <= 9) return 'bg-amber-400/80 text-slate-900'
  if (score <= 14) return 'bg-orange-500/80 text-white'
  return 'bg-red-500/80 text-white'
}

const getLevelLabel = (score: number) => {
  if (score <= 4) return 'Baixo'
  if (score <= 9) return 'Médio'
  if (score <= 14) return 'Alto'
  return 'Crítico'
}

const LEGEND = [
  { label: 'Baixo', color: 'bg-emerald-500' },
  { label: 'Médio', color: 'bg-amber-400' },
  { label: 'Alto', color: 'bg-orange-500' },
  { label: 'Crítico', color: 'bg-red-500' },
]

export function RiskHeatmap({
  risks,
  onCellClick,
}: {
  risks: RiskRecord[]
  onCellClick?: (level: string) => void
}) {
  const cells: { prob: number; impact: number; score: number; count: number }[] = []
  for (let prob = 5; prob >= 1; prob--) {
    for (let impact = 1; impact <= 5; impact++) {
      const score = prob * impact
      const count = risks.filter((r) => r.likelihood === prob && r.impact === impact).length
      cells.push({ prob, impact, score, count })
    }
  }

  return (
    <Card className="shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Mapa de Calor de Riscos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex items-center">
            <span className="text-[10px] text-muted-foreground -rotate-90 whitespace-nowrap font-medium">
              Probabilidade
            </span>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-5 gap-1.5">
              {cells.map((cell) => (
                <div
                  key={`${cell.prob}-${cell.impact}`}
                  className={cn(
                    'aspect-square rounded-md flex flex-col items-center justify-center transition-all hover:scale-105',
                    onCellClick ? 'cursor-pointer' : 'cursor-default',
                    getCellColor(cell.score),
                    cell.count === 0 && 'opacity-35',
                  )}
                  onClick={() => onCellClick?.(getLevelLabel(cell.score))}
                >
                  {cell.count > 0 && (
                    <span className="text-sm font-bold leading-none">{cell.count}</span>
                  )}
                  <span className="text-[8px] mt-0.5">{getLevelLabel(cell.score)}</span>
                </div>
              ))}
            </div>
            <div className="text-center text-[10px] text-muted-foreground mt-2 font-medium">
              Impacto
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-4 flex-wrap">
          {LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={cn('h-3 w-3 rounded-sm', l.color)} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
