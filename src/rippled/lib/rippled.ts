import type { XrplClient } from 'xrpl-client'

import type { ExplorerXrplClient } from '../../containers/shared/SocketContext'
import { CTID_REGEX, HASH256_REGEX } from '../../containers/shared/utils'
import { formatAmount } from './txSummary/formatAmount'
import { Error, XRP_BASE, convertRippleDate } from './utils'

const N_UNL_INDEX =
  '2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244'

const formatEscrow = (d: any) => ({
  id: d.index,
  account: d.Account,
  destination: d.Destination,
  amount: d.Amount / XRP_BASE,
  condition: d.Condition,
  cancelAfter: d.CancelAfter ? convertRippleDate(d.CancelAfter) : undefined,
  finishAfter: d.FinishAfter ? convertRippleDate(d.FinishAfter) : undefined,
})

const formatPaychannel = (d: any) => ({
  id: d.index,
  account: d.Account,
  destination: d.Destination,
  amount: d.Amount / XRP_BASE,
  balance: d.Balance / XRP_BASE,
  settleDelay: d.SettleDelay,
})

const executeQuery = async (
  rippledSocket: XrplClient,
  params: any,
): Promise<any> =>
  rippledSocket.send(params).catch((error: any) => {
    const message =
      error.response && error.response.error_message
        ? error.response.error_message
        : error.toString()
    const code =
      error.response && error.response.status ? error.response.status : 500
    throw new Error(message, code)
  })

// generic RPC query
function query(rippledSocket: ExplorerXrplClient, options: any): Promise<any> {
  return executeQuery(rippledSocket, options)
}

// If there is a separate peer to peer (not reporting mode) server for admin requests, use it.
// Otherwise use the default rippledSocket for everything.
function queryP2P(
  rippledSocket: ExplorerXrplClient,
  options: any,
): Promise<any> {
  return executeQuery(rippledSocket.p2pSocket ?? rippledSocket, options)
}

// get ledger
const getLedger = async (
  rippledSocket: ExplorerXrplClient,
  parameters: any,
): Promise<any> => {
  const request = {
    command: 'ledger',
    ...parameters,
    transactions: true,
    expand: true,
  }

  const resp = await query(rippledSocket, request)
  if (!resp) {
    throw new Error(`No response from rippled: ${JSON.stringify(resp)}`, 500)
  }
  if (resp.error_message === 'ledgerNotFound') {
    throw new Error('ledger not found', 404)
  }

  if (resp.error_message === 'ledgerIndexMalformed') {
    throw new Error('invalid ledger index/hash', 400)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  if (!resp.validated) {
    throw new Error('ledger not validated', 404)
  }
  return resp.ledger
}

// get ledger_entry
const getLedgerEntry = async (
  rippledSocket: ExplorerXrplClient,
  { index }: { index: string },
  ledgerIndex?: number,
): Promise<any> => {
  const request = {
    command: 'ledger_entry',
    index,
    ledger_index: ledgerIndex ?? 'validated',
  }

  const resp = await query(rippledSocket, request)
  if (resp.error_message === 'entryNotFound') {
    throw new Error('ledger entry not found', 404)
  }

  if (resp.error_message === 'invalidParams') {
    throw new Error('invalidParams for ledger_entry', 404)
  }

  if (resp.error_message === 'lgrNotFound') {
    throw new Error('invalid ledger index/hash', 400)
  }

  if (resp.error_message === 'malformedAddress') {
    throw new Error(
      'The ledger_entry request improperly specified an Address field.',
      404,
    )
  }

  if (resp.error_message === 'malformedCurrency') {
    throw new Error(
      'The ledger_entry request improperly specified a Currency Code field.',
      404,
    )
  }

  if (resp.error_message === 'malformedOwner') {
    throw new Error(
      'The ledger_entry request improperly specified the escrow.owner sub-field.',
      404,
    )
  }

  if (resp.error_message === 'malformedRequest') {
    throw new Error(
      'The ledger_entry request provided an invalid combination of fields, or provided the wrong type for one or more fields.',
      404,
    )
  }

  if (resp.error_message === 'unknownOption') {
    throw new Error(
      'The fields provided in the ledger_entry request did not match any of the expected request formats.',
      404,
    )
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  return resp
}

// get transaction
const getTransaction = async (
  rippledSocket: ExplorerXrplClient,
  txId: string,
): Promise<any> => {
  const params: any = {
    command: 'tx',
  }
  if (HASH256_REGEX.test(txId)) {
    params.transaction = txId
  } else if (CTID_REGEX.test(txId)) {
    params.ctid = txId
  } else {
    throw new Error(`${txId} not a ctid or hash`, 404)
  }

  const resp = await query(rippledSocket, params)
  if (resp.error === 'txnNotFound') {
    throw new Error('transaction not found', 404)
  }

  if (resp.error === 'notImpl') {
    throw new Error('invalid transaction hash', 400)
  }

  // TODO: remove the `unknown` option when
  // https://github.com/XRPLF/rippled/pull/4738 is in a release
  if (resp.error === 'wrongNetwork' || resp.error === 'unknown') {
    throw new Error('wrong network for CTID', 406)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  if (!resp.validated) {
    throw new Error('transaction not validated', 500)
  }
  return resp
}

const getAccountInfo = async (
  rippledSocket: ExplorerXrplClient,
  account: string | unknown,
  includeSignerLists: boolean = true,
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'account_info',
    api_version: 1,
    account,
    ledger_index: 'validated',
    signer_lists: includeSignerLists,
  })
  if (resp.error === 'actNotFound') {
    throw new Error('account not found', 404)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  return Object.assign(resp.account_data, {
    ledger_index: resp.ledger_index,
  })
}

// get account escrows
const getAccountEscrows = async (
  rippledSocket: ExplorerXrplClient,
  account: string,
  ledgerIndex: string | number = 'validated',
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'account_objects',
    account,
    ledger_index: ledgerIndex,
    type: 'escrow',
    limit: 400,
  })
  if (resp.error === 'actNotFound') {
    throw new Error('account not found', 404)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  if (!resp.account_objects.length) {
    return undefined
  }

  const escrows: any = { in: [], out: [], total: 0, totalIn: 0, totalOut: 0 }
  resp.account_objects.forEach((d: any) => {
    const amount = Number(d.Amount)
    escrows.total += amount
    if (account === d.Destination) {
      escrows.in.push(formatEscrow(d))
      escrows.totalIn += amount
    } else {
      escrows.out.push(formatEscrow(d))
      escrows.totalOut += amount
    }
  })

  escrows.total /= XRP_BASE
  escrows.totalIn /= XRP_BASE
  escrows.totalOut /= XRP_BASE
  return escrows
}

// get account paychannels
const getAccountPaychannels = async (
  rippledSocket: ExplorerXrplClient,
  account: string,
  ledgerIndex: string | number = 'validated',
): Promise<any> => {
  const list: any[] = []
  let remaining = 0
  const getChannels = async (marker?: any): Promise<any> => {
    const resp = await query(rippledSocket, {
      command: 'account_objects',
      marker,
      account,
      ledger_index: ledgerIndex,
      type: 'payment_channel',
      limit: 400,
    })
    if (resp.error === 'actNotFound') {
      throw new Error('account not found', 404)
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500)
    }

    // This isn't working, resp.marker isn't empty, but we don't enter this if block
    if (!resp.account_objects.length) {
      return undefined
    }

    list.push(...resp.account_objects)
    if (resp.marker) {
      return getChannels(resp.marker)
    }

    return undefined
  }

  await getChannels()

  const channels = list.map((c) => {
    remaining += c.Amount - c.Balance
    return formatPaychannel(c)
  })

  return channels.length
    ? {
        channels,
        total_available: remaining / XRP_BASE,
      }
    : undefined
}

// get account escrows
const getAccountBridges = async (
  rippledSocket: ExplorerXrplClient,
  account: string,
  ledgerIndex: string | number = 'validated',
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'account_objects',
    account,
    ledger_index: ledgerIndex,
    type: 'bridge',
    limit: 400,
  })
  if (resp.error === 'actNotFound') {
    throw new Error('account not found', 404)
  }
  if (resp.error === 'invalidParams') {
    // thrown when XChainBridge amendment is not activated
    // TODO: remove this when XLS-38d is live in mainnet
    return undefined
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  if (!resp.account_objects.length) {
    return undefined
  }

  if (resp.account_objects.length >= 1) {
    return resp.account_objects.map((bridge: any) => ({
      lockingChainDoor: bridge.XChainBridge.LockingChainDoor,
      lockingChainIssue: bridge.XChainBridge.LockingChainIssue,
      issuingChainDoor: bridge.XChainBridge.IssuingChainDoor,
      issuingChainIssue: bridge.XChainBridge.LockingChainIssue,
      minAccountCreateAmount: formatAmount(bridge.MinAccountCreateAmount),
      signatureReward: formatAmount(bridge.SignatureReward),
      xchainAccountClaimCount: bridge.XChainAccountClaimCount,
      xchainAccountCreateCount: bridge.XChainAccountCreateCount,
      xchainClaimId: bridge.XChainClaimID,
    }))
  }

  return undefined
}

// get Token balance summary
const getBalances = async (
  rippledSocket: ExplorerXrplClient,
  account: string,
  ledgerIndex: string | number = 'validated',
): Promise<any> => {
  const resp = await queryP2P(rippledSocket, {
    command: 'gateway_balances',
    account,
    ledger_index: ledgerIndex,
  })
  if (resp.error === 'actNotFound') {
    throw new Error('account not found', 404)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }
  return resp
}

const getAccountTransactions = async (
  rippledSocket: ExplorerXrplClient,
  account: string,
  limit: number = 20,
  marker: string = '',
): Promise<any> => {
  const markerComponents = marker.split('.')
  const ledger = parseInt(markerComponents[0], 10)
  const seq = parseInt(markerComponents[1], 10)
  const resp = await query(rippledSocket, {
    command: 'account_tx',
    account,
    limit,
    ledger_index_max: -1,
    ledger_index_min: -1,
    marker: marker
      ? {
          ledger,
          seq,
        }
      : undefined,
  })
  if (resp.error === 'actNotFound') {
    throw new Error('account not found', 404)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }
  return {
    transactions: resp.transactions,
    marker: resp.marker
      ? `${resp.marker.ledger}.${resp.marker.seq}`
      : undefined,
  }
}

const getAccountNFTs = async (
  rippledSocket: ExplorerXrplClient,
  account: string,
  marker: string = '',
  limit: number = 20,
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'account_nfts',
    account,
    marker: marker || undefined,
    limit, // Not `limit` of NFTs, but `limit` pages of NFTs
  })
  if (resp.error === 'actNotFound') {
    throw new Error('account not found', 404)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  return resp
}

const getNFTsIssuedByAccount = async (
  rippledSocket: ExplorerXrplClient,
  issuer: string,
  marker: string = '',
  limit: number = 20,
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'nfts_by_issuer',
    issuer,
    marker: marker || undefined,
    limit,
  })
  if (resp.error === 'actNotFound') {
    throw new Error('account not found', 404)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  return resp
}

const getNFTInfo = async (
  rippledSocket: ExplorerXrplClient,
  tokenId: string,
): Promise<any> => {
  const resp = await queryP2P(rippledSocket, {
    command: 'nft_info',
    api_version: 2,
    nft_id: tokenId,
  })
  if (resp.error === 'objectNotFound') {
    throw new Error('NFT not found', 404)
  }
  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }
  return resp
}

const getNFToffers = async (
  offerCmd: string,
  rippledSocket: ExplorerXrplClient,
  tokenId: string,
  limit: number = 50,
  marker: string = '',
): Promise<any> => {
  const allOffers: any[] = []
  let currentMarker: string | undefined = marker

  do {
    // eslint-disable-next-line no-await-in-loop
    const resp = await query(rippledSocket, {
      command: offerCmd,
      nft_id: tokenId,
      limit,
      marker: currentMarker !== '' ? currentMarker : undefined,
    })

    // The NFT does not have any offers (note that object refers to the offer rather than the NFT itself).
    if (resp.error === 'objectNotFound') {
      throw new Error(resp.error_message, 404)
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500)
    }

    allOffers.push(...(resp.offers || []))
    currentMarker = resp.marker
  } while (currentMarker)

  return { offers: allOffers }
}

const getBuyNFToffers = (
  rippledSocket: ExplorerXrplClient,
  tokenId: string,
  limit: number = 50,
  marker: string = '',
): Promise<any> =>
  getNFToffers('nft_buy_offers', rippledSocket, tokenId, limit, marker)

const getSellNFToffers = (
  rippledSocket: ExplorerXrplClient,
  tokenId: string,
  limit: number = 50,
  marker: string = '',
): Promise<any> =>
  getNFToffers('nft_sell_offers', rippledSocket, tokenId, limit, marker)

const getNFTTransactions = async (
  rippledSocket: ExplorerXrplClient,
  tokenId: string,
  limit: number = 20,
  marker: string = '',
  forward: boolean = false,
): Promise<any> => {
  const markerComponents = marker.split('.')
  const ledger = parseInt(markerComponents[0], 10)
  const seq = parseInt(markerComponents[1], 10)
  const resp = await queryP2P(rippledSocket, {
    command: 'nft_history',
    api_version: 2,
    nft_id: tokenId,
    limit,
    ledger_index_max: -1,
    ledger_index_min: -1,
    marker: marker
      ? {
          ledger,
          seq,
        }
      : undefined,
    forward,
  })
  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }
  return {
    transactions: resp.transactions,
    marker: resp.marker
      ? `${resp.marker.ledger}.${resp.marker.seq}`
      : undefined,
  }
}

const getNegativeUNL = async (
  rippledSocket: ExplorerXrplClient,
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'ledger_entry',
    index: N_UNL_INDEX,
  })
  if (
    resp.error === 'entryNotFound' ||
    resp.error === 'lgrNotFound' ||
    resp.error === 'objectNotFound'
  ) {
    return []
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  return resp
}

// get server info
const getServerInfo = async (
  rippledSocket: ExplorerXrplClient,
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'server_info',
  })
  if (resp.error !== undefined || resp.error_message !== undefined) {
    throw new Error(resp.error_message || resp.error, 500)
  }

  return resp
}

// gets server state
const getServerState = async (
  rippledSocket: ExplorerXrplClient,
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'server_state',
  })
  if (resp.error !== undefined || resp.error_message !== undefined) {
    throw new Error(resp.error_message || resp.error, 500)
  }

  return resp
}

const getOffers = async (
  rippledSocket: ExplorerXrplClient,
  currencyCode: string,
  issuerAddress: string,
  pairCurrencyCode: string,
  pairIssuerAddress: string,
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'book_offers',
    taker_gets: {
      currency: `${currencyCode.toUpperCase()}`,
      issuer:
        currencyCode.toUpperCase() === 'XRP' ? undefined : `${issuerAddress}`,
    },
    taker_pays: {
      currency: `${pairCurrencyCode.toUpperCase()}`,
      issuer:
        pairCurrencyCode.toUpperCase() === 'XRP'
          ? undefined
          : `${pairIssuerAddress}`,
    },
  })
  if (resp.error !== undefined || resp.error_message !== undefined) {
    throw new Error(resp.error_message || resp.error, 500)
  }

  return resp
}

const getAMMInfo = async (
  rippledSocket: ExplorerXrplClient,
  params: any,
): Promise<any> => {
  const request = {
    command: 'amm_info',
    ledger_index: 'validated',
    ...params,
  }

  const resp = await query(rippledSocket, request)
  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  if (!resp.validated) {
    throw new Error(
      'Ledger is not validated. The response data is pending and might change',
      500,
    )
  }

  return resp
}

const getAMMInfoByAssets = (
  rippledSocket: ExplorerXrplClient,
  asset: any,
  asset2: any,
): Promise<any> => getAMMInfo(rippledSocket, { asset, asset2 })

const getAMMInfoByAMMAccount = (
  rippledSocket: ExplorerXrplClient,
  ammAccount: string,
): Promise<any> => getAMMInfo(rippledSocket, { amm_account: ammAccount })

// get feature
const getFeature = async (
  rippledSocket: ExplorerXrplClient,
  amendmentId: string,
): Promise<any> => {
  const request = {
    command: 'feature',
    feature: amendmentId,
  }
  const resp = await query(rippledSocket, request)
  if (resp == null || resp.error_message) {
    return null
  }

  return resp
}

const getMPTIssuance = async (
  rippledSocket: ExplorerXrplClient,
  tokenId: string | null,
): Promise<any> => {
  const resp = await queryP2P(rippledSocket, {
    command: 'ledger_entry',
    mpt_issuance: tokenId,
    ledger_index: 'validated',
    include_deleted: true,
  })
  if (
    resp.error === 'entryNotFound' ||
    resp.error === 'lgrNotFound' ||
    resp.error === 'objectNotFound'
  ) {
    throw new Error('MPT Issuance not found', 404)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  return resp
}

const getAccountMPTs = async (
  rippledSocket: ExplorerXrplClient,
  account: string,
  marker: string = '',
  ledgerIndex: string | number = 'validated',
  limit: number = 400,
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'account_objects',
    account,
    ledger_index: ledgerIndex,
    type: 'mptoken',
    marker: marker || undefined,
    limit,
  })
  if (resp.error === 'actNotFound') {
    throw new Error('account not found', 404)
  }

  if (resp.error === 'invalidParams') {
    // For example, "error_message": "Required field 'account' missing"
    throw new Error(resp.error_message, 400)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  return resp
}

const getAccountObjects = async (
  rippledSocket: ExplorerXrplClient,
  account: string,
  objectType: string,
  marker: string = '',
  ledgerIndex: string | number = 'validated',
  limit: number = 400,
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'account_objects',
    account,
    ledger_index: ledgerIndex,
    type: objectType,
    marker: marker || undefined,
    limit,
  })
  if (resp.error === 'actNotFound') {
    throw new Error('account not found', 404)
  }

  if (resp.error === 'invalidParams') {
    // For example, "error_message": "Required field 'account' missing"
    throw new Error(resp.error_message, 400)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  return resp
}

const getAccountLines = async (
  rippledSocket: ExplorerXrplClient,
  account: string,
  limit: number,
  marker: string = '',
): Promise<any> => {
  const resp = await query(rippledSocket, {
    command: 'account_lines',
    account,
    limit,
    marker: marker || undefined,
  })
  if (resp.error === 'actNotFound') {
    throw new Error('account not found', 404)
  }
  if (resp.error === 'invalidParams') {
    // For example, "error_message": "Required field 'account' missing"
    throw new Error(resp.error_message, 400)
  }

  if (resp.error_message) {
    throw new Error(resp.error_message, 500)
  }

  return resp
}

/**
 * Fetches MPT holders using the mpt_holders Clio method
 * @see https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/clio-methods/mpt_holders
 */
const getMPTHolders = (rippledSocket, mptIssuanceId, limit = 20, marker = '') =>
  queryP2P(rippledSocket, {
    command: 'mpt_holders',
    mpt_issuance_id: mptIssuanceId,
    limit,
    marker: marker || undefined,
  }).then((resp) => {
    if (resp.error === 'objectNotFound') {
      throw new Error('MPT Issuance not found', 404)
    }

    if (resp.error === 'invalidParams') {
      throw new Error(resp.error_message, 400)
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500)
    }

    return resp
  })

// get Vault object by VaultID
const getVault = (rippledSocket, vaultId) =>
  query(rippledSocket, {
    command: 'ledger_entry',
    index: vaultId,
    ledger_index: 'validated',
  }).then((resp) => {
    if (resp.error === 'entryNotFound') {
      throw new Error('Vault not found', 404)
    }

    if (resp.error_message === 'invalidParams') {
      throw new Error('invalidParams for ledger_entry', 404)
    }

    if (resp.error_message === 'lgrNotFound') {
      throw new Error('invalid ledger index/hash', 400)
    }

    // Handle invalid vault ID format (e.g., non-hex string like "1234")
    if (resp.error_message?.includes('not hex string')) {
      throw new Error('Invalid vault ID format', 400)
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500)
    }

    return resp.node
  })

// get LoanBroker object by LoanBrokerID
const getLoanBroker = (rippledSocket, loanBrokerId) =>
  query(rippledSocket, {
    command: 'ledger_entry',
    index: loanBrokerId,
    ledger_index: 'validated',
  }).then((resp) => {
    if (resp.error === 'entryNotFound') {
      throw new Error('LoanBroker not found', 404)
    }

    if (resp.error_message === 'invalidParams') {
      throw new Error('invalidParams for ledger_entry', 404)
    }

    if (resp.error_message === 'lgrNotFound') {
      throw new Error('invalid ledger index/hash', 400)
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500)
    }

    return resp.node
  })

export {
  getLedger,
  getLedgerEntry,
  getTransaction,
  getAccountInfo,
  getAccountEscrows,
  getAccountPaychannels,
  getAccountBridges,
  getAccountNFTs,
  getAccountObjects,
  getNFTsIssuedByAccount,
  getBalances,
  getAccountTransactions,
  getNegativeUNL,
  getServerInfo,
  getServerState,
  getOffers,
  getNFTInfo,
  getBuyNFToffers,
  getSellNFToffers,
  getNFTTransactions,
  getAMMInfoByAssets,
  getAMMInfoByAMMAccount,
  getFeature,
  getMPTIssuance,
  getMPTHolders,
  getAccountMPTs,
  getAccountLines,
  getVault,
  getLoanBroker,
}
