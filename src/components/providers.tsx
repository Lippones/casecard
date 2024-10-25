import { type AbstractIntlMessages, NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/toaster'
import { CSPostHogProvider } from './cs-post-hog-provider'

interface ProvidersProps {
  children: ReactNode
  messages: AbstractIntlMessages | undefined
}

export function Providers({ children, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        disableTransitionOnChange>
        <CSPostHogProvider>{children}</CSPostHogProvider>
        <Toaster />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
