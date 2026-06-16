import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getBooking, cancelBooking } from '@/services/booking'
import { bookingSearchSchema, type BookingSearchForm } from '@/schemas/bookingSearchSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Booking } from '@/types'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
export default function BookingSearchPage() {
  const navigate = useNavigate()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingSearchForm>({
    resolver: zodResolver(bookingSearchSchema),
  })

  async function onSubmit(data: BookingSearchForm) {
    setLoading(true)
    setBooking(null)
    setCancelled(false)
    try {
      const result = await getBooking(data.code)
      setBooking(result)
    } catch {
      toast.error('Reserva não encontrada. Verifique o código e tente novamente.', {
        id: 'booking-search-error',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!booking) return
    setCancelling(true)
    try {
      await cancelBooking(booking.bookingCode)
      setCancelled(true)
      setBooking(null)
      toast.success('Reserva cancelada com sucesso.', {
        id: 'booking-cancel-success',
      })
    } catch {
      toast.error('Não foi possível cancelar a reserva. Tente novamente.', {
        id: 'booking-cancel-error',
      })
    } finally {
      setCancelling(false)
    }
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <h1 className="text-2xl font-bold text-foreground">Consultar reserva</h1>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="code">Código da reserva</Label>
                <Input id="code" placeholder="Ex: ABC-12345" {...register('code')} />
                {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                Buscar reserva
              </Button>
            </form>
          </CardContent>
        </Card>

        {cancelled && (
          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <p className="font-medium text-foreground">Reserva cancelada com sucesso.</p>
              <p className="text-sm text-muted-foreground">
                Você pode fazer uma nova busca a qualquer momento.
              </p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>

              <hr />

              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>

              <hr />

              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        )}

        {booking && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Código da reserva</span>
                <Badge className="text-base px-3 py-1">{booking.bookingCode}</Badge>
              </div>

              <hr />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                    {booking.status === 'CONFIRMED' ? 'Confirmada' : 'Cancelada'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rota</span>
                  <span className="font-medium text-foreground">
                    {booking.trip.route.origin} - {booking.trip.route.destination}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data</span>
                  <span className="font-medium text-foreground">
                    {new Date(booking.trip.departureDateTime).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assento</span>
                  <span className="font-medium text-foreground">{booking.seatNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="font-medium text-foreground">
                    R${' '}
                    {booking.trip.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <hr />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passageiro</span>
                  <span className="font-medium text-foreground">{booking.passenger.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPF</span>
                  <span className="font-medium text-foreground">{booking.passenger.cpf}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-mail</span>
                  <span className="font-medium text-foreground">{booking.passenger.email}</span>
                </div>
              </div>

              {booking.status === 'CONFIRMED' && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelando...' : 'Cancelar reserva'}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
