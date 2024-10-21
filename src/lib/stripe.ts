import { env } from '@/env'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia',
})

export default stripe
