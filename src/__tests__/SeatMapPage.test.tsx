import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import SeatMapPage from '@/pages/SeatMapPage'
import { getTripSeats } from '@/services/trips'
import { useBookingStore } from '@/store/useBookingStore'
import type { Trip } from '@/types'

vi.mock('@/services/trips')

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockGetTripSeats = vi.mocked(getTripSeats)

const mockTrip: Trip = {
  id: 1,
  route: { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', estimatedDuration: '6h' },
  departureDateTime: '2026-06-17T08:00:00',
  basePrice: 89.9,
  availableSeats: 15,
  totalSeats: 40,
}

function renderSeatMapPage() {
  return render(
    <MemoryRouter initialEntries={['/viagens/1/assentos']}>
      <Routes>
        <Route path="/viagens/:id/assentos" element={<SeatMapPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('SeatMapPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetTripSeats.mockResolvedValue([])
    useBookingStore.setState({ selectedTrip: null })
  })

  it('deve exibir mensagem quando nenhuma viagem está selecionada', () => {
    renderSeatMapPage()

    expect(screen.getByText('Nenhuma viagem selecionada.')).toBeInTheDocument()
  })

  it('deve exibir informações da viagem', async () => {
    useBookingStore.setState({ selectedTrip: mockTrip })
    renderSeatMapPage()

    expect(screen.getByText(/São Paulo.*Rio de Janeiro/)).toBeInTheDocument()
  })

  it('deve renderizar os assentos corretamente', async () => {
    useBookingStore.setState({ selectedTrip: mockTrip })
    mockGetTripSeats.mockResolvedValue([
      { number: 1, isOccupied: false },
      { number: 2, isOccupied: true },
      { number: 3, isOccupied: false },
    ])

    renderSeatMapPage()

    await waitFor(() => {
      expect(screen.getByLabelText('Assento 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Assento 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Assento 3')).toBeInTheDocument()
    })
  })

  it('não deve permitir selecionar assento ocupado', async () => {
    useBookingStore.setState({ selectedTrip: mockTrip })
    mockGetTripSeats.mockResolvedValue([{ number: 1, isOccupied: true }])

    renderSeatMapPage()

    await waitFor(() => {
      expect(screen.getByLabelText('Assento 1')).toBeDisabled()
    })
  })

  it('deve selecionar um assento livre ao clicar', async () => {
    useBookingStore.setState({ selectedTrip: mockTrip })
    mockGetTripSeats.mockResolvedValue([{ number: 1, isOccupied: false }])

    renderSeatMapPage()

    await waitFor(() => {
      expect(screen.getByLabelText('Assento 1')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByLabelText('Assento 1'))

    expect(screen.getByLabelText('Assento 1')).toHaveAttribute('aria-pressed', 'true')
  })

  it('deve habilitar botão continuar após selecionar assento', async () => {
    useBookingStore.setState({ selectedTrip: mockTrip })
    mockGetTripSeats.mockResolvedValue([{ number: 1, isOccupied: false }])

    renderSeatMapPage()

    expect(screen.getByText('Continuar')).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByLabelText('Assento 1')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByLabelText('Assento 1'))

    expect(screen.getByText('Continuar')).not.toBeDisabled()
  })

  it('deve navegar para próxima tela ao confirmar assento', async () => {
    useBookingStore.setState({ selectedTrip: mockTrip })
    mockGetTripSeats.mockResolvedValue([{ number: 1, isOccupied: false }])

    renderSeatMapPage()

    await waitFor(() => {
      expect(screen.getByLabelText('Assento 1')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByLabelText('Assento 1'))
    await userEvent.click(screen.getByText('Continuar'))

    expect(mockNavigate).toHaveBeenCalledWith('/reservas/nova')
  })
})
