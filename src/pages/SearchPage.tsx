import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { searchTrips } from '@/services/trips'
import { useBookingStore } from '@/store/useBookingStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import type { Trip } from '@/types'
import { searchSchema, type SearchForm } from '@/schemas/searchSchema'
import { DatePicker } from '@/components/DatePicker'
export default function SearchPage() {
  const navigate = useNavigate()
  const setSearchParams = useBookingStore((s) => s.setSearchParams)
  const setSelectedTrip = useBookingStore((s) => s.setSelectedTrip)

  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
  })
  const dateValue = useWatch({ control, name: 'date' })

  async function onSubmit(data: SearchForm) {
    setLoading(true)
    setSearched(false)
    setSearchError(null)
    try {
      const result = await searchTrips(data.origin, data.destination, data.date)
      setTrips(result)
      setSearched(true)
    } catch {
      setSearchError('Erro ao buscar viagens. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleSelectTrip(trip: Trip) {
    setSearchParams({
      origin: trip.route.origin,
      destination: trip.route.destination,
      date: trip.departureDateTime,
    })
    setSelectedTrip(trip)
    navigate(`/viagens/${trip.id}/assentos`)
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">OniBus Express</h1>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="origin">Origem</Label>
                <Input id="origin" placeholder="Ex: São Paulo" {...register('origin')} />
                {errors.origin && <p className="text-sm text-red-500">{errors.origin.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  placeholder="Ex: Rio de Janeiro"
                  {...register('destination')}
                />
                {errors.destination && (
                  <p className="text-sm text-red-500">{errors.destination.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Data de ida</Label>
                <DatePicker
                  value={dateValue}
                  onChange={(val) => setValue('date', val, { shouldValidate: true })}
                  error={errors.date?.message}
                />
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar passagens'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {searchError && <p className="text-center text-red-500">{searchError}</p>}

        {searched && !loading && trips.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <p className="text-slate-600 font-medium">Nenhuma viagem encontrada</p>
            <p className="text-slate-400 text-sm">Tente uma data ou rota diferente</p>
          </div>
        )}

        {trips.length > 0 && (
          <div className="space-y-3">
            {trips.map((trip) => (
              <Card key={trip.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800">
                      {trip.route.origin} → {trip.route.destination}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(trip.departureDateTime).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-slate-500">
                      {trip.availableSeats} vagas disponíveis
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-xl font-bold text-slate-800">
                      R$ {trip.basePrice.toFixed(2)}
                    </p>
                    <Button onClick={() => handleSelectTrip(trip)}>Selecionar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
