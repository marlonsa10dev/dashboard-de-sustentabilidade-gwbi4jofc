import pb from '@/lib/pocketbase/client'
import type { EsgAction, RiskRecord, ChecklistItem, Supplier } from '@/types/esg'

export const getActions = () =>
  pb.collection('esg_actions').getFullList<EsgAction>({ sort: '-created' })
export const getAction = (id: string) => pb.collection('esg_actions').getOne<EsgAction>(id)
export const createAction = (data: Partial<EsgAction>) =>
  pb.collection('esg_actions').create<EsgAction>(data)
export const updateAction = (id: string, data: Partial<EsgAction>) =>
  pb.collection('esg_actions').update<EsgAction>(id, data)
export const deleteAction = (id: string) => pb.collection('esg_actions').delete(id)

export const getRisks = () =>
  pb.collection('esg_risks').getFullList<RiskRecord>({ sort: '-created' })
export const getRisk = (id: string) => pb.collection('esg_risks').getOne<RiskRecord>(id)
export const createRisk = (data: Partial<RiskRecord>) =>
  pb.collection('esg_risks').create<RiskRecord>(data)
export const updateRisk = (id: string, data: Partial<RiskRecord>) =>
  pb.collection('esg_risks').update<RiskRecord>(id, data)
export const deleteRisk = (id: string) => pb.collection('esg_risks').delete(id)

export const getChecklistItems = () =>
  pb.collection('esg_checklist_items').getFullList<ChecklistItem>({ sort: '-created' })
export const getChecklistItem = (id: string) =>
  pb.collection('esg_checklist_items').getOne<ChecklistItem>(id)
export const createChecklistItem = (data: Partial<ChecklistItem>) =>
  pb.collection('esg_checklist_items').create<ChecklistItem>(data)
export const updateChecklistItem = (id: string, data: Partial<ChecklistItem>) =>
  pb.collection('esg_checklist_items').update<ChecklistItem>(id, data)
export const deleteChecklistItem = (id: string) => pb.collection('esg_checklist_items').delete(id)

export const getSuppliers = () =>
  pb.collection('esg_suppliers').getFullList<Supplier>({ sort: '-created' })
export const getSupplier = (id: string) => pb.collection('esg_suppliers').getOne<Supplier>(id)
export const createSupplier = (data: Partial<Supplier>) =>
  pb.collection('esg_suppliers').create<Supplier>(data)
export const updateSupplier = (id: string, data: Partial<Supplier>) =>
  pb.collection('esg_suppliers').update<Supplier>(id, data)
export const deleteSupplier = (id: string) => pb.collection('esg_suppliers').delete(id)
