<template>
  <Card class="print-card overflow-hidden rounded-3xl border-primary/15">
    <div class="border-b border-border bg-secondary/70 px-5 py-5 sm:px-7">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs font-bold tracking-[0.16em] text-primary">JUNIPER HOME CLEANING</p>
          <h2 id="estimate-preview-heading" tabindex="-1" class="mt-2 text-2xl font-semibold tracking-tight outline-none">
            Your cleaning estimate
          </h2>
        </div>
        <div class="rounded-2xl border border-primary/15 bg-card px-3 py-2 text-right">
          <p class="text-xs text-muted-foreground">Reference</p>
          <p class="font-mono text-sm font-semibold tracking-wide text-foreground">{{ props.reference }}</p>
        </div>
      </div>
    </div>

    <div class="space-y-7 p-5 sm:p-7">
      <div class="grid gap-5 border-b border-border pb-6 text-sm sm:grid-cols-2">
        <div>
          <p class="text-xs font-bold tracking-[0.14em] text-muted-foreground">PREPARED FOR</p>
          <p class="mt-2 font-semibold text-foreground">{{ props.inputs.customerName }}</p>
          <p class="mt-1 text-muted-foreground">{{ props.inputs.customerEmail }}</p>
        </div>
        <div class="sm:text-right">
          <p class="text-xs font-bold tracking-[0.14em] text-muted-foreground">PREFERRED DATE</p>
          <p class="mt-2 font-semibold text-foreground">{{ formatPreferredDate(props.inputs.preferredDate) }}</p>
          <p class="mt-1 text-muted-foreground">{{ timingLabel }}</p>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-foreground">Service details</h3>
        <dl class="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          <div class="rounded-xl bg-secondary px-3 py-3">
            <dt class="text-xs text-muted-foreground">Service</dt>
            <dd class="mt-1 font-medium text-foreground">{{ serviceLabel }}</dd>
          </div>
          <div class="rounded-xl bg-secondary px-3 py-3">
            <dt class="text-xs text-muted-foreground">Home</dt>
            <dd class="mt-1 font-medium text-foreground">
              {{ props.inputs.bedrooms }} bed · {{ props.inputs.bathrooms }} bath
            </dd>
          </div>
          <div class="rounded-xl bg-secondary px-3 py-3">
            <dt class="text-xs text-muted-foreground">Size</dt>
            <dd class="mt-1 font-medium text-foreground">{{ homeSizeLabel }}</dd>
          </div>
        </dl>
      </div>

      <div>
        <div class="flex items-center justify-between border-b border-border pb-3">
          <h3 class="text-sm font-semibold text-foreground">Price breakdown</h3>
          <span class="text-xs text-muted-foreground">USD</span>
        </div>
        <div class="space-y-3 py-4 text-sm">
          <div v-for="item in props.quote.lineItems" :key="item.id" class="flex justify-between gap-4">
            <span class="text-muted-foreground">{{ item.label }}</span>
            <span class="font-medium text-foreground">
              {{ item.amount === 0 ? 'Included' : formatCurrency(item.amount) }}
            </span>
          </div>
        </div>
        <div class="flex items-end justify-between border-t border-border pt-4">
          <span class="font-semibold text-foreground">Estimated total</span>
          <strong class="text-3xl tracking-tight text-primary">{{ formatCurrency(props.quote.total) }}</strong>
        </div>
      </div>

      <p class="rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm leading-6 text-secondary-foreground">
        This is an estimate. Final pricing and availability are confirmed after review.
      </p>

      <div class="no-print flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button variant="outline" class="w-full sm:w-auto" @click="emit('copy')">Copy quote</Button>
        <Button variant="outline" class="w-full sm:w-auto" @click="emit('print')">Print / Save PDF</Button>
        <Button class="w-full sm:ml-auto sm:w-auto" @click="emit('request')">Request this estimate</Button>
      </div>
      <p v-if="props.copyStatus" class="no-print text-sm font-medium text-primary" role="status">
        {{ props.copyStatus }}
      </p>
      <p v-if="props.requestStatus" class="no-print text-sm leading-6 text-muted-foreground" role="status">
        {{ props.requestStatus }}
      </p>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import Card from '~/components/ui/card/Card.vue'
import { formatCurrency, formatPreferredDate } from '~/lib/format'
import {
  HOME_SIZE_OPTIONS,
  SERVICE_OPTIONS,
  TIMING_OPTIONS,
} from '~/lib/pricing'
import type { QuoteInputs, QuoteResult } from '~/types/quote'

const props = defineProps<{
  inputs: QuoteInputs
  quote: QuoteResult
  reference: string
  copyStatus: string
  requestStatus: string
}>()

const emit = defineEmits<{
  copy: []
  print: []
  request: []
}>()

const serviceLabel = computed(
  () => SERVICE_OPTIONS.find((option) => option.value === props.inputs.serviceType)?.title ?? 'Cleaning service',
)
const homeSizeLabel = computed(
  () => HOME_SIZE_OPTIONS.find((option) => option.value === props.inputs.homeSize)?.label ?? 'Not selected',
)
const timingLabel = computed(
  () => TIMING_OPTIONS.find((option) => option.value === props.inputs.timing)?.label ?? 'Not selected',
)
</script>
