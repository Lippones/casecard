'use client'

import Image from 'next/image'
import { AspectRatio } from './ui/aspect-ratio'
import { useRef, useState } from 'react'
import { Input } from './ui/input'
import { Rnd } from 'react-rnd'
import { HandleComponent } from './handle-component'
import { ScrollArea } from './ui/scroll-area'

export function DesignConfigurador() {
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const uploadImageButton = useRef<HTMLInputElement>(null)

  function handleAddImage(file: File) {
    const url = URL.createObjectURL(file)
    setSelectedImages([...selectedImages, url])

    if (uploadImageButton.current) {
      uploadImageButton.current.value = ''
    }
  }

  console.log(selectedImages)

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

        {selectedImages.map((url) => (
          <Rnd
            className="absolute z-20 border-[2px] border-blue-600"
            default={{
              x: 150,
              y: 205,
              width: 300,
              height: 300,
            }}
            key={url}
            lockAspectRatio
            resizeHandleComponent={{
              bottomLeft: <HandleComponent />,
              bottomRight: <HandleComponent />,
              topLeft: <HandleComponent />,
              topRight: <HandleComponent />,
            }}>
            <div className="w-full h-full">
              <Image
                src={url}
                alt="Image"
                fill
                className="pointer-events-none z-40"
              />
            </div>
          </Rnd>
        ))}
      </div>

      <div className="h-[37.5rem flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="text-3xl tracking-tight font-bold">
              Customize your case
            </h2>

            <div className="w-full h-px bg-zinc-200 my-6" />

            <div className="relative mt-4 h-full flex flex-col justify-between">
              colors
              <Input
                ref={uploadImageButton}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleAddImage(file)
                }}
                placeholder="Add Image"
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
