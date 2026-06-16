import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import BookingSearchPage from '@/pages/BookingSearchPage'
import { getBooking, cancelBooking } from '@/services/booking'
import type { Booking, Trip } from '@/types'
import { toast } from 'sonner'

vi.mock('@/services/booking')

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockGetBooking = vi.mocked(getBooking)
const mockCancelBooking = vi.mocked(cancelBooking)

const mockTrip: Trip = {
  id: 1,
  route: { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', estimatedDuration: '6h' },
  departureDateTime: '2026-06-17T08:00:00',
  basePrice: 89.9,
  availableSeats: 15,
  totalSeats: 40,
}

const mockBooking: Booking = {
  bookingCode: 'ABC-12345',
  status: 'CONFIRMED',
  trip: mockTrip,
  passenger: {
    name: 'João Silva',
    cpf: '529.982.247-25',
    email: 'joao@email.com',
  },
  seatNumber: 5,
}

function renderPage() {
  return render(
    <MemoryRouter>
      <BookingSearchPage />
    </MemoryRouter>
  )
}

describe('BookingSearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar o formulário de consulta', () => {
    renderPage()

    expect(screen.getByLabelText('Código da reserva')).toBeInTheDocument()
    expect(screen.getByText('Buscar reserva')).toBeInTheDocument()
  })

  it('deve exibir erro ao submeter formulário vazio', async () => {
    renderPage()

    await userEvent.click(screen.getByText('Buscar reserva'))

    expect(await screen.findByText('Informe o código da reserva')).toBeInTheDocument()
  })

  it('deve exibir erro para formato de código inválido', async () => {
    renderPage()

    await userEvent.type(screen.getByLabelText('Código da reserva'), 'codigo-errado')
    await userEvent.click(screen.getByText('Buscar reserva'))

    expect(await screen.findByText('Formato inválido. Ex: ABC-12345')).toBeInTheDocument()
  })

  it('deve exibir os dados da reserva após busca bem sucedida', async () => {
    mockGetBooking.mockResolvedValue(mockBooking)

    renderPage()

    await userEvent.type(screen.getByLabelText('Código da reserva'), 'ABC-12345')
    await userEvent.click(screen.getByText('Buscar reserva'))

    await waitFor(() => {
      expect(screen.getByText('ABC-12345')).toBeInTheDocument()
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('Cancelar reserva')).toBeInTheDocument()
    })
  })

  it('deve exibir erro quando reserva não encontrada', async () => {
    mockGetBooking.mockRejectedValue(new Error('Not found'))

    renderPage()

    await userEvent.type(screen.getByLabelText('Código da reserva'), 'ABC-99999')
    await userEvent.click(screen.getByText('Buscar reserva'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Reserva não encontrada. Verifique o código e tente novamente.',
        { id: 'booking-search-error' }
      )
    })
  })
  it('deve cancelar reserva ao clicar em cancelar', async () => {
    mockGetBooking.mockResolvedValue(mockBooking)
    mockCancelBooking.mockResolvedValue(undefined)

    renderPage()

    await userEvent.type(screen.getByLabelText('Código da reserva'), 'ABC-12345')
    await userEvent.click(screen.getByText('Buscar reserva'))

    await waitFor(() => {
      expect(screen.getByText('Cancelar reserva')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Cancelar reserva'))

    await waitFor(() => {
      expect(screen.getByText('Reserva cancelada com sucesso.')).toBeInTheDocument()
    })
  })

  it('não deve exibir botão de cancelar quando reserva já cancelada', async () => {
    mockGetBooking.mockResolvedValue({
      ...mockBooking,
      status: 'CANCELLED',
    })

    renderPage()

    await userEvent.type(screen.getByLabelText('Código da reserva'), 'ABC-12345')
    await userEvent.click(screen.getByText('Buscar reserva'))

    await waitFor(() => {
      expect(screen.getByText('ABC-12345')).toBeInTheDocument()
    })

    expect(screen.queryByText('Cancelar reserva')).not.toBeInTheDocument()
  })
})
