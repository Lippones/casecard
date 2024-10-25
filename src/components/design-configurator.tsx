'use client'

import NextImage from 'next/image'
import { AspectRatio } from './ui/aspect-ratio'
import { useRef, useState } from 'react'
import { Rnd } from 'react-rnd'
import { HandleComponent } from './handle-component'
import { Button } from './ui/button'

import { type DeliveryOption, PreviewDialog } from './preview-dialog'
import { finishCustomization } from '@/actions/finish-customization'
import { uploadFile } from '@/actions/upload-file'

import { loadStripe } from '@stripe/stripe-js'
import { env } from '@/env'
import { createCheckout } from '@/actions/create-checkout'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import useMediaQuery from '@/hooks/use-media-query'
import { SideBarConfigurator } from './sidebar-configurator'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ArrowUp } from 'lucide-react'
import posthog from 'posthog-js'

export type EditorImage = {
  index: number
  degrees: number
  url: string
  renderedPosition: {
    x: number
    y: number
  }
  renderedDimension: {
    width: number
    height: number
  }
}

export function DesignConfigurador() {
  const uploadImageButton = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isSmallScreen = useMediaQuery('(max-width: 768px)')

  const { toast } = useToast()

  const erros = useTranslations('errors')

  const [previewFile, setPreviewFile] = useState<File | null>(null)

  const [selectedImages, setSelectedImages] = useState<EditorImage[]>([])

  function handleAddImage(file: File) {
    const url = URL.createObjectURL(file)
    setSelectedImages([
      ...selectedImages,
      {
        url,
        index: selectedImages.length,
        degrees: 0,
        renderedDimension: {
          width: isSmallScreen ? 300 : 420,
          height: isSmallScreen ? 300 : 420,
        },
        renderedPosition: {
          x: containerRef.current!.offsetWidth / 2 - 150,
          y: isSmallScreen
            ? containerRef.current!.offsetHeight / 2 - 320
            : containerRef.current!.offsetHeight / 2 - 150,
        },
      },
    ])

    posthog.capture('Added an image')

    if (uploadImageButton.current) {
      uploadImageButton.current.value = ''
    }
  }

  const handleRotate = (url: string, degrees: number) => {
    const index = selectedImages.findIndex((image) => image.url === url)

    const newArray = selectedImages.map((image, i) => {
      if (i === index) {
        return {
          ...image,
          degrees: image.degrees + degrees,
        }
      }

      return image
    })

    setSelectedImages(newArray)
  }

  const handleMove = (url: string, value: number) => {
    const index = selectedImages.findIndex((image) => image.url === url)

    const newArray = selectedImages.map((image, i) => {
      if (i === index) {
        const newIndex = image.index + value
        if (newIndex <= 0) {
          return image
        }
        return {
          ...image,
          index: image.index + value,
        }
      }

      return image
    })

    setSelectedImages(newArray)
  }

  const handleRemove = (url: string) => {
    const newArray = selectedImages.filter((image) => image.url !== url)
    setSelectedImages(newArray)
  }

  async function saveConfiguration() {
    try {
      const {
        left: cardLeft,
        top: cardTop,
        width,
        height,
      } = cardRef.current!.getBoundingClientRect()

      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect()

      const leftOffset = cardLeft - containerLeft
      const topOffset = cardTop - containerTop

      // Criar o canvas original para desenhar as imagens
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        toast({
          title: erros('unexpected'),
        })
        return
      }

      ctx.fillStyle = '#CCEC60' // Cor de fundo
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const image of selectedImages) {
        const actualX = image.renderedPosition.x - leftOffset
        const actualY = image.renderedPosition.y - topOffset

        const userImage = new Image()
        userImage.crossOrigin = 'anonymous'
        userImage.src = image.url

        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        await new Promise((resolve) => (userImage.onload = resolve))

        // Desenhar a imagem no canvas original
        ctx.drawImage(
          userImage,
          actualX,
          actualY,
          image.renderedDimension.width,
          image.renderedDimension.height,
        )
      }

      // Criar um novo canvas para o upscale
      const upscaleCanvas = document.createElement('canvas')
      // Garante o tamanho correto do cartão
      const upscaleWidth = 1011
      const upscaleHeight = 638
      upscaleCanvas.width = upscaleWidth
      upscaleCanvas.height = upscaleHeight

      const upscaleCtx = upscaleCanvas.getContext('2d')

      if (!upscaleCtx) {
        toast({
          title: erros('unexpected'),
        })
        return
      }

      // Adicionar arredondamento ao canvas
      const borderRadius = 37
      upscaleCtx.beginPath()
      upscaleCtx.moveTo(borderRadius, 0)
      upscaleCtx.lineTo(upscaleWidth - borderRadius, 0)
      upscaleCtx.quadraticCurveTo(upscaleWidth, 0, upscaleWidth, borderRadius)
      upscaleCtx.lineTo(upscaleWidth, upscaleHeight - borderRadius)
      upscaleCtx.quadraticCurveTo(
        upscaleWidth,
        upscaleHeight,
        upscaleWidth - borderRadius,
        upscaleHeight,
      )
      upscaleCtx.lineTo(borderRadius, upscaleHeight)
      upscaleCtx.quadraticCurveTo(
        0,
        upscaleHeight,
        0,
        upscaleHeight - borderRadius,
      )
      upscaleCtx.lineTo(0, borderRadius)
      upscaleCtx.quadraticCurveTo(0, 0, borderRadius, 0)
      upscaleCtx.closePath()
      upscaleCtx.clip() // Aplicar a máscara de arredondamento

      upscaleCtx.fillStyle = '#CCEC60' // Cor de fundo
      upscaleCtx.fillRect(0, 0, upscaleCanvas.width, upscaleCanvas.height) // Preencher o canvas

      // Desenhar o canvas original no canvas upscale após aplicar o arredondamento
      upscaleCtx.drawImage(
        canvas,
        0,
        0,
        width,
        height,
        0,
        0,
        upscaleWidth,
        upscaleHeight,
      )

      // Gerar a imagem final como base64
      const base64 = upscaleCanvas.toDataURL()
      const base64Data = base64.split(',')[1]

      const blob = base64ToBlob(base64Data, 'image/png')
      const file = new File([blob], 'filename.png', { type: 'image/png' })

      posthog.capture('Open preview')

      setPreviewFile(file)
    } catch (error) {
      toast({
        title: erros('unexpected'),
      })
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }

  function setRenderedPositionAndDimension({
    x,
    y,
    height,
    width,
    url,
  }: { x: number; y: number; width?: number; height?: number; url: string }) {
    const index = selectedImages.findIndex((image) => image.url === url)

    const newArray = selectedImages.map((image, i) => {
      if (i === index) {
        return {
          ...image,
          renderedPosition: { x, y },
          renderedDimension:
            width && height ? { width, height } : image.renderedDimension,
        }
      }

      return image
    })

    setSelectedImages(newArray)
  }

  async function onSubmit({
    delivery,
    email,
  }: {
    email: string
    delivery: DeliveryOption
  }) {
    try {
      if (!previewFile) {
        toast({
          title: erros('unexpected'),
        })
        return
      }

      const { url, accessKey } = await uploadFile(previewFile)

      const data = await finishCustomization({
        email,
        imageUrl: url,
        deliveryMethod: delivery,
        accessKey,
      })

      if (!data?.data) {
        return
      }

      const { purschase, user } = data.data

      const stripeClient = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

      if (!stripeClient) throw new Error('Stripe failed to initialize.')

      const session = await createCheckout({
        purchaseId: purschase[0].id,
        email: user.email,
      })

      if (!session?.data) {
        return
      }

      const { id } = session.data

      posthog.capture('checkout')

      await stripeClient.redirectToCheckout({ sessionId: id })
    } catch (error) {
      toast({
        title: erros('unexpected'),
      })
    }
  }

  return (
    <div className="relative md:grid grid-cols-[1fr_1fr_400px] lg:grid-cols-[1fr_1fr_600px] h-full">
      <div
        ref={containerRef}
        className="relative h-full m-auto overflow-hidden col-span-2 w-full flex items-center justify-center text-center">
        <div className="relative w-[400px] bg-opacity-50 pointer-events-none aspect-[1011/638] max-md:bottom-40 max-md:px-4">
          <AspectRatio
            ref={cardRef}
            ratio={1011 / 638} // Proporção exata do cartão de crédito
            className="pointer-events-none aspect-[1011/638] w-full">
            <NextImage
              fill
              src={'/card.png'}
              alt="Base card img"
              className="pointer-events-none select-none"
            />
          </AspectRatio>

          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px shadow-[0_0_0_99999px_rgba(23,23,23,0.4)] " />
        </div>

        {selectedImages.map(
          ({ degrees, index, url, renderedDimension, renderedPosition }, i) => (
            <Rnd
              className="absolute border-4 border-blue-600"
              style={{
                zIndex: index,
              }}
              default={{
                height: renderedDimension.height,
                width: renderedDimension.width,
                x: renderedPosition.x,
                y: renderedPosition.y,
              }}
              key={url}
              onResizeStop={(_, __, ref, ___, { x, y }) => {
                setRenderedPositionAndDimension({
                  height: Number.parseInt(ref.style.height.slice(0, -2)),
                  width: Number.parseInt(ref.style.width.slice(0, -2)),
                  x,
                  y,
                  url,
                })
              }}
              onDragStop={(_, data) => {
                const { x, y } = data
                setRenderedPositionAndDimension({ x, y, url })
              }}
              resizeHandleComponent={{
                bottomLeft: <HandleComponent />,
                bottomRight: <HandleComponent />,
                topLeft: <HandleComponent />,
                topRight: <HandleComponent />,
              }}>
              <div
                className="w-full h-full"
                style={{
                  transform: `rotate(${degrees}deg)`, // Aplica a rotação
                }}>
                <NextImage
                  src={url}
                  alt="image"
                  fill
                  className="pointer-events-none"
                />
              </div>
            </Rnd>
          ),
        )}
      </div>

      {isSmallScreen ? (
        <Drawer defaultOpen>
          <DrawerTrigger asChild>
            <Button
              size={'lg'}
              className="absolute bottom-10 left-1/2 right-1/2 -translate-x-1/2 mx-auto z-40 w-[300px]">
              <ArrowUp className="size-4 mr-2" /> Open customizador
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-card">
            <SideBarConfigurator
              handleAddImage={handleAddImage}
              handleMove={handleMove}
              handleRemove={handleRemove}
              handleRotate={handleRotate}
              saveConfiguration={saveConfiguration}
              selectedImages={selectedImages}
              uploadImageButton={uploadImageButton}
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <div className="h-full flex flex-col bg-card border-l">
          <SideBarConfigurator
            handleAddImage={handleAddImage}
            handleMove={handleMove}
            handleRemove={handleRemove}
            handleRotate={handleRotate}
            saveConfiguration={saveConfiguration}
            selectedImages={selectedImages}
            uploadImageButton={uploadImageButton}
          />
        </div>
      )}

      {previewFile && (
        <PreviewDialog
          handleClose={() => setPreviewFile(null)}
          onSubmit={onSubmit}
          imageUrl={URL.createObjectURL(previewFile)}
        />
      )}
    </div>
  )
}
