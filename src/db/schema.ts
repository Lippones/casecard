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
  accessKey: text('access_key').notNull().unique(),
  imageUrl: text('image_url').notNull(),
  value: decimal().notNull(),
  priceId: text('price_id').notNull(),
  emailSent: boolean().default(false),
  paymentStatus: paymentStatus('payment_status'),
  deliveryMethod: deliveryMethod('delivery_method'),
})

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text().notNull().unique(),
})
