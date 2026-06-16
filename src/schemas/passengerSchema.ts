import { z } from 'zod'

function validateCPF(cpf: string) {
  const cleaned = cpf.replace(/\D/g, '')

  if (cleaned.length !== 11) return false
  if (/^(\d)\1+$/.test(cleaned)) return false

  const calc = (factor: number) =>
    cleaned
      .slice(0, factor - 1)
      .split('')
      .reduce((sum, digit, i) => sum + Number(digit) * (factor - i), 0)

  const remainder = (sum: number) => ((sum * 10) % 11) % 10

  const first = remainder(calc(10))
  if (first !== Number(cleaned[9])) return false

  const second = remainder(calc(11))
  if (second !== Number(cleaned[10])) return false

  return true
}

export const passengerSchema = z.object({
  name: z.string().min(3, 'Informe o nome completo'),
  cpf: z
    .string()
    .min(1, 'Informe o CPF')
    .refine((val) => validateCPF(val), 'CPF inválido'),
  email: z.email({ error: 'E-mail inválido' }),
})

export type PassengerForm = z.infer<typeof passengerSchema>
