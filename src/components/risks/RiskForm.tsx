import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createRisk, updateRisk } from '@/services/esg'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { cn } from '@/lib/utils'
import type { RiskRecord, Pillar, RiskStatus, RiskLevel } from '@/types/esg'

interface RiskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingRisk: RiskRecord | null
  onSaved: () => void
}

const levelBadge: Record<string, string> = {
  Baixo: 'bg-emerald-500 text-white',
  Médio: 'bg-amber-500 text-slate-900',
  Alto: 'bg-orange-500 text-white',
  Crítico: 'bg-red-500 text-white',
}

function calcLevel(score: number): RiskLevel {
  if (score > 14) return 'Crítico'
  if (score > 9) return 'Alto'
  if (score > 4) return 'Médio'
  return 'Baixo'
}

export function RiskForm({ open, onOpenChange, editingRisk, onSaved }: RiskFormProps) {
  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState<Pillar>('Ambiental')
  const [likelihood, setLikelihood] = useState(3)
  const [impact, setImpact] = useState(3)
  const [status, setStatus] = useState<RiskStatus>('Identificado')
  const [responsible, setResponsible] = useState('')
  const [category, setCategory] = useState('')
  const [mitigationPlan, setMitigationPlan] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      if (editingRisk) {
        setTitle(editingRisk.title)
        setPillar(editingRisk.pillar)
        setLikelihood(editingRisk.likelihood)
        setImpact(editingRisk.impact)
        setStatus(editingRisk.status)
        setResponsible(editingRisk.responsible || '')
        setCategory(editingRisk.category || '')
        setMitigationPlan(editingRisk.mitigation_plan || '')
        setDueDate(editingRisk.due_date ? editingRisk.due_date.split(' ')[0] : '')
      } else {
        setTitle('')
        setPillar('Ambiental')
        setLikelihood(3)
        setImpact(3)
        setStatus('Identificado')
        setResponsible('')
        setCategory('')
        setMitigationPlan('')
        setDueDate('')
      }
      setErrors({})
    }
  }, [open, editingRisk])

  const score = likelihood * impact
  const level = calcLevel(score)

  const handleSubmit = async () => {
    const e: FieldErrors = {}
    if (!title.trim()) e.title = 'Título é obrigatório'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSaving(true)
    try {
      const data = {
        title: title.trim(),
        pillar,
        likelihood,
        impact,
        score,
        level,
        status,
        responsible: responsible.trim(),
        category: category.trim(),
        mitigation_plan: mitigationPlan.trim(),
        due_date: dueDate || null,
      }
      if (editingRisk) {
        await updateRisk(editingRisk.id, data)
        toast.success('Risco atualizado com sucesso.')
      } else {
        await createRisk(data)
        toast.success('Risco criado com sucesso.')
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      const fieldErrors = extractFieldErrors(err)
      if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors)
      else toast.error('Erro ao salvar risco.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingRisk ? 'Editar Risco' : 'Novo Risco'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Título *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do risco"
              className="text-sm"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Pilar</Label>
              <Select value={pillar} onValueChange={(v) => setPillar(v as Pillar)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ambiental">Ambiental</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Governança">Governança</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as RiskStatus)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Identificado">Identificado</SelectItem>
                  <SelectItem value="Em tratamento">Em tratamento</SelectItem>
                  <SelectItem value="Mitigado">Mitigado</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Probabilidade (1-5)</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setLikelihood(n)}
                    className={cn(
                      'h-8 w-8 rounded-md text-sm font-medium transition-colors',
                      likelihood === n
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Impacto (1-5)</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setImpact(n)}
                    className={cn(
                      'h-8 w-8 rounded-md text-sm font-medium transition-colors',
                      impact === n
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border">
            <div className="text-center">
              <span className="text-[10px] text-slate-500 block uppercase">Score</span>
              <span className="text-xl font-bold text-slate-900">{score}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-500 block uppercase mb-1">Nível</span>
              <Badge className={cn('text-[10px] border-none', levelBadge[level])}>{level}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Responsável</Label>
              <Input
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Nome"
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Categoria</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Categoria"
                className="text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Plano de Mitigação</Label>
            <Textarea
              value={mitigationPlan}
              onChange={(e) => setMitigationPlan(e.target.value)}
              placeholder="Descreva o plano..."
              className="text-sm min-h-[60px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Prazo</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-sm"
            />
          </div>
          {Object.keys(errors).length > 0 && !errors.title && (
            <p className="text-xs text-red-500">{Object.values(errors).join(', ')}</p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
