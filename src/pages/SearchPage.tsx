import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRoutes, searchTrips } from '@/services/trips'
import { useBookingStore } from '@/store/useBookingStore'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import type { Route, Trip } from '@/types'
import { searchSchema, type SearchForm } from '@/schemas/searchSchema'
import { DatePicker } from '@/components/DatePicker'
import { RouteCombobox } from '@/components/RouteCombobox'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function SearchPage() {
  const navigate = useNavigate()
  const setSearchParams = useBookingStore((s) => s.setSearchParams)
  const setSelectedTrip = useBookingStore((s) => s.setSelectedTrip)

  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const [routes, setRoutes] = useState<Route[]>([])

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: '',
      destination: '',
      date: '',
    },
  })
  const dateValue = useWatch({ control, name: 'date' })
  const originValue = useWatch({ control, name: 'origin' })
  const destinationValue = useWatch({ control, name: 'destination' })

  const origins = [...new Set(routes.map((r) => r.origin))]
  const destinations = [...new Set(routes.map((r) => r.destination))]

  async function onSubmit(data: SearchForm) {
    setLoading(true)
    setSearched(false)
    try {
      const result = await searchTrips(data.origin, data.destination, data.date)
      setTrips(result)
      setSearched(true)
    } catch {
      toast.error('Erro ao buscar viagens. Tente novamente.', {
        id: 'search-error',
      })
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

  useEffect(() => {
    getRoutes().then(setRoutes)
  }, [])

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="origin">Origem</Label>
                <RouteCombobox
                  id="origin"
                  options={origins}
                  value={originValue}
                  onChange={(val) => setValue('origin', val, { shouldValidate: true })}
                  placeholder="Selecione a origem"
                  error={errors.origin?.message}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="destination">Destino</Label>
                <RouteCombobox
                  id="destination"
                  options={destinations}
                  value={destinationValue}
                  onChange={(val) => setValue('destination', val, { shouldValidate: true })}
                  placeholder="Selecione o destino"
                  error={errors.destination?.message}
                />
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
                      {trip.route.origin} - {trip.route.destination}
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

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6 flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
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
