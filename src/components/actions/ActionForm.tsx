import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createAction, updateAction } from '@/services/esg'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import type { EsgAction, Pillar, TargetDeadline, ActionStatus } from '@/types/esg'

interface ActionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingAction: EsgAction | null
  onSaved: () => void
}

export function ActionForm({ open, onOpenChange, editingAction, onSaved }: ActionFormProps) {
  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState<Pillar>('Ambiental')
  const [responsible, setResponsible] = useState('')
  const [targetDeadline, setTargetDeadline] = useState<TargetDeadline>('3')
  const [status, setStatus] = useState<ActionStatus>('Planejada')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      if (editingAction) {
        setTitle(editingAction.title)
        setPillar(editingAction.pillar)
        setResponsible(editingAction.responsible || '')
        setTargetDeadline(editingAction.target_deadline)
        setStatus(editingAction.status)
        setDueDate(editingAction.due_date ? editingAction.due_date.split(' ')[0] : '')
      } else {
        setTitle('')
        setPillar('Ambiental')
        setResponsible('')
        setTargetDeadline('3')
        setStatus('Planejada')
        setDueDate('')
      }
      setErrors({})
    }
  }, [open, editingAction])

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
        responsible: responsible.trim(),
        target_deadline: targetDeadline,
        status,
        progress: editingAction?.progress ?? 0,
        due_date: dueDate || null,
      }
      if (editingAction) {
        await updateAction(editingAction.id, data)
        toast.success('Ação atualizada com sucesso.')
      } else {
        await createAction(data)
        toast.success('Ação criada com sucesso.')
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      const fieldErrors = extractFieldErrors(err)
      if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors)
      else toast.error('Erro ao salvar ação.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingAction ? 'Editar Ação' : 'Nova Ação'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Título *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da ação"
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
              <Label className="text-xs">Prazo (meses)</Label>
              <Select
                value={targetDeadline}
                onValueChange={(v) => setTargetDeadline(v as TargetDeadline)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meses</SelectItem>
                  <SelectItem value="6">6 meses</SelectItem>
                  <SelectItem value="12">12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Responsável</Label>
            <Input
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Nome do responsável"
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ActionStatus)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planejada">Planejada</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Atrasada">Atrasada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Data de vencimento</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm"
              />
            </div>
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
