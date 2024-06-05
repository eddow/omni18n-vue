declare namespace I18n {
	interface TextInfos {}
	interface KeyInfos {}
}

declare module 'nuxt/schema' {
	interface AppConfig {
		locales: string[]
	}
}
