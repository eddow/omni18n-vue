import { FileDB, I18nClient, I18nServer, type Locale } from 'omni18n'
const { locales }: { locales: Locale[] } = useAppConfig()

// PoI: Manage your database here
// Note: Dictionary data is "downloaded" at *each* request involving text, we might consider caching
const i18nSource = new FileDB('dictionary.i18n'),
	i18nServer = new I18nServer<I18n.KeyInfos, I18n.TextInfos>(i18nSource)
type ClientSideError = object & { clientSide?: true }

class ReportingI18nClient extends I18nClient {
	error(key: string, error: string, spec: ClientSideError) {
		// PoI: actually report
		console.error(
			`Error ${error} for ${key} in ${this.locales[0]}:\n`,
			JSON.stringify(spec, null, 2)
		)
		// If error on server-side, avoid at all costs sending an email with no text
		if (!spec.clientSide) throw new Error(`Error ${error} for ${key} in ${this.locales[0]}`)
		return '[*error*]'
	}

	missing(key: string, fallback: string) {
		// PoI: actually report
		console.error(`Missing ${key} in ${this.locales[0]}`)
		// If no fallbacks is provided, avoid at all costs sending an email with no text
		if (!fallback) throw new Error(`Missing ${key} in ${this.locales[0]}`)
		return fallback || `[${key}]`
	}
}

export default defineEventHandler((event) => {
	const preferredLocale = <Locale>getCookie(event, 'language'),
		usedLocales = <Locale[]>event.headers
				.get('accept-language')
				?.split(',')
				.map((x) => x.split(' ')[0])
				.map((x) => x && locales.find((locale) => locale.startsWith(x)))
				.filter((x) => !!x) || []
	if (preferredLocale) usedLocales.unshift(preferredLocale)
	// Always have the en (original website) as feedback + avoid empty locales
	usedLocales.push('en')
	// Does not actually download anything, just centralizes so that if something is downloaded, it is done once
	event.context.i18n = {
		client: new ReportingI18nClient(usedLocales, i18nServer.condense),
		server: i18nServer,
		source: i18nSource
	}
})
