import { z } from 'zod'

const ticker = z.object({
  bid: z.string(),
  ask: z.string(),
  timestamp: z.number()
})

export type TickerData = z.infer<typeof ticker>
