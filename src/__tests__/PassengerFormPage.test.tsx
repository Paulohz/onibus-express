import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import PassengerFormPage from '@/pages/PassengerFormPage'
import { createBooking } from '@/services/booking'
import { useBookingStore } from '@/store/useBookingStore'
import { toast } from 'sonner'
import type { Trip } from '@/types'

vi.mock('@/services/booking')

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockCreateBooking = vi.mocked(createBooking)

const mockTrip: Trip = {
  id: 1,
  route: { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', estimatedDuration: '6h' },
  departureDateTime: '2026-06-17T08:00:00',
  basePrice: 89.9,
  availableSeats: 15,
  totalSeats: 40,
}

function renderPage() {
  return render(
    <MemoryRouter>
      <PassengerFormPage />
    </MemoryRouter>
  )
}

describe('PassengerFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useBookingStore.setState({
      selectedTrip: mockTrip,
      selectedSeat: 5,
    })
  })

  it('deve exibir mensagem quando viagem ou assento não selecionado', () => {
    useBookingStore.setState({ selectedTrip: null, selectedSeat: null })
    renderPage()

    expect(screen.getByText('Nenhuma viagem ou assento selecionado.')).toBeInTheDocument()
  })

  it('deve exibir resumo da viagem', () => {
    renderPage()

    expect(screen.getByText(/São Paulo/)).toBeInTheDocument()
    expect(screen.getByText(/Rio de Janeiro/)).toBeInTheDocument()
    expect(screen.getByText(/R\$ 89,90/)).toBeInTheDocument()
  })

  it('deve exibir erros ao submeter formulário vazio', async () => {
    renderPage()

    await userEvent.click(screen.getByText('Confirmar reserva'))

    expect(await screen.findByText('Informe o nome completo')).toBeInTheDocument()
    expect(await screen.findByText('Informe o CPF')).toBeInTheDocument()
    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
  })

  it('deve exibir erro para CPF inválido', async () => {
    renderPage()

    await userEvent.type(screen.getByLabelText('CPF'), '123.456.789-00')
    await userEvent.click(screen.getByText('Confirmar reserva'))

    expect(await screen.findByText('CPF inválido')).toBeInTheDocument()
  })

  it('deve navegar para confirmação após reserva bem sucedida', async () => {
    mockCreateBooking.mockResolvedValue({
      bookingCode: 'ABC-12345',
      status: 'CONFIRMED',
      trip: mockTrip,
      passenger: { name: 'João Silva', cpf: '529.982.247-25', email: 'joao@email.com' },
      seatNumber: 5,
    })

    renderPage()

    await userEvent.type(screen.getByLabelText('Nome completo'), 'João Silva')
    await userEvent.type(screen.getByLabelText('CPF'), '529.982.247-25')
    await userEvent.type(screen.getByLabelText('E-mail'), 'joao@email.com')
    await userEvent.click(screen.getByText('Confirmar reserva'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/reservas/confirmacao')
    })
  })

  it('deve exibir erro quando a reserva falhar', async () => {
    mockCreateBooking.mockRejectedValue(new Error('Erro'))

    renderPage()

    await userEvent.type(screen.getByLabelText('Nome completo'), 'João Silva')
    await userEvent.type(screen.getByLabelText('CPF'), '529.982.247-25')
    await userEvent.type(screen.getByLabelText('E-mail'), 'joao@email.com')
    await userEvent.click(screen.getByText('Confirmar reserva'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao realizar reserva. Tente novamente.', {
        id: 'booking-error',
      })
    })
  })
})
