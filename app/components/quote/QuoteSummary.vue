<template>
  <Card :class="compact ? 'rounded-2xl shadow-none' : 'rounded-3xl'">
    <div :class="compact ? 'p-4' : 'p-5 sm:p-6'">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-bold tracking-[0.16em] text-primary">YOUR ESTIMATE</p>
          <h2 class="mt-1 text-lg font-semibold tracking-tight text-foreground">
            {{ props.quoteReady ? 'Your price, itemized' : 'Ready when you are' }}
          </h2>
        </div>
        <span
          v-if="props.quoteReady"
          class="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground"
        >
          Live
        </span>
      </div>

      <template v-if="props.quoteReady">
        <div class="mt-5 space-y-3 border-y border-border py-4 text-sm">
          <div
            v-for="item in props.quote.lineItems"
            :key="item.id"
            class="flex items-start justify-between gap-4"
          >
            <span class="leading-5 text-muted-foreground">{{ item.label }}</span>
            <span class="shrink-0 font-medium text-foreground">
              {{ item.amount === 0 ? 'Included' : formatCurrency(item.amount) }}
            </span>
          </div>
        </div>

        <div class="mt-4 flex items-end justify-between gap-4">
          <span class="text-sm font-medium text-muted-foreground">Estimated total</span>
          <strong class="text-3xl tracking-tight text-primary">
            {{ formatCurrency(props.quote.total) }}
          </strong>
        </div>
        <p class="mt-4 text-xs leading-5 text-muted-foreground">
          Final pricing and availability are confirmed after a quick review.
        </p>
      </template>

      <p v-else class="mt-5 rounded-2xl bg-secondary px-4 py-4 text-sm leading-6 text-secondary-foreground">
        Complete your service details to see an itemized estimate.
      </p>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import Card from '~/components/ui/card/Card.vue'
import { formatCurrency } from '~/lib/format'
import type { QuoteResult } from '~/types/quote'

const props = defineProps<{
  quote: QuoteResult
  quoteReady: boolean
  compact?: boolean
}>()
</script>
