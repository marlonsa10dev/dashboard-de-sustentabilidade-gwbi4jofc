import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Pencil, Trash2, ListChecks, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { updateAction } from '@/services/esg'
import type { EsgAction, ActionStatus, Pillar } from '@/types/esg'

interface ActionKanbanProps {
  actions: EsgAction[]
  onEdit: (action: EsgAction) => void
  onDelete: (id: string) => void
  onManageSubtasks: (action: EsgAction) => void
  onStatusChange: (id: string, status: ActionStatus) => void
}

const columns: { status: ActionStatus; label: string; color: string }[] = [
  { status: 'Planejada', label: 'Planejada', color: 'border-t-slate-400' },
  { status: 'Em andamento', label: 'Em Andamento', color: 'border-t-blue-500' },
  { status: 'Concluída', label: 'Concluída', color: 'border-t-emerald-500' },
  { status: 'Atrasada', label: 'Atrasada', color: 'border-t-red-500' },
]

const pillarBadge: Record<Pillar, string> = {
  Ambiental: 'bg-emerald-100 text-emerald-800',
  Social: 'bg-blue-100 text-blue-800',
  Governança: 'bg-purple-100 text-purple-800',
}

export function ActionKanban({
  actions,
  onEdit,
  onDelete,
  onManageSubtasks,
  onStatusChange,
}: ActionKanbanProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const handleDrop = async (status: ActionStatus) => {
    const id = draggedId
    setDraggedId(null)
    if (!id) return
    const action = actions.find((a) => a.id === id)
    if (action && action.status === status) return
    try {
      await updateAction(id, { status })
      onStatusChange(id, status)
    } catch {
      toast.error('Erro ao atualizar status.')
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colActions = actions.filter((a) => a.status === col.status)
        return (
          <div
            key={col.status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.status)}
            className={cn(
              'rounded-xl border border-t-4 bg-slate-50/50 p-3 min-h-[300px]',
              col.color,
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-700">{col.label}</h3>
              <span className="text-[10px] text-muted-foreground bg-white px-1.5 py-0.5 rounded-full border">
                {colActions.length}
              </span>
            </div>
            <div className="space-y-2">
              {colActions.map((action) => (
                <Card
                  key={action.id}
                  draggable
                  onDragStart={() => setDraggedId(action.id)}
                  onDragEnd={() => setDraggedId(null)}
                  className={cn(
                    'cursor-grab active:cursor-grabbing shadow-subtle transition-opacity',
                    draggedId === action.id && 'opacity-40',
                  )}
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-medium text-slate-900 leading-tight flex-1">
                        {action.title}
                      </span>
                      <GripVertical className="h-3 w-3 text-slate-300 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge className={cn('text-[9px] border-none', pillarBadge[action.pillar])}>
                        {action.pillar}
                      </Badge>
                      <span className="text-[10px] text-slate-500">{action.target_deadline}m</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{action.responsible || '—'}</div>
                    <div className="flex items-center gap-1.5">
                      <Progress value={action.progress} className="h-1 flex-1" />
                      <span className="text-[9px] text-muted-foreground">{action.progress}%</span>
                    </div>
                    <div className="flex items-center gap-1 pt-1 border-t">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onManageSubtasks(action)}
                      >
                        <ListChecks className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onEdit(action)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500"
                        onClick={() => onDelete(action.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {colActions.length === 0 && (
                <div className="text-center py-8 text-[10px] text-muted-foreground">Vazio</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
