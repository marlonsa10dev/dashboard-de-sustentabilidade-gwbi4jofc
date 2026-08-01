import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Target, Activity, AlertTriangle, CheckCircle, Building } from 'lucide-react'
import type { EsgAction, RiskRecord, ChecklistItem, Supplier } from '@/types/esg'

interface KpiCardsProps {
  actions: EsgAction[]
  risks: RiskRecord[]
  checklist: ChecklistItem[]
  suppliers: Supplier[]
}

export function KpiCards({ actions, risks, checklist, suppliers }: KpiCardsProps) {
  const readiness =
    actions.length > 0
      ? Math.round(actions.reduce((sum, a) => sum + a.progress, 0) / actions.length)
      : 0
  const inProgress = actions.filter((a) => a.status === 'Em andamento').length
  const criticalRisks = risks.filter((r) => r.level === 'Crítico').length
  const compliantChecks = checklist.filter((c) => c.status === 'Conforme').length
  const atRiskSuppliers = suppliers.filter(
    (s) => s.risk_level === 'Alto' || s.risk_level === 'Crítico',
  ).length

  const cards = [
    {
      title: 'Prontidão para Certificação',
      value: `${readiness}%`,
      icon: Target,
      color: 'text-emerald-600',
    },
    { title: 'Ações em Andamento', value: inProgress, icon: Activity, color: 'text-blue-600' },
    { title: 'Riscos Críticos', value: criticalRisks, icon: AlertTriangle, color: 'text-red-600' },
    {
      title: 'Checklists Conformes',
      value: compliantChecks,
      icon: CheckCircle,
      color: 'text-emerald-600',
    },
    {
      title: 'Fornecedores em Risco',
      value: atRiskSuppliers,
      icon: Building,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <Card
          key={i}
          className="animate-fade-in-up shadow-subtle"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground leading-tight">
                {card.title}
              </span>
              <card.icon className={cn('h-4 w-4 flex-shrink-0', card.color)} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
