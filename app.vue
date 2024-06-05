<script setup lang="ts">
const {
	$i18n: { locale }
} = useNuxtApp()
</script>
<script lang="ts">
export default {
	head() {
		return {
			htmlAttrs: {
				lang: locale.value //TODO: no effect at all
			}
		}
	}
}
</script>
<template>
	<div>
		<NuxtPage />
	</div>
</template>
