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
import { Pencil, Trash2, ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Supplier, RiskLevel, SupplierStatus } from '@/types/esg'

interface SupplierListProps {
  suppliers: Supplier[]
  onEdit: (s: Supplier) => void
  onDelete: (id: string) => void
  onRequirements: (s: Supplier) => void
}

const riskBadge: Record<RiskLevel, string> = {
  Baixo: 'bg-emerald-100 text-emerald-800',
  Médio: 'bg-amber-100 text-amber-800',
  Alto: 'bg-orange-100 text-orange-800',
  Crítico: 'bg-red-100 text-red-800',
}

const statusBadge: Record<SupplierStatus, string> = {
  Ativo: 'bg-emerald-100 text-emerald-800',
  Inativo: 'bg-slate-100 text-slate-700',
  'Em avaliação': 'bg-amber-100 text-amber-800',
}

export function SupplierList({ suppliers, onEdit, onDelete, onRequirements }: SupplierListProps) {
  return (
    <div className="rounded-xl border bg-white shadow-subtle overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Nome</TableHead>
            <TableHead className="text-xs hidden md:table-cell">Categoria</TableHead>
            <TableHead className="text-xs">Risco</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((s) => (
            <TableRow key={s.id} className="hover:bg-slate-50/50">
              <TableCell className="text-sm font-medium text-slate-900 max-w-[200px] truncate">
                {s.name}
              </TableCell>
              <TableCell className="text-xs text-slate-600 hidden md:table-cell">
                {s.category || '—'}
              </TableCell>
              <TableCell>
                <Badge className={cn('text-[10px] border-none', riskBadge[s.risk_level])}>
                  {s.risk_level}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={cn('text-[10px] border-none', statusBadge[s.status])}>
                  {s.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onRequirements(s)}
                    title="Requisitos ESG"
                  >
                    <ListChecks className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onEdit(s)}
                    title="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:text-red-600"
                    onClick={() => onDelete(s.id)}
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
