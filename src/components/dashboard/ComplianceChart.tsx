import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, LabelList } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChecklistItem } from '@/types/esg'

const chartConfig = {
  conformidade: { label: 'Conformidade', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig

const PHASES: { key: string; short: string }[] = [
  { key: 'Aquisição de Terreno', short: 'Aquisição' },
  { key: 'Licenciamento', short: 'Licenciamento' },
  { key: 'Construção', short: 'Construção' },
  { key: 'Manutenção', short: 'Manutenção' },
  { key: 'Fornecedores', short: 'Fornecedores' },
]

export function ComplianceChart({
  checklist,
  onPhaseClick,
}: {
  checklist: ChecklistItem[]
  onPhaseClick?: (phase: string) => void
}) {
  const data = PHASES.map((phase) => {
    const items = checklist.filter((c) => c.phase === phase.key)
    const conforme = items.filter((c) => c.status === 'Conforme').length
    const pct = items.length > 0 ? Math.round((conforme / items.length) * 100) : 0
    return {
      phase: phase.short,
      phaseKey: phase.key,
      conformidade: pct,
      conforme,
      total: items.length,
    }
  })

  const getBarColor = (pct: number) => {
    if (pct >= 75) return 'hsl(152, 69%, 40%)'
    if (pct >= 50) return 'hsl(38, 92%, 50%)'
    return 'hsl(0, 72%, 51%)'
  }

  return (
    <Card className="shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Conformidade por Fase</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="phase" tickLine={false} axisLine={false} fontSize={11} interval={0} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value, _name, item) => {
                const payload = item.payload as { conforme: number; total: number }
                return [`${value}% (${payload.conforme}/${payload.total})`, 'Conformidade']
              }}
            />
            <Bar
              dataKey="conformidade"
              radius={[4, 4, 0, 0]}
              className={onPhaseClick ? 'cursor-pointer' : ''}
              onClick={(payload: any) => {
                const pk = payload?.payload?.phaseKey
                if (pk && onPhaseClick) onPhaseClick(pk)
              }}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.conformidade)} />
              ))}
              <LabelList
                dataKey="conformidade"
                position="top"
                formatter={(v: number) => `${v}%`}
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
