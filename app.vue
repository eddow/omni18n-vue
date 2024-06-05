<script lang="ts" setup>
const { locale } = useNuxtApp().$i18n
useHead({
	htmlAttrs: {
		lang: locale.value
	}
})
</script>
<template>
	<div>
		<NuxtPage />
	</div>
</template>
