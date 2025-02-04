'use client'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { AspectRatio } from './ui/aspect-ratio'
import Image from 'next/image'
import { useDisableContextMenuAndShortcuts } from '@/hooks/use-disable-context-menu-and-shortcuts'
import { Eye } from 'lucide-react'
import { Button } from './ui/button'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string
  revokeUrl?: boolean
  nsfw?: boolean
}

const Card = ({
  imgSrc,
  className,
  nsfw = false,
  revokeUrl = false,
}: CardProps) => {
  const imageRef = useRef<HTMLImageElement | null>(null)

  const [blurContent, setBlurContent] = useState(nsfw)

  useDisableContextMenuAndShortcuts()

  // useEffect(() => {
  //   const imageElement = imageRef.current

  //   if (!imageElement) return

  //   const restoreStyles = () => {
  //     imageElement.style.userSelect = 'none'
  //     imageElement.style.pointerEvents = 'none'
  //     imageElement.draggable = false
  //   }

  //   const observer = new MutationObserver(() => {
  //     if (
  //       imageElement.style.userSelect === 'none' &&
  //       imageElement.style.pointerEvents === 'none' &&
  //       imageElement.draggable === false
  //     ) {
  //       return
  //     }

  //     restoreStyles()
  //     alert('Sai dai bixo')
  //   })

  //   observer.observe(imageElement, {
  //     attributes: true,
  //     attributeFilter: ['style', 'draggable'],
  //   })

  //   return () => observer.disconnect()
  // }, [])

  return (
    <AspectRatio
      ratio={1011 / 638} // Proporção exata do cartão de crédito
      className={cn(
        'aspect-[1011/638] w-full relative overflow-hidden rounded-[16px]',
        className,
      )}>
      {blurContent && (
        <div className="h-full w-full absolute inset-0 z-20 flex items-center justify-center">
          <Button
            type="button"
            onClick={() => setBlurContent(false)}
            variant={'secondary'}
            className="">
            NSFW Content <Eye className="size-5 ml-2" />
          </Button>
        </div>
      )}
      <Image
        ref={imageRef}
        fill
        src={imgSrc}
        onLoad={() => {
          if (revokeUrl) {
            URL.revokeObjectURL(imgSrc)
          }
        }}
        style={{
          userSelect: 'none',
          pointerEvents: 'none',
          filter: blurContent ? 'blur(32px)' : '',
        }}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        alt="preview"
        className="pointer-events-none select-none"
      />
    </AspectRatio>
  )
}

export default Card
