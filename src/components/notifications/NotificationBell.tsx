import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  ShieldAlert,
  ClipboardCheck,
  Building,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'

const typeIcon: Record<string, typeof Bell> = {
  'Ação atrasada': AlertTriangle,
  'Prazo de mitigação': ShieldAlert,
  'Checklist vencido': ClipboardCheck,
  'Avaliação de fornecedor': Building,
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const navigate = useNavigate()

  const handleClick = (id: string, route: string) => {
    markAsRead(id)
    if (route) navigate(route)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <span className="text-sm font-semibold">Notificações</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllAsRead}>
              <CheckCheck className="h-3.5 w-3.5 mr-1" /> Marcar todas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Nenhuma notificação.
            </div>
          ) : (
            notifications.slice(0, 20).map((n) => {
              const Icon = typeIcon[n.type] || Bell
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n.id, n.route)}
                  className={cn(
                    'w-full flex items-start gap-2 p-3 border-b last:border-0 text-left hover:bg-slate-50 transition-colors',
                    !n.read && 'bg-blue-50/50',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 mt-0.5 flex-shrink-0',
                      !n.read ? 'text-blue-600' : 'text-slate-400',
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-xs leading-tight',
                        !n.read ? 'font-semibold text-slate-900' : 'text-slate-600',
                      )}
                    >
                      {n.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(n.created).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                  )}
                </button>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
