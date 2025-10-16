import { localizeNumber } from '../../shared/utils'

const DEFAULT_DECIMALS = 1

/**
 * Formats a number to a specified number of decimal places
 * @param val - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string
 */
export const formatDecimals = (
  val: number,
  decimals: number = DEFAULT_DECIMALS,
): string => {
  const rounded = Number(val.toFixed(decimals))

  if (rounded === 0 && val !== 0) {
    const str = val.toPrecision(1)
    return str.includes('e') ? '< 0.1' : str
  }

  return val.toFixed(decimals).replace(/\.?0+$/, '')
}

/**
 * Formats a number with decimals and then localizes it for display
 * Combines formatDecimals and localizeNumber for a complete formatting solution
 * @param val - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Localized formatted string
 */
export const formatAndLocalizeNumber = (
  val: number,
  decimals: number = DEFAULT_DECIMALS,
): string => localizeNumber(Number(formatDecimals(val, decimals))) || ''

/**
 * Formats a number with decimals and localizes it, with fallback for null/undefined values
 * @param val - The number to format (can be null or undefined)
 * @param decimals - Number of decimal places (default: 1)
 * @param fallback - Value to return if val is null/undefined (default: '--')
 * @returns Localized formatted string or fallback value
 */
export const formatAndLocalizeNumberWithFallback = (
  val: number | null | undefined,
  decimals: number = DEFAULT_DECIMALS,
  fallback: string = '--',
): string => {
  if (val === null || val === undefined) {
    return fallback
  }
  return formatAndLocalizeNumber(val, decimals)
}

/**
 * Formats a number with 2 decimal places and localizes it
 * Convenience function for the common case of 2 decimal places
 * @param val - The number to format
 * @returns Localized formatted string with 2 decimals
 */
export const formatAndLocalizeNumberWith2Decimals = (val: number): string =>
  formatAndLocalizeNumber(val, 2)

/**
 * Formats a number with 2 decimal places and localizes it, with fallback
 * @param val - The number to format (can be null or undefined)
 * @param fallback - Value to return if val is null/undefined (default: '--')
 * @returns Localized formatted string with 2 decimals or fallback value
 */
export const formatAndLocalizeNumberWith2DecimalsWithFallback = (
  val: number | null | undefined,
  fallback: string = '--',
): string => formatAndLocalizeNumberWithFallback(val, 2, fallback)
