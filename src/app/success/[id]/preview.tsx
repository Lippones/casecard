'use client'
import { getFile } from '@/actions/get-file'
import CardPreview from '@/components/card'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'

interface PreviewProps {
  accessKey: string
}

export function Preview({ accessKey }: PreviewProps) {
  const { execute, isExecuting = true, result } = useAction(getFile)

  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    execute({
      fileName: accessKey,
    })
  }, [])

  useEffect(() => {
    if (result.data) {
      const blob = new Blob([result.data], { type: 'image/png' })

      const objectUrl = URL.createObjectURL(blob)

      setImageUrl(objectUrl)
    }
  }, [result])

  if (isExecuting || !imageUrl) {
    return <Skeleton className="h-full w-full rounded-[37px]" />
  }

  if (imageUrl) {
    return <CardPreview imgSrc={imageUrl} revokeUrl />
  }
}
