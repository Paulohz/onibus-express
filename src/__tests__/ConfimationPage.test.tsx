import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import ConfirmationPage from '@/pages/ConfirmationPage'
import { useBookingStore } from '@/store/useBookingStore'
import type { Trip } from '@/types'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

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
      <ConfirmationPage />
    </MemoryRouter>
  )
}

describe('ConfirmationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useBookingStore.setState({
      bookingCode: 'ABC-12345',
      selectedTrip: mockTrip,
      selectedSeat: 5,
      passenger: {
        name: 'João Silva',
        cpf: '529.982.247-25',
        email: 'joao@email.com',
      },
    })
  })

  it('deve exibir mensagem quando não há reserva', () => {
    useBookingStore.setState({
      bookingCode: null,
      selectedTrip: null,
      selectedSeat: null,
      passenger: null,
    })

    renderPage()

    expect(screen.getByText('Nenhuma reserva encontrada.')).toBeInTheDocument()
  })

  it('deve exibir o código da reserva', () => {
    renderPage()

    expect(screen.getByText('ABC-12345')).toBeInTheDocument()
  })

  it('deve exibir os dados da viagem', () => {
    renderPage()

    expect(screen.getByText(/São Paulo/)).toBeInTheDocument()
    expect(screen.getByText(/Rio de Janeiro/)).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('deve exibir os dados do passageiro', () => {
    renderPage()

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('529.982.247-25')).toBeInTheDocument()
    expect(screen.getByText('joao@email.com')).toBeInTheDocument()
  })

  it('deve resetar o store e navegar para home ao clicar em nova busca', async () => {
    renderPage()

    await userEvent.click(screen.getByText('Fazer nova busca'))

    expect(mockNavigate).toHaveBeenCalledWith('/')
    expect(useBookingStore.getState().bookingCode).toBeNull()
    expect(useBookingStore.getState().selectedTrip).toBeNull()
  })
})
