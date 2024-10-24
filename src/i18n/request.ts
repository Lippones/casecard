import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

const supportedLocales = ['en', 'pt']

function getPrimaryLocale(acceptedLanguages: string[]) {
  for (const lang of acceptedLanguages) {
    const baseLang = lang.split('-')[0]
    if (supportedLocales.includes(baseLang)) {
      return baseLang
    }
  }
  return 'en'
}

export default getRequestConfig(async () => {
  const cookie = await cookies()
  const header = await headers()

  let locale = cookie.get('locale')?.value

  if (!locale) {
    const acceptedLanguages = header.get('accept-language')?.split(',') || [
      'en',
    ]

    locale = getPrimaryLocale(acceptedLanguages)

    cookie.set({
      value: locale,
      name: 'locale',
    })
  }

  if (!supportedLocales.includes(locale)) {
    locale = 'en'
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
