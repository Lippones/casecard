import { type AbstractIntlMessages, NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/toaster'
import { CSPostHogProvider } from './cs-post-hog-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

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
        <CSPostHogProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </CSPostHogProvider>
        <Toaster />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
