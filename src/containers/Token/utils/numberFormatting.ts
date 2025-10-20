import { localizeNumber } from '../../shared/utils'
import { ExplorerAmount } from '../../shared/types'

/**
 * Default fallback value for empty or missing data
 */
export const DEFAULT_EMPTY_VALUE = '--'

/**
 * Formats a number with 2 decimal places and localizes it, with fallback
 * @param val - The number to format (can be null or undefined)
 * @param fallback - Value to return if val is null/undefined (default: '--')
 * @returns Localized formatted string with 2 decimals or fallback value
 */
export const format2Decimals = (
  val: number | null | undefined,
  fallback: string = DEFAULT_EMPTY_VALUE,
): string => {
  if (val === null || val === undefined) {
    return fallback
  }
  const formatted = val.toFixed(2).replace(/\.?0+$/, '')
  return localizeNumber(Number(formatted)) || fallback
}

/**
 * Extracts and converts the amount from an ExplorerAmount to a number
 * Handles both string and number amount types
 * @param amount - The ExplorerAmount object
 * @returns The amount as a number, or 0 if invalid
 */
export const getAmountAsNumber = (
  amount: ExplorerAmount | undefined,
): number => {
  if (!amount) return 0
  const value = amount.amount
  return typeof value === 'string' ? Number(value) : value
}
