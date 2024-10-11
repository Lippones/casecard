import Link from 'next/link'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container px-4 md:px-8 py-20 mx-auto space-y-14">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold">Casecard</h3>
          </div>
          <div className="col-span-3">
            <p className="text-2xl font-semibold">
              Casecard é um projeto open source desenvolvido pela comunidade
              para personalizar capas de cartões de crédito.
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex  gap-16">
          <div>
            <h3 className="uppercase">Links úteis</h3>
            <ul className="space-y-2 mt-4 text-muted-foreground">
              <li>
                <Link className="text-sm" href="/sobre">
                  Sobre
                </Link>
              </li>
              <li>
                <Link className="text-sm" href="/comunidade">
                  Comunidade
                </Link>
              </li>
              <li>
                <Link className="text-sm" href="/editor">
                  Editor
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="uppercase">Legal</h3>
            <ul className="space-y-2 mt-4 text-muted-foreground">
              <li>
                <Link className="text-sm" href="/sobre">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link className="text-sm" href="/comunidade">
                  Politica de privacidade
                </Link>
              </li>
              <li>CNPJ: 00.000.000/0000-00</li>
            </ul>
          </div>
        </div>

        <div className="flex  max-md:flex-col-reverse gap-8 items-center justify-between">
          <div className="space-y-6 max-sm:w-full rounded-full border bg-secondary/40 px-6 py-2 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <span className="text-sm">
                Desenvolvido por{' '}
                <Link
                  href="https://www.lippe.dev"
                  className="underline font-medium">
                  Filipe Vieira
                </Link>
              </span>
              <Avatar>
                <AvatarFallback>Lippe</AvatarFallback>
                <AvatarImage src="https://avatars.githubusercontent.com/u/34816616?v=4" />
              </Avatar>
            </div>
            <span className="text-xs text-muted-foreground">
              © 2021 Casecard. Todos os direitos reservados.
            </span>
          </div>
          <div className="flex max-sm:w-full items-center justify-between rounded-full border bg-secondary/40 px-6 py-4 backdrop-blur-md gap-12">
            <span className="font-semibold">Follow me</span>
            <ul className="flex items-center gap-2">
              <li>
                <Button className="" variant={'outline'} size={'icon'} asChild>
                  <Link target="_blank" href="">
                    <FaXTwitter className="size-4" />
                  </Link>
                </Button>
              </li>
              <li>
                <Button className="" variant={'outline'} size={'icon'} asChild>
                  <Link target="_blank" href="">
                    <FaGithub className="size-4" />
                  </Link>
                </Button>
              </li>
              <li>
                <Button className="" variant={'outline'} size={'icon'} asChild>
                  <Link target="_blank" href="">
                    <FaInstagram className="size-4" />
                  </Link>
                </Button>
              </li>
              <li>
                <Button className="" variant={'outline'} size={'icon'} asChild>
                  <Link target="_blank" href="">
                    <FaLinkedin className="size-4" />
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
