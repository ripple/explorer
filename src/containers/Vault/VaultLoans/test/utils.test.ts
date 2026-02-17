/**
 * VaultLoans Utility Functions Unit Tests
 *
 * This test suite validates the utility functions used across the VaultLoans
 * component for formatting rates, dates, loan status, and IDs.
 *
 * Key functions tested:
 * - formatRate: Converts 1/10th basis points to percentage strings
 * - formatPaymentInterval: Converts seconds to human-readable frequency
 * - formatLoanStatus: Determines loan status from flags and balance
 * - formatRippleDate: Converts Ripple epoch timestamps to date strings
 * - truncateId: Shortens long IDs for display
 * - LSF_LOAN_DEFAULT, LSF_LOAN_IMPAIRED: Flag constants
 */

import {
  formatRate,
  formatPaymentInterval,
  formatLoanStatus,
  truncateId,
  LSF_LOAN_DEFAULT,
  LSF_LOAN_IMPAIRED,
} from '../utils'

describe('VaultLoans Utils', () => {
  /**
   * =========================================
   * SECTION 1: formatRate Tests
   * =========================================
   * formatRate converts values from 1/10th basis points to percentage strings.
   * 1 basis point = 0.01%, so 1/10th basis point = 0.001%
   *
   * The formula is: percentage = rate / 1000
   * Example: 500 (1/10th bps) → 500/1000 = 0.5 → "0.500%"
   */
  describe('formatRate', () => {
    it('converts 1/10th basis points to percentage', () => {
      // 500 / 1000 = 0.5%
      expect(formatRate(500)).toBe('0.500%')
    })

    it('handles zero rate', () => {
      expect(formatRate(0)).toBe('0.000%')
    })

    it('handles small rates (less than 1 basis point)', () => {
      // 1 / 1000 = 0.001%
      expect(formatRate(1)).toBe('0.001%')
    })

    it('handles large rates', () => {
      // 10000 / 1000 = 10%
      expect(formatRate(10000)).toBe('10.000%')
    })

    it('returns default value for undefined rate', () => {
      // Default ManagementFeeRate, CoverRateMinimum, etc. is 0 or `--`
      expect(formatRate(undefined)).toBe('--')
    })

    it('formats with exactly 3 decimal places', () => {
      // Ensures consistent formatting regardless of value
      expect(formatRate(1000)).toBe('1.000%')
      expect(formatRate(1500)).toBe('1.500%')
      expect(formatRate(1234)).toBe('1.234%')
    })
  })

  /**
   * =========================================
   * SECTION 2: formatPaymentInterval Tests
   * =========================================
   * formatPaymentInterval converts seconds to human-readable frequency.
   * Common intervals:
   * - Daily: 86,400 seconds (1 day)
   * - Weekly: 604,800 seconds (7 days)
   * - Bi-Weekly: ~1,209,600 seconds (14 days)
   * - Monthly: ~2,592,000 seconds (30 days)
   * - Quarterly: ~7,776,000 seconds (90 days)
   * - Yearly: ~31,536,000 seconds (365 days)
   */
  describe('formatPaymentInterval', () => {
    it('identifies daily interval', () => {
      const oneDay = 86400
      expect(formatPaymentInterval(oneDay)).toBe('Daily')
    })

    it('identifies weekly interval', () => {
      const sevenDays = 604800
      expect(formatPaymentInterval(sevenDays)).toBe('Weekly')
    })

    it('identifies bi-weekly interval', () => {
      const fourteenDays = 1209600
      expect(formatPaymentInterval(fourteenDays)).toBe('Bi-Weekly')
    })

    it('identifies monthly interval (30 days)', () => {
      const thirtyDays = 2592000
      expect(formatPaymentInterval(thirtyDays)).toBe('Monthly')
    })

    it('identifies monthly interval with slight variance (28-31 days)', () => {
      // Real months vary from 28-31 days
      expect(formatPaymentInterval(28 * 86400)).toBe('Monthly')
      expect(formatPaymentInterval(31 * 86400)).toBe('Monthly')
    })

    it('identifies quarterly interval', () => {
      const ninetyDays = 7776000
      expect(formatPaymentInterval(ninetyDays)).toBe('Quarterly')
    })

    it('identifies yearly interval', () => {
      const threeHundredSixtyFiveDays = 31536000
      expect(formatPaymentInterval(threeHundredSixtyFiveDays)).toBe('Yearly')
    })

    it('shows days for non-standard intervals', () => {
      // 45 days doesn't match any standard interval
      const fortyFiveDays = 45 * 86400
      expect(formatPaymentInterval(fortyFiveDays)).toBe('45 Days')
    })
  })

  /**
   * =========================================
   * SECTION 3: formatLoanStatus Tests
   * =========================================
   * formatLoanStatus determines loan status based on:
   * 1. Flags (LSF_LOAN_DEFAULT, LSF_LOAN_IMPAIRED)
   * 2. Outstanding balance (0 = paid off)
   *
   * Priority order:
   * 1. Paid Off (balance = 0)
   * 2. Default (LSF_LOAN_DEFAULT flag set)
   * 3. Impaired (LSF_LOAN_IMPAIRED flag set)
   * 4. Current (no flags, has balance)
   */
  describe('formatLoanStatus', () => {
    it('returns paid_off status when balance is zero', () => {
      const result = formatLoanStatus(0, 0)
      expect(result.status).toBe('loan_status_paid_off')
      expect(result.colorClass).toBe('status-paid-off')
    })

    it('returns paid_off status when balance is "0" string', () => {
      const result = formatLoanStatus(0, '0')
      expect(result.status).toBe('loan_status_paid_off')
    })

    it('returns default status when LSF_LOAN_DEFAULT flag is set', () => {
      const result = formatLoanStatus(LSF_LOAN_DEFAULT, 1000)
      expect(result.status).toBe('loan_status_default')
      expect(result.colorClass).toBe('status-default')
    })

    it('returns impaired status when LSF_LOAN_IMPAIRED flag is set', () => {
      const result = formatLoanStatus(LSF_LOAN_IMPAIRED, 1000)
      expect(result.status).toBe('loan_status_impaired')
      expect(result.colorClass).toBe('status-impaired')
    })

    it('returns current status for active loan with no flags', () => {
      const result = formatLoanStatus(0, 1000)
      expect(result.status).toBe('loan_status_current')
      expect(result.colorClass).toBe('status-current')
    })

    it('paid_off takes priority over default flag', () => {
      // Even if default flag is set, zero balance means paid off
      const result = formatLoanStatus(LSF_LOAN_DEFAULT, 0)
      expect(result.status).toBe('loan_status_paid_off')
    })

    it('default takes priority over impaired flag', () => {
      // If both flags are set, default takes precedence
      const bothFlags = LSF_LOAN_DEFAULT | LSF_LOAN_IMPAIRED
      const result = formatLoanStatus(bothFlags, 1000)
      expect(result.status).toBe('loan_status_default')
    })

    it('handles string balance values', () => {
      const result = formatLoanStatus(0, '5000')
      expect(result.status).toBe('loan_status_current')
    })
  })

  /**
   * =========================================
   * SECTION 4: truncateId Tests
   * =========================================
   * truncateId shortens long IDs for display by showing
   * the first N chars, "...", and the last M chars.
   *
   * Default: first 7 chars + "..." + last 5 chars
   */
  describe('truncateId', () => {
    it('truncates long IDs with default parameters', () => {
      const longId = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456'
      // Default: first 7 + "..." + last 5
      expect(truncateId(longId)).toBe('ABCDEFG...23456')
    })

    it('returns original ID if already short enough', () => {
      const shortId = 'ABC123'
      expect(truncateId(shortId)).toBe('ABC123')
    })

    it('uses custom start and end character counts', () => {
      const id = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      // First 4 + "..." + last 4
      expect(truncateId(id, 4, 4)).toBe('ABCD...WXYZ')
    })

    it('handles empty string', () => {
      expect(truncateId('')).toBe('')
    })

    it('handles undefined/null gracefully', () => {
      expect(truncateId(undefined as any)).toBe(undefined)
    })

    it('does not truncate if ID length equals threshold', () => {
      // Threshold is startChars + endChars + 3 (for "...")
      // Default: 7 + 5 + 3 = 15
      const exactId = 'ABCDEFGHIJKLMNO' // 15 chars
      expect(truncateId(exactId)).toBe(exactId)
    })
  })

  /**
   * =========================================
   * SECTION 5: Flag Constants Tests
   * =========================================
   * Verify the loan flag constants match the XLS-66 spec.
   */
  describe('Flag Constants', () => {
    it('LSF_LOAN_DEFAULT has correct value', () => {
      // From XLS-66 spec: 0x00010000 = 65536
      expect(LSF_LOAN_DEFAULT).toBe(0x00010000)
      expect(LSF_LOAN_DEFAULT).toBe(65536)
    })

    it('LSF_LOAN_IMPAIRED has correct value', () => {
      // From XLS-66 spec: 0x00020000 = 131072
      expect(LSF_LOAN_IMPAIRED).toBe(0x00020000)
      expect(LSF_LOAN_IMPAIRED).toBe(131072)
    })

    it('flags are distinct (no overlap)', () => {
      // Bitwise AND should be 0 for distinct flags
      expect(LSF_LOAN_DEFAULT & LSF_LOAN_IMPAIRED).toBe(0)
    })

    it('flags can be combined with bitwise OR', () => {
      const combined = LSF_LOAN_DEFAULT | LSF_LOAN_IMPAIRED
      // Combined should have both bits set
      expect(combined & LSF_LOAN_DEFAULT).toBeTruthy()
      expect(combined & LSF_LOAN_IMPAIRED).toBeTruthy()
    })
  })
})
