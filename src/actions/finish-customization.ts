'use server'
import { db } from '@/db/drizzle'
import { purchase, user } from '@/db/schema'
import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { Decimal } from 'decimal.js'
import { env } from '@/env'
import { eq } from 'drizzle-orm'

const finishCustomizationSchema = z.object({
  imageUrl: z.string().url(),
  email: z.string().email(),
  deliveryMethod: z.enum(['email', 'home']),
  accessKey: z.string(),
})

export const finishCustomization = createSafeActionClient()
  .schema(finishCustomizationSchema)
  .action(
    async ({ parsedInput: { email, imageUrl, deliveryMethod, accessKey } }) => {
      const decimalValue = new Decimal(0)

      const userAlreadyExists = await db
        .select()
        .from(user)
        .where(eq(user.email, email))

      if (userAlreadyExists.length > 0) {
        await db.insert(purchase).values({
          imageUrl,
          priceId: env.STRIPE_PRICE_ID,
          value: decimalValue.toString(),
          paymentStatus: 'unpaid',
          deliveryMethod,
          accessKey,
        })

        return
      }

      await Promise.all([
        db.insert(user).values({
          email,
        }),
        db.insert(purchase).values({
          imageUrl,
          priceId: env.STRIPE_PRICE_ID,
          value: decimalValue.toString(),
          paymentStatus: 'unpaid',
          deliveryMethod,
          accessKey,
        }),
      ])
    },
  )
