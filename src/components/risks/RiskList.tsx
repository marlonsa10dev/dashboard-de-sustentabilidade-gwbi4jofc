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
import { Pencil, Trash2, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RiskRecord, Pillar } from '@/types/esg'

interface RiskListProps {
  risks: RiskRecord[]
  onEdit: (risk: RiskRecord) => void
  onDelete: (id: string) => void
  onView: (risk: RiskRecord) => void
}

const pillarBadge: Record<Pillar, string> = {
  Ambiental: 'bg-emerald-100 text-emerald-800',
  Social: 'bg-blue-100 text-blue-800',
  Governança: 'bg-purple-100 text-purple-800',
}

const levelBadge: Record<string, string> = {
  Baixo: 'bg-emerald-500 text-white',
  Médio: 'bg-amber-500 text-slate-900',
  Alto: 'bg-orange-500 text-white',
  Crítico: 'bg-red-500 text-white',
}

const statusBadge: Record<string, string> = {
  Identificado: 'bg-slate-100 text-slate-700',
  'Em tratamento': 'bg-blue-100 text-blue-800',
  Mitigado: 'bg-emerald-100 text-emerald-800',
  Crítico: 'bg-red-100 text-red-800',
}

export function RiskList({ risks, onEdit, onDelete, onView }: RiskListProps) {
  return (
    <div className="rounded-xl border bg-white shadow-subtle overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Título</TableHead>
            <TableHead className="text-xs">Pilar</TableHead>
            <TableHead className="text-xs">P×I</TableHead>
            <TableHead className="text-xs">Score</TableHead>
            <TableHead className="text-xs">Nível</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs hidden md:table-cell">Responsável</TableHead>
            <TableHead className="text-xs text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.map((risk) => (
            <TableRow
              key={risk.id}
              className="hover:bg-slate-50/50 cursor-pointer"
              onClick={() => onView(risk)}
            >
              <TableCell className="text-sm font-medium text-slate-900 max-w-[200px] truncate">
                {risk.title}
              </TableCell>
              <TableCell>
                <Badge className={cn('text-[10px] border-none', pillarBadge[risk.pillar])}>
                  {risk.pillar}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-600">
                {risk.likelihood}×{risk.impact}
              </TableCell>
              <TableCell className="text-xs font-bold text-slate-800">{risk.score}</TableCell>
              <TableCell>
                <Badge className={cn('text-[10px] border-none', levelBadge[risk.level])}>
                  {risk.level}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={cn('text-[10px] border-none', statusBadge[risk.status])}>
                  {risk.status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-600 hidden md:table-cell">
                {risk.responsible || '—'}
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onView(risk)}
                    title="Ver"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onEdit(risk)}
                    title="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:text-red-600"
                    onClick={() => onDelete(risk.id)}
                    title="Excluir"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
