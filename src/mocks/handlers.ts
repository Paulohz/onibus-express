import { http, HttpResponse, delay } from 'msw'
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
  {
    id: 999,
    route: { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', estimatedDuration: '6h' },
    departureDateTime: '2026-06-17T23:00:00',
    basePrice: 0,
    availableSeats: 0,
    totalSeats: 40,
  },
]

export const handlers = [
  http.get(`${API_URL}/viagens`, async ({ request }) => {
    const url = new URL(request.url)
    const origin = url.searchParams.get('origem') ?? ''
    const destination = url.searchParams.get('destino') ?? ''

    if (origin.toLowerCase() === 'erro') {
      await delay(500)
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }

    await delay(1000)
    const filtered = trips.filter(
      (t) =>
        t.route.origin.toLowerCase().includes(origin.toLowerCase()) &&
        t.route.destination.toLowerCase().includes(destination.toLowerCase())
    )

    return HttpResponse.json(filtered)
  }),

  http.get(`${API_URL}/viagens/:id`, async ({ params }) => {
    await delay(800)

    if (params.id === '999') {
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }

    return HttpResponse.json({
      seats: Array.from({ length: 40 }, (_, i) => ({
        number: i + 1,
        isOccupied: [3, 7, 12, 15, 22, 31].includes(i + 1),
      })),
    })
  }),

  http.post(`${API_URL}/reservas`, async () => {
    await delay(1000)

    return HttpResponse.json({
      bookingCode: 'ABC-12345',
      status: 'CONFIRMED',
    })
  }),

  http.get(`${API_URL}/rotas`, async () => {
    await delay(1000)

    return HttpResponse.json([
      { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', estimatedDuration: '6h' },
      { id: 2, origin: 'São Paulo', destination: 'Curitiba', estimatedDuration: '6h' },
      { id: 3, origin: 'Rio de Janeiro', destination: 'Belo Horizonte', estimatedDuration: '5h' },
      { id: 4, origin: 'Curitiba', destination: 'Florianópolis', estimatedDuration: '2h' },
      { id: 5, origin: 'Belo Horizonte', destination: 'Salvador', estimatedDuration: '8h' },
      { id: 5, origin: 'Belo Horizonte', destination: 'Salvador', estimatedDuration: '8h' },
      { id: 6, origin: 'Erro', destination: 'Rio de Janeiro', estimatedDuration: '1h' },
    ])
  }),

  http.get(`${API_URL}/reservas/:codigo`, async ({ params }) => {
    await delay(1000)

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

  http.delete(`${API_URL}/reservas/:codigo`, async () => {
    delay(1000)

    return HttpResponse.json({ success: true })
  }),
]
