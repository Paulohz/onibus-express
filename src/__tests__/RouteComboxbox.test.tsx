import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { RouteCombobox } from '@/components/RouteCombobox'

const options = ['São Paulo', 'Rio de Janeiro', 'Curitiba']

describe('RouteCombobox', () => {
  it('deve exibir o placeholder quando sem valor', () => {
    render(
      <RouteCombobox
        id="origin"
        options={options}
        value=""
        onChange={vi.fn()}
        placeholder="Selecione a origem"
      />
    )

    expect(screen.getByText('Selecione a origem')).toBeInTheDocument()
  })

  it('deve exibir o valor selecionado', () => {
    render(
      <RouteCombobox
        id="origin"
        options={options}
        value="São Paulo"
        onChange={vi.fn()}
        placeholder="Selecione a origem"
      />
    )

    expect(screen.getByText('São Paulo')).toBeInTheDocument()
  })

  it('deve exibir mensagem de erro quando passada', () => {
    render(
      <RouteCombobox
        id="origin"
        options={options}
        value=""
        onChange={vi.fn()}
        placeholder="Selecione a origem"
        error="Informe a cidade de origem"
      />
    )

    expect(screen.getByText('Informe a cidade de origem')).toBeInTheDocument()
  })

  it('deve chamar onChange ao selecionar uma opção', async () => {
    const mockOnChange = vi.fn()

    render(
      <RouteCombobox
        id="origin"
        options={options}
        value=""
        onChange={mockOnChange}
        placeholder="Selecione a origem"
      />
    )

    await userEvent.click(screen.getByText('Selecione a origem'))
    await userEvent.click(screen.getByText('São Paulo'))

    expect(mockOnChange).toHaveBeenCalledWith('São Paulo')
  })
})
