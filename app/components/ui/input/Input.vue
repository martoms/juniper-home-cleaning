<template>
  <input
    :value="props.modelValue"
    :class="cn('flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm', props.class)"
    @input="updateValue"
  >
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    modelModifiers?: { number?: boolean }
    class?: string
  }>(),
  {
    modelValue: '',
    modelModifiers: () => ({}),
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const updateValue = (event: Event): void => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', props.modelModifiers.number ? Number(value) : value)
}
</script>
