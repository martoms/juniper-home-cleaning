import type {
  AddOnId,
  HomeSize,
  PricingRule,
  QuoteInputs,
  QuoteLineItem,
  QuoteResult,
  ServiceType,
  Timing,
} from '~/types/quote'

export const SERVICE_OPTIONS: Array<{
  value: ServiceType
  title: string
  description: string
}> = [
  {
    value: 'standard',
    title: 'Standard clean',
    description: 'A recurring refresh for a cared-for home.',
  },
  {
    value: 'deep',
    title: 'Deep clean',
    description: 'A fuller reset for spaces that need extra attention.',
  },
  {
    value: 'move-out',
    title: 'Move-out clean',
    description: 'A detailed clean before handing over the keys.',
  },
]

export const HOME_SIZE_OPTIONS: Array<{ value: HomeSize; label: string }> = [
  { value: 'under-1000', label: 'Under 1,000 sq ft' },
  { value: '1000-2000', label: '1,000–2,000 sq ft' },
  { value: '2000-3000', label: '2,000–3,000 sq ft' },
  { value: 'over-3000', label: 'Over 3,000 sq ft' },
]

export const TIMING_OPTIONS: Array<{ value: Timing; label: string }> = [
  { value: 'flexible', label: 'I am flexible' },
  { value: 'within-week', label: 'Within 7 days' },
  { value: 'next-day', label: 'Next-day service' },
]

export const ADD_ON_OPTIONS: Array<{
  value: AddOnId
  label: string
  description: string
}> = [
  {
    value: 'oven',
    label: 'Inside oven',
    description: 'Degrease racks, door, and interior.',
  },
  {
    value: 'refrigerator',
    label: 'Inside refrigerator',
    description: 'Wipe shelves, drawers, and interior surfaces.',
  },
  {
    value: 'windows',
    label: 'Interior windows',
    description: 'Clean accessible interior glass and sills.',
  },
  {
    value: 'laundry',
    label: 'Laundry refresh',
    description: 'Fold one standard load of clean laundry.',
  },
]

export const PRICING: {
  serviceBase: Record<ServiceType, PricingRule>
  perBedroom: number
  perBathroom: number
  homeSize: Record<HomeSize, PricingRule>
  timing: Record<Timing, PricingRule>
  addOns: Record<AddOnId, PricingRule>
} = {
  serviceBase: {
    standard: { id: 'service-standard', label: 'Standard clean', amount: 89 },
    deep: { id: 'service-deep', label: 'Deep clean', amount: 149 },
    'move-out': { id: 'service-move-out', label: 'Move-out clean', amount: 189 },
  },
  perBedroom: 20,
  perBathroom: 25,
  homeSize: {
    'under-1000': { id: 'size-under-1000', label: 'Home under 1,000 sq ft', amount: 0 },
    '1000-2000': { id: 'size-1000-2000', label: 'Home size adjustment', amount: 25 },
    '2000-3000': { id: 'size-2000-3000', label: 'Home size adjustment', amount: 55 },
    'over-3000': { id: 'size-over-3000', label: 'Home size adjustment', amount: 95 },
  },
  timing: {
    flexible: { id: 'timing-flexible', label: 'Flexible timing', amount: 0 },
    'within-week': { id: 'timing-within-week', label: 'Within 7 days', amount: 20 },
    'next-day': { id: 'timing-next-day', label: 'Next-day service', amount: 45 },
  },
  addOns: {
    oven: { id: 'addon-oven', label: 'Inside oven', amount: 30 },
    refrigerator: { id: 'addon-refrigerator', label: 'Inside refrigerator', amount: 25 },
    windows: { id: 'addon-windows', label: 'Interior windows', amount: 40 },
    laundry: { id: 'addon-laundry', label: 'Laundry refresh', amount: 20 },
  },
}

export const DEFAULT_QUOTE_INPUTS: QuoteInputs = {
  serviceType: null,
  bedrooms: 0,
  bathrooms: 0,
  homeSize: null,
  timing: null,
  addOns: [],
  customerName: '',
  customerEmail: '',
  preferredDate: '',
}

export const createDefaultQuoteInputs = (): QuoteInputs => {
  return {
    ...DEFAULT_QUOTE_INPUTS,
    addOns: [...DEFAULT_QUOTE_INPUTS.addOns],
  }
}

const quantityLineItem = (
  id: string,
  label: string,
  quantity: number,
  unitAmount: number,
): QuoteLineItem => {
  return {
    id,
    label: `${quantity} ${label}${quantity === 1 ? '' : 's'}`,
    amount: quantity * unitAmount,
  }
}

export const calculateQuote = (inputs: QuoteInputs): QuoteResult => {
  const lineItems: QuoteLineItem[] = []

  if (inputs.serviceType) {
    lineItems.push(PRICING.serviceBase[inputs.serviceType])
  }

  if (inputs.bedrooms > 0) {
    lineItems.push(
      quantityLineItem('bedrooms', 'bedroom', inputs.bedrooms, PRICING.perBedroom),
    )
  }

  if (inputs.bathrooms > 0) {
    lineItems.push(
      quantityLineItem('bathrooms', 'bathroom', inputs.bathrooms, PRICING.perBathroom),
    )
  }

  if (inputs.homeSize) {
    lineItems.push(PRICING.homeSize[inputs.homeSize])
  }

  if (inputs.timing) {
    lineItems.push(PRICING.timing[inputs.timing])
  }

  inputs.addOns.forEach((addOn) => {
    lineItems.push(PRICING.addOns[addOn])
  })

  return {
    lineItems,
    total: lineItems.reduce((sum, item) => sum + item.amount, 0),
  }
}

export const isQuoteReady = (inputs: QuoteInputs): boolean => {
  return Boolean(
    inputs.serviceType &&
      inputs.bedrooms > 0 &&
      inputs.bathrooms > 0 &&
      inputs.homeSize &&
      inputs.timing,
  )
}

export const isPreferredDateValid = (date: string): boolean => {
  if (!date) {
    return false
  }

  const preferredDate = new Date(`${date}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return !Number.isNaN(preferredDate.getTime()) && preferredDate >= today
}

export const isPreviewReady = (inputs: QuoteInputs): boolean => {
  return Boolean(
    isQuoteReady(inputs) &&
      inputs.customerName.trim() &&
      /^\S+@\S+\.\S+$/.test(inputs.customerEmail) &&
      isPreferredDateValid(inputs.preferredDate),
  )
}
