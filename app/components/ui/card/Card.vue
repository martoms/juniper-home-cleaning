<template>
  <section :class="cn('rounded-2xl border border-border bg-card text-card-foreground shadow-sm', props.class)">
    <slot />
  </section>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

const props = defineProps<{ class?: string }>()
</script>
