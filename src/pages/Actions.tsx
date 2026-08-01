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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { getActions, getSubtasks, deleteAction, updateAction } from '@/services/esg'
import { useRealtime } from '@/hooks/use-realtime'
import type { EsgAction, ActionSubtask, ActionStatus } from '@/types/esg'
import { ActionForm } from '@/components/actions/ActionForm'
import { ActionList } from '@/components/actions/ActionList'
import { ActionKanban } from '@/components/actions/ActionKanban'
import { SubtaskPanel } from '@/components/actions/SubtaskPanel'

export default function Actions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || 'all'
  const deadlineFilter = searchParams.get('deadline') || 'all'

  const [actions, setActions] = useState<EsgAction[]>([])
  const [subtasks, setSubtasks] = useState<ActionSubtask[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'kanban'>(
    () => (localStorage.getItem('esg-action-view') as 'list' | 'kanban') || 'list',
  )
  const [formOpen, setFormOpen] = useState(false)
  const [editingAction, setEditingAction] = useState<EsgAction | null>(null)
  const [subtaskAction, setSubtaskAction] = useState<EsgAction | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [a, s] = await Promise.all([getActions(), getSubtasks()])
      setActions(a)
      setSubtasks(s)
    } catch (e) {
      console.error('Failed to load data:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('esg_actions', () => {
    loadData()
  })
  useRealtime('esg_action_subtasks', () => {
    loadData()
  })

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all') params.delete(key)
    else params.set(key, value)
    setSearchParams(params, { replace: true })
  }

  const filteredActions = actions.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (deadlineFilter !== 'all' && a.target_deadline !== deadlineFilter) return false
    return true
  })

  const handleEdit = (action: EsgAction) => {
    setEditingAction(action)
    setFormOpen(true)
  }
  const handleNew = () => {
    setEditingAction(null)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta ação?')) {
      try {
        await deleteAction(id)
        toast.success('Ação excluída.')
      } catch {
        toast.error('Erro ao excluir ação.')
      }
    }
  }

  const handleStatusChange = async (id: string, status: ActionStatus) => {
    try {
      await updateAction(id, { status })
    } catch {
      toast.error('Erro ao atualizar status.')
    }
  }

  const handleViewChange = (v: string) => {
    setView(v as 'list' | 'kanban')
    localStorage.setItem('esg-action-view', v)
  }

  const getSubtasksForAction = (actionId: string) => subtasks.filter((s) => s.action === actionId)

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
          <h1 className="text-2xl font-bold text-slate-900">Planos de Ação</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestão de ações ESG para Tower Companies
          </p>
        </div>
        <Button onClick={handleNew} size="sm" className="w-fit">
          <Plus className="h-4 w-4 mr-1.5" /> Nova ação
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => updateFilter('status', v)}>
          <SelectTrigger className="w-40 h-9 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Planejada">Planejada</SelectItem>
            <SelectItem value="Em andamento">Em andamento</SelectItem>
            <SelectItem value="Concluída">Concluída</SelectItem>
            <SelectItem value="Atrasada">Atrasada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deadlineFilter} onValueChange={(v) => updateFilter('deadline', v)}>
          <SelectTrigger className="w-40 h-9 text-xs">
            <SelectValue placeholder="Prazo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os prazos</SelectItem>
            <SelectItem value="3">3 meses</SelectItem>
            <SelectItem value="6">6 meses</SelectItem>
            <SelectItem value="12">12 meses</SelectItem>
          </SelectContent>
        </Select>
        <Tabs value={view} onValueChange={handleViewChange}>
          <TabsList className="h-9">
            <TabsTrigger value="list" className="text-xs">
              Lista
            </TabsTrigger>
            <TabsTrigger value="kanban" className="text-xs">
              Kanban
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredActions.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">
          Nenhuma ação encontrada com os filtros selecionados.
        </div>
      ) : view === 'list' ? (
        <ActionList
          actions={filteredActions}
          subtasks={subtasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onManageSubtasks={setSubtaskAction}
        />
      ) : (
        <ActionKanban
          actions={filteredActions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onManageSubtasks={setSubtaskAction}
          onStatusChange={handleStatusChange}
        />
      )}

      <ActionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editingAction={editingAction}
        onSaved={() => loadData()}
      />

      <SubtaskPanel
        action={subtaskAction}
        subtasks={subtaskAction ? getSubtasksForAction(subtaskAction.id) : []}
        open={!!subtaskAction}
        onOpenChange={(open) => {
          if (!open) setSubtaskAction(null)
        }}
      />
    </div>
  )
}
