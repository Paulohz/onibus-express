import { api } from './api'
import type { Booking, Passenger } from '@/types'

export async function createBooking(tripId: number, seatNumber: number, passenger: Passenger) {
  const { data } = await api.post<Booking>('/reservas', {
    viagemId: tripId,
    numeroAssento: seatNumber,
    ...passenger,
  })
  return data
}

export async function getBooking(code: string) {
  const { data } = await api.get<Booking>(`/reservas/${code}`)
  return data
}

export async function cancelBooking(code: string) {
  await api.delete(`/reservas/${code}`)
}
