import { randomUUID } from 'node:crypto'
import { relations } from 'drizzle-orm'
import {
  integer,
  decimal,
  text,
  pgTable,
  boolean,
  serial,
  pgEnum,
  uuid,
  timestamp,
} from 'drizzle-orm/pg-core'

export const paymentStatus = pgEnum('payment_status', ['paid', 'unpaid'])
export const deliveryMethod = pgEnum('delivery_method', ['email', 'home'])

export const purchase = pgTable('purchases', {
  id: uuid('id').$default(randomUUID).primaryKey(),
  artWorkId: uuid('art_work_id').notNull(),
  userId: uuid('user_id').notNull(),
  value: decimal().notNull(),
  priceId: text('price_id').notNull(),
  emailSent: boolean('email_sent').default(false),
  paymentId: text('payment_id'),
  paymentStatus: paymentStatus('payment_status'),
  deliveryMethod: deliveryMethod('delivery_method'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const purchaseRelations = relations(purchase, ({ one }) => ({
  artwork: one(artwork, {
    fields: [purchase.artWorkId],
    references: [artwork.id],
  }),
  user: one(user, {
    fields: [purchase.userId],
    references: [user.id],
  }),
}))

export const artwork = pgTable('artworks', {
  id: uuid('id').$default(randomUUID).primaryKey(),
  userId: uuid('user_id').notNull(),
  imageUrl: text('image_url').notNull(),
  accessKey: text('access_key').notNull().unique(),
  isPublic: boolean('is_public').default(false),
  nsfw: boolean().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const artWorkRelations = relations(artwork, ({ one }) => ({
  user: one(user, {
    fields: [artwork.userId],
    references: [user.id],
  }),
}))

export const user = pgTable('users', {
  id: uuid('id').$default(randomUUID).primaryKey(),
  email: text().notNull().unique(),
})

export const userRelations = relations(user, ({ many }) => ({
  purchases: many(purchase),
  artworks: many(artwork),
}))
