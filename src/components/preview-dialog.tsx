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

export type DeliveryOption = 'email' | 'home'

interface PreviewDialogProps {
  imageUrl: string
  handleClose: () => void
  onSubmit: (props: {
    email: string
    delivery: DeliveryOption
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

  const [message, setMessage] = useState<string | null>('')

  function handleMessage() {
    setMessage(
      'Unfortunately, we have exhausted our quota for home delivery. Please proceed with email delivery for your order.',
    )

    // Salvar evento
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
          <DialogTitle>See the sticker preview</DialogTitle>
          <DialogDescription>
            Upon confirmation you will be directed to checkout
          </DialogDescription>
        </DialogHeader>
        {step === 1 ? (
          <>
            <div>
              <AspectRatio
                ratio={1011 / 638} // Proporção exata do cartão de crédito
                className="pointer-events-none aspect-[1011/638] w-full relative">
                <Image
                  fill
                  src={imageUrl}
                  onLoad={() => {
                    URL.revokeObjectURL(imageUrl) // Desativa a URL para evitar downloads
                  }}
                  alt="preview"
                  className="pointer-events-none select-none"
                />
              </AspectRatio>
            </div>
            <DialogFooter>
              <Button onClick={() => setStep(2)} size={'lg'} className="mt-2">
                Continuar
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
                  // TODO: Messagem de error
                  return
                }

                await onSubmit({
                  delivery: deliveryOption,
                  email: email.toString(),
                })
              } catch (error) {
                console.log(error)
                // TODO: Mensagem de error
              } finally {
                setIsLoading(false)
              }
            }}
            className="space-y-4 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="choose">
                Delivery Method
              </label>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setDeliveryOption('email')}
                  type="button"
                  variant={deliveryOption === 'email' ? 'default' : 'outline'}
                  size={'sm'}>
                  Receive via Email
                </Button>
                <Button
                  onClick={handleMessage}
                  type="button"
                  variant={deliveryOption === 'home' ? 'default' : 'outline'}
                  size={'sm'}>
                  Delivered to Your Home
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
                The email we will send the sticker to
              </p>
            </div>
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit"
                size={'lg'}
                className="mt-2">
                {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
                Proceed to Checkout
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
