import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteRisk } from '@/services/esg'
import type { RiskRecord } from '@/types/esg'
import { Trash2, Shield, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface RiskDrawerProps {
  risk: RiskRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefresh: () => void
  canManage: boolean
}

export function RiskDrawer({ risk, open, onOpenChange, onRefresh, canManage }: RiskDrawerProps) {
  if (!risk) return null

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este risco?')) {
      try {
        await deleteRisk(risk.id)
        toast.success('Risco excluído.')
        onRefresh()
        onOpenChange(false)
      } catch (_) {
        toast.error('Erro ao excluir risco.')
      }
    }
  }

  const getLevelBadge = (level: string) => {
    if (level === 'Crítico') return 'bg-red-500 text-white'
    if (level === 'Alto') return 'bg-orange-500 text-white'
    if (level === 'Médio') return 'bg-amber-500 text-slate-900'
    return 'bg-emerald-500 text-white'
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-100 text-emerald-800 border-none">{risk.pillar}</Badge>
            <Badge className={getLevelBadge(risk.level)}>Nível {risk.level.toUpperCase()}</Badge>
          </div>
          <SheetTitle className="text-xl font-bold text-slate-900">{risk.title}</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border text-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Probabilidade</span>
              <span className="font-bold text-slate-800 text-base">{risk.likelihood} / 5</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Impacto</span>
              <span className="font-bold text-slate-800 text-base">{risk.impact} / 5</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Score Total</span>
              <span className="font-extrabold text-emerald-600 text-base">{risk.score}</span>
            </div>
          </div>

          {/* Mitigation Plan */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-600" /> Plano de Mitigação
            </h4>
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs text-slate-700 leading-relaxed">
              {risk.mitigation_plan || 'Nenhum plano cadastrado.'}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Categoria</span>
              <span className="font-semibold text-slate-800">{risk.category || 'Geral'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Prazo</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                {risk.due_date ? new Date(risk.due_date).toLocaleDateString('pt-BR') : '—'}
              </span>
            </div>
          </div>

          {canManage && (
            <div className="pt-6 border-t flex justify-end">
              <Button variant="destructive" size="sm" onClick={handleDelete} className="text-xs">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Excluir Risco
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
