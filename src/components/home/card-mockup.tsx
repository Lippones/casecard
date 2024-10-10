import Mockup from '@/assets/mockup.png'
import MockupPrin from '@/assets/mockup_prin.png'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface CardMockupProps {
  className?: string
  isPrimary?: boolean
}

export function CardMockup({ className, isPrimary = false }: CardMockupProps) {
  return (
    <Image
      className={cn('', className)}
      src={isPrimary ? MockupPrin : Mockup}
      alt="mockup"
    />
  )
}
