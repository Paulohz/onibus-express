import { z } from 'zod'

export const searchSchema = z
  .object({
    origin: z.string().min(2, 'Informe a cidade de origem'),
    destination: z.string().min(2, 'Informe a cidade de destino'),
    date: z.string().min(1, 'Informe a data de ida'),
  })
  .superRefine((data, ctx) => {
    if (data.origin === data.destination) {
      ctx.addIssue({
        code: 'custom',
        message: 'Origem e destino não podem ser iguais',
        path: ['destination'],
      })
    }
  })

export type SearchForm = z.infer<typeof searchSchema>
