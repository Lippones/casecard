import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'

const createCheckoutSchema = z.object({
  userId: z.number(),
  purchaseId: z.number(),
})

export const createCheckout = createSafeActionClient()
  .schema(createCheckoutSchema)
  .action(async () => {
    return 'Hello'
  })
