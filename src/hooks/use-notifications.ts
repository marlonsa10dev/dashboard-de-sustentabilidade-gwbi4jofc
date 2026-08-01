import { useState, useEffect, useCallback } from 'react'
import { getNotifications, updateNotification } from '@/services/notifications'
import { useRealtime } from '@/hooks/use-realtime'
import type { EsgNotification } from '@/types/esg'

export function useNotifications() {
  const [notifications, setNotifications] = useState<EsgNotification[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setNotifications(await getNotifications())
    } catch (e) {
      console.error('Failed to load notifications:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('esg_notifications', () => {
    loadData()
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = async (id: string) => {
    try {
      await updateNotification(id, { read: true })
      loadData()
    } catch (e) {
      console.error('Failed to mark notification as read:', e)
    }
  }

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read)
    await Promise.all(unread.map((n) => updateNotification(n.id, { read: true })))
    loadData()
  }

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead }
}
