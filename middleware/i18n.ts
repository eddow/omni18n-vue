import { type MLocale, locales, removeDuplicates } from '~/i18n/client'
import { createClient } from '~/i18n/server'

export default defineEventHandler((event) => {
	const preferredLocale = <MLocale>useCookie('language').value,
		usedLocales = <MLocale[]>event.headers
				.get('accept-language')
				?.split(',')
				.map((x) => x.split(' ')[0])
				.map((x) => x && locales.find((locale) => locale.startsWith(x)))
				.filter((x) => !!x) || []
	if (preferredLocale) usedLocales.unshift(preferredLocale)
	// Always have the en (original website) as feedback + avoid empty locales
	usedLocales.push('en')
	// Does not actually download anything, just centralizes so that if something is downloaded, it is done once
	event.context.i18nClient = createClient(removeDuplicates(usedLocales))
})
