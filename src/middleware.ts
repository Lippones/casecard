import { cookies, headers } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

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

export async function middleware(request: NextRequest) {
  const header = await headers()
  const cookie = await cookies()

  const acceptedLanguages = header.get('accept-language')?.split(',') || ['en']

  const localeAlreadyExists = cookie.get('locale')

  if (!localeAlreadyExists) {
    const locale = getPrimaryLocale(acceptedLanguages)

    return NextResponse.redirect(request.nextUrl, {
      headers: {
        'Set-Cookie': `locale=${locale}`,
      },
    })
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
