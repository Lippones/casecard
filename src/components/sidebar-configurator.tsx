'use client'
import {
  ArrowDownFromLine,
  ArrowUpFromLine,
  Plus,
  RotateCcw,
  RotateCw,
} from 'lucide-react'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { useTranslations } from 'next-intl'
import type { EditorImage } from './design-configurator'
import NextImage from 'next/image'
import type { RefObject } from 'react'

interface SideBarConfiguratorProps {
  handleAddImage: (file: File) => void
  selectedImages: EditorImage[]
  handleMove: (url: string, number: number) => void
  handleRotate: (url: string, number: number) => void
  handleRemove: (url: string) => void
  uploadImageButton: RefObject<HTMLInputElement>
  saveConfiguration: () => void
}

export function SideBarConfigurator({
  handleAddImage,
  handleMove,
  handleRemove,
  handleRotate,
  selectedImages,
  uploadImageButton,
  saveConfiguration,
}: SideBarConfiguratorProps) {
  const t = useTranslations('editor.sidebar')

  return (
    <ScrollArea className="relative flex-1 overflow-auto">
      <div className="md:px-8 px-4 pb-12 pt-8 w-full">
        <h2 className="text-3xl tracking-tight font-bold">{t('title')}</h2>

        <Separator className="w-full my-6" />

        <div className="relative mt-4 h-full flex flex-col gap-4">
          <div className="space-y-2 flex flex-col w-full">
            <div className="flex justify-between items-center">
              <span className="font-medium">{t('images')}</span>
              <Button asChild variant={'outline'}>
                <label htmlFor="add" className="cursor-pointer">
                  <Plus className="size-5 mr-2" />
                  {t('add')}
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
              {t('organize')}
            </span>
            <ul className="space-y-4">
              {selectedImages
                .sort((a, b) => {
                  return b.index - a.index
                })
                .map(({ url }) => (
                  <li
                    key={url}
                    className="flex max-lg:flex-col lg:items-center lg:justify-between lg:space-x-2 lg:h-36 gap-4 max-lg:py-4 max-lg:border-t max-lg:border-b lg:gap-6 relative">
                    <NextImage
                      src={url}
                      alt="NextImage"
                      width={200}
                      height={144}
                      className="rounded-md object-cover h-[136px] w-full lg:w-[200px]"
                    />
                    <Separator orientation="vertical" />
                    <div className="lg:ml-auto grid grid-cols-2 justify-between gap-2">
                      <Button
                        variant={'outline'}
                        onClick={() => handleMove(url, 1)}
                        className="w-full">
                        <ArrowUpFromLine className="size-5 mr-2" />
                        {t('options.front')}
                      </Button>
                      <Button
                        className="w-full"
                        variant={'outline'}
                        onClick={() => handleMove(url, -1)}>
                        <ArrowDownFromLine className="size-5 mr-2" />{' '}
                        {t('options.back')}
                      </Button>
                      <Button
                        className="w-full"
                        variant={'outline'}
                        onClick={() => handleRotate(url, 90)}>
                        <RotateCw className="size-5 mr-2" />{' '}
                        {t('options.90degrees')}
                      </Button>
                      <Button
                        className="w-full"
                        variant={'outline'}
                        onClick={() => handleRotate(url, -90)}>
                        <RotateCcw className="size-5 mr-2" />{' '}
                        {t('options.-90degrees')}
                      </Button>
                      <Button
                        className="col-span-2 w-full"
                        variant={'destructive'}
                        onClick={() => handleRemove(url)}>
                        {t('options.remove')}
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <Button onClick={saveConfiguration}>{t('options.save')}</Button>
        </div>
      </div>
    </ScrollArea>
  )
}
