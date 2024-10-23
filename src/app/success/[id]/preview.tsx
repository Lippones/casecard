'use client'
import { getSignedUrl } from '@/actions/get-signed-url'
import CardPreview from '@/components/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'

interface PreviewProps {
  accessKey: string
}

export function Preview({ accessKey }: PreviewProps) {
  const { execute, isExecuting = true, result } = useAction(getSignedUrl)

  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    execute({
      fileName: accessKey,
    })
  }, [])

  useEffect(() => {
    if (result.data) {
      setImageUrl(result.data)
    }
  }, [result])

  if (isExecuting || !imageUrl) {
    return <Skeleton className="h-full w-full rounded-[37px]" />
  }

  if (imageUrl) {
    return <CardPreview imgSrc={imageUrl} />
  }
}
