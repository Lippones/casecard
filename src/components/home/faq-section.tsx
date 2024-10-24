import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getTranslations } from 'next-intl/server'

export async function FAQSection() {
  const t = await getTranslations('home.faq')

  return (
    <div className="max-w-screen-lg px-4 md:px-8 mx-auto flex flex-col w-full items-center gap-10">
      <h2 className="text-4xl font-bold">{t('title')}</h2>
      <Accordion className="w-full" type="single" collapsible>
        <AccordionItem value="item1">
          <AccordionTrigger className="text-left">
            {t('item1.question')}
          </AccordionTrigger>
          <AccordionContent>{t('item1.answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item2">
          <AccordionTrigger className="text-left">
            {t('item2.question')}
          </AccordionTrigger>
          <AccordionContent>{t('item2.answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item3">
          <AccordionTrigger className="text-left">
            {t('item3.question')}
          </AccordionTrigger>
          <AccordionContent>{t('item3.answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item4">
          <AccordionTrigger className="text-left">
            {t('item4.question')}
          </AccordionTrigger>
          <AccordionContent>{t('item4.answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item5">
          <AccordionTrigger className="text-left">
            {t('item5.question')}
          </AccordionTrigger>
          <AccordionContent>{t('item5.answer')}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
