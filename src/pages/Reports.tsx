import { useState, useEffect, useCallback } from 'react'
import { useEsgData } from '@/hooks/use-esg-data'
import { getPolicies } from '@/services/policies'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Printer, AlertCircle, Leaf, Users, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Policy, Pillar } from '@/types/esg'

const PILLARS: { key: Pillar; label: string; icon: typeof Leaf }[] = [
  { key: 'Ambiental', label: 'Ambiental', icon: Leaf },
  { key: 'Social', label: 'Social', icon: Users },
  { key: 'Governança', label: 'Governança', icon: Scale },
]

export default function Reports() {
  const { actions, risks, checklist, suppliers, loading } = useEsgData()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadPolicies = useCallback(async () => {
    try {
      setError(null)
      setPolicies(await getPolicies())
    } catch (e) {
      console.error('Failed to load policies:', e)
      setError('Não foi possível carregar os dados do relatório.')
    }
  }, [])

  useEffect(() => {
    loadPolicies()
  }, [loadPolicies])
  useRealtime('esg_policies', () => loadPolicies())

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const concluded = actions.filter((a) => a.status === 'Concluída').length
  const critical = risks.filter((r) => r.level === 'Crítico').length
  const compliant = checklist.filter((c) => c.status === 'Conforme').length
  const atRisk = suppliers.filter(
    (s) => s.risk_level === 'Alto' || s.risk_level === 'Crítico',
  ).length
  const applicable = policies.filter((p) => p.applicability === 'Aplicável').length

  const summary = [
    { label: 'Ações Concluídas', value: concluded, color: 'text-emerald-600' },
    { label: 'Riscos Críticos', value: critical, color: 'text-red-600' },
    {
      label: 'Checklists Conformes',
      value: `${compliant}/${checklist.length}`,
      color: 'text-blue-600',
    },
    { label: 'Fornecedores em Risco', value: atRisk, color: 'text-orange-600' },
    { label: 'Políticas Aplicáveis', value: applicable, color: 'text-violet-600' },
  ]

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-down print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Relatório de Sustentabilidade</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visão consolidada ESG — Tower Companies
          </p>
        </div>
        <Button onClick={() => window.print()} size="sm" className="w-fit">
          <Printer className="h-4 w-4 mr-1.5" /> Imprimir / Salvar como PDF
        </Button>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold">Relatório de Sustentabilidade ESG</h1>
        <p className="text-sm text-slate-600">
          Tower Companies — {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {summary.map((s, i) => (
          <Card key={i} className="shadow-subtle print:shadow-none print:border-slate-300">
            <CardContent className="p-4">
              <span className="text-xs font-medium text-muted-foreground leading-tight">
                {s.label}
              </span>
              <div className={cn('text-2xl font-bold mt-1', s.color)}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {PILLARS.map((pillar) => {
        const pa = actions.filter((a) => a.pillar === pillar.key)
        const pr = risks.filter((r) => r.pillar === pillar.key)
        const pp = policies.filter((p) => p.pillar === pillar.key)
        const avg =
          pa.length > 0 ? Math.round(pa.reduce((s, a) => s + a.progress, 0) / pa.length) : 0

        return (
          <Card
            key={pillar.key}
            className="shadow-subtle print:shadow-none print:border-slate-300 print:break-inside-avoid"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <pillar.icon className="h-4 w-4 text-slate-600" /> Pilar {pillar.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Ações</span>
                  <p className="font-bold text-slate-900">{pa.length}</p>
                  <span className="text-xs text-slate-500">Progresso: {avg}%</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Riscos</span>
                  <p className="font-bold text-slate-900">{pr.length}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Políticas</span>
                  <p className="font-bold text-slate-900">{pp.length}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Aplicáveis</span>
                  <p className="font-bold text-slate-900">
                    {pp.filter((p) => p.applicability === 'Aplicável').length}
                  </p>
                </div>
              </div>
              {pp.length > 0 && (
                <div className="space-y-1 pt-2 border-t">
                  {pp.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700">{p.title}</span>
                      <span className="text-slate-500">{p.applicability}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
