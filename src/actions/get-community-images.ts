'use server'
import { db } from '@/db/drizzle'
import { artwork, purchase, user } from '@/db/schema'
import { and, count, desc, eq } from 'drizzle-orm'

const perPage = 20

interface GetCommunityImagesProps {
  page: number
}

export async function getCommunityImages({ page }: GetCommunityImagesProps) {
  const [artworks, countArtwork] = await Promise.all([
    db
      .select()
      .from(artwork)
      .innerJoin(purchase, eq(artwork.id, purchase.artWorkId))
      .innerJoin(user, eq(artwork.userId, user.id))
      .where(
        and(eq(artwork.isPublic, true), eq(purchase.paymentStatus, 'paid')),
      )
      .orderBy(desc(artwork.createdAt))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db
      .select({ count: count() })
      .from(artwork)
      .innerJoin(purchase, eq(artwork.id, purchase.artWorkId))
      .innerJoin(user, eq(artwork.userId, user.id))
      .where(
        and(eq(artwork.isPublic, true), eq(purchase.paymentStatus, 'paid')),
      ),
  ])

  const totalPages = countArtwork[0].count / perPage

  return {
    artworks,
    meta: {
      page,
      totalPages,
      totalCount: countArtwork[0].count,
    },
  }
}
