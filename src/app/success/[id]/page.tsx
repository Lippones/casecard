import { getPurchase } from '@/actions/get-purchase'
import { Confetti } from '@/components/confetti'
import { Preview } from './preview'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Success(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { purchase } = await getPurchase(params.id)

  if (!purchase) {
    return <h1>Não foi possivel encontrar sua compra</h1>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh max-w-screen-lg mx-auto space-y-6">
      <Suspense>
        <Confetti />
      </Suspense>
      <h1 className="text-primary font-medium text-xl">Thank you!</h1>
      <p className="text-4xl font-semibold">Purchase Completed Successfully!</p>
      {purchase.deliveryMethod === 'email' && (
        <p className="text-muted-foreground">
          The sticker has been sent to your email
        </p>
      )}
      <div className="max-w-[700px] w-full">
        <Preview accessKey={purchase.accessKey} />
        <Button size={'lg'} className="mt-6 w-full" asChild>
          <Link href="/">Back to site</Link>
        </Button>
      </div>
    </div>
  )
}
