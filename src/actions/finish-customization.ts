import { db } from '@/db/drizzle'
import { purchase, user } from '@/db/schema'
import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'

const finishCustomizationSchema = z.object({
  imageUrl: z.string().url(),
  email: z.string().email(),
})

export const finishCustomization = createSafeActionClient()
  .schema(finishCustomizationSchema)
  .action(async ({ parsedInput: { email, imageUrl } }) => {
    await Promise.all([
      db.insert(user).values({
        email,
      }),
      db.insert(purchase).values({
        imageUrl,
        priceId: '', // TODO: Pegar do env,
        value: '',
        paymentStatus: 'unpaid',
      }),
    ])

    return 'Hello'
  })
