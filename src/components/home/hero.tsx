import Link from 'next/link'
import { Button } from '../ui/button'
import { OrbitingBackground } from './orbiting-background'
import { CardMockup } from './card-mockup'

export function Hero() {
  return (
    <div className="relative h-svh w-full px-8 pt-32">
      <div className="absolute inset-0">
        <OrbitingBackground />
      </div>

      <div className="relative z-20 flex items-center gap-6 flex-col">
        <h1 className="text-center text-6xl font-semibold leading-tight">
          Crie seu próprio adesivo de cartão <br /> personalizado em minutos!
        </h1>
        <p className="text-center text-2xl font-medium text-muted-foreground">
          Personalize o seu adesivo de forma rápida e prática. Barato, simples e
          entregue em sua casa!
        </p>
        <div className="flex gap-8 items-center">
          <Button
            asChild
            variant={'link'}
            className="text-base text-muted-foreground py-6">
            <Link href="/comunidade">Ver exemplos da comunidade</Link>
          </Button>
          <Button asChild className="h-auto font-bold text-base px-8 py-4">
            <Link href="/editor">Criar adesivo</Link>
          </Button>
        </div>
      </div>
      <div className="absolute flex w-full justify-center -bottom-12 overflow-hidden">
        <CardMockup className="-rotate-12 relative top-16" />
        <CardMockup isPrimary className="relative z-20" />
        <CardMockup className="rotate-12 relative top-16" />
      </div>
    </div>
  )
}
