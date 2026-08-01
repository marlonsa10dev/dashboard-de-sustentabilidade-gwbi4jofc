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
import { createSupplier, updateSupplier } from '@/services/esg'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import type { Supplier, RiskLevel, SupplierStatus } from '@/types/esg'

interface SupplierFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSupplier: Supplier | null
  onSaved: () => void
}

export function SupplierForm({ open, onOpenChange, editingSupplier, onSaved }: SupplierFormProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Médio')
  const [status, setStatus] = useState<SupplierStatus>('Ativo')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      if (editingSupplier) {
        setName(editingSupplier.name)
        setCategory(editingSupplier.category || '')
        setRiskLevel(editingSupplier.risk_level)
        setStatus(editingSupplier.status)
      } else {
        setName('')
        setCategory('')
        setRiskLevel('Médio')
        setStatus('Ativo')
      }
      setErrors({})
    }
  }, [open, editingSupplier])

  const handleSubmit = async () => {
    const e: FieldErrors = {}
    if (!name.trim()) e.name = 'Nome é obrigatório'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSaving(true)
    try {
      const data = { name: name.trim(), category: category.trim(), risk_level: riskLevel, status }
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, data)
        toast.success('Fornecedor atualizado.')
      } else {
        await createSupplier(data)
        toast.success('Fornecedor criado.')
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      const fe = extractFieldErrors(err)
      if (Object.keys(fe).length > 0) setErrors(fe)
      else toast.error('Erro ao salvar fornecedor.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Nome *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do fornecedor"
              className="text-sm"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nível de Risco</Label>
              <Select value={riskLevel} onValueChange={(v) => setRiskLevel(v as RiskLevel)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as SupplierStatus)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Em avaliação">Em avaliação</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
