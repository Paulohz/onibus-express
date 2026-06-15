export type Route = {
  id: number
  origin: string
  destination: string
  estimatedDuration: string
}

export type Trip = {
  id: number
  route: Route
  departureDateTime: string
  basePrice: number
  availableSeats: number
  totalSeats: number
}

export type Seat = {
  number: number
  isOccupied: boolean
}

export type Passenger = {
  name: string
  cpf: string
  email: string
}

export type Booking = {
  trip: Trip
  passenger: Passenger
  seatNumber: number
  status: 'CONFIRMED' | 'CANCELLED'
  bookingCode: string
}

export type SearchParams = {
  origin: string
  destination: string
  date: string
}
