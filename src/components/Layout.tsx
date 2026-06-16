import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Toaster } from 'sonner'

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Toaster richColors position="top-right" />
      <Outlet />
    </div>
  )
}
