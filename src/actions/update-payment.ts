'use server'

import { db } from '@/db/drizzle'
import { artwork, purchase, user } from '@/db/schema'
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
      const { userId, artWorkId } = updatedPurchase[0]

      const image = await db
        .select()
        .from(artwork)
        .where(eq(artwork.id, artWorkId))

      if (image.length === 0) {
        throw new Error('Not Found')
      }

      const [findUser, file] = await Promise.all([
        db.select().from(user).where(eq(user.id, userId)),
        getFile({
          fileName: image[0].accessKey,
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
