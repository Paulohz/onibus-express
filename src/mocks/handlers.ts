import { http, HttpResponse } from 'msw'
import type { Trip } from '@/types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const trips: Trip[] = [
  {
    id: 1,
    route: { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', estimatedDuration: '6h' },
    departureDateTime: '2026-06-17T08:00:00',
    basePrice: 89.9,
    availableSeats: 15,
    totalSeats: 40,
  },
  {
    id: 2,
    route: { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', estimatedDuration: '6h' },
    departureDateTime: '2026-06-17T14:00:00',
    basePrice: 79.9,
    availableSeats: 3,
    totalSeats: 40,
  },
]

export const handlers = [
  http.get(`${API_URL}/viagens`, ({ request }) => {
    const url = new URL(request.url)
    const origin = url.searchParams.get('origem') ?? ''
    const destination = url.searchParams.get('destino') ?? ''

    const filtered = trips.filter(
      (t) =>
        t.route.origin.toLowerCase().includes(origin.toLowerCase()) &&
        t.route.destination.toLowerCase().includes(destination.toLowerCase())
    )

    return HttpResponse.json(filtered)
  }),

  http.get(`${API_URL}/viagens/:id`, () => {
    return HttpResponse.json({
      seats: Array.from({ length: 40 }, (_, i) => ({
        number: i + 1,
        isOccupied: [3, 7, 12, 15, 22, 31].includes(i + 1),
      })),
    })
  }),

  http.post(`${API_URL}/reservas`, () => {
    return HttpResponse.json({
      bookingCode: 'ABC-12345',
      status: 'CONFIRMED',
    })
  }),

  http.get(`${API_URL}/rotas`, () => {
    return HttpResponse.json([
      { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', estimatedDuration: '6h' },
      { id: 2, origin: 'São Paulo', destination: 'Curitiba', estimatedDuration: '6h' },
      { id: 3, origin: 'Rio de Janeiro', destination: 'Belo Horizonte', estimatedDuration: '5h' },
      { id: 4, origin: 'Curitiba', destination: 'Florianópolis', estimatedDuration: '2h' },
      { id: 5, origin: 'Belo Horizonte', destination: 'Salvador', estimatedDuration: '8h' },
    ])
  }),

  http.get(`${API_URL}/reservas/:codigo`, ({ params }) => {
    return HttpResponse.json({
      bookingCode: params.codigo,
      status: 'CONFIRMED',
      trip: {
        id: 1,
        route: {
          id: 1,
          origin: 'São Paulo',
          destination: 'Rio de Janeiro',
          estimatedDuration: '6h',
        },
        departureDateTime: '2026-06-17T08:00:00',
        basePrice: 89.9,
        availableSeats: 15,
        totalSeats: 40,
      },
      passenger: {
        name: 'João Silva',
        cpf: '529.982.247-25',
        email: 'joao@email.com',
      },
      seatNumber: 5,
    })
  }),

  http.delete(`${API_URL}/reservas/:codigo`, () => {
    return HttpResponse.json({ success: true })
  }),
]
