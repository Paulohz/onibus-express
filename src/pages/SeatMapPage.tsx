import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useBookingStore } from '@/store/useBookingStore'
import { getTripSeats } from '@/services/trips'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Seat } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
export default function SeatMapPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const selectedTrip = useBookingStore((s) => s.selectedTrip)
  const setSelectedSeat = useBookingStore((s) => s.setSelectedSeat)

  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeat, setLocalSelectedSeat] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!id) return

    async function loadSeats() {
      setHasError(false)
      setLoading(true)

      try {
        const seats = await getTripSeats(Number(id))
        setSeats(seats)
      } catch {
        toast.error('Erro ao carregar assentos. Tente novamente.', {
          id: 'seat-load-error',
        })
        setHasError(true)
      } finally {
        setLoading(false)
      }
    }

    void loadSeats()
  }, [id])

  function handleSelectSeat(seat: Seat) {
    if (seat.isOccupied) return
    setLocalSelectedSeat(seat.number)
  }

  function handleContinue() {
    if (!selectedSeat) return
    setSelectedSeat(selectedSeat)
    navigate('/reservas/nova')
  }

  if (!selectedTrip) {
    return (
      <main className="min-h-screen bg-background p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Nenhuma viagem selecionada.</p>
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Selecione seu assento</h1>
          <p className="text-muted-foreground mt-1">
            {selectedTrip.route.origin} - {selectedTrip.route.destination} •{' '}
            {new Date(selectedTrip.departureDateTime).toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-secondary border border-border" />
            <span className="text-muted-foreground">Livre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-muted opacity-50" />
            <span className="text-muted-foreground">Ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary" />
            <span className="text-muted-foreground">Selecionado</span>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading && (
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 40 }, (_, i) => (
                  <Skeleton key={i} className="h-10 rounded" />
                ))}
              </div>
            )}

            {!loading && hasError && (
              <div className="text-center py-12 space-y-4">
                <p className="text-muted-foreground">Não foi possível carregar os assentos.</p>
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Voltar e escolher outra viagem
                </Button>
              </div>
            )}

            {!loading && !hasError && (
              <div className="grid grid-cols-4 gap-2">
                {seats.map((seat) => (
                  <button
                    key={seat.number}
                    onClick={() => handleSelectSeat(seat)}
                    disabled={seat.isOccupied}
                    aria-label={`Assento ${seat.number}`}
                    aria-pressed={selectedSeat === seat.number}
                    className={cn(
                      'h-10 rounded text-sm font-medium transition-colors',
                      seat.isOccupied &&
                        'bg-muted text-muted-foreground cursor-not-allowed opacity-50',
                      !seat.isOccupied &&
                        selectedSeat === seat.number &&
                        'bg-primary text-primary-foreground',
                      !seat.isOccupied &&
                        selectedSeat !== seat.number &&
                        'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedSeat && (
          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Assento selecionado</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">{selectedSeat}</span>
                  <Badge variant="secondary">Disponível</Badge>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="text-xl font-bold text-foreground">
                  R$ {selectedTrip.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button className="w-full" disabled={!selectedSeat} onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </main>
  )
}
