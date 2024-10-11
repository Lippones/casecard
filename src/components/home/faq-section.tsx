import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FAQSection() {
  return (
    <div className="max-w-screen-lg px-4 md:px-8 mx-auto flex flex-col w-full items-center gap-10">
      <h2 className="text-4xl font-bold">Perguntas Frequentes</h2>
      <Accordion className="w-full" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">
            O que é Casecard?
          </AccordionTrigger>
          <AccordionContent>
            O Casecard permite que você personalize a capa do seu cartão de
            crédito com designs únicos. Você pode criar um adesivo exclusivo e
            optar por recebê-lo em casa, ou receber o arquivo digital por email,
            para imprimir e aplicar como quiser.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">
            Como recebo meu adesivo?
          </AccordionTrigger>
          <AccordionContent>
            Você pode optar por receber seu adesivo no email como um arquivo
            pronto para impressão ou ter o adesivo físico entregue na sua casa.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">
            Os projetos da comunidade são gratuitos?
          </AccordionTrigger>
          <AccordionContent>
            Não, os projetos criados pela comunidade não são gratuitos. Cada
            criador define o preço dos seus adesivos e você pode escolher
            comprá-los.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">
            Posso personalizar o adesivo do meu jeito?
          </AccordionTrigger>
          <AccordionContent>
            Sim! Você pode personalizar seu adesivo com imagens, textos e cores
            exclusivas antes de finalizar o pedido.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left">
            E sobre o corte para o chip?
          </AccordionTrigger>
          <AccordionContent>
            O adesivo não terá um corte no chip, isso é para evitar erros na
            aplicação do adesivo.
            {/* O adesivo terá um corte especial para o chip do celular, para garantir
          que ele funcione perfeitamente após a aplicação. */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
