import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { getRisks, deleteRisk } from '@/services/esg'
import { useRealtime } from '@/hooks/use-realtime'
import type { RiskRecord } from '@/types/esg'
import { RiskForm } from '@/components/risks/RiskForm'
import { RiskList } from '@/components/risks/RiskList'
import { RiskDrawer } from '@/components/risks/RiskDrawer'

export default function Risks() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pillarFilter = searchParams.get('pillar') || 'all'
  const levelFilter = searchParams.get('level') || 'all'
  const statusFilter = searchParams.get('status') || 'all'

  const [risks, setRisks] = useState<RiskRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingRisk, setEditingRisk] = useState<RiskRecord | null>(null)
  const [drawerRisk, setDrawerRisk] = useState<RiskRecord | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const r = await getRisks()
      setRisks(r)
    } catch (e) {
      console.error('Failed to load risks:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('esg_risks', () => {
    loadData()
  })

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all') params.delete(key)
    else params.set(key, value)
    setSearchParams(params, { replace: true })
  }

  const filteredRisks = risks.filter((r) => {
    if (pillarFilter !== 'all' && r.pillar !== pillarFilter) return false
    if (levelFilter !== 'all' && r.level !== levelFilter) return false
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    return true
  })

  const handleEdit = (risk: RiskRecord) => {
    setEditingRisk(risk)
    setFormOpen(true)
    setDrawerOpen(false)
  }
  const handleNew = () => {
    setEditingRisk(null)
    setFormOpen(true)
  }
  const handleView = (risk: RiskRecord) => {
    setDrawerRisk(risk)
    setDrawerOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este risco?')) {
      try {
        await deleteRisk(id)
        toast.success('Risco excluído.')
      } catch {
        toast.error('Erro ao excluir risco.')
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-down">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Riscos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Matriz de riscos ESG para Tower Companies
          </p>
        </div>
        <Button onClick={handleNew} size="sm" className="w-fit">
          <Plus className="h-4 w-4 mr-1.5" /> Novo risco
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={pillarFilter} onValueChange={(v) => updateFilter('pillar', v)}>
          <SelectTrigger className="w-40 h-9 text-xs">
            <SelectValue placeholder="Pilar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pilares</SelectItem>
            <SelectItem value="Ambiental">Ambiental</SelectItem>
            <SelectItem value="Social">Social</SelectItem>
            <SelectItem value="Governança">Governança</SelectItem>
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={(v) => updateFilter('level', v)}>
          <SelectTrigger className="w-40 h-9 text-xs">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            <SelectItem value="Baixo">Baixo</SelectItem>
            <SelectItem value="Médio">Médio</SelectItem>
            <SelectItem value="Alto">Alto</SelectItem>
            <SelectItem value="Crítico">Crítico</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => updateFilter('status', v)}>
          <SelectTrigger className="w-44 h-9 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Identificado">Identificado</SelectItem>
            <SelectItem value="Em tratamento">Em tratamento</SelectItem>
            <SelectItem value="Mitigado">Mitigado</SelectItem>
            <SelectItem value="Crítico">Crítico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredRisks.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">
          Nenhum risco encontrado com os filtros selecionados.
        </div>
      ) : (
        <RiskList
          risks={filteredRisks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      <RiskForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editingRisk={editingRisk}
        onSaved={() => loadData()}
      />
      <RiskDrawer
        risk={drawerRisk}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onRefresh={() => loadData()}
        canManage={true}
        onEdit={handleEdit}
      />
    </div>
  )
}
