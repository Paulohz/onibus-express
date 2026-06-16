import { http, HttpResponse, RequestHandler } from 'msw'

export const handlers: RequestHandler[] = [
  http.get('http://localhost:3000/viagens', () => {
    return HttpResponse.json([
      {
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
      {
        id: 2,
        route: {
          id: 1,
          origin: 'São Paulo',
          destination: 'Rio de Janeiro',
          estimatedDuration: '6h',
        },
        departureDateTime: '2026-06-17T14:00:00',
        basePrice: 79.9,
        availableSeats: 3,
        totalSeats: 40,
      },
    ])
  }),

  http.get('http://localhost:3000/viagens/:id', () => {
    return HttpResponse.json({
      seats: Array.from({ length: 40 }, (_, i) => ({
        number: i + 1,
        isOccupied: [3, 7, 12, 15, 22, 31].includes(i + 1),
      })),
    })
  }),

  http.post('http://localhost:3000/reservas', () => {
    return HttpResponse.json({
      bookingCode: 'ABC-12345',
      status: 'CONFIRMED',
    })
  }),
]
