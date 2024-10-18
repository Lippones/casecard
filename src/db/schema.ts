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

export const purchase = pgTable('purchases', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  value: decimal().notNull(),
  priceId: text('price_id').notNull(),
  emailSent: boolean().default(false),
  paymentStatus: paymentStatus('payment_status'),
})

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text().notNull().unique(),
})
