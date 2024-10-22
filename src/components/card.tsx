'use client'
import { cn } from '@/lib/utils'
import { useEffect, useRef, type HTMLAttributes } from 'react'
import { AspectRatio } from './ui/aspect-ratio'
import Image from 'next/image'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string
  revokeUrl?: boolean
}

const Card = ({ imgSrc, className, revokeUrl = false }: CardProps) => {
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const imageElement = imageRef.current

    if (!imageElement) return

    const restoreStyles = () => {
      imageElement.style.userSelect = 'none'
      imageElement.style.pointerEvents = 'none'
      imageElement.draggable = false
    }

    const observer = new MutationObserver(() => {
      alert('Sai dai bixo')

      if (
        imageElement.style.userSelect === 'none' &&
        imageElement.style.pointerEvents === 'none' &&
        imageElement.draggable === false
      ) {
        return
      }

      restoreStyles()
    })

    observer.observe(imageElement, {
      attributes: true,
      attributeFilter: ['style', 'draggable'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <AspectRatio
      ratio={1011 / 638} // Proporção exata do cartão de crédito
      className={cn(
        'pointer-events-none aspect-[1011/638] w-full relative',
        className,
      )}>
      <Image
        ref={imageRef}
        fill
        src={imgSrc}
        onLoad={() => {
          if (revokeUrl) {
            URL.revokeObjectURL(imgSrc)
          }
        }}
        style={{ userSelect: 'none', pointerEvents: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        alt="preview"
        className="pointer-events-none select-none"
      />
    </AspectRatio>
  )
}

export default Card
