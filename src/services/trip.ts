import { api } from './api'
import type { Trip, Seat } from '@/types'

export async function searchTrips(origin: string, destination: string, date: string) {
  const { data } = await api.get<Trip[]>('/viagens', {
    params: { origem: origin, destino: destination, data: date },
  })
  return data
}

export async function getTripSeats(tripId: number) {
  const { data } = await api.get<{ seats: Seat[] }>(`/viagens/${tripId}`)
  return data.seats
}
