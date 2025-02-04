import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cookies } from 'next/headers'
import Link from 'next/link'

export async function NsfwContentDialog() {
  const cookieStore = await cookies()

  const majority = cookieStore.get('majority')?.value === 'true'

  async function setMajority() {
    'use server'
    const cookieStore = await cookies()

    await cookieStore.set({
      name: 'majority',
      value: 'true',
    })
  }

  return (
    <AlertDialog open={!majority}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Conteúdo Sensível – Confirmação de Idade
          </AlertDialogTitle>
          <AlertDialogDescription>
            Algumas imagens compartilhadas podem conter conteúdo impróprio.
            Aplicamos um filtro para desfocar imagens sensíveis, mas ele não é
            100% preciso. Para continuar, você deve ter pelo menos 18 anos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Link href={'/'}>Voltar</Link>
          </AlertDialogCancel>
          <AlertDialogAction onClick={setMajority}>
            Confirmar e Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
