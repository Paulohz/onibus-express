import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="flex flex-col items-center justify-center py-24 space-y-4">
      <p className="text-6xl font-bold text-slate-200">404</p>
      <h1 className="text-xl font-semibold text-slate-800">Página não encontrada</h1>
      <p className="text-slate-500 text-sm">O endereço que você acessou não existe.</p>
      <Button onClick={() => navigate('/')}>Voltar para o início</Button>
    </main>
  )
}
