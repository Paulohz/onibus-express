import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '@/components/Header'

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )
}

describe('Header', () => {
  it('deve renderizar o nome do sistema', () => {
    renderHeader()

    expect(screen.getByText('OniBus Express')).toBeInTheDocument()
  })

  it('deve renderizar o link de consultar reserva', () => {
    renderHeader()

    expect(screen.getByText('Consultar reserva')).toBeInTheDocument()
  })

  it('deve ter link para home', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: 'OniBus Express' })).toHaveAttribute('href', '/')
  })

  it('deve ter link para consulta de reserva', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: 'Consultar reserva' })).toHaveAttribute(
      'href',
      '/reservas/consulta'
    )
  })
})
