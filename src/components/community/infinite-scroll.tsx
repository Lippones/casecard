'use client'

import { Loader2 } from 'lucide-react'
import { useQueryState, parseAsInteger } from 'nuqs'
import { useEffect, useRef } from 'react'

interface InfinityScrollProps {
  maxPages: number
}

export function InfinityScroll({ maxPages }: InfinityScrollProps) {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entities) => {
      const target = entities[0]

      if (target.isIntersecting) {
        if (page >= maxPages) {
          setPage(page)
          return
        }
        setPage(page + 1)
      }
    })

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }
  }, [])

  if (page >= maxPages) {
    return null
  }

  return (
    <div ref={loadMoreRef}>
      <Loader2 className="animate-spin" />
    </div>
  )
}
