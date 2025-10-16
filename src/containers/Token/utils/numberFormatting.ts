import { localizeNumber } from '../../shared/utils'

/**
 * Formats a number with 2 decimal places and localizes it, with fallback
 * @param val - The number to format (can be null or undefined)
 * @param fallback - Value to return if val is null/undefined (default: '--')
 * @returns Localized formatted string with 2 decimals or fallback value
 */
export const formatAndLocalizeNumberWith2DecimalsWithFallback = (
  val: number | null | undefined,
  fallback: string = '--',
): string => {
  if (val === null || val === undefined) {
    return fallback
  }
  const formatted = val.toFixed(2).replace(/\.?0+$/, '')
  return localizeNumber(Number(formatted)) || fallback
}
