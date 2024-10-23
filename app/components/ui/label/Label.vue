<template>
  <label :class="cn('text-sm font-medium leading-none', props.class)">
    <slot />
  </label>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

const props = defineProps<{ class?: string }>()
</script>
