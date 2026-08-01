import { useState, useEffect, useCallback } from 'react'
import { getActions, getRisks, getChecklistItems, getSuppliers } from '@/services/esg'
import { getPolicies } from '@/services/policies'
import { useRealtime } from '@/hooks/use-realtime'
import type { EsgAction, RiskRecord, ChecklistItem, Supplier, Policy } from '@/types/esg'

export function useEsgData() {
  const [actions, setActions] = useState<EsgAction[]>([])
  const [risks, setRisks] = useState<RiskRecord[]>([])
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [a, r, c, s, p] = await Promise.all([
        getActions(),
        getRisks(),
        getChecklistItems(),
        getSuppliers(),
        getPolicies(),
      ])
      setActions(a)
      setRisks(r)
      setChecklist(c)
      setSuppliers(s)
      setPolicies(p)
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
  useRealtime('esg_policies', () => {
    loadData()
  })

  return { actions, risks, checklist, suppliers, policies, loading }
}
