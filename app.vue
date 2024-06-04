<script lang="ts">
import type { PartialLoad } from 'omni18n'
import type { I18n } from './plugins/i18n'

const { locale } = inject<I18n>('i18n')!

export default {
	head() {
		return {
			htmlAttrs: {
				lang: locale.value
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
