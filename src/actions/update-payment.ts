'use server'

import { db } from '@/db/drizzle'
import { purchase, user } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { getFile } from './get-file'
import { sendEmail } from '@/lib/resend'

const updatePaymentSchema = z.object({
  purchaseId: z.string(),
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
      const { accessKey, userId } = updatedPurchase[0]

      const [findUser, file] = await Promise.all([
        db.select().from(user).where(eq(user.id, userId)),
        getFile({
          fileName: accessKey,
        }),
      ])

      if (findUser.length === 0 || !file?.data) {
        return
      }

      const { email } = findUser[0]

      const { data } = await sendEmail({
        to: email,
        text: 'Purchase Completed Successfully!, your sticker is attached.',
        attachments: [
          {
            content: Buffer.from(file.data),
            contentType: 'image/png',
            filename: 'sticker.png',
          },
        ],
        subject: 'Thank you!',
      })

      if (data) {
        await db
          .update(purchase)
          .set({
            emailSent: true,
          })
          .where(eq(purchase.id, purchaseId))
      }
    }
  })
