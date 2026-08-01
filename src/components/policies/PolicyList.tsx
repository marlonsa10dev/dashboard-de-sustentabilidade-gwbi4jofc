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
import { Pencil, Trash2, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'
import pb from '@/lib/pocketbase/client'
import type { Policy, Pillar, Applicability } from '@/types/esg'

interface PolicyListProps {
  policies: Policy[]
  onEdit: (p: Policy) => void
  onDelete: (id: string) => void
}

const pillarBadge: Record<Pillar, string> = {
  Ambiental: 'bg-emerald-100 text-emerald-800',
  Social: 'bg-blue-100 text-blue-800',
  Governança: 'bg-violet-100 text-violet-800',
}

const applicabilityBadge: Record<Applicability, string> = {
  Aplicável: 'bg-emerald-100 text-emerald-800',
  'Parcialmente aplicável': 'bg-amber-100 text-amber-800',
  'Não aplicável': 'bg-slate-100 text-slate-600',
}

export function PolicyList({ policies, onEdit, onDelete }: PolicyListProps) {
  const getDocUrl = (p: Policy) =>
    p.document
      ? `${pb.baseURL}/api/files/esg_policies/${p.id}/${p.document}?token=${pb.authStore.token}`
      : null

  return (
    <div className="rounded-xl border bg-white shadow-subtle overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Título</TableHead>
            <TableHead className="text-xs">Pilar</TableHead>
            <TableHead className="text-xs">Aplicabilidade</TableHead>
            <TableHead className="text-xs hidden md:table-cell">Documento</TableHead>
            <TableHead className="text-xs text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((p) => {
            const docUrl = getDocUrl(p)
            return (
              <TableRow key={p.id} className="hover:bg-slate-50/50">
                <TableCell className="text-sm font-medium text-slate-900 max-w-[240px]">
                  {p.title}
                  {p.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={cn('text-[10px] border-none', pillarBadge[p.pillar])}>
                    {p.pillar}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn('text-[10px] border-none', applicabilityBadge[p.applicability])}
                  >
                    {p.applicability}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {docUrl ? (
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Paperclip className="h-3 w-3" /> {p.document}
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEdit(p)}
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-600"
                      onClick={() => onDelete(p.id)}
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
