import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '@/store/useBookingStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

export default function ConfirmationPage() {
  const navigate = useNavigate()
  const { bookingCode, selectedTrip, selectedSeat, passenger, reset } = useBookingStore()

  function handleNewSearch() {
    reset()
    navigate('/')
  }

  if (!bookingCode || !selectedTrip || !selectedSeat || !passenger) {
    return (
      <main className="min-h-screen bg-background p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Nenhuma reserva encontrada.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 py-6">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold text-foreground">Reserva confirmada!</h1>
          <p className="text-muted-foreground">Sua passagem foi reservada com sucesso.</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Código da reserva</span>
              <Badge className="text-base px-3 py-1">{bookingCode}</Badge>
            </div>

            <hr />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rota</span>
                <span className="font-medium text-foreground">
                  {selectedTrip.route.origin} - {selectedTrip.route.destination}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data</span>
                <span className="font-medium text-foreground">
                  {new Date(selectedTrip.departureDateTime).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assento</span>
                <span className="font-medium text-foreground">{selectedSeat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-medium text-foreground">
                  R$ {selectedTrip.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <hr />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passageiro</span>
                <span className="font-medium text-foreground">{passenger.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPF</span>
                <span className="font-medium text-foreground">{passenger.cpf}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">E-mail</span>
                <span className="font-medium text-foreground">{passenger.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleNewSearch}>
          Fazer nova busca
        </Button>
      </div>
    </main>
  )
}
