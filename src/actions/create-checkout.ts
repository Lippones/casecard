'use server'
import { env } from '@/env'
import stripe from '@/lib/stripe'
import { createSafeActionClient } from 'next-safe-action'
import { headers } from 'next/headers'
import { z } from 'zod'

const createCheckoutSchema = z.object({
  userId: z.number(),
  purchaseId: z.number(),
  imageUrl: z.string().url(),
})

export const createCheckout = createSafeActionClient()
  .schema(createCheckoutSchema)
  .action(async ({ parsedInput: { purchaseId, userId, imageUrl } }) => {
    const header = await headers()

    const origin = header.get('origin')

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: `${origin}/sucesso`,
      cancel_url: `${origin}/`,
      metadata: {
        purchaseId,
        userId,
      },
    })

    return session
  })
