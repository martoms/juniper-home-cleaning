import { computed, onMounted, ref, watch } from 'vue'
import {
  calculateQuote,
  createDefaultQuoteInputs,
  isPreviewReady,
  isQuoteReady,
} from '~/lib/pricing'
import type {
  AddOnId,
  HomeSize,
  QuoteInputs,
  ServiceType,
  Timing,
} from '~/types/quote'

const STORAGE_KEY = 'juniper-estimate-draft'
const SERVICE_TYPES: ServiceType[] = ['standard', 'deep', 'move-out']
const HOME_SIZES: HomeSize[] = ['under-1000', '1000-2000', '2000-3000', 'over-3000']
const TIMINGS: Timing[] = ['flexible', 'within-week', 'next-day']
const ADD_ONS: AddOnId[] = ['oven', 'refrigerator', 'windows', 'laundry']

const isMember = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === 'string' && values.includes(value as T)

const isRoomCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6

const sanitizeDraft = (draft: Partial<QuoteInputs>): QuoteInputs => {
  const defaults = createDefaultQuoteInputs()

  return {
    ...defaults,
    serviceType: isMember(SERVICE_TYPES, draft.serviceType) ? draft.serviceType : defaults.serviceType,
    bedrooms: isRoomCount(draft.bedrooms) ? draft.bedrooms : defaults.bedrooms,
    bathrooms: isRoomCount(draft.bathrooms) ? draft.bathrooms : defaults.bathrooms,
    homeSize: isMember(HOME_SIZES, draft.homeSize) ? draft.homeSize : defaults.homeSize,
    timing: isMember(TIMINGS, draft.timing) ? draft.timing : defaults.timing,
    addOns: Array.isArray(draft.addOns)
      ? [...new Set(draft.addOns.filter((addOn) => isMember(ADD_ONS, addOn)))]
      : defaults.addOns,
    customerName: typeof draft.customerName === 'string' ? draft.customerName : defaults.customerName,
    customerEmail: typeof draft.customerEmail === 'string' ? draft.customerEmail : defaults.customerEmail,
    preferredDate: typeof draft.preferredDate === 'string' ? draft.preferredDate : defaults.preferredDate,
  }
}

export const useQuoteCalculator = () => {
  const inputs = ref<QuoteInputs>(createDefaultQuoteInputs())
  const hasLoadedDraft = ref(false)
  const quote = computed(() => calculateQuote(inputs.value))
  const quoteReady = computed(() => isQuoteReady(inputs.value))
  const previewReady = computed(() => isPreviewReady(inputs.value))

  onMounted(() => {
    const storedDraft = window.localStorage.getItem(STORAGE_KEY)

    if (storedDraft) {
      try {
        const parsedDraft = JSON.parse(storedDraft) as unknown
        if (typeof parsedDraft === 'object' && parsedDraft !== null && !Array.isArray(parsedDraft)) {
          inputs.value = sanitizeDraft(parsedDraft as Partial<QuoteInputs>)
        } else {
          window.localStorage.removeItem(STORAGE_KEY)
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }

    hasLoadedDraft.value = true
  })

  watch(
    inputs,
    (value) => {
      if (hasLoadedDraft.value) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      }
    },
    { deep: true },
  )

  const toggleAddOn = (addOn: AddOnId): void => {
    const isSelected = inputs.value.addOns.includes(addOn)
    inputs.value.addOns = isSelected
      ? inputs.value.addOns.filter((item) => item !== addOn)
      : [...inputs.value.addOns, addOn]
  }

  const reset = (): void => {
    inputs.value = createDefaultQuoteInputs()
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return {
    inputs,
    quote,
    quoteReady,
    previewReady,
    toggleAddOn,
    reset,
  }
}
