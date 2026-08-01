import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Paperclip } from 'lucide-react'
import { toast } from 'sonner'
import { createChecklistItem, updateChecklistItem } from '@/services/esg'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import type { ChecklistItem, Phase, ChecklistStatus } from '@/types/esg'

interface ChecklistFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: ChecklistItem | null
  defaultPhase?: Phase
  onSaved: () => void
}

export function ChecklistForm({
  open,
  onOpenChange,
  editingItem,
  defaultPhase,
  onSaved,
}: ChecklistFormProps) {
  const [phase, setPhase] = useState<Phase>('Construção')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<ChecklistStatus>('Em análise')
  const [responsible, setResponsible] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      if (editingItem) {
        setPhase(editingItem.phase)
        setDescription(editingItem.description)
        setStatus(editingItem.status)
        setResponsible(editingItem.responsible || '')
        setDueDate(editingItem.due_date ? editingItem.due_date.split(' ')[0] : '')
      } else {
        setPhase(defaultPhase || 'Construção')
        setDescription('')
        setStatus('Em análise')
        setResponsible('')
        setDueDate('')
      }
      setEvidenceFile(null)
      setErrors({})
    }
  }, [open, editingItem, defaultPhase])

  const handleSubmit = async () => {
    const e: FieldErrors = {}
    if (!description.trim()) e.description = 'Descrição é obrigatória'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSaving(true)
    try {
      if (evidenceFile) {
        const formData = new FormData()
        formData.append('phase', phase)
        formData.append('description', description.trim())
        formData.append('status', status)
        formData.append('responsible', responsible.trim())
        formData.append('due_date', dueDate || '')
        formData.append('evidence', evidenceFile)
        if (editingItem) await updateChecklistItem(editingItem.id, formData)
        else await createChecklistItem(formData)
      } else {
        const data = {
          phase,
          description: description.trim(),
          status,
          responsible: responsible.trim(),
          due_date: dueDate || null,
        }
        if (editingItem) await updateChecklistItem(editingItem.id, data)
        else await createChecklistItem(data)
      }
      toast.success(editingItem ? 'Item atualizado.' : 'Item criado.')
      onSaved()
      onOpenChange(false)
    } catch (err) {
      const fieldErrors = extractFieldErrors(err)
      if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors)
      else toast.error('Erro ao salvar item.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Editar Item' : 'Novo Item'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Fase *</Label>
            <Select value={phase} onValueChange={(v) => setPhase(v as Phase)}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aquisição de Terreno">Aquisição de Terreno</SelectItem>
                <SelectItem value="Licenciamento">Licenciamento</SelectItem>
                <SelectItem value="Construção">Construção</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Fornecedores">Fornecedores</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Descrição *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do item"
              className="text-sm min-h-[60px]"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ChecklistStatus)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conforme">Conforme</SelectItem>
                  <SelectItem value="Não conforme">Não conforme</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
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
            <Label className="text-xs">Evidência (PDF/Imagem)</Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
            {editingItem?.evidence && !evidenceFile && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Paperclip className="h-3 w-3" /> {editingItem.evidence}
              </p>
            )}
          </div>
          {Object.keys(errors).length > 0 && !errors.description && (
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
