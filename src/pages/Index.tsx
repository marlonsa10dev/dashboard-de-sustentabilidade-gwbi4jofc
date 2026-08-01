import { useNavigate } from 'react-router-dom'
import { useEsgData } from '@/hooks/use-esg-data'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { PillarProgress } from '@/components/dashboard/PillarProgress'
import { DeadlineChart } from '@/components/dashboard/DeadlineChart'
import { RiskHeatmap } from '@/components/dashboard/RiskHeatmap'
import { ComplianceChart } from '@/components/dashboard/ComplianceChart'
import { Skeleton } from '@/components/ui/skeleton'

export default function Index() {
  const { actions, risks, checklist, suppliers, loading } = useEsgData()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="animate-fade-in-down">
        <h1 className="text-2xl font-bold text-slate-900">Visão Executiva</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Monitoramento de prontidão para certificação ESG — Tower Companies
        </p>
      </div>

      <KpiCards
        actions={actions}
        risks={risks}
        checklist={checklist}
        suppliers={suppliers}
        onInProgressClick={() => navigate('/acoes?status=Em andamento')}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PillarProgress actions={actions} />
        <DeadlineChart
          actions={actions}
          onDeadlineClick={(deadline) => navigate(`/acoes?deadline=${deadline}`)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RiskHeatmap risks={risks} />
        <ComplianceChart checklist={checklist} />
      </div>
    </div>
  )
}
