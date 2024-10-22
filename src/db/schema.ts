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
} from 'drizzle-orm/pg-core'

export const paymentStatus = pgEnum('payment_status', ['paid', 'unpaid'])
export const deliveryMethod = pgEnum('delivery_method', ['email', 'home'])

export const purchase = pgTable('purchases', {
  id: uuid('id').$default(randomUUID).primaryKey(),
  userId: uuid('user_id').notNull(),
  accessKey: text('access_key').notNull().unique(),
  imageUrl: text('image_url').notNull(),
  value: decimal().notNull(),
  priceId: text('price_id').notNull(),
  emailSent: boolean('email_sent').default(false),
  paymentStatus: paymentStatus('payment_status'),
  deliveryMethod: deliveryMethod('delivery_method'),
})

export const purchaseRelations = relations(purchase, ({ one }) => ({
  user: one(user, {
    fields: [purchase.userId],
    references: [user.id],
  }),
}))

export const user = pgTable('users', {
  id: uuid('id').$default(randomUUID).primaryKey(),
  email: text().notNull().unique(),
})

export const userRelations = relations(user, ({ many }) => ({
  purchases: many(purchase),
}))
