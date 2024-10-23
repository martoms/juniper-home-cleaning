<template>
  <div class="min-h-screen overflow-x-clip">
    <header class="no-print mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <a href="#estimate" class="group inline-flex items-center gap-3 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-ring/25">
        <span class="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm" aria-hidden="true">
          <svg viewBox="0 0 24 24" class="size-5 fill-none stroke-current stroke-[1.8]">
            <path d="M12 20V5" />
            <path d="M12 12c-4.5 0-6-2.5-6-6 4.5 0 6 2.5 6 6Z" />
            <path d="M12 16c4.5 0 6-2.5 6-6-4.5 0-6 2.5-6 6Z" />
          </svg>
        </span>
        <span>
          <span class="block text-sm font-bold tracking-tight text-foreground">Juniper</span>
          <span class="block text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">HOME CLEANING</span>
        </span>
      </a>
      <a href="#estimate" class="text-sm font-semibold text-primary underline-offset-4 hover:underline">Get an estimate</a>
    </header>

    <main id="estimate" class="mx-auto w-full max-w-6xl px-4 pb-32 sm:px-6 md:pb-12 lg:px-8">
      <section class="no-print relative overflow-hidden rounded-3xl bg-primary px-6 py-9 text-primary-foreground shadow-sm sm:px-10 sm:py-12">
        <div class="hero-leaf hero-leaf-left" aria-hidden="true" />
        <div class="hero-leaf hero-leaf-right" aria-hidden="true" />
        <div class="relative max-w-2xl">
          <p class="text-xs font-bold tracking-[0.18em] text-primary-foreground/75">HOME CLEANING MADE SIMPLE</p>
          <h1 class="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">Get a clear cleaning estimate.</h1>
          <p class="mt-4 max-w-xl text-base leading-7 text-primary-foreground/80 sm:text-lg">
            Choose a service, tell us about your home, and see your price before you book.
          </p>
          <ul class="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-primary-foreground/90">
            <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-[#e9c38a]" /> No payment needed</li>
            <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-[#e9c38a]" /> Prices shown upfront</li>
            <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-[#e9c38a]" /> Saved on this device</li>
          </ul>
        </div>
      </section>

      <div class="mt-6 grid items-start gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form class="no-print space-y-5" novalidate @submit.prevent="previewEstimate">
          <div
            v-if="previewAttempted && formHasErrors"
            ref="errorSummary"
            class="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-4 text-sm text-foreground"
            role="alert"
            tabindex="-1"
          >
            <p class="font-semibold">A few details need your attention.</p>
            <ul class="mt-2 space-y-1.5 text-muted-foreground">
              <li v-for="issue in errorLinks" :key="issue.id">
                <a :href="`#${issue.id}`" class="underline decoration-primary/40 underline-offset-4 hover:text-primary" @click.prevent="focusField(issue.id)">
                  {{ issue.message }}
                </a>
              </li>
            </ul>
          </div>

          <Card class="overflow-hidden">
            <fieldset>
              <legend class="sr-only">Choose your clean</legend>
              <div class="p-6 sm:p-7">
                <div class="flex w-full items-start gap-3">
                  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">1</span>
                  <span>
                    <span class="block text-lg font-semibold tracking-tight">Choose your clean</span>
                    <span class="mt-1 block text-sm leading-6 text-muted-foreground">Pick the service that best fits your home today.</span>
                  </span>
                </div>
                <p v-if="errorFor('service')" id="service-error" class="mt-4 text-sm font-medium text-destructive">{{ errorFor('service') }}</p>
                <div class="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  <div v-for="option in SERVICE_OPTIONS" :key="option.value" class="relative">
                    <input
                      :id="`service-${option.value}`"
                      v-model="inputs.serviceType"
                      type="radio"
                      name="service"
                      :value="option.value"
                      class="peer sr-only"
                      :aria-invalid="errorFor('service') ? 'true' : undefined"
                      :aria-describedby="errorFor('service') ? 'service-error' : undefined"
                    >
                    <Label
                      :for="`service-${option.value}`"
                      class="flex min-h-40 cursor-pointer flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 peer-checked:border-primary peer-checked:bg-accent/55 peer-focus-visible:ring-4 peer-focus-visible:ring-ring/25"
                    >
                      <span class="flex items-start justify-between gap-3">
                        <span class="text-base font-semibold text-foreground">{{ option.title }}</span>
                        <span class="text-sm font-bold text-primary">{{ formatCurrency(PRICING.serviceBase[option.value].amount) }}</span>
                      </span>
                      <span class="mt-3 text-sm leading-5 text-muted-foreground">{{ option.description }}</span>
                    </Label>
                  </div>
                </div>
              </div>
            </fieldset>
          </Card>

          <Card>
            <fieldset>
              <legend class="sr-only">Tell us about your home</legend>
              <div class="p-6 sm:p-7">
                <div class="flex w-full items-start gap-3">
                  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">2</span>
                  <span>
                    <span class="block text-lg font-semibold tracking-tight">Tell us about your home</span>
                    <span class="mt-1 block text-sm leading-6 text-muted-foreground">A few details help us shape a more useful estimate.</span>
                  </span>
                </div>
                <div class="mt-5 grid grid-cols-2 gap-3 sm:max-w-md">
                  <div>
                  <Label for="bedrooms">Bedrooms</Label>
                  <div class="relative mt-2">
                    <select
                      id="bedrooms"
                      v-model.number="inputs.bedrooms"
                      class="flex h-11 w-full appearance-none rounded-xl border border-input bg-card px-3 pr-10 text-base shadow-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/20 sm:text-sm"
                      :class="errorFor('bedrooms') ? 'border-destructive focus-visible:border-destructive' : ''"
                      :aria-invalid="errorFor('bedrooms') ? 'true' : undefined"
                      :aria-describedby="errorFor('bedrooms') ? 'bedrooms-error' : undefined"
                    >
                      <option :value="0" disabled>Select</option>
                      <option v-for="count in 6" :key="count" :value="count">{{ count }}</option>
                    </select>
                    <svg class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75">
                      <path d="m4 6 4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <p v-if="errorFor('bedrooms')" id="bedrooms-error" class="mt-2 text-sm font-medium text-destructive">{{ errorFor('bedrooms') }}</p>
                  </div>
                  <div>
                  <Label for="bathrooms">Bathrooms</Label>
                  <div class="relative mt-2">
                    <select
                      id="bathrooms"
                      v-model.number="inputs.bathrooms"
                      class="flex h-11 w-full appearance-none rounded-xl border border-input bg-card px-3 pr-10 text-base shadow-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/20 sm:text-sm"
                      :class="errorFor('bathrooms') ? 'border-destructive focus-visible:border-destructive' : ''"
                      :aria-invalid="errorFor('bathrooms') ? 'true' : undefined"
                      :aria-describedby="errorFor('bathrooms') ? 'bathrooms-error' : undefined"
                    >
                      <option :value="0" disabled>Select</option>
                      <option v-for="count in 6" :key="count" :value="count">{{ count }}</option>
                    </select>
                    <svg class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75">
                      <path d="m4 6 4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <p v-if="errorFor('bathrooms')" id="bathrooms-error" class="mt-2 text-sm font-medium text-destructive">{{ errorFor('bathrooms') }}</p>
                  </div>
                </div>

                <div class="mt-6">
                  <p class="text-sm font-medium">Home size</p>
                  <p v-if="errorFor('homeSize')" id="home-size-error" class="mt-2 text-sm font-medium text-destructive">{{ errorFor('homeSize') }}</p>
                  <div class="mt-3 grid gap-3 sm:grid-cols-2">
                    <div v-for="option in HOME_SIZE_OPTIONS" :key="option.value" class="relative">
                      <input
                        :id="`size-${option.value}`"
                        v-model="inputs.homeSize"
                        type="radio"
                        name="home-size"
                        :value="option.value"
                        class="peer sr-only"
                        :aria-invalid="errorFor('homeSize') ? 'true' : undefined"
                        :aria-describedby="errorFor('homeSize') ? 'home-size-error' : undefined"
                      >
                      <Label
                        :for="`size-${option.value}`"
                        class="flex min-h-11 cursor-pointer items-center rounded-xl border border-border bg-card px-4 text-sm transition-colors hover:border-primary/40 peer-checked:border-primary peer-checked:bg-accent/55 peer-focus-visible:ring-4 peer-focus-visible:ring-ring/25"
                      >
                        {{ option.label }}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </Card>

          <Card>
            <fieldset>
              <legend class="sr-only">Add details</legend>
              <div class="p-6 sm:p-7">
                <div class="flex w-full items-start gap-3">
                  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">3</span>
                  <span>
                    <span class="block text-lg font-semibold tracking-tight">Add details</span>
                    <span class="mt-1 block text-sm leading-6 text-muted-foreground">Choose any finishing touches and your preferred timing.</span>
                  </span>
                </div>
                <div class="mt-5 grid gap-3 sm:grid-cols-2">
                  <div v-for="option in ADD_ON_OPTIONS" :key="option.value" class="relative">
                    <input
                      :id="`addon-${option.value}`"
                      type="checkbox"
                      class="peer sr-only"
                      :checked="inputs.addOns.includes(option.value)"
                      @change="toggleAddOn(option.value)"
                    >
                    <Label
                      :for="`addon-${option.value}`"
                      class="flex min-h-28 cursor-pointer flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 peer-checked:border-primary peer-checked:bg-accent/55 peer-focus-visible:ring-4 peer-focus-visible:ring-ring/25"
                    >
                      <span class="flex w-full items-start justify-between gap-3">
                        <span class="font-semibold text-foreground">{{ option.label }}</span>
                        <span class="shrink-0 text-sm font-bold text-primary">
                          +{{ formatCurrency(PRICING.addOns[option.value].amount) }}
                        </span>
                      </span>
                      <span class="mt-2 text-sm leading-5 text-muted-foreground">{{ option.description }}</span>
                    </Label>
                  </div>
                </div>

                <div class="mt-7">
                  <p class="text-sm font-medium">When would you like us to come by?</p>
                  <p v-if="errorFor('timing')" id="timing-error" class="mt-2 text-sm font-medium text-destructive">{{ errorFor('timing') }}</p>
                  <div class="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    <div v-for="option in TIMING_OPTIONS" :key="option.value" class="relative">
                      <input
                        :id="`timing-${option.value}`"
                        v-model="inputs.timing"
                        type="radio"
                        name="timing"
                        :value="option.value"
                        class="peer sr-only"
                        :aria-invalid="errorFor('timing') ? 'true' : undefined"
                        :aria-describedby="errorFor('timing') ? 'timing-error' : undefined"
                      >
                      <Label
                        :for="`timing-${option.value}`"
                        class="flex min-h-20 cursor-pointer items-center rounded-2xl border border-border bg-card px-4 text-sm transition-colors hover:border-primary/40 peer-checked:border-primary peer-checked:bg-accent/55 peer-focus-visible:ring-4 peer-focus-visible:ring-ring/25"
                      >
                        {{ option.label }}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </Card>

          <Card>
            <fieldset>
              <legend class="sr-only">Make it yours</legend>
              <div class="p-6 sm:p-7">
                <div class="flex w-full items-start gap-3">
                  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">4</span>
                  <span>
                    <span class="block text-lg font-semibold tracking-tight">Make it yours</span>
                    <span class="mt-1 block text-sm leading-6 text-muted-foreground">We use these details only to prepare your quote preview.</span>
                  </span>
                </div>
                <div class="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label for="customer-name">Your name</Label>
                    <Input
                      id="customer-name"
                      v-model="inputs.customerName"
                      autocomplete="name"
                      placeholder="Alex Morgan"
                      class="mt-2"
                      :class="errorFor('customerName') ? 'border-destructive focus-visible:border-destructive' : ''"
                      :aria-invalid="errorFor('customerName') ? 'true' : undefined"
                      :aria-describedby="errorFor('customerName') ? 'customer-name-error' : undefined"
                    />
                    <p v-if="errorFor('customerName')" id="customer-name-error" class="mt-2 text-sm font-medium text-destructive">{{ errorFor('customerName') }}</p>
                  </div>
                  <div>
                    <Label for="customer-email">Email address</Label>
                    <Input
                      id="customer-email"
                      v-model="inputs.customerEmail"
                      type="email"
                      autocomplete="email"
                      placeholder="alex@example.com"
                      class="mt-2"
                      :class="errorFor('customerEmail') ? 'border-destructive focus-visible:border-destructive' : ''"
                      :aria-invalid="errorFor('customerEmail') ? 'true' : undefined"
                      :aria-describedby="errorFor('customerEmail') ? 'customer-email-error' : undefined"
                    />
                    <p v-if="errorFor('customerEmail')" id="customer-email-error" class="mt-2 text-sm font-medium text-destructive">{{ errorFor('customerEmail') }}</p>
                  </div>
                  <div class="sm:col-span-2 sm:max-w-xs">
                    <Label for="preferred-date">Preferred date</Label>
                    <Input
                      id="preferred-date"
                      v-model="inputs.preferredDate"
                      type="date"
                      :min="minimumDate || undefined"
                      class="mt-2"
                      :class="errorFor('preferredDate') ? 'border-destructive focus-visible:border-destructive' : ''"
                      :aria-invalid="errorFor('preferredDate') ? 'true' : undefined"
                      :aria-describedby="errorFor('preferredDate') ? 'preferred-date-error' : undefined"
                    />
                    <p v-if="errorFor('preferredDate')" id="preferred-date-error" class="mt-2 text-sm font-medium text-destructive">{{ errorFor('preferredDate') }}</p>
                  </div>
                </div>
                <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button variant="ghost" type="button" class="self-start" @click="resetCalculator">Reset calculator</Button>
                  <Button type="submit" size="lg" class="w-full sm:w-auto">Preview my estimate</Button>
                </div>
              </div>
            </fieldset>
          </Card>
        </form>

        <section v-if="quoteReady" id="mobile-estimate-details" class="no-print md:hidden">
          <details ref="mobileSummaryDetails" class="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <summary class="cursor-pointer px-5 py-4 text-sm font-semibold text-primary outline-none transition-colors hover:bg-secondary focus-visible:ring-4 focus-visible:ring-ring/25">
              View itemized estimate
            </summary>
            <div class="border-t border-border p-2">
              <QuoteSummary :quote="quote" :quote-ready="quoteReady" compact />
            </div>
          </details>
        </section>

        <aside class="no-print hidden md:block lg:sticky lg:top-6">
          <QuoteSummary :quote="quote" :quote-ready="quoteReady" />
        </aside>
      </div>

      <section v-if="previewVisible" class="mt-8 scroll-mt-6">
        <QuotePreview
          :inputs="inputs"
          :quote="quote"
          :reference="quoteReference"
          :copy-status="copyStatus"
          :request-status="requestStatus"
          @copy="copyQuote"
          @print="printQuote"
          @request="requestEstimate"
        />
      </section>
    </main>

    <div class="no-print fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgb(45_74_61_/_0.08)] backdrop-blur md:hidden">
      <div class="mx-auto max-w-md">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold tracking-[0.13em] text-muted-foreground">ESTIMATED TOTAL</p>
            <p v-if="quoteReady" class="mt-0.5 text-2xl font-semibold tracking-tight text-primary">{{ formatCurrency(quote.total) }}</p>
            <p v-else class="mt-0.5 text-sm font-medium text-muted-foreground">Complete service details</p>
            <p v-if="quoteReady" class="mt-0.5 text-xs leading-4 text-muted-foreground">Final price confirmed after review.</p>
          </div>
          <Button v-if="quoteReady" variant="outline" size="sm" @click="openMobileSummary">View details</Button>
        </div>
      </div>
    </div>

    <p class="sr-only" aria-live="polite">{{ estimateAnnouncement }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useQuoteCalculator } from '~/composables/useQuoteCalculator'
import Button from '~/components/ui/button/Button.vue'
import Card from '~/components/ui/card/Card.vue'
import Input from '~/components/ui/input/Input.vue'
import Label from '~/components/ui/label/Label.vue'
import { formatCurrency } from '~/lib/format'
import {
  ADD_ON_OPTIONS,
  HOME_SIZE_OPTIONS,
  isPreferredDateValid,
  PRICING,
  SERVICE_OPTIONS,
  TIMING_OPTIONS,
} from '~/lib/pricing'

const {
  inputs,
  quote,
  quoteReady,
  previewReady,
  reset,
  toggleAddOn,
} = useQuoteCalculator()

const previewAttempted = ref(false)
const previewVisible = ref(false)
const quoteReference = ref('')
const copyStatus = ref('')
const requestStatus = ref('')
const minimumDate = ref('')
const errorSummary = ref<HTMLElement | null>(null)
const mobileSummaryDetails = ref<HTMLDetailsElement | null>(null)

const fieldIds: Record<string, string> = {
  service: 'service-standard',
  bedrooms: 'bedrooms',
  bathrooms: 'bathrooms',
  homeSize: 'size-under-1000',
  timing: 'timing-flexible',
  customerName: 'customer-name',
  customerEmail: 'customer-email',
  preferredDate: 'preferred-date',
}

const validationErrors = computed<Record<string, string>>(() => {
  const errors: Record<string, string> = {}

  if (!inputs.value.serviceType) {
    errors.service = 'Choose a cleaning service.'
  }

  if (!Number.isFinite(inputs.value.bedrooms) || inputs.value.bedrooms < 1) {
    errors.bedrooms = 'Choose the number of bedrooms.'
  }

  if (!Number.isFinite(inputs.value.bathrooms) || inputs.value.bathrooms < 1) {
    errors.bathrooms = 'Choose the number of bathrooms.'
  }

  if (!inputs.value.homeSize) {
    errors.homeSize = 'Choose a home-size range.'
  }

  if (!inputs.value.timing) {
    errors.timing = 'Choose your preferred timing.'
  }

  if (!inputs.value.customerName.trim()) {
    errors.customerName = 'Enter your name.'
  }

  if (!/^\S+@\S+\.\S+$/.test(inputs.value.customerEmail)) {
    errors.customerEmail = 'Enter a valid email address.'
  }

  if (!inputs.value.preferredDate) {
    errors.preferredDate = 'Choose a preferred date.'
  } else if (!isPreferredDateValid(inputs.value.preferredDate)) {
    errors.preferredDate = 'Choose today or a future date.'
  }

  return errors
})

const formHasErrors = computed(() => Object.keys(validationErrors.value).length > 0)
const errorLinks = computed(() =>
  Object.entries(validationErrors.value).map(([field, message]) => ({
    id: fieldIds[field],
    message,
  })),
)
const estimateAnnouncement = computed(() =>
  quoteReady.value ? `Estimate updated. ${formatCurrency(quote.value.total)} total.` : '',
)
const serviceLabel = computed(
  () => SERVICE_OPTIONS.find((option) => option.value === inputs.value.serviceType)?.title ?? 'Not selected',
)
const homeSizeLabel = computed(
  () => HOME_SIZE_OPTIONS.find((option) => option.value === inputs.value.homeSize)?.label ?? 'Not selected',
)
const timingLabel = computed(
  () => TIMING_OPTIONS.find((option) => option.value === inputs.value.timing)?.label ?? 'Not selected',
)
const addOnLabels = computed(() => {
  const labels = inputs.value.addOns
    .map((addOn) => ADD_ON_OPTIONS.find((option) => option.value === addOn)?.label)
    .filter((label): label is string => Boolean(label))

  return labels.length ? labels.join(', ') : 'None'
})

const errorFor = (field: string): string | undefined =>
  previewAttempted.value ? validationErrors.value[field] : undefined

const getLocalDateInputValue = (): string => {
  const today = new Date()
  const offset = today.getTimezoneOffset()
  return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

const focusField = (id: string): void => {
  document.getElementById(id)?.focus()
}

const previewEstimate = async (): Promise<void> => {
  previewAttempted.value = true
  copyStatus.value = ''
  requestStatus.value = ''

  if (!previewReady.value) {
    await nextTick()
    errorSummary.value?.focus()
    return
  }

  if (!quoteReference.value) {
    quoteReference.value = `JUN-${Math.floor(10000 + Math.random() * 90000)}`
  }

  previewVisible.value = true
  await nextTick()
  const heading = document.getElementById('estimate-preview-heading')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  heading?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
  heading?.focus()
}

const quoteText = (): string =>
  [
    'Juniper Home Cleaning — Estimate',
    `Reference: ${quoteReference.value}`,
    `For: ${inputs.value.customerName} (${inputs.value.customerEmail})`,
    `Preferred date: ${inputs.value.preferredDate}`,
    `Service: ${serviceLabel.value}`,
    `Home: ${inputs.value.bedrooms} bedroom(s), ${inputs.value.bathrooms} bathroom(s)`,
    `Home size: ${homeSizeLabel.value}`,
    `Timing: ${timingLabel.value}`,
    `Add-ons: ${addOnLabels.value}`,
    '',
    'Price breakdown:',
    ...quote.value.lineItems.map((item) => `${item.label}: ${item.amount === 0 ? 'Included' : formatCurrency(item.amount)}`),
    '',
    `Estimated total: ${formatCurrency(quote.value.total)}`,
    'Final pricing and availability are confirmed after review.',
  ].join('\n')

const copyWithFallback = (text: string): void => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.append(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()

  if (!copied) {
    throw new Error('Copy command was unavailable.')
  }
}

const copyQuote = async (): Promise<void> => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(quoteText())
    } else {
      copyWithFallback(quoteText())
    }
    copyStatus.value = 'Quote copied to your clipboard.'
  } catch {
    try {
      copyWithFallback(quoteText())
      copyStatus.value = 'Quote copied to your clipboard.'
    } catch {
      copyStatus.value = 'Copy is unavailable in this browser. Select the estimate text to copy it.'
    }
  }
}

const printQuote = (): void => {
  window.print()
}

const requestEstimate = (): void => {
  requestStatus.value = 'Prototype confirmation only. No estimate request or personal information was sent.'
}

const openMobileSummary = async (): Promise<void> => {
  mobileSummaryDetails.value?.setAttribute('open', '')
  await nextTick()
  mobileSummaryDetails.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const resetCalculator = async (): Promise<void> => {
  reset()
  previewAttempted.value = false
  previewVisible.value = false
  quoteReference.value = ''
  copyStatus.value = ''
  requestStatus.value = ''
  await nextTick()
  focusField('service-standard')
}

onMounted(() => {
  minimumDate.value = getLocalDateInputValue()
})

watch(previewReady, (ready) => {
  if (!ready) {
    previewVisible.value = false
  }
})
</script>
