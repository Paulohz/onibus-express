import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import SearchPage from '@/pages/SearchPage'
import { searchTrips, getRoutes } from '@/services/trips'
import type { Trip } from '@/types'

const mockRouteCombobox = vi.fn()

vi.mock('@/services/trips')
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
vi.mock('@/components/RouteCombobox', () => ({
  RouteCombobox: (props: {
    id: string
    value: string
    onChange: (val: string) => void
    placeholder: string
    error?: string
  }) => mockRouteCombobox(props),
}))

const mockSearchTrips = vi.mocked(searchTrips)
const mockGetRoutes = vi.mocked(getRoutes)
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

function renderSearchPage() {
  return render(
    <MemoryRouter>
      <SearchPage />
    </MemoryRouter>
  )
}

type ComboboxProps = {
  id: string
  value: string
  onChange: (val: string) => void
  placeholder: string
  error?: string
}

function defaultComboboxImpl({ id, onChange, placeholder, error }: ComboboxProps) {
  return (
    <div>
      <button id={id} onClick={() => onChange(id === 'origin' ? 'São Paulo' : 'Rio de Janeiro')}>
        {placeholder}
      </button>
      {error && <p>{error}</p>}
    </div>
  )
}

function sameValueComboboxImpl({ id, onChange, placeholder, error }: ComboboxProps) {
  return (
    <div>
      <button id={id} onClick={() => onChange('São Paulo')}>
        {placeholder}
      </button>
      {error && <p>{error}</p>}
    </div>
  )
}

async function selectOrigin() {
  await userEvent.click(screen.getByText('Selecione a origem'))
}

async function selectDestination() {
  await userEvent.click(screen.getByText('Selecione o destino'))
}

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetRoutes.mockResolvedValue([
      { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', estimatedDuration: '6h' },
    ])
    mockRouteCombobox.mockImplementation(defaultComboboxImpl)
  })

  it('deve renderizar o formulário de busca', () => {
    renderSearchPage()

    expect(screen.getByText('Selecione a origem')).toBeInTheDocument()
    expect(screen.getByText('Selecione o destino')).toBeInTheDocument()
    expect(screen.getByText('Buscar passagens')).toBeInTheDocument()
  })

  it('deve exibir erros ao submeter formulário vazio', async () => {
    renderSearchPage()

    await userEvent.click(screen.getByText('Buscar passagens'))

    expect(await screen.findByText('Informe a cidade de origem')).toBeInTheDocument()
    expect(await screen.findByText('Informe a cidade de destino')).toBeInTheDocument()
  })

  it('deve exibir erro quando origem e destino são iguais', async () => {
    mockRouteCombobox.mockImplementation(sameValueComboboxImpl)

    renderSearchPage()

    await selectOrigin()
    await selectDestination()
    await userEvent.type(screen.getByTestId('date-picker'), '2026-06-17')
    await userEvent.click(screen.getByText('Buscar passagens'))

    expect(await screen.findByText('Origem e destino não podem ser iguais')).toBeInTheDocument()
  })

  it('deve exibir viagens após busca bem sucedida', async () => {
    mockSearchTrips.mockResolvedValue([mockTrip])

    renderSearchPage()

    await selectOrigin()
    await selectDestination()
    await userEvent.type(screen.getByTestId('date-picker'), '2026-06-17')
    await userEvent.click(screen.getByText('Buscar passagens'))

    await waitFor(() => {
      expect(screen.getByText('São Paulo - Rio de Janeiro')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem quando não há viagens', async () => {
    mockSearchTrips.mockResolvedValue([])

    renderSearchPage()

    await selectOrigin()
    await selectDestination()
    await userEvent.type(screen.getByTestId('date-picker'), '2026-06-17')
    await userEvent.click(screen.getByText('Buscar passagens'))

    expect(await screen.findByText('Nenhuma viagem encontrada')).toBeInTheDocument()
  })
})
