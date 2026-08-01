import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Leaf, LogOut, LayoutDashboard, ListTodo } from 'lucide-react'

export default function Layout() {
  const { user, signOut, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {isAuthenticated && (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <Leaf className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-bold text-slate-900 hidden sm:inline">
                  Sustentabilidade ESG
                </span>
              </Link>
              <nav className="flex items-center gap-1">
                <Button asChild variant="ghost" size="sm" className="text-xs h-8">
                  <Link to="/">
                    <LayoutDashboard className="h-3.5 w-3.5 mr-1" /> Dashboard
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-xs h-8">
                  <Link to="/acoes">
                    <ListTodo className="h-3.5 w-3.5 mr-1" /> Planos de Ação
                  </Link>
                </Button>
              </nav>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 hidden sm:inline">
                  {user.name || user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs h-8">
                  <LogOut className="h-3.5 w-3.5 mr-1" /> Sair
                </Button>
              </div>
            )}
          </div>
        </header>
      )}
      <Outlet />
    </div>
  )
}
