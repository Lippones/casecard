'use server'
import { env } from '@/env'
import stripe from '@/lib/stripe'
import { createSafeActionClient } from 'next-safe-action'
import { headers } from 'next/headers'
import { z } from 'zod'

const createCheckoutSchema = z.object({
  purchaseId: z.string(),
  email: z.string(),
})

export const createCheckout = createSafeActionClient()
  .schema(createCheckoutSchema)
  .action(async ({ parsedInput: { purchaseId, email } }) => {
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
      customer_email: email,
      payment_method_types: ['card'],
      success_url: `${origin}/suceess/${purchaseId}`,
      cancel_url: `${origin}/`,
      metadata: {
        purchaseId,
      },
    })

    return session
  })
