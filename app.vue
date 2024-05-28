<script lang="ts">
import { locale } from './i18n/client'

export default {
	// other code...
	head() {
		return {
			htmlAttrs: {
				lang: locale.value
			}
		}
	}
	// other code...
}
</script>
<template>
	<div>
		<NuxtPage />
	</div>
</template>
