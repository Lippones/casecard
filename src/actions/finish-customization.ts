'use server'
import { db } from '@/db/drizzle'
import { artwork, purchase, user } from '@/db/schema'
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
  isPublic: z.boolean(),
  isNSFW: z.boolean(),
})

export const finishCustomization = createSafeActionClient()
  .schema(finishCustomizationSchema)
  .action(
    async ({
      parsedInput: { email, imageUrl, deliveryMethod, accessKey, isPublic },
    }) => {
      const decimalValue = new Decimal(0)

      const userAlreadyExists = await db
        .select()
        .from(user)
        .where(eq(user.email, email))

      if (userAlreadyExists.length > 0) {
        const art = await db
          .insert(artwork)
          .values({
            imageUrl,
            isPublic,
            accessKey,
            userId: userAlreadyExists[0].id,
          })
          .returning()

        const createdPurchase = await db
          .insert(purchase)
          .values({
            artWorkId: art[0].id,
            priceId: env.STRIPE_PRICE_ID,
            value: decimalValue.toString(),
            paymentStatus: 'unpaid',
            deliveryMethod,
            userId: userAlreadyExists[0].id,
          })
          .returning()

        return {
          purchase: createdPurchase,
          user: userAlreadyExists[0],
        }
      }

      const createdUser = await db
        .insert(user)
        .values({
          email,
        })
        .returning()

      const art = await db
        .insert(artwork)
        .values({
          imageUrl,
          isPublic,
          accessKey,
          userId: createdUser[0].id,
        })
        .returning()

      const createdPurchase = await db
        .insert(purchase)
        .values({
          artWorkId: art[0].id,
          priceId: env.STRIPE_PRICE_ID,
          value: decimalValue.toString(),
          paymentStatus: 'unpaid',
          deliveryMethod,
          userId: createdUser[0].id,
        })
        .returning()

      return {
        purchase: createdPurchase,
        user: createdUser[0],
      }
    },
  )
