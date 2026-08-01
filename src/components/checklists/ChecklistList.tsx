import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Paperclip, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getChecklistEvidenceUrl } from '@/services/esg'
import type { ChecklistItem, ChecklistStatus } from '@/types/esg'

interface ChecklistListProps {
  items: ChecklistItem[]
  onEdit: (item: ChecklistItem) => void
  onDelete: (id: string) => void
}

const statusBadge: Record<ChecklistStatus, string> = {
  Conforme: 'bg-emerald-100 text-emerald-800',
  'Não conforme': 'bg-red-100 text-red-800',
  'Em análise': 'bg-amber-100 text-amber-800',
}

export function ChecklistList({ items, onEdit, onDelete }: ChecklistListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">Nenhum item nesta fase.</div>
    )
  }
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const evidenceUrl = getChecklistEvidenceUrl(item)
        return (
          <Card key={item.id} className="shadow-subtle hover:shadow-elevation transition-shadow">
            <CardContent className="p-3 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 leading-tight">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <Badge className={cn('text-[10px] border-none', statusBadge[item.status])}>
                    {item.status}
                  </Badge>
                  {item.responsible && (
                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                      <User className="h-3 w-3" />
                      {item.responsible}
                    </span>
                  )}
                  {item.due_date && (
                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.due_date).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                  {evidenceUrl && (
                    <a
                      href={evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      <Paperclip className="h-3 w-3" /> Evidência
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onEdit(item)}
                  title="Editar"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500 hover:text-red-600"
                  onClick={() => onDelete(item.id)}
                  title="Excluir"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
