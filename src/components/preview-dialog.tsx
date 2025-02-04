'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { AspectRatio } from './ui/aspect-ratio'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Loader2 } from 'lucide-react'
import Card from './card'
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/use-toast'
import posthog from 'posthog-js'
import { Checkbox } from './ui/checkbox'

export type DeliveryOption = 'email' | 'home'

interface PreviewDialogProps {
  imageUrl: string
  handleClose: () => void
  onSubmit: (props: {
    email: string
    delivery: DeliveryOption
    isPublic: boolean
  }) => Promise<void>
}

export function PreviewDialog({
  imageUrl,
  handleClose,
  onSubmit,
}: PreviewDialogProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('email')
  const [isPublic, setIsPublic] = useState<boolean>(true)

  const t = useTranslations('editor.preview')
  const errors = useTranslations('errors')

  const { toast } = useToast()

  const [message, setMessage] = useState<string | null>('')

  function handleMessage() {
    setMessage(errors('deliveryQuota'))

    posthog.capture('Deliver Method', { property: 'home' })
  }

  return (
    <Dialog
      open
      onOpenChange={() => {
        if (isLoading) return
        handleClose()
      }}>
      <DialogContent className="max-w-[638px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        {step === 1 ? (
          <>
            <div>
              <Card imgSrc={imageUrl} revokeUrl />
            </div>
            <DialogFooter>
              <Button onClick={() => setStep(2)} size={'lg'} className="mt-2">
                {t('step1.continue')}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form
            onSubmit={async (e) => {
              try {
                e.preventDefault()
                setIsLoading(true)

                const data = new FormData(e.currentTarget)

                const email = data.get('email')

                if (!email) {
                  toast({
                    title: errors('notFound', {
                      item: 'Email',
                    }),
                  })
                  return
                }

                await onSubmit({
                  delivery: deliveryOption,
                  email: email.toString(),
                  isPublic,
                })
              } catch (error) {
                toast({
                  title: errors('unexpected'),
                })
              } finally {
                setIsLoading(false)
              }
            }}
            className="space-y-4 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="choose">
                {t('step2.title')}
              </label>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setDeliveryOption('email')}
                  type="button"
                  variant={deliveryOption === 'email' ? 'default' : 'outline'}
                  size={'sm'}>
                  {t('step2.options.email')}
                </Button>
                <Button
                  onClick={handleMessage}
                  type="button"
                  variant={deliveryOption === 'home' ? 'default' : 'outline'}
                  size={'sm'}>
                  {t('step2.options.home')}
                </Button>
              </div>
            </div>
            {message && <p className="text-destructive text-sm">{message}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                type="email"
                required
                name="email"
                placeholder="jonhdoe@gmail.com"
              />
              <p className="text-xs text-muted-foreground">
                {t('step2.email.description')}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isPublic}
                  onCheckedChange={(value) => setIsPublic(value === true)}
                  id="isPublic"
                />
                <label htmlFor="isPublic" className="text-sm font-medium">
                  {t('step2.isPublic.title')}
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('step2.isPublic.description')}
              </p>
            </div>
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit"
                size={'lg'}
                className="mt-2">
                {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
                {t('step2.continue')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
