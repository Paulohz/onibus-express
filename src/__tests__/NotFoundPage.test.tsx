import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import NotFoundPage from '@/pages/NotFoundPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderPage() {
  return render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  )
}

describe('NotFoundPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve exibir o código 404', () => {
    renderPage()

    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('deve exibir mensagem de página não encontrada', () => {
    renderPage()

    expect(screen.getByText('Página não encontrada')).toBeInTheDocument()
  })

  it('deve navegar para home ao clicar no botão', async () => {
    renderPage()

    await userEvent.click(screen.getByText('Voltar para o início'))

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
