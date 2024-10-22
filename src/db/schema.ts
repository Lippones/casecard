import { relations } from 'drizzle-orm'
import {
  integer,
  decimal,
  text,
  pgTable,
  boolean,
  serial,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const paymentStatus = pgEnum('payment_status', ['paid', 'unpaid'])
export const deliveryMethod = pgEnum('delivery_method', ['email', 'home'])

export const purchase = pgTable('purchases', {
  id: serial('id').primaryKey(),
  userId: integer().notNull(),
  accessKey: text('access_key').notNull().unique(),
  imageUrl: text('image_url').notNull(),
  value: decimal().notNull(),
  priceId: text('price_id').notNull(),
  emailSent: boolean().default(false),
  paymentStatus: paymentStatus('payment_status'),
  deliveryMethod: deliveryMethod('delivery_method'),
})

export const purchaseRelations = relations(purchase, ({ one }) => ({
  author: one(user, {
    fields: [purchase.userId],
    references: [user.id],
  }),
}))

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text().notNull().unique(),
})

export const userRelations = relations(user, ({ many }) => ({
  purchases: many(purchase),
}))
