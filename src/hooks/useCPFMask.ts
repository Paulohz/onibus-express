import { useState } from 'react'

function formatCPF(value: string) {
  const cleaned = value.replace(/\D/g, '').slice(0, 11)

  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
  if (cleaned.length <= 9)
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
}

export function useCPFMask() {
  const [displayValue, setDisplayValue] = useState('')

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDisplayValue(formatCPF(e.target.value))
  }

  return { displayValue, onChange }
}
