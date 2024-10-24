import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from '@radix-ui/react-icons'

import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { getTranslations } from 'next-intl/server'

export async function HowItWorks() {
  const t = await getTranslations('home.howToWorks')

  const steps = [
    {
      Icon: InputIcon,
      background: (
        <img
          className="absolute inset-0 h-full object-cover w-full opacity-60"
          src="/example.webp"
          alt=""
        />
      ),
      name: t('items.customizeSticker'),
      description: t('items.customizeDescription'),
      href: '/editor',
      cta: t('getStarted'),
      className: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',
    },
    {
      Icon: CalendarIcon,
      background: (
        <img
          className="absolute inset-0 h-full object-cover w-full opacity-60"
          src="/example.webp"
          alt=""
        />
      ),
      name: t('items.chooseDelivery'),
      description: t('items.chooseDeliveryDescription'),
      href: '/',
      cta: t('learnMore'),
      className: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',
    },
    {
      Icon: GlobeIcon,
      background: (
        <img
          className="absolute inset-0 h-full object-cover w-full opacity-60"
          src="/example.webp"
          alt=""
        />
      ),
      name: t('items.exploreCommunity'),
      description: t('items.exploreCommunityDescription'),
      href: '/examples',
      cta: t('learnMore'),
      className: 'lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4',
    },
    {
      Icon: GlobeIcon,
      background: (
        <img
          className="absolute inset-0 h-full object-cover w-full opacity-60"
          src="/example.webp"
          alt=""
        />
      ),
      name: t('items.makePayment'),
      description: t('items.makePaymentDescription'),
      href: '/',
      cta: t('learnMore'),
      className: 'lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2',
    },
    {
      Icon: FileTextIcon,
      background: (
        <img
          className="absolute inset-0 h-full object-cover w-full opacity-60"
          src="/example.webp"
          alt=""
        />
      ),
      name: t('items.shareCommunity'),
      description: t('items.shareCommunityDescription'),
      href: '/community',
      cta: t('learnMore'),
      className: 'lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4',
    },
  ]

  return (
    <div className="flex flex-col gap-10 justify-center mx-auto container w-full pt-20 md:pt-10 px-4 md:px-8">
      <h2 className="text-4xl font-bold">How to works</h2>
      <BentoGrid className="lg:grid-rows-3">
        {steps.map((step) => (
          <BentoCard key={step.name} {...step} />
        ))}
      </BentoGrid>
    </div>
  )
}
