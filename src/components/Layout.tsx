import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  Leaf,
  LogOut,
  LayoutDashboard,
  ListTodo,
  ShieldAlert,
  ClipboardCheck,
  Building,
  FileText,
  BarChart3,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/acoes', label: 'Planos', icon: ListTodo },
  { to: '/riscos', label: 'Riscos', icon: ShieldAlert },
  { to: '/checklists', label: 'Checklists', icon: ClipboardCheck },
  { to: '/fornecedores', label: 'Fornecedores', icon: Building },
  { to: '/politicas', label: 'Políticas', icon: FileText },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout() {
  const { user, signOut, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-slate-900">Sustentabilidade ESG</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>
        <div className="border-t border-slate-200 p-3 space-y-2">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <span className="text-xs text-slate-600 truncate">{user?.name || user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-xs h-8 flex-1"
            >
              <LogOut className="h-3.5 w-3.5 mr-1" /> Sair
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-sm lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Navegação</SheetTitle>
              <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <Leaf className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-bold text-slate-900">Sustentabilidade ESG</span>
              </div>
              <div className="flex flex-col gap-1 p-3">
                <NavLinks onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="mt-auto border-t border-slate-200 p-3 space-y-2">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <span className="text-xs text-slate-600 truncate">
                    {user?.name || user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <NotificationBell />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-xs h-8 flex-1"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1" /> Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-slate-900">Sustentabilidade ESG</span>
          </Link>
          <div className="flex items-center gap-1">
            <NotificationBell />
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
