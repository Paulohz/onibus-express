import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import SearchPage from '@/pages/SearchPage'
import { searchTrips } from '@/services/trips'
import type { Trip } from '@/types'

const mockNavigate = vi.fn()

vi.mock('@/services/trips')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})
vi.mock('@/components/DatePicker', () => ({
  DatePicker: ({
    onChange,
    error,
  }: {
    value: string | undefined
    onChange: (val: string) => void
    error?: string
  }) => (
    <div>
      <input data-testid="date-picker" type="date" onChange={(e) => onChange(e.target.value)} />
      {error && <p>{error}</p>}
    </div>
  ),
}))

const mockSearchTrips = vi.mocked(searchTrips)

function renderSearchPage() {
  return render(
    <MemoryRouter>
      <SearchPage />
    </MemoryRouter>
  )
}

const mockTrip: Trip = {
  id: 1,
  route: { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', estimatedDuration: '6h' },
  departureDateTime: '2026-06-17T08:00:00',
  basePrice: 89.9,
  availableSeats: 15,
  totalSeats: 40,
}

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar o formulário de busca', () => {
    renderSearchPage()

    expect(screen.getByLabelText('Origem')).toBeInTheDocument()
    expect(screen.getByLabelText('Destino')).toBeInTheDocument()
    expect(screen.getByText('Buscar passagens')).toBeInTheDocument()
  })

  it('deve exibir erros ao submeter formulário vazio', async () => {
    renderSearchPage()

    await userEvent.click(screen.getByText('Buscar passagens'))

    expect(await screen.findByText('Informe a cidade de origem')).toBeInTheDocument()
    expect(await screen.findByText('Informe a cidade de destino')).toBeInTheDocument()
  })

  it('deve exibir erro quando origem e destino são iguais', async () => {
    renderSearchPage()

    await userEvent.type(screen.getByLabelText('Origem'), 'São Paulo')
    await userEvent.type(screen.getByLabelText('Destino'), 'São Paulo')
    await userEvent.type(screen.getByTestId('date-picker'), '2026-06-17')
    await userEvent.click(screen.getByText('Buscar passagens'))

    expect(await screen.findByText('Origem e destino não podem ser iguais')).toBeInTheDocument()
  })

  it('deve exibir viagens após busca bem sucedida', async () => {
    mockSearchTrips.mockResolvedValue([mockTrip])

    renderSearchPage()

    await userEvent.type(screen.getByLabelText('Origem'), 'São Paulo')
    await userEvent.type(screen.getByLabelText('Destino'), 'Rio de Janeiro')
    await userEvent.type(screen.getByTestId('date-picker'), '2026-06-17')
    await userEvent.click(screen.getByText('Buscar passagens'))

    await waitFor(() => {
      expect(screen.getByText('São Paulo → Rio de Janeiro')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem quando não há viagens', async () => {
    mockSearchTrips.mockResolvedValue([])

    renderSearchPage()

    await userEvent.type(screen.getByLabelText('Origem'), 'Curitiba')
    await userEvent.type(screen.getByLabelText('Destino'), 'Florianópolis')
    await userEvent.type(screen.getByTestId('date-picker'), '2026-06-17')
    await userEvent.click(screen.getByText('Buscar passagens'))

    expect(await screen.findByText('Nenhuma viagem encontrada')).toBeInTheDocument()
  })
})
