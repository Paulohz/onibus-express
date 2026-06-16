import { z } from 'zod'

export const bookingSearchSchema = z.object({
  code: z
    .string()
    .min(1, 'Informe o código da reserva')
    .regex(/^[A-Z]{3}-\d{5}$/, 'Formato inválido. Ex: ABC-12345'),
})

export type BookingSearchForm = z.infer<typeof bookingSearchSchema>
