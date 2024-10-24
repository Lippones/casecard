import { updatePayment } from '@/actions/update-payment'
import { env } from '@/env'
import stripe from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

const secret = env.STRIPE_WEBHOOK

export async function POST(req: Request) {
  try {
    const body = await req.text()

    const signature = req.headers.get('stripe-signature')

    if (!secret || !signature) {
      throw new Error('Missing secret or signature')
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret)

    switch (event.type) {
      case 'checkout.session.completed':
        if (event.data.object.payment_status === 'paid') {
          // pagagamento por cartão com sucesso
          const purchaseId = event.data.object.metadata?.purchaseId

          if (!purchaseId) {
            return NextResponse.json(
              {
                message: 'purchaseId not found',
                ok: false,
              },
              { status: 500 },
            )
          }

          await updatePayment({
            purchaseId,
            status: event.data.object.payment_status,
          })
        }

        break

      case 'checkout.session.expired':
        if (event.data.object.payment_status === 'unpaid') {
          const purchaseId = event.data.object.metadata?.purchaseId

          if (!purchaseId) {
            return NextResponse.json(
              {
                message: 'purchaseId not found',
                ok: false,
              },
              { status: 500 },
            )
          }

          await updatePayment({
            purchaseId,
            status: event.data.object.payment_status,
          })
        }
        break
    }

    return NextResponse.json({ result: event, ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        message: `Webhook error: ${error}`,
        ok: false,
      },
      { status: 500 },
    )
  }
}
