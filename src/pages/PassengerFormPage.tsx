import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBookingStore } from '@/store/useBookingStore'
import { createBooking } from '@/services/booking'
import { passengerSchema, type PassengerForm } from '@/schemas/passengerSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { useCPFMask } from '@/hooks/useCPFMask'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
export default function PassengerFormPage() {
  const navigate = useNavigate()
  const { selectedTrip, selectedSeat, setPassenger, setBookingCode } = useBookingStore()
  const [loading, setLoading] = useState(false)
  const { displayValue: cpfDisplay, onChange: onCPFChange } = useCPFMask()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerForm>({
    resolver: zodResolver(passengerSchema),
  })

  async function onSubmit(data: PassengerForm) {
    if (!selectedTrip || !selectedSeat) return
    setLoading(true)
    try {
      const booking = await createBooking(selectedTrip.id, selectedSeat, data)
      setPassenger(data)
      setBookingCode(booking.bookingCode)
      navigate('/reservas/confirmacao')
    } catch {
      toast.error('Erro ao realizar reserva. Tente novamente.', {
        id: 'booking-error',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!selectedTrip || !selectedSeat) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <p className="text-slate-500">Nenhuma viagem ou assento selecionado.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <h1 className="text-2xl font-bold text-slate-800">Dados do passageiro</h1>

        <Card>
          <CardContent className="pt-6 space-y-1 text-sm text-slate-600">
            <p>
              <span className="font-medium">Rota:</span> {selectedTrip.route.origin} -{' '}
              {selectedTrip.route.destination}
            </p>
            <p>
              <span className="font-medium">Data:</span>{' '}
              {new Date(selectedTrip.departureDateTime).toLocaleString('pt-BR')}
            </p>
            <p>
              <span className="font-medium">Assento:</span> {selectedSeat}
            </p>
            <p>
              <span className="font-medium">Valor:</span> R${' '}
              {selectedTrip.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" placeholder="Ex: João da Silva" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpfDisplay}
                  {...register('cpf')}
                  onChange={(e) => {
                    onCPFChange(e)
                    register('cpf').onChange(e)
                  }}
                />
                {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: joao@email.com"
                  {...register('email')}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Confirmando...' : 'Confirmar reserva'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
