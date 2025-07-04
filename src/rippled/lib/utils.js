import { hexToString, hexToBytes } from '@xrplf/isomorphic/utils'
import { encodeAccountID } from 'ripple-address-codec'
import { convertRippleDate } from './convertRippleDate'
import { formatSignerList } from './formatSignerList'
import { decodeHex } from '../../containers/shared/transactionUtils'

const XRP_BASE = 1000000
const BILLION = 1000000000

export const ACCOUNT_FLAGS = {
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
}
const NFT_FLAGS = {
  0x00000001: 'lsfBurnable',
  0x00000002: 'lsfOnlyXRP',
  0x00000008: 'lsfTransferable',
}
const MPT_ISSUANCE_FLAGS = {
  0x00000001: 'lsfMPTLocked',
  0x00000002: 'lsfMPTCanLock',
  0x00000004: 'lsfMPTRequireAuth',
  0x00000008: 'lsfMPTCanEscrow',
  0x00000010: 'lsfMPTCanTrade',
  0x00000020: 'lsfMPTCanTransfer',
  0x00000040: 'lsfMPTCanClawback',
}
const MPTOKEN_FLAGS = {
  0x00000001: 'lsfMPTLocked',
  0x00000002: 'lsfMPTAuthorized',
}
const hex32 = (d) => {
  const int = d & 0xffffffff
  const hex = int.toString(16).toUpperCase()
  return `0x${`00000000${hex}`.slice(-8)}`
}

const zeroPad = (num, size, back = false) => {
  let s = String(num)
  while (s.length < (size || 2)) {
    s = back ? `${s}0` : `0${s}`
  }

  return s
}

const buildFlags = (flags, flagMap) => {
  const bits = zeroPad((flags || 0).toString(2), 32).split('')

  return bits
    .map((value, i) => {
      const bin = zeroPad(1, 32 - i, true)
      const int = parseInt(bin, 2)
      return value === '1' ? flagMap[int] || hex32(int) : undefined
    })
    .filter((d) => Boolean(d))
}

const formatAccountInfo = (info, serverInfoValidated) => ({
  sequence: info.Sequence,
  ticketCount: info.TicketCount,
  ownerCount: info.OwnerCount,
  reserve: serverInfoValidated.reserve_base_xrp
    ? serverInfoValidated.reserve_base_xrp +
      info.OwnerCount * serverInfoValidated.reserve_inc_xrp
    : undefined,
  tick: info.TickSize,
  rate: info.TransferRate ? (info.TransferRate - BILLION) / BILLION : undefined,
  domain: info.Domain ? hexToString(info.Domain) : undefined,
  emailHash: info.EmailHash,
  flags: buildFlags(info.Flags, ACCOUNT_FLAGS),
  balance: info.Balance,
  previousTxn: info.PreviousTxnID,
  previousLedger: info.PreviousTxnLgrSeq,
  nftMinter: info.NFTokenMinter,
})

const formatTransaction = (tx) => {
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

function RippledError(message, code) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor)
  }
  this.name = this.constructor.name
  this.message = message
  this.code = code
}

function convertHexToString(hex, encoding = 'utf8') {
  return hex ? hexToString(hex) : undefined
}

const formatNFTInfo = (info) => ({
  NFTId: info.nft_id,
  ledgerIndex: info.ledger_index,
  owner: info.owner,
  isBurned: info.is_burned,
  flags: buildFlags(info.flags, NFT_FLAGS),
  transferFee: info.transfer_fee,
  issuer: info.issuer,
  NFTTaxon: info.nft_taxon,
  // TODO: remove `nft_sequence` support after clio update has been fully rolled out.
  NFTSerial: info.nft_serial ?? info.nft_sequence,
  uri: info.nft_serial ? decodeHex(info.uri) : info.uri,
  validated: info.validated,
  status: info.status,
  warnings: info.warnings,
})

const formatMPTIssuanceInfo = (info) => ({
  issuer: info.node.Issuer,
  assetScale: info.node.AssetScale,
  maxAmt: info.node.MaximumAmount
    ? BigInt(info.node.MaximumAmount).toString(10)
    : undefined, // default is undefined because the default maxAmt is the largest 63-bit int
  outstandingAmt: info.node.OutstandingAmount
    ? BigInt(info.node.OutstandingAmount).toString(10)
    : '0',
  transferFee: info.node.TransferFee,
  sequence: info.node.Sequence,
  metadata: info.node.MPTokenMetadata
    ? decodeHex(info.node.MPTokenMetadata)
    : info.node.MPTokenMetadata,
  flags: buildFlags(info.node.Flags, MPT_ISSUANCE_FLAGS),
})

const formatMPTokenInfo = (info) => ({
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
  formatMPTIssuanceInfo,
  formatMPTokenInfo,
}
