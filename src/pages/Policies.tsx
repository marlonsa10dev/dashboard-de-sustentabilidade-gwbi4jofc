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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { getPolicies, deletePolicy } from '@/services/policies'
import { useRealtime } from '@/hooks/use-realtime'
import type { Policy } from '@/types/esg'
import { PolicyForm } from '@/components/policies/PolicyForm'
import { PolicyList } from '@/components/policies/PolicyList'

export default function Policies() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pillarFilter = searchParams.get('pillar') || 'all'
  const applicabilityFilter = searchParams.get('applicability') || 'all'

  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)

  const loadData = useCallback(async () => {
    try {
      setError(null)
      setPolicies(await getPolicies())
    } catch (e) {
      console.error('Failed to load policies:', e)
      setError('Não foi possível carregar as políticas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('esg_policies', () => loadData())

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all') params.delete(key)
    else params.set(key, value)
    setSearchParams(params, { replace: true })
  }

  const filteredPolicies = policies.filter((p) => {
    if (pillarFilter !== 'all' && p.pillar !== pillarFilter) return false
    if (applicabilityFilter !== 'all' && p.applicability !== applicabilityFilter) return false
    return true
  })

  const handleEdit = (p: Policy) => {
    setEditingPolicy(p)
    setFormOpen(true)
  }
  const handleNew = () => {
    setEditingPolicy(null)
    setFormOpen(true)
  }
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta política?')) {
      try {
        await deletePolicy(id)
        toast.success('Política excluída.')
      } catch {
        toast.error('Erro ao excluir política.')
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
        </div>
        <Skeleton className="h-96 rounded-xl" />
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

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-down">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Políticas ESG</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Documentos e políticas por pilar — Tower Companies
          </p>
        </div>
        <Button onClick={handleNew} size="sm" className="w-fit">
          <Plus className="h-4 w-4 mr-1.5" /> Nova política
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
        <Select value={applicabilityFilter} onValueChange={(v) => updateFilter('applicability', v)}>
          <SelectTrigger className="w-48 h-9 text-xs">
            <SelectValue placeholder="Aplicabilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toda aplicabilidade</SelectItem>
            <SelectItem value="Aplicável">Aplicável</SelectItem>
            <SelectItem value="Parcialmente aplicável">Parcialmente aplicável</SelectItem>
            <SelectItem value="Não aplicável">Não aplicável</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPolicies.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">
          Nenhuma política encontrada com os filtros selecionados.
        </div>
      ) : (
        <PolicyList policies={filteredPolicies} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <PolicyForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editingPolicy={editingPolicy}
        onSaved={() => loadData()}
      />
    </div>
  )
}
