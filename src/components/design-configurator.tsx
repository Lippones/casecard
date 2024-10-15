'use client'

import NextImage from 'next/image'
import { AspectRatio } from './ui/aspect-ratio'
import { useEffect, useRef, useState } from 'react'
import { Rnd } from 'react-rnd'
import { HandleComponent } from './handle-component'
import { ScrollArea } from './ui/scroll-area'
import {
  ArrowDownFromLine,
  ArrowUpFromLine,
  Plus,
  RotateCcw,
  RotateCw,
} from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { convertJsonToBuffer } from '@/utils/convert-json-to-buffer'
import { convertBufferToJson } from '@/utils/convert-buffer-to-json'

export function DesignConfigurador() {
  const uploadImageButton = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedImages, setSelectedImages] = useState<
    {
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
    }[]
  >([])

  function handleAddImage(file: File) {
    const url = URL.createObjectURL(file)
    setSelectedImages([
      ...selectedImages,
      {
        url,
        index: selectedImages.length,
        degrees: 0,
        renderedDimension: {
          width: 420,
          height: 420,
        },
        renderedPosition: {
          x: containerRef.current!.offsetWidth / 2 - 150,
          y: containerRef.current!.offsetHeight / 2 - 150,
        },
      },
    ])

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

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')

      for (const image of selectedImages) {
        const actualX = image.renderedPosition.x - leftOffset
        const actualY = image.renderedPosition.y - topOffset

        const userImage = new Image()
        userImage.crossOrigin = 'anonymous'
        userImage.src = image.url
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        await new Promise((resolve) => (userImage.onload = resolve))

        ctx?.drawImage(
          userImage,
          actualX,
          actualY,
          image.renderedDimension.width,
          image.renderedDimension.height,
        )
      }

      const base64 = canvas.toDataURL()
      const base64Data = base64.split(',')[1]

      const blob = base64ToBlob(base64Data, 'image/png')
      const file = new File([blob], 'filename.png', { type: 'image/png' })

      // TODO: Implementar a lógica de salvar a imagem
    } catch (error) {}
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

  return (
    <div className="relative md:grid grid-cols-3 h-full">
      <div
        ref={containerRef}
        className="relative h-full m-auto overflow-hidden col-span-2 w-full flex items-center justify-center text-center">
        <div className="relative w-[400px] bg-opacity-50 pointer-events-none aspect-[1011/638]">
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

          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px shadow-[0_0_0_99999px_rgba(23,23,23,0.4)]" />
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

      <div className="h-full flex flex-col bg-card border-l">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div className="px-8 pb-12 pt-8">
            <h2 className="text-3xl tracking-tight font-bold">Customize</h2>

            <Separator className="w-full my-6" />

            <div className="relative mt-4 h-full flex flex-col gap-4">
              <div className="space-y-2 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Imagens</span>
                  <Button asChild variant={'outline'}>
                    <label htmlFor="add" className="cursor-pointer">
                      <Plus className="size-5 mr-2" />
                      Add Image
                      <input
                        id="add"
                        ref={uploadImageButton}
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleAddImage(file)
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Organize as camadas
                </span>
                <ul className="space-y-4">
                  {selectedImages
                    .sort((a, b) => {
                      return b.index - a.index
                    })
                    .map(({ url }) => (
                      <li
                        key={url}
                        className="flex items-center justify-between space-x-2 h-36 gap-6 relative">
                        <NextImage
                          src={url}
                          alt="NextImage"
                          width={200}
                          height={144}
                          className="rounded-md object-cover h-[136px] w-[200px]"
                        />
                        <Separator orientation="vertical" />
                        <div className="ml-auto grid grid-cols-2 justify-between gap-2">
                          <Button
                            variant={'outline'}
                            onClick={() => handleMove(url, 1)}
                            className="w-full">
                            <ArrowUpFromLine className="size-5 mr-2" /> Para
                            frente
                          </Button>
                          <Button
                            className="w-full"
                            variant={'outline'}
                            onClick={() => handleMove(url, -1)}>
                            <ArrowDownFromLine className="size-5 mr-2" /> Para
                            trás
                          </Button>
                          <Button
                            className="w-full"
                            variant={'outline'}
                            onClick={() => handleRotate(url, 90)}>
                            <RotateCw className="size-5 mr-2" /> 90 graus
                          </Button>
                          <Button
                            className="w-full"
                            variant={'outline'}
                            onClick={() => handleRotate(url, -90)}>
                            <RotateCcw className="size-5 mr-2" /> -90 graus
                          </Button>
                          <Button
                            className="col-span-2 w-full"
                            variant={'destructive'}
                            onClick={() => handleRemove(url)}>
                            remover
                          </Button>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              <Button onClick={saveConfiguration}>Salvar</Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
