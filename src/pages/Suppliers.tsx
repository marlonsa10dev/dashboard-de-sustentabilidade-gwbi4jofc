import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { getSuppliers, deleteSupplier } from '@/services/esg'
import { useRealtime } from '@/hooks/use-realtime'
import type { Supplier } from '@/types/esg'
import { SupplierForm } from '@/components/suppliers/SupplierForm'
import { SupplierList } from '@/components/suppliers/SupplierList'
import { RequirementManager } from '@/components/suppliers/RequirementManager'

export default function Suppliers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category') || 'all'
  const riskFilter = searchParams.get('risk_level') || 'all'
  const statusFilter = searchParams.get('status') || 'all'

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [reqSupplier, setReqSupplier] = useState<Supplier | null>(null)

  const loadData = useCallback(async () => {
    try {
      setError(null)
      setSuppliers(await getSuppliers())
    } catch (e) {
      console.error('Failed to load suppliers:', e)
      setError('Não foi possível carregar os fornecedores. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('esg_suppliers', () => loadData())
  useRealtime('esg_supplier_requirements', () => loadData())

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all') params.delete(key)
    else params.set(key, value)
    setSearchParams(params, { replace: true })
  }

  const filteredSuppliers = suppliers.filter((s) => {
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false
    if (riskFilter !== 'all') {
      if (riskFilter === 'Em risco') {
        if (s.risk_level !== 'Alto' && s.risk_level !== 'Crítico') return false
      } else if (s.risk_level !== riskFilter) return false
    }
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    return true
  })

  const handleEdit = (s: Supplier) => {
    setEditingSupplier(s)
    setFormOpen(true)
  }
  const handleNew = () => {
    setEditingSupplier(null)
    setFormOpen(true)
  }
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await deleteSupplier(id)
        toast.success('Fornecedor excluído.')
      } catch {
        toast.error('Erro ao excluir fornecedor.')
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-down">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fornecedores</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestão de fornecedores e requisitos ESG — Tower Companies
          </p>
        </div>
        <Button onClick={handleNew} size="sm" className="w-fit">
          <Plus className="h-4 w-4 mr-1.5" /> Novo fornecedor
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={categoryFilter} onValueChange={(v) => updateFilter('category', v)}>
          <SelectTrigger className="w-40 h-9 text-xs">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="obra">Obra</SelectItem>
            <SelectItem value="manutenção">Manutenção</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={(v) => updateFilter('risk_level', v)}>
          <SelectTrigger className="w-40 h-9 text-xs">
            <SelectValue placeholder="Risco" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            <SelectItem value="Em risco">Em risco</SelectItem>
            <SelectItem value="Baixo">Baixo</SelectItem>
            <SelectItem value="Médio">Médio</SelectItem>
            <SelectItem value="Alto">Alto</SelectItem>
            <SelectItem value="Crítico">Crítico</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => updateFilter('status', v)}>
          <SelectTrigger className="w-40 h-9 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
            <SelectItem value="Em avaliação">Em avaliação</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredSuppliers.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">
          Nenhum fornecedor encontrado com os filtros selecionados.
        </div>
      ) : (
        <SupplierList
          suppliers={filteredSuppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRequirements={setReqSupplier}
        />
      )}

      <SupplierForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editingSupplier={editingSupplier}
        onSaved={() => loadData()}
      />
      <RequirementManager
        supplier={reqSupplier}
        open={!!reqSupplier}
        onOpenChange={(open) => {
          if (!open) setReqSupplier(null)
        }}
      />
    </div>
  )
}
