'use client'

import Image from 'next/image'
import { AspectRatio } from './ui/aspect-ratio'
import { useMemo, useRef, useState } from 'react'
import { Input } from './ui/input'
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

export function DesignConfigurador() {
  const uploadImageButton = useRef<HTMLInputElement>(null)

  const [selectedImages, setSelectedImages] = useState<
    {
      index: number
      degrees: number
      url: string
    }[]
  >([])

  function handleAddImage(file: File) {
    const url = URL.createObjectURL(file)
    setSelectedImages([
      ...selectedImages,
      { url, index: selectedImages.length, degrees: 0 },
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

  return (
    <div className="relative mt-20 grid grid-cols-3 mb-20 pb-20">
      <div className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <div className="relative w-[400px] bg-opacity-50 pointer-events-none aspect-[1004/650]">
          <AspectRatio
            ratio={1004 / 650}
            className="pointer-events-none aspect-[1004/650] w-full">
            <Image
              fill
              src={'/card.png'}
              alt="Base card img"
              className="pointer-events-none select-none"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[12px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
        </div>

        {selectedImages.map(({ degrees, index, url }, i) => (
          <Rnd
            className="absolute z-20 border-[2px] border-blue-600"
            default={{
              x: 150,
              y: 205,
              width: 300,
              height: 300,
            }}
            key={url}
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
              <Image
                src={url}
                alt="Image"
                fill
                className={`pointer-events-none z-[${index + 40}]`}
              />
            </div>
          </Rnd>
        ))}
        {/* <Rnd
          className="absolute z-20 border-[2px] border-blue-600"
          default={{
            x: 150,
            y: 205,
            width: 300,
            height: 32,
          }}
          resizeHandleComponent={{
            bottomLeft: <HandleComponent />,
            bottomRight: <HandleComponent />,
            topLeft: <HandleComponent />,
            topRight: <HandleComponent />,
          }}>
          <span className="text-">Teste de texto</span>
        </Rnd> */}
      </div>

      <div className="h-[37.5rem] flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="text-3xl tracking-tight font-bold">Customize</h2>

            <div className="w-full h-px bg-zinc-200 my-6" />

            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="space-y-2 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Imagens</span>
                  <Button asChild variant={'outline'}>
                    <label htmlFor="add">
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
                  {selectedImages.map(({ url }) => (
                    <li
                      key={url}
                      className="flex items-center space-x-2 h-36 gap-6 relative">
                      <Image
                        src={url}
                        alt="Image"
                        width={200}
                        height={144}
                        className="rounded-md object-cover h-[136px] w-[200px]"
                      />
                      <div className="grid grid-cols-2 justify-between gap-2">
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
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
