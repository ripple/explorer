import type { MPTAmount } from 'xrpl'
import { Amount, ExplorerAmount } from '../../../containers/shared/types'
import { XRP_BASE } from '../utils'

/**
 * Asset type definition for XRPL assets
 */
export interface Asset {
  currency: string
  issuer?: string
  isMPT?: boolean
  mpt_issuance_id?: string
}

/**
 * Format Asset field according to XRPL specifications
 * - XRP: { "currency": "XRP" } or "XRP" (string)
 * - IOU: { "currency": "USD", "issuer": "rXXX..." }
 * - MPT: { "mpt_issuance_id": "000000..." }
 */
export function formatAsset(asset: any): Asset {
  if (typeof asset === 'string') {
    return { currency: 'XRP' }
  }

  if (asset && typeof asset === 'object') {
    if (asset.mpt_issuance_id) {
      return {
        currency: asset.mpt_issuance_id,
        mpt_issuance_id: asset.mpt_issuance_id,
        isMPT: true,
      }
    }
    if (asset.currency) {
      return {
        currency: asset.currency,
        issuer: asset.issuer,
      }
    }
  }

  // Fallback to XRP if asset format is unclear
  return { currency: 'XRP' }
}

export const isXRP = (amount: Amount): boolean => typeof amount === 'string'

export const isMPTAmount = (amount: Amount): amount is MPTAmount =>
  (amount as MPTAmount).mpt_issuance_id !== undefined &&
  (amount as MPTAmount).value !== undefined

export const formatAmount = (d: Amount | number): ExplorerAmount => {
  if (d == null) {
    return d
  }

  if (typeof d === 'string' || typeof d === 'number')
    return {
      currency: 'XRP',
      amount: Number(d) / XRP_BASE,
    }

  return isMPTAmount(d)
    ? {
        currency: d.mpt_issuance_id,
        amount: d.value,
        isMPT: true,
      }
    : {
        currency: d.currency,
        issuer: d.issuer,
        amount: Number(d.value),
      }
}

/**
 * Formats a raw amount using the provided asset information
 * @param amount - The amount to format (string or number)
 * @param asset - The asset information containing currency and issuer
 * @returns ExplorerAmount - Formatted amount with correct currency
 */
export function formatAmountWithAsset(amount: string | number, asset: Asset) {
  if (amount == null || amount === undefined) {
    return undefined
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (asset.currency === 'XRP') {
    return {
      currency: 'XRP',
      amount: numericAmount / XRP_BASE,
    }
  }

  if (asset.isMPT) {
    return {
      currency: asset.currency,
      amount: numericAmount,
      isMPT: true,
    }
  }

  return {
    currency: asset.currency,
    issuer: asset.issuer!,
    amount: numericAmount,
  }
}

export default formatAmount
