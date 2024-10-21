import stripe from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

const secret =
  'whsec_7fb15834731560670d2311d56265039d868e92052a6222d657370e249273e227'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const header = await headers()

    const signature = header.get('stripe-signature')

    if (!secret || !signature) {
      throw new Error('Missing secret or signature')
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret)

    switch (event.type) {
      case 'checkout.session.completed':
        if (event.data.object.payment_status === 'paid') {
          // pagagamento por cartão com sucesso
          const purchaseId = event.data.object.metadata?.purchaseId
          const userId = event.data.object.metadata?.userId

          console.log('pagamento por cartão com sucesso', {
            purchaseId,
            userId,
          })
        }

        break

      case 'checkout.session.expired':
        if (event.data.object.payment_status === 'unpaid') {
          const purchaseId = event.data.object.metadata?.purchaseId
          const userId = event.data.object.metadata?.userId

          console.log('checkout expirado', {
            purchaseId,
            userId,
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
