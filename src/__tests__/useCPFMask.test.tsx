import { renderHook, act } from '@testing-library/react'
import { useCPFMask } from '@/hooks/useCPFMask'

describe('useCPFMask', () => {
  it('deve formatar CPF enquanto digita', () => {
    const { result } = renderHook(() => useCPFMask())

    act(() => {
      result.current.onChange({
        target: { value: '12345678900' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.displayValue).toBe('123.456.789-00')
  })

  it('deve formatar parcialmente com 6 dígitos', () => {
    const { result } = renderHook(() => useCPFMask())

    act(() => {
      result.current.onChange({
        target: { value: '123456' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.displayValue).toBe('123.456')
  })

  it('deve ignorar caracteres não numéricos', () => {
    const { result } = renderHook(() => useCPFMask())

    act(() => {
      result.current.onChange({
        target: { value: 'abc123def' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.displayValue).toBe('123')
  })

  it('deve limitar a 11 dígitos', () => {
    const { result } = renderHook(() => useCPFMask())

    act(() => {
      result.current.onChange({
        target: { value: '123456789001234' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.displayValue).toBe('123.456.789-00')
  })
})
