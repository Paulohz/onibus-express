import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { DatePicker } from '@/components/DatePicker'

describe('DatePicker', () => {
  it('deve exibir placeholder quando sem valor', () => {
    render(<DatePicker value="" onChange={vi.fn()} />)

    expect(screen.getByText('Selecione uma data')).toBeInTheDocument()
  })

  it('deve exibir a data formatada quando tem valor', () => {
    render(<DatePicker value="2026-06-17" onChange={vi.fn()} />)

    expect(screen.getByText('17/06/2026')).toBeInTheDocument()
  })

  it('deve exibir mensagem de erro quando passada', () => {
    render(<DatePicker value="" onChange={vi.fn()} error="Informe a data de ida" />)

    expect(screen.getByText('Informe a data de ida')).toBeInTheDocument()
  })
})
