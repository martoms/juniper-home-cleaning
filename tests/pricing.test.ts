import { describe, expect, it } from 'vitest'
import {
  calculateQuote,
  createDefaultQuoteInputs,
  DEFAULT_QUOTE_INPUTS,
  isPreviewReady,
  isQuoteReady,
} from '~/lib/pricing'
import type { HomeSize, QuoteInputs } from '~/types/quote'

const COMPLETE_INPUTS: QuoteInputs = {
  ...DEFAULT_QUOTE_INPUTS,
  serviceType: 'standard',
  bedrooms: 2,
  bathrooms: 1,
  homeSize: '1000-2000',
  timing: 'flexible',
}

const futureDate = (): string => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

describe('calculateQuote', () => {
  it('calculates the standard cleaning estimate', () => {
    const result = calculateQuote(COMPLETE_INPUTS)

    expect(result.total).toBe(179)
    expect(result.lineItems.map((item) => item.amount)).toEqual([89, 40, 25, 25, 0])
  })

  it('includes a deep-clean, size, timing, and add-on surcharges', () => {
    const result = calculateQuote({
      ...COMPLETE_INPUTS,
      serviceType: 'deep',
      bedrooms: 3,
      bathrooms: 2,
      homeSize: '2000-3000',
      timing: 'next-day',
      addOns: ['oven', 'windows'],
    })

    expect(result.total).toBe(429)
    expect(result.lineItems).toHaveLength(7)
  })

  it('calculates a move-out estimate with the largest home-size adjustment', () => {
    const result = calculateQuote({
      ...COMPLETE_INPUTS,
      serviceType: 'move-out',
      bedrooms: 1,
      bathrooms: 1,
      homeSize: 'over-3000',
      timing: 'within-week',
      addOns: ['refrigerator', 'laundry'],
    })

    expect(result.total).toBe(394)
    expect(result.lineItems.map((item) => item.amount)).toEqual([189, 20, 25, 95, 20, 25, 20])
  })

  it('applies each home-size adjustment exactly once', () => {
    const homeSizes: HomeSize[] = ['under-1000', '1000-2000', '2000-3000', 'over-3000']
    const amounts = homeSizes.map((homeSize) => {
      const result = calculateQuote({ ...COMPLETE_INPUTS, homeSize })
      return result.lineItems.find((item) => item.id.startsWith('size-'))?.amount
    })

    expect(amounts).toEqual([0, 25, 55, 95])
  })

  it('uses each add-on once and keeps the line-item sum equal to the total', () => {
    const result = calculateQuote({
      ...COMPLETE_INPUTS,
      addOns: ['oven', 'refrigerator', 'windows', 'laundry'],
    })

    expect(result.total).toBe(
      result.lineItems.reduce((sum, item) => sum + item.amount, 0),
    )
  })

  it('creates isolated default state for calculator resets', () => {
    const changedState = createDefaultQuoteInputs()
    changedState.addOns.push('oven')

    expect(createDefaultQuoteInputs()).toEqual(DEFAULT_QUOTE_INPUTS)
    expect(isQuoteReady(createDefaultQuoteInputs())).toBe(false)
  })
})

describe('quote validation', () => {
  it('requires all pricing inputs before a quote is ready', () => {
    expect(isQuoteReady(DEFAULT_QUOTE_INPUTS)).toBe(false)
    expect(isQuoteReady({ ...COMPLETE_INPUTS, serviceType: null })).toBe(false)
    expect(isQuoteReady({ ...COMPLETE_INPUTS, bedrooms: 0 })).toBe(false)
    expect(isQuoteReady(COMPLETE_INPUTS)).toBe(true)
  })

  it('requires valid customer details before opening a preview', () => {
    expect(isPreviewReady(DEFAULT_QUOTE_INPUTS)).toBe(false)
    expect(
      isPreviewReady({
        ...COMPLETE_INPUTS,
        customerName: 'Maya Cruz',
        customerEmail: 'maya@example.com',
        preferredDate: futureDate(),
      }),
    ).toBe(true)
    expect(
      isPreviewReady({
        ...COMPLETE_INPUTS,
        customerName: 'Maya Cruz',
        customerEmail: 'maya@example.com',
        preferredDate: '2020-01-01',
      }),
    ).toBe(false)
  })
})
