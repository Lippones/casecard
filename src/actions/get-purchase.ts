'use server'

import { db } from '@/db/drizzle'
import { purchase } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getPurchase(purchaseId: string) {
  const purschaseAlreadyExists = await db
    .select()
    .from(purchase)
    .where(eq(purchase.id, purchaseId))

  return {
    purchase: purschaseAlreadyExists[0],
  }
}
