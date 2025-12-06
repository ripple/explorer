import { hexToString, hexToBytes } from '@xrplf/isomorphic/utils'
import { encodeAccountID } from 'ripple-address-codec'

import { decodeHex } from '../../containers/shared/transactionUtils'
import { convertRippleDate } from './convertRippleDate'
import { formatSignerList } from './formatSignerList'

const XRP_BASE = 1000000
const THOUSAND = 1000
const BILLION = 1000000000

type FlagMap = Record<number, string>

export const ACCOUNT_FLAGS: FlagMap = {
  0x00010000: 'lsfPasswordSpent',
  0x00020000: 'lsfRequireDestTag',
  0x00040000: 'lsfRequireAuth',
  0x00080000: 'lsfDisallowXRP',
  0x00100000: 'lsfDisableMaster',
  0x00200000: 'lsfNoFreeze',
  0x00400000: 'lsfGlobalFreeze',
  0x00800000: 'lsfDefaultRipple',
  0x01000000: 'lsfDepositAuth',
  0x04000000: 'lsfDisallowIncomingNFTokenOffer',
  0x08000000: 'lsfDisallowIncomingCheck',
  0x10000000: 'lsfDisallowIncomingPayChan',
  0x20000000: 'lsfDisallowIncomingTrustline',
  0x80000000: 'lsfAllowTrustLineClawback',
  0x40000000: 'lsfAllowTrustLineLocking',
}
const NFT_FLAGS: FlagMap = {
  0x00000001: 'lsfBurnable',
  0x00000002: 'lsfOnlyXRP',
  0x00000008: 'lsfTransferable',
}
const MPT_ISSUANCE_FLAGS: FlagMap = {
  0x00000001: 'lsfMPTLocked',
  0x00000002: 'lsfMPTCanLock',
  0x00000004: 'lsfMPTRequireAuth',
  0x00000008: 'lsfMPTCanEscrow',
  0x00000010: 'lsfMPTCanTrade',
  0x00000020: 'lsfMPTCanTransfer',
  0x00000040: 'lsfMPTCanClawback',
}
const MPTOKEN_FLAGS: FlagMap = {
  0x00000001: 'lsfMPTLocked',
  0x00000002: 'lsfMPTAuthorized',
}
const hex32 = (d: number): string => {
  const int = d & 0xffffffff
  const hex = int.toString(16).toUpperCase()
  return `0x${`00000000${hex}`.slice(-8)}`
}

const zeroPad = (
  num: number | string,
  size: number,
  back: boolean = false,
): string => {
  let s = String(num)
  while (s.length < (size || 2)) {
    s = back ? `${s}0` : `0${s}`
  }

  return s
}

export const buildFlags = (
  flags: number | undefined,
  flagMap: FlagMap,
): string[] => {
  const bits = zeroPad((flags || 0).toString(2), 32).split('')

  return bits
    .map((value, i) => {
      const bin = zeroPad(1, 32 - i, true)
      const int = parseInt(bin, 2)
      return value === '1' ? flagMap[int] || hex32(int) : undefined
    })
    .filter((d): d is string => Boolean(d))
}

type TokenType = 'IOU' | 'NFT' | 'MPT'

const formatTransferFee = (
  transferFee: number | null | undefined,
  tokenType: TokenType,
): string => {
  if (!transferFee) {
    return '0'
  }

  // https://xrpl.org/docs/concepts/tokens/fungible-tokens/transfer-fees#technical-details
  if (tokenType === 'IOU') {
    const transferFeePercentage = (100 * (transferFee - BILLION)) / BILLION
    return parseFloat(transferFeePercentage.toFixed(7)).toString()
  }

  // MTP: https://xrpl.org/docs/references/protocol/data-types/nftoken#transferfee
  // NFT: https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens#transfer-fees
  if (tokenType === 'NFT' || tokenType === 'MPT') {
    const transferFeePercentage = transferFee / THOUSAND
    return parseFloat(transferFeePercentage.toFixed(3)).toString()
  }

  throw new Error(`Unsupported Token type: ${tokenType}`)
}

interface AccountInfo {
  AccountTxnID?: string
  Sequence: number
  TicketCount?: number
  OwnerCount: number
  TickSize?: number
  TransferRate?: number
  Domain?: string
  EmailHash?: string
  Flags: number
  Balance: string
  PreviousTxnID: string
  PreviousTxnLgrSeq: number
  NFTokenMinter?: string
}

interface ServerInfoValidated {
  reserve_base_xrp?: number
  reserve_inc_xrp?: number
}

interface FormattedAccountInfo {
  accountTransactionID?: string
  sequence: number
  ticketCount: number
  ownerCount: number
  reserve?: number
  tick?: number
  rate: string
  domain?: string
  emailHash?: string
  flags: string[]
  balance: string
  previousTxn: string
  previousLedger: number
  nftMinter?: string
}

const formatAccountInfo = (
  info: AccountInfo,
  serverInfoValidated: ServerInfoValidated,
): FormattedAccountInfo => ({
  accountTransactionID: info.AccountTxnID,
  sequence: info.Sequence,
  ticketCount: info.TicketCount ?? 0,
  ownerCount: info.OwnerCount,
  reserve:
    serverInfoValidated.reserve_base_xrp && serverInfoValidated.reserve_inc_xrp
      ? serverInfoValidated.reserve_base_xrp +
        info.OwnerCount * serverInfoValidated.reserve_inc_xrp
      : undefined,
  tick: info.TickSize,
  rate: formatTransferFee(info.TransferRate, 'IOU'),
  domain: info.Domain ? hexToString(info.Domain) : undefined,
  emailHash: info.EmailHash,
  flags: buildFlags(info.Flags, ACCOUNT_FLAGS),
  balance: info.Balance,
  previousTxn: info.PreviousTxnID,
  previousLedger: info.PreviousTxnLgrSeq,
  nftMinter: info.NFTokenMinter,
})

const formatTransaction = (tx: any): any => {
  // `tx` is the property for some v1 arrays of transactions such as account_tx and `tx_json` is used in v2 for all
  const txn = tx.tx || tx.tx_json || tx
  // `hash` is up a level on v2 responses objects
  const hash = txn.hash || tx.hash
  return {
    tx: {
      ...txn,
      date: txn.date ? convertRippleDate(txn.date) : undefined,
    },
    meta: tx.meta || tx.metaData,
    hash,
    ledger_index: txn.ledger_index,
    date: txn.date ? convertRippleDate(txn.date) : undefined,
  }
}

class RippledError extends Error {
  code: number

  constructor(message: string, code: number) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
    this.name = this.constructor.name
    this.code = code
  }
}

function convertHexToString(hex: string | undefined): string | undefined {
  return hex ? hexToString(hex) : undefined
}

interface NFTInfo {
  nft_id: string
  ledger_index: number
  owner: string
  is_burned: boolean
  flags: number
  transfer_fee: number
  issuer: string
  nft_taxon: number
  nft_serial?: number
  nft_sequence?: number
  uri: string
  validated: boolean
  status?: string
  warnings?: any[]
}

interface FormattedNFTInfo {
  NFTId: string
  ledgerIndex: number
  owner: string
  isBurned: boolean
  flags: string[]
  transferFee: number
  issuer: string
  NFTTaxon: number
  NFTSerial: number
  uri: string
  validated: boolean
  status?: string
  warnings?: any[]
}

const formatNFTInfo = (info: NFTInfo): FormattedNFTInfo => ({
  NFTId: info.nft_id,
  ledgerIndex: info.ledger_index,
  owner: info.owner,
  isBurned: info.is_burned,
  flags: buildFlags(info.flags, NFT_FLAGS),
  transferFee: info.transfer_fee,
  issuer: info.issuer,
  NFTTaxon: info.nft_taxon,
  // TODO: remove `nft_sequence` support after clio update has been fully rolled out.
  NFTSerial: info.nft_serial ?? info.nft_sequence ?? 0,
  uri: info.nft_serial ? decodeHex(info.uri) : info.uri,
  validated: info.validated,
  status: info.status,
  warnings: info.warnings,
})

interface MPTIssuanceInfo {
  Issuer: string
  AssetScale: number
  MaximumAmount?: string
  OutstandingAmount?: string
  TransferFee: number
  Sequence: number
  MPTokenMetadata?: string
  Flags: number
}

interface FormattedMPTIssuance {
  issuer: string
  assetScale: number
  maxAmt?: string
  outstandingAmt: string
  transferFee: number
  sequence: number
  metadata?: any
  flags: string[]
}

const formatMPTIssuance = (info: MPTIssuanceInfo): FormattedMPTIssuance => ({
  issuer: info.Issuer,
  assetScale: info.AssetScale,
  maxAmt: info.MaximumAmount
    ? BigInt(info.MaximumAmount).toString(10)
    : undefined, // default is undefined because the default maxAmt is the largest 63-bit int
  outstandingAmt: info.OutstandingAmount
    ? BigInt(info.OutstandingAmount).toString(10)
    : '0',
  transferFee: info.TransferFee,
  sequence: info.Sequence,
  metadata: info.MPTokenMetadata
    ? decodeHex(info.MPTokenMetadata)
    : info.MPTokenMetadata,
  flags: buildFlags(info.Flags, MPT_ISSUANCE_FLAGS),
})

interface MPTokenInfo {
  Account: string
  Flags: number
  MPTokenIssuanceID: string
  MPTAmount?: bigint
}

interface FormattedMPToken {
  account: string
  flags: string[]
  mptIssuanceID: string
  mptIssuer: string
  mptAmount: string
}

const formatMPToken = (info: MPTokenInfo): FormattedMPToken => ({
  account: info.Account,
  flags: buildFlags(info.Flags, MPTOKEN_FLAGS),
  mptIssuanceID: info.MPTokenIssuanceID,
  mptIssuer: encodeAccountID(
    hexToBytes(info.MPTokenIssuanceID.substring(8, 48)),
  ),
  mptAmount: info.MPTAmount ? info.MPTAmount.toString(10) : '0',
})

export {
  XRP_BASE,
  RippledError as Error,
  convertRippleDate,
  formatTransaction,
  formatSignerList,
  formatAccountInfo,
  convertHexToString,
  formatNFTInfo,
  formatMPTIssuance,
  formatMPToken,
  formatTransferFee,
}
