'use server'

import { db } from '@/db/drizzle'
import { purchase } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'

const updatePaymentSchema = z.object({
  purchaseId: z.number(),
  status: z.enum(['paid', 'unpaid']),
})

export const updatePayment = createSafeActionClient()
  .schema(updatePaymentSchema)
  .action(async ({ parsedInput: { purchaseId, status } }) => {
    console.log(purchaseId)

    const updatedPurchase = await db
      .update(purchase)
      .set({
        paymentStatus: status,
      })
      .where(eq(purchase.id, purchaseId))
      .returning()

    if (updatedPurchase.length === 0) {
      return
    }

    if (
      updatedPurchase[0].paymentStatus === 'paid' &&
      updatedPurchase[0].deliveryMethod === 'email'
    ) {
      const { userId } = updatedPurchase[0]
      // TODO: Enviar Email de confirmação com a imagem
    }
  })
