import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { createSubtask, updateSubtask, deleteSubtask } from '@/services/esg'
import type { EsgAction, ActionSubtask, SubtaskStatus } from '@/types/esg'

interface SubtaskPanelProps {
  action: EsgAction | null
  subtasks: ActionSubtask[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusBadge: Record<SubtaskStatus, string> = {
  Pendente: 'bg-slate-100 text-slate-700',
  'Em andamento': 'bg-blue-100 text-blue-800',
  Concluída: 'bg-emerald-100 text-emerald-800',
}

export function SubtaskPanel({ action, subtasks, open, onOpenChange }: SubtaskPanelProps) {
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  if (!action) return null

  const completed = subtasks.filter((s) => s.status === 'Concluída').length
  const total = subtasks.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : action.progress

  const handleAdd = async () => {
    if (!newTitle.trim() || !action) return
    setAdding(true)
    try {
      await createSubtask({ title: newTitle.trim(), action: action.id, status: 'Pendente' })
      setNewTitle('')
    } catch {
      toast.error('Erro ao adicionar subtarefa.')
    } finally {
      setAdding(false)
    }
  }

  const handleStatusChange = async (id: string, status: SubtaskStatus) => {
    try {
      await updateSubtask(id, { status })
    } catch {
      toast.error('Erro ao atualizar subtarefa.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSubtask(id)
    } catch {
      toast.error('Erro ao excluir subtarefa.')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="text-lg font-bold text-slate-900">Subtarefas</SheetTitle>
          <SheetDescription className="text-sm text-slate-600">{action.title}</SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Progresso calculado</span>
              <span className="font-bold text-slate-900">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-[10px] text-muted-foreground">
              {completed} de {total} subtarefa{total !== 1 ? 's' : ''} concluída
              {completed !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Nova subtarefa..."
              className="text-sm h-9"
            />
            <Button
              size="sm"
              className="h-9"
              onClick={handleAdd}
              disabled={adding || !newTitle.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {subtasks.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-8">
                Nenhuma subtarefa cadastrada. O progresso atual da ação será mantido.
              </p>
            )}
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 p-2 rounded-lg border bg-white hover:bg-slate-50/50"
              >
                <span className="text-xs text-slate-800 flex-1 leading-tight">{subtask.title}</span>
                <Select
                  value={subtask.status}
                  onValueChange={(v) => handleStatusChange(subtask.id, v as SubtaskStatus)}
                >
                  <SelectTrigger className="h-7 w-28 text-[10px]">
                    <SelectValue>
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[9px]',
                          statusBadge[subtask.status],
                        )}
                      >
                        {subtask.status}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500"
                  onClick={() => handleDelete(subtask.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
