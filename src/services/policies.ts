import pb from '@/lib/pocketbase/client'
import type { Policy } from '@/types/esg'

export const getPolicies = () =>
  pb.collection('esg_policies').getFullList<Policy>({ sort: '-created' })
export const getPolicy = (id: string) => pb.collection('esg_policies').getOne<Policy>(id)
export const createPolicy = (data: FormData | Partial<Policy>) =>
  pb.collection('esg_policies').create<Policy>(data as any)
export const updatePolicy = (id: string, data: FormData | Partial<Policy>) =>
  pb.collection('esg_policies').update<Policy>(id, data as any)
export const deletePolicy = (id: string) => pb.collection('esg_policies').delete(id)
export const getPolicyDocumentUrl = (p: Policy) =>
  p.document
    ? `${pb.baseURL}/api/files/esg_policies/${p.id}/${p.document}?token=${pb.authStore.token}`
    : null
