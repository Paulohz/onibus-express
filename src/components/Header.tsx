import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-slate-800 hover:text-slate-600 transition-colors"
        >
          OniBus Express
        </Link>
        <Link
          to="/reservas/consulta"
          className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          Consultar reserva
        </Link>
      </div>
    </header>
  )
}
