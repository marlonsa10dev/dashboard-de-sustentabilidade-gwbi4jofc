import { useState, useEffect, useCallback } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  getRequirementsBySupplier,
  createRequirement,
  updateRequirement,
  deleteRequirement,
} from '@/services/supplier-requirements'
import { useRealtime } from '@/hooks/use-realtime'
import type { Supplier, SupplierRequirement, ChecklistStatus } from '@/types/esg'

interface RequirementManagerProps {
  supplier: Supplier | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequirementManager({ supplier, open, onOpenChange }: RequirementManagerProps) {
  const [requirements, setRequirements] = useState<SupplierRequirement[]>([])
  const [newName, setNewName] = useState('')
  const [newStatus, setNewStatus] = useState<ChecklistStatus>('Em análise')
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    if (!supplier) return
    try {
      setRequirements(await getRequirementsBySupplier(supplier.id))
    } catch (e) {
      console.error('Failed to load requirements:', e)
    }
  }, [supplier])

  useEffect(() => {
    if (open && supplier) {
      loadData()
      setNewName('')
      setNewStatus('Em análise')
    }
  }, [open, supplier, loadData])

  useRealtime('esg_supplier_requirements', () => {
    if (open) loadData()
  })

  const handleAdd = async () => {
    if (!supplier || !newName.trim()) return
    setLoading(true)
    try {
      await createRequirement({ supplier: supplier.id, name: newName.trim(), status: newStatus })
      setNewName('')
      setNewStatus('Em análise')
      loadData()
    } catch {
      toast.error('Erro ao adicionar requisito.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: ChecklistStatus) => {
    try {
      await updateRequirement(id, { status })
      loadData()
    } catch {
      toast.error('Erro ao atualizar status.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteRequirement(id)
      loadData()
    } catch {
      toast.error('Erro ao excluir requisito.')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="text-lg font-bold text-slate-900">
            Requisitos ESG — {supplier?.name}
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          {requirements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum requisito cadastrado.
            </p>
          ) : (
            <div className="space-y-2">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-2 p-2.5 rounded-lg border bg-white"
                >
                  <span className="text-sm font-medium text-slate-800 flex-1">{req.name}</span>
                  <Select
                    value={req.status}
                    onValueChange={(v) => handleStatusChange(req.id, v as ChecklistStatus)}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conforme">Conforme</SelectItem>
                      <SelectItem value="Não conforme">Não conforme</SelectItem>
                      <SelectItem value="Em análise">Em análise</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(req.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="pt-4 border-t space-y-2">
            <p className="text-xs font-semibold text-slate-600">Adicionar requisito</p>
            <div className="flex gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome do requisito"
                className="text-sm flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ChecklistStatus)}>
                <SelectTrigger className="w-32 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conforme">Conforme</SelectItem>
                  <SelectItem value="Não conforme">Não conforme</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleAdd} disabled={loading || !newName.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
