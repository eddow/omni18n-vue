import {
	I18nClient,
	type Locale,
	type Translator,
	type Condense,
	type PartialLoad,
	type LocaleFlagsEngine,
	localeFlagsEngine
} from 'omni18n'

// PoI: Manage your locales here
export const locales = ['fr', 'en'] as const

export interface I18n {
	client: I18nClient
	T: Ref<Translator>
	locale: Ref<Locale>
	localeFlags: LocaleFlagsEngine
}

class ReportingI18nClient extends I18nClient {
	report(key: string, error: string, spec?: object | undefined): void {
		$fetch(`/api/api/i18n?report`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ key, error, spec })
		})
	}
}

export default defineNuxtPlugin(async (nuxtApp) => {
	const client = new ReportingI18nClient([], <Condense>condense)

	async function condense() {
		return await $fetch(`/api/i18n`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale: i18n.locale.value })
		})
	}

	const fetched = await useFetch('/api/i18n?partial', {
		method: 'POST'
	})
	const { partial, locale, lfEngine } = fetched.data.value as {
		partial: PartialLoad
		locale: Locale
		lfEngine: string
	}
	client.setLocales([locale])
	client.usePartial(partial)

	const i18n: I18n = {
		client,
		T: ref<Translator>(await client.enter()),
		locale: ref<Locale>(locale),
		localeFlags: localeFlagsEngine(lfEngine)
	}

	watch(
		i18n.locale,
		async (locale: Locale, oldLocale: Locale) => {
			if (!locale || locale === oldLocale) return
			await i18n.client.setLocales([locale])
			i18n.T.value = await i18n.client.enter()
		},
		{ immediate: false }
	)
	return { provide: { i18n } }
})
