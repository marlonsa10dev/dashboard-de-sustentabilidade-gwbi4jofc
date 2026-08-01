import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { getChecklistItems, deleteChecklistItem } from '@/services/esg'
import { useRealtime } from '@/hooks/use-realtime'
import type { ChecklistItem, Phase } from '@/types/esg'
import { ChecklistForm } from '@/components/checklists/ChecklistForm'
import { ChecklistList } from '@/components/checklists/ChecklistList'

const PHASES: { key: Phase; label: string }[] = [
  { key: 'Aquisição de Terreno', label: 'Aquisição' },
  { key: 'Licenciamento', label: 'Licenciamento' },
  { key: 'Construção', label: 'Construção' },
  { key: 'Manutenção', label: 'Manutenção' },
  { key: 'Fornecedores', label: 'Fornecedores' },
]

export default function Checklists() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialPhase = (searchParams.get('phase') as Phase) || 'Construção'

  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activePhase, setActivePhase] = useState<Phase>(initialPhase)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null)

  const loadData = useCallback(async () => {
    try {
      const c = await getChecklistItems()
      setItems(c)
    } catch (e) {
      console.error('Failed to load checklist items:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('esg_checklist_items', () => {
    loadData()
  })

  const handlePhaseChange = (value: string) => {
    setActivePhase(value as Phase)
    const params = new URLSearchParams(searchParams)
    params.set('phase', value)
    setSearchParams(params, { replace: true })
  }

  const handleEdit = (item: ChecklistItem) => {
    setEditingItem(item)
    setFormOpen(true)
  }
  const handleNew = () => {
    setEditingItem(null)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteChecklistItem(id)
        toast.success('Item excluído.')
      } catch {
        toast.error('Erro ao excluir item.')
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-full max-w-2xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  const phaseItems = items.filter((i) => i.phase === activePhase)
  const conforme = phaseItems.filter((i) => i.status === 'Conforme').length
  const pct = phaseItems.length > 0 ? Math.round((conforme / phaseItems.length) * 100) : 0

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-down">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Checklists Operacionais</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Conformidade por fase — Tower Companies
          </p>
        </div>
        <Button onClick={handleNew} size="sm" className="w-fit">
          <Plus className="h-4 w-4 mr-1.5" /> Novo item
        </Button>
      </div>

      <Tabs value={activePhase} onValueChange={handlePhaseChange}>
        <TabsList className="h-9 flex-wrap">
          {PHASES.map((p) => (
            <TabsTrigger key={p.key} value={p.key} className="text-xs">
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Conformidade da fase</span>
          <span className="font-bold text-slate-900">
            {pct}% ({conforme}/{phaseItems.length})
          </span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      <ChecklistList items={phaseItems} onEdit={handleEdit} onDelete={handleDelete} />

      <ChecklistForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editingItem={editingItem}
        defaultPhase={activePhase}
        onSaved={() => loadData()}
      />
    </div>
  )
}
