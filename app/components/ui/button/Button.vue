<template>
  <button
    :type="props.type"
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { cva } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        outline: 'border border-border bg-card text-foreground hover:bg-secondary',
        ghost: 'text-primary hover:bg-accent',
      },
      size: {
        default: 'h-11',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonVariant = 'default' | 'outline' | 'ghost'
type ButtonSize = 'default' | 'sm' | 'lg'

const props = withDefaults(
  defineProps<
    {
      variant?: ButtonVariant
      size?: ButtonSize
      class?: string
      type?: 'button' | 'submit' | 'reset'
    }
  >(),
  {
    type: 'button',
  },
)
</script>
