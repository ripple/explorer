import { convertRippleDate } from '../../../rippled/lib/convertRippleDate'

// 1/10th basis point = 0.001%
const ONE_TENTH_BASIS_POINT = 1000

// Loan flag constants from XLS-66 spec
const LSF_LOAN_DEFAULT = 0x00010000
// const LSF_LOAN_IMPAIRED = 0x00020000

/**
 * Format a rate value from 1/10th basis points to percentage string
 * e.g., 50 (1/10th bps) -> "0.05%"
 */
export const formatRate = (rate: number | undefined): string => {
  // the default value for ManagementFeeRate, CoverRateLiquidation and CoverRateMinimum is 0
  if (rate === undefined) return '0.000%'

  // Convert from 1/10th basis points to percentage
  // 1 basis point = 0.01%, 1/10th basis point = 0.001%
  const percentage = rate / ONE_TENTH_BASIS_POINT

  // The field must be able to display up to 3 decimal places
  return `${percentage.toFixed(3)}%`
}

/**
 * Convert payment interval in seconds to human-readable frequency
 * Common intervals: Monthly (~30 days), Weekly (7 days), Daily (1 day)
 */
export const formatPaymentInterval = (seconds: number): string => {
  const SECONDS_PER_DAY = 86400
  const days = Math.round(seconds / SECONDS_PER_DAY)

  if (days >= 28 && days <= 31) return 'Monthly'
  if (days >= 13 && days <= 15) return 'Bi-Weekly'
  if (days >= 6 && days <= 8) return 'Weekly'
  if (days === 1) return 'Daily'
  if (days >= 89 && days <= 92) return 'Quarterly'
  if (days >= 364 && days <= 366) return 'Yearly'

  return `${days} Days`
}

/**
 * Determine loan status based on flags and outstanding balance
 * Returns status key for translation and color class
 */
export const formatLoanStatus = (
  flags: number,
  principalOutstanding: string | number,
): { status: string; colorClass: string } => {
  const outstanding =
    typeof principalOutstanding === 'string'
      ? Number(principalOutstanding)
      : principalOutstanding

  // Check if loan is paid off (no outstanding balance)
  if (outstanding === 0) {
    return { status: 'loan_status_paid_off', colorClass: 'status-paid-off' }
  }

  // Check if loan is defaulted
  // eslint-disable-next-line no-bitwise
  if (flags & LSF_LOAN_DEFAULT) {
    return { status: 'loan_status_default', colorClass: 'status-default' }
  }

  // Otherwise loan is current
  return { status: 'loan_status_current', colorClass: 'status-current' }
}

/**
 * Format a Ripple epoch timestamp to a readable date string
 */
export const formatRippleDate = (
  timestamp: number,
  language: string = 'en-US',
): string => {
  if (!timestamp) return '-'

  const jsTimestamp = convertRippleDate(timestamp)
  const date = new Date(jsTimestamp)

  return date.toLocaleDateString(language, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

/**
 * Truncate a string (like loan ID or address) to show start and end
 * e.g., "4F5E6D7...890AB"
 */
export const truncateId = (id: string, startChars = 7, endChars = 5): string => {
  if (!id || id.length <= startChars + endChars + 3) return id
  return `${id.slice(0, startChars)}...${id.slice(-endChars)}`
}
