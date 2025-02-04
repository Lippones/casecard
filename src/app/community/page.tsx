import { getCommunityImages } from '@/actions/get-community-images'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Preview } from '../success/[id]/preview'
import { NsfwContentDialog } from '@/components/nsfw-content-dialog'
import { cookies } from 'next/headers'
import { formatDistance } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'
import { getTranslations } from 'next-intl/server'
import { InfinityScroll } from '@/components/community/infinite-scroll'
import { Footer } from '@/components/footer'

export default async function Community({
  searchParams,
}: {
  searchParams: Promise<{
    page: number | undefined
  }>
}) {
  const { page } = await searchParams
  const cookieStore = await cookies()
  const t = await getTranslations('community')

  const locale = cookieStore.get('locale')?.value ?? 'en'

  const majority = cookieStore.get('majority')?.value === 'true'

  const { artworks, meta } = await getCommunityImages({
    page: page ?? 1,
  })

  return (
    <div className="mx-auto container w-full pt-20 md:pt-10 px-4 md:px-8">
      <NsfwContentDialog />
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      {majority && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 w-full mt-12 pb-10">
          {artworks.map(({ artworks, users }) => {
            return (
              <Card key={artworks.id}>
                <CardHeader>
                  <CardTitle>{users?.email}</CardTitle>
                  <CardDescription>
                    {formatDistance(new Date(artworks.createdAt), new Date(), {
                      addSuffix: true,
                      locale: locale === 'en' ? enUS : ptBR,
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-w-[638px]">
                  <Preview
                    nsfw={artworks.nsfw ?? false}
                    accessKey={artworks.accessKey}
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
      <div className="flex justify-center w-full">
        <InfinityScroll maxPages={meta.totalPages} />
      </div>

      <Footer />
    </div>
  )
}
