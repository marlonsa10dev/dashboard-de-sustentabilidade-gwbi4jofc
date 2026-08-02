import pb from '@/lib/pocketbase/client'
import type { SupplierRequirement } from '@/types/esg'

export const getRequirements = () =>
  pb.collection('esg_supplier_requirements').getFullList<SupplierRequirement>({ sort: '-created' })
export const getRequirementsBySupplier = (supplierId: string) =>
  pb.collection('esg_supplier_requirements').getFullList<SupplierRequirement>({
    filter: `supplier = "${supplierId}"`,
  })
export const createRequirement = (data: Partial<SupplierRequirement>) =>
  pb.collection('esg_supplier_requirements').create<SupplierRequirement>(data)
export const updateRequirement = (id: string, data: Partial<SupplierRequirement>) =>
  pb.collection('esg_supplier_requirements').update<SupplierRequirement>(id, data)
export const deleteRequirement = (id: string) =>
  pb.collection('esg_supplier_requirements').delete(id)
