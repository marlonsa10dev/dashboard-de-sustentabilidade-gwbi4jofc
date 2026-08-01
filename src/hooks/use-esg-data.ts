import { useState, useEffect, useCallback } from 'react'
import { getActions, getRisks, getChecklistItems, getSuppliers } from '@/services/esg'
import { useRealtime } from '@/hooks/use-realtime'
import type { EsgAction, RiskRecord, ChecklistItem, Supplier } from '@/types/esg'

export function useEsgData() {
  const [actions, setActions] = useState<EsgAction[]>([])
  const [risks, setRisks] = useState<RiskRecord[]>([])
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [a, r, c, s] = await Promise.all([
        getActions(),
        getRisks(),
        getChecklistItems(),
        getSuppliers(),
      ])
      setActions(a)
      setRisks(r)
      setChecklist(c)
      setSuppliers(s)
    } catch (e) {
      console.error('Failed to load ESG data:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('esg_actions', () => {
    loadData()
  })
  useRealtime('esg_risks', () => {
    loadData()
  })
  useRealtime('esg_checklist_items', () => {
    loadData()
  })
  useRealtime('esg_suppliers', () => {
    loadData()
  })

  return { actions, risks, checklist, suppliers, loading }
}
