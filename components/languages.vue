<script setup lang="ts">
const { locale, localeFlags } = useNuxtApp().$i18n
const { locales } = useAppConfig()

function selfLocale(locale: string) {
	return new Intl.DisplayNames(locale, { type: 'language' }).of(locale) || '???'
}
const localeDescriptions = locales.map((locale) => ({
	locale,
	flag: localeFlags(locale)[0],
	text: selfLocale(locale)
}))
</script>
<template>
	<div>
		<button
			v-for="desc in localeDescriptions"
			@click="() => (locale = desc.locale)"
			:class="{ selected: locale === desc.locale }"
		>
			<span v-html="desc.flag"></span>
			{{ desc.text }}
		</button>
	</div>
</template>

<style>
.selected {
	font-weight: bold;
}
</style>
