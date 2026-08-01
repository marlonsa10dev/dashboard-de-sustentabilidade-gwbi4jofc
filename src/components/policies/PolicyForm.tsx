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
import { createPolicy, updatePolicy } from '@/services/policies'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import type { Policy, Pillar, Applicability } from '@/types/esg'

interface PolicyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingPolicy: Policy | null
  onSaved: () => void
}

export function PolicyForm({ open, onOpenChange, editingPolicy, onSaved }: PolicyFormProps) {
  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState<Pillar>('Ambiental')
  const [description, setDescription] = useState('')
  const [applicability, setApplicability] = useState<Applicability>('Aplicável')
  const [docFile, setDocFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      if (editingPolicy) {
        setTitle(editingPolicy.title)
        setPillar(editingPolicy.pillar)
        setDescription(editingPolicy.description || '')
        setApplicability(editingPolicy.applicability)
      } else {
        setTitle('')
        setPillar('Ambiental')
        setDescription('')
        setApplicability('Aplicável')
      }
      setDocFile(null)
      setErrors({})
    }
  }, [open, editingPolicy])

  const handleSubmit = async () => {
    const e: FieldErrors = {}
    if (!title.trim()) e.title = 'Título é obrigatório'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSaving(true)
    try {
      if (docFile) {
        const fd = new FormData()
        fd.append('title', title.trim())
        fd.append('pillar', pillar)
        fd.append('description', description.trim())
        fd.append('applicability', applicability)
        fd.append('document', docFile)
        if (editingPolicy) await updatePolicy(editingPolicy.id, fd)
        else await createPolicy(fd)
      } else {
        const data = { title: title.trim(), pillar, description: description.trim(), applicability }
        if (editingPolicy) await updatePolicy(editingPolicy.id, data)
        else await createPolicy(data)
      }
      toast.success(editingPolicy ? 'Política atualizada.' : 'Política criada.')
      onSaved()
      onOpenChange(false)
    } catch (err) {
      const fe = extractFieldErrors(err)
      if (Object.keys(fe).length > 0) setErrors(fe)
      else toast.error('Erro ao salvar política.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPolicy ? 'Editar Política' : 'Nova Política'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Título *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da política"
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
              <Label className="text-xs">Aplicabilidade</Label>
              <Select
                value={applicability}
                onValueChange={(v) => setApplicability(v as Applicability)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aplicável">Aplicável</SelectItem>
                  <SelectItem value="Parcialmente aplicável">Parcialmente aplicável</SelectItem>
                  <SelectItem value="Não aplicável">Não aplicável</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da política"
              className="text-sm min-h-[60px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Documento (PDF/Imagem)</Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setDocFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
            {editingPolicy?.document && !docFile && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Paperclip className="h-3 w-3" /> {editingPolicy.document}
              </p>
            )}
          </div>
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
