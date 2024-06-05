<script setup lang="ts">
import type { Translator } from 'omni18n/ts'
import Languages from '~/components/languages.vue'

const { T } = useNuxtApp().$i18n
function alertBox(message: string) {
	alert(message)
}
</script>

<template>
	<Languages />
	<h1>{{ T.page.welcome.title }}</h1>

	<button @click="() => alertBox(T.this.message.doesnt.exist)">{{ T.cmd.inexistent }}</button>
</template>
