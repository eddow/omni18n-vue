<script setup lang="ts">
const { T } = useNuxtApp().$i18n
let { name } = defineProps<{ name: string }>()

// Beware that `Translator` wizardry is not working on SSR for attributes,
// 	so `T.fld[name].placeholder` has to be explicitly called
</script>

<template>
	<label>
		{{ T.fld[name] }}
	</label>
	<input type="text" :name="name" :placeholder="T.fld[name].placeholder()" />
</template>
