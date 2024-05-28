import {
	reports,
	type TContext,
	I18nClient,
	type Locale,
	type Translator,
	type CondensedDictionary
} from 'omni18n'

// PoI: Manage your locales here
export const locales = ['fr', 'en'] as const
export type MLocale = (typeof locales)[number] & Locale

export interface TextInfos {}
export interface KeyInfos {}

// Remove duplicates while keeping the order
export function removeDuplicates(arr: MLocale[]) {
	const done = new Set<MLocale>()
	return arr.filter((k) => !done.has(k) && done.add(k))
}

export const i18nClient = new I18nClient([], condense)
export const T = ref<Translator>()
export const locale = ref<MLocale>()

watch(locale, async (locale) => {
	if (!locale) return
	await i18nClient.setLocales(removeDuplicates([locale, ...(<MLocale[]>i18nClient.locales)]))
	await initTranslator()
})
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
	return (await $fetch(`/i18n`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ locale: locale.value })
	})) as CondensedDictionary[]
}
export async function initTranslator() {
	T.value = await i18nClient.enter()
}
