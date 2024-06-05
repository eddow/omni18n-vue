import {
	reports,
	type TContext,
	I18nClient,
	type Locale,
	type Translator,
	type Condense,
	type PartialLoad
} from 'omni18n/ts'
//import { defineNuxtPlugin } from 'nuxt/app'

// PoI: Manage your locales here
export const locales = ['fr', 'en'] as const

export interface I18n {
	client: I18nClient
	T: Ref<Translator>
	locale: Ref<Locale>
}

export default defineNuxtPlugin(async (nuxtApp) => {
	const client = new I18nClient([], <Condense>condense)
	Object.assign(reports, {
		error({ key }: TContext, error: string, spec: object) {
			$fetch(`/i18n?error`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, error, spec })
			})
			return '[*translation error*]'
		},
		missing({ key }: TContext, fallback: string) {
			$fetch(`/i18n?missing`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key })
			})
			return fallback || `[${key}]`
		}
	})

	async function condense() {
		return await $fetch(`/i18n`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale: i18n.locale.value })
		})
	}

	const fetched = await useFetch('/api/i18n?partial', {
		method: 'POST'
	})
	const { partial, locale } = fetched.data.value as { partial: PartialLoad; locale: Locale }
	client.setLocales([locale])
	client.usePartial(partial)

	const i18n: I18n = {
		client,
		T: ref<Translator>(await client.enter()),
		locale: ref<Locale>(locale)
	}

	watch(
		i18n.locale,
		async (locale, oldLocale) => {
			if (!locale || locale === oldLocale) return
			await i18n.client.setLocales([locale])
			i18n.T.value = await i18n.client.enter()
		},
		{ immediate: false }
	)
	return { provide: { i18n } }
})
