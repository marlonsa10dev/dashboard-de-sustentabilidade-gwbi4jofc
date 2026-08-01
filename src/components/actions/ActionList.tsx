import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Pencil, Trash2, ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EsgAction, ActionSubtask, Pillar } from '@/types/esg'

interface ActionListProps {
  actions: EsgAction[]
  subtasks: ActionSubtask[]
  onEdit: (action: EsgAction) => void
  onDelete: (id: string) => void
  onManageSubtasks: (action: EsgAction) => void
}

const pillarBadge: Record<Pillar, string> = {
  Ambiental: 'bg-emerald-100 text-emerald-800',
  Social: 'bg-blue-100 text-blue-800',
  Governança: 'bg-purple-100 text-purple-800',
}

const statusBadge: Record<string, string> = {
  Planejada: 'bg-slate-100 text-slate-700',
  'Em andamento': 'bg-blue-100 text-blue-800',
  Concluída: 'bg-emerald-100 text-emerald-800',
  Atrasada: 'bg-red-100 text-red-800',
}

export function ActionList({
  actions,
  subtasks,
  onEdit,
  onDelete,
  onManageSubtasks,
}: ActionListProps) {
  return (
    <div className="rounded-xl border bg-white shadow-subtle overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Título</TableHead>
            <TableHead className="text-xs">Pilar</TableHead>
            <TableHead className="text-xs hidden md:table-cell">Responsável</TableHead>
            <TableHead className="text-xs">Prazo</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs w-32">Progresso</TableHead>
            <TableHead className="text-xs text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.map((action) => {
            const actionSubtaskCount = subtasks.filter((s) => s.action === action.id).length
            return (
              <TableRow key={action.id} className="hover:bg-slate-50/50">
                <TableCell className="text-sm font-medium text-slate-900 max-w-[200px] truncate">
                  {action.title}
                </TableCell>
                <TableCell>
                  <Badge className={cn('text-[10px] border-none', pillarBadge[action.pillar])}>
                    {action.pillar}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-600 hidden md:table-cell">
                  {action.responsible || '—'}
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {action.target_deadline} meses
                </TableCell>
                <TableCell>
                  <Badge className={cn('text-[10px] border-none', statusBadge[action.status])}>
                    {action.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={action.progress} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground w-7 text-right">
                      {action.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onManageSubtasks(action)}
                      title="Subtarefas"
                    >
                      <ListChecks className="h-3.5 w-3.5" />
                      {actionSubtaskCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-primary text-[8px] text-primary-foreground flex items-center justify-center">
                          {actionSubtaskCount}
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEdit(action)}
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-600"
                      onClick={() => onDelete(action.id)}
                      title="Excluir"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
