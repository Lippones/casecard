import { getPurchase } from '@/actions/get-purchase'
import { Confetti } from '@/components/confetti'
import { Preview } from './preview'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function Success(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { artworks, purchases } = await getPurchase(params.id)

  const t = await getTranslations('success')

  if (!purchases) {
    return <h1>{t('error')}</h1>
  }

  return (
    <div className="flex flex-col items-center px-4 justify-center min-h-svh max-w-screen-lg mx-auto space-y-6">
      <Suspense>
        <Confetti />
      </Suspense>
      <h1 className="text-primary font-medium text-xl">{t('title')}</h1>
      <p className="text-4xl font-semibold text-center">{t('description')}</p>
      {purchases.deliveryMethod === 'email' && (
        <p className="text-muted-foreground">{t('message.email')}</p>
      )}
      <div className="max-w-[700px] w-full">
        <Preview
          nsfw={artworks?.nsfw ?? false}
          accessKey={artworks?.accessKey ?? ''}
        />
        <Button size={'lg'} className="mt-6 w-full" asChild>
          <Link href="/">{t('backButton')}</Link>
        </Button>
      </div>
    </div>
  )
}
