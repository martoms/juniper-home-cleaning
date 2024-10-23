export type ServiceType = 'standard' | 'deep' | 'move-out'

export type HomeSize = 'under-1000' | '1000-2000' | '2000-3000' | 'over-3000'

export type Timing = 'flexible' | 'within-week' | 'next-day'

export type AddOnId = 'oven' | 'refrigerator' | 'windows' | 'laundry'

export interface QuoteInputs {
  serviceType: ServiceType | null
  bedrooms: number
  bathrooms: number
  homeSize: HomeSize | null
  timing: Timing | null
  addOns: AddOnId[]
  customerName: string
  customerEmail: string
  preferredDate: string
}

export interface PricingRule {
  id: string
  label: string
  amount: number
}

export interface QuoteLineItem extends PricingRule {}

export interface QuoteResult {
  lineItems: QuoteLineItem[]
  total: number
}
