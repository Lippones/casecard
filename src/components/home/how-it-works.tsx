import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from '@radix-ui/react-icons'

import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'

const steps = [
  {
    Icon: InputIcon,
    name: 'Personalize seu adesivo',
    description:
      'Use nossa ferramenta de personalização para criar adesivos únicos, com suas próprias imagens, textos e cores.',
    href: '/personalize',
    cta: 'Comece agora',
    background: (
      <img
        className="absolute inset-0 h-full object-cover w-full opacity-60"
        src="/example.webp"
        alt=""
      />
    ),
    className: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',
  },
  {
    Icon: CalendarIcon,
    name: 'Escolha como receber',
    description:
      'Receba o adesivo em sua casa ou em formato digital via email, prontos para uso imediato.',
    href: '/',
    cta: 'Saiba mais',
    background: (
      <img
        className="absolute inset-0 h-full object-cover w-full opacity-60"
        src="/example.webp"
        alt=""
      />
    ),
    className: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',
  },
  {
    Icon: GlobeIcon,
    name: 'Explore criações da comunidade',
    description:
      'Inspire-se com adesivos criados por outros usuários e descubra designs únicos.',
    href: '/exemplos',
    cta: 'Ver exemplos',
    background: (
      <img
        className="absolute inset-0 h-full object-cover w-full opacity-60"
        src="/example.webp"
        alt=""
      />
    ),
    className: 'lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4',
  },
  {
    Icon: GlobeIcon,
    name: 'Faça o pagamento',
    description:
      'Faça o pagamento para que possamos produzir o seu adesivo e enviar para você.',
    href: '/',
    cta: 'Saiba mais',
    background: (
      <img
        className="absolute inset-0 h-full object-cover w-full opacity-60"
        src="/example.webp"
        alt=""
      />
    ),
    className: 'lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2',
  },
  {
    Icon: FileTextIcon,
    name: 'Compartilhe com a comunidade',
    description:
      'Exiba suas criações para a comunidade e veja o que outros criadores estão fazendo!',
    href: '/comunidade',
    cta: 'Ver mais',
    background: (
      <img
        className="absolute inset-0 h-full object-cover w-full opacity-60"
        src="/example.webp"
        alt=""
      />
    ),
    className: 'lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4',
  },
]

export async function HowItWorks() {
  return (
    <div className="flex flex-col gap-10 justify-center mx-auto container w-full pt-20 md:pt-10 px-4 md:px-8">
      <h2 className="text-4xl font-bold">Como funciona</h2>
      <BentoGrid className="lg:grid-rows-3">
        {steps.map((step) => (
          <BentoCard key={step.name} {...step} />
        ))}
      </BentoGrid>
    </div>
  )
}
