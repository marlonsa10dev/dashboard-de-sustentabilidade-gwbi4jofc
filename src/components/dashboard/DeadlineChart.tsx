import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { EsgAction } from '@/types/esg'

const chartConfig = {
  Ambiental: { label: 'Ambiental', color: 'hsl(var(--chart-1))' },
  Social: { label: 'Social', color: 'hsl(var(--chart-2))' },
  Governança: { label: 'Governança', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig

export function DeadlineChart({ actions }: { actions: EsgAction[] }) {
  const deadlines = ['3', '6', '12']
  const data = deadlines.map((d) => ({
    deadline: `${d} meses`,
    Ambiental: actions.filter((a) => a.target_deadline === d && a.pillar === 'Ambiental').length,
    Social: actions.filter((a) => a.target_deadline === d && a.pillar === 'Social').length,
    Governança: actions.filter((a) => a.target_deadline === d && a.pillar === 'Governança').length,
  }))

  return (
    <Card className="shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Planos de Ação por Prazo</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="deadline" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="Ambiental" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Social" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Governança" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
