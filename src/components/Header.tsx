import { Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/hooks/useTheme'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-border dark:border-slate-800 bg-card dark:bg-slate-950 px-6 py-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-foreground dark:text-slate-100 hover:text-muted-foreground dark:hover:text-slate-300 transition-colors"
        >
          OniBus Express
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/reservas/consulta"
            className="text-sm text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-slate-100 transition-colors"
          >
            Consultar reserva
          </Link>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            <Moon className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  )
}
