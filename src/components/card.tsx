import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string
}

const Card = ({ imgSrc, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'relative pointer-events-none z-50 overflow-hidden',
        className,
      )}
      {...props}>
      <img
        src="/card.png"
        className="pointer-events-none select-none"
        alt="card"
      />

      <div className="absolute z-40 inset-0">
        <img
          className="object-cover min-w-full min-h-full"
          src={imgSrc}
          alt="overlaying card"
        />
      </div>
    </div>
  )
}

export default Card
