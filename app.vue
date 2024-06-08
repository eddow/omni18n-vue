<script lang="ts" setup>
const { locale, localeFlags } = useNuxtApp().$i18n

useHead({
	htmlAttrs: {
		lang: locale.value
	},
	link: localeFlags.styleSheetProps ? [localeFlags.styleSheetProps] : []
})
</script>
<template>
	<div>
		<NuxtPage />
	</div>
</template>
