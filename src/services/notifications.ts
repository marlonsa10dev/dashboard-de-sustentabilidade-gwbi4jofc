import pb from '@/lib/pocketbase/client'
import type { EsgNotification } from '@/types/esg'

export const getNotifications = () =>
  pb.collection('esg_notifications').getFullList<EsgNotification>({ sort: '-created' })

export const createNotification = (data: Partial<EsgNotification>) =>
  pb.collection('esg_notifications').create<EsgNotification>(data)

export const updateNotification = (id: string, data: Partial<EsgNotification>) =>
  pb.collection('esg_notifications').update<EsgNotification>(id, data)

export const deleteNotification = (id: string) => pb.collection('esg_notifications').delete(id)
