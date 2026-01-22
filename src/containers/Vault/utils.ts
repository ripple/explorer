import { localizeNumber } from '../shared/utils'

/**
 * Decode the Data field from hex to UTF-8 if needed
 */
export const decodeVaultData = (data: string | undefined): string | undefined => {
  if (!data) return undefined

  // Try to decode hex string to UTF-8
  if (/^[0-9A-Fa-f]+$/.test(data)) {
    try {
      return Buffer.from(data, 'hex').toString('utf8')
    } catch {
      return data
    }
  }

  return data
}

/**
 * Format large numbers with K (thousands) or M (millions) suffixes
 * e.g., 12500000 -> "12.5M", 200000 -> "200K"
 *
 * @param value - The number or string value to format
 * @param language - Locale string for number formatting
 * @param options - Optional configuration
 * @param options.currency - Currency suffix to append (e.g., "XRP")
 * @param options.prefix - Prefix to prepend (e.g., "$")
 * @param options.fallback - Value to return if input is invalid (default: "-")
 * @param options.maxFractionDigits - Maximum fraction digits (default: 2)
 */
export const formatCompactNumber = (
  value: string | number | undefined,
  language: string,
  options: {
    currency?: string
    prefix?: string
    fallback?: string
    maxFractionDigits?: number
  } = {},
): string => {
  const {
    currency = '',
    prefix = '',
    fallback = '0',
    maxFractionDigits = 2,
  } = options

  if (value === undefined || value === null || value === '') {
    return fallback
  }

  const num = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(num)) {
    return String(value)
  }

  let formattedNum: string
  if (num >= 1_000_000) {
    formattedNum = `${localizeNumber(num / 1_000_000, language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFractionDigits,
    })}M`
  } else if (num >= 1_000) {
    formattedNum = `${localizeNumber(num / 1_000, language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFractionDigits,
    })}K`
  } else {
    formattedNum = String(
      localizeNumber(num, language, {
        minimumFractionDigits: 0,
        maximumFractionDigits: maxFractionDigits,
      }),
    )
  }

  const parts = [prefix, formattedNum, currency].filter(Boolean)
  return parts.join(currency ? ' ' : '')
}
