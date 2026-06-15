import { create } from 'zustand'
import type { Trip, Passenger, SearchParams } from '@/types'

type BookingStore = {
  searchParams: SearchParams | null
  selectedTrip: Trip | null
  selectedSeat: number | null
  passenger: Passenger | null
  bookingCode: string | null
  setSearchParams: (params: SearchParams) => void
  setSelectedTrip: (trip: Trip) => void
  setSelectedSeat: (seat: number) => void
  setPassenger: (passenger: Passenger) => void
  setBookingCode: (code: string) => void
  reset: () => void
}

const initialState = {
  searchParams: null,
  selectedTrip: null,
  selectedSeat: null,
  passenger: null,
  bookingCode: null,
}

export const useBookingStore = create<BookingStore>((set) => ({
  ...initialState,
  setSearchParams: (params) => set({ searchParams: params }),
  setSelectedTrip: (trip) => set({ selectedTrip: trip }),
  setSelectedSeat: (seat) => set({ selectedSeat: seat }),
  setPassenger: (passenger) => set({ passenger }),
  setBookingCode: (code) => set({ bookingCode: code }),
  reset: () => set(initialState),
}))
