'use server'

import { db } from '@/db/drizzle'
import { artwork, purchase } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getPurchase(purchaseId: string) {
  const purchaseWithArtwork = await db
    .select()
    .from(purchase)
    .leftJoin(artwork, eq(artwork.id, purchase.artWorkId))
    .where(eq(purchase.id, purchaseId))

  return purchaseWithArtwork[0]
}
