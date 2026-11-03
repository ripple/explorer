import { KeyboardEventHandler, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import {
  isValidClassicAddress,
  isValidXAddress,
  classicAddressToXAddress,
} from 'ripple-address-codec'

import { useAnalytics } from '../shared/analytics'
import SocketContext, { ExplorerXrplClient } from '../shared/SocketContext'
import {
  CURRENCY_REGEX,
  DECIMAL_REGEX,
  FULL_CURRENCY_REGEX,
  HASH256_REGEX,
  VALIDATORS_REGEX,
  CTID_REGEX,
  HASH192_REGEX,
} from '../shared/utils'
import './search.scss'
import {
  getTransaction,
  getLedgerEntry,
  getLoanBroker,
  getLedger,
  getNFTInfo,
} from '../../rippled/lib/rippled'
import { buildPath } from '../shared/routing'
import {
  ACCOUNT_ROUTE,
  LEDGER_ROUTE,
  NFT_ROUTE,
  TOKEN_ROUTE,
  TRANSACTION_ROUTE,
  VALIDATOR_ROUTE,
  MPT_ROUTE,
  VAULT_ROUTE,
  SEARCH_RESULT_ROUTE,
} from '../App/routes'
import TokenSearchResults from '../shared/components/TokenSearchResults/TokenSearchResults'

interface HashMatch {
  type: string
  // The vault a loan broker or a loan belongs to. Both are rendered on the vault page.
  vaultId?: string
}

// A vault, a loan broker and a loan are all ledger objects keyed by the same 256-bit index,
// so one ledger_entry lookup resolves all three. Any object type added later costs no
// extra request, only a case below.
const resolveLedgerEntry = async (
  id: string,
  rippledContext: ExplorerXrplClient,
): Promise<HashMatch> => {
  const { node } = await getLedgerEntry(rippledContext, { index: id })
  switch (node?.LedgerEntryType) {
    case 'Vault':
      return { type: 'vault' }
    case 'LoanBroker':
      if (!node.VaultID) throw new Error('LoanBroker without a VaultID')
      return { type: 'loanBroker', vaultId: node.VaultID }
    case 'Loan': {
      const broker = await getLoanBroker(rippledContext, node.LoanBrokerID)
      if (!broker?.VaultID) throw new Error('Loan broker without a VaultID')
      return { type: 'loan', vaultId: broker.VaultID }
    }
    default:
      throw new Error(`Unsupported ledger entry ${node?.LedgerEntryType}`)
  }
}

const determineHashType = async (
  id: string,
  rippledContext: ExplorerXrplClient,
): Promise<HashMatch | null> => {
  const lookups: Promise<HashMatch>[] = [
    getTransaction(rippledContext, id).then(() => ({ type: 'transactions' })),
    resolveLedgerEntry(id, rippledContext),
    getLedger(rippledContext, { ledger_hash: id.toUpperCase() }).then(() => ({
      type: 'ledgers',
    })),
    getNFTInfo(rippledContext, id).then(() => ({ type: 'nft' })),
  ]

  // Note: Owing to ledger-semantics, it is assumed that the ledger-index is unique. Two ledger-objects will not have identical ID, except with an astronomically small probability.
  const results = await Promise.allSettled(lookups)
  const match = results.find(
    (r): r is PromiseFulfilledResult<HashMatch> => r.status === 'fulfilled',
  )
  return match?.value ?? null
}

// separator for currency formats
const separators = /[.:+-]/

const getRoute = async (
  id: string,
  rippledContext: ExplorerXrplClient,
): Promise<{ type: string; path: string } | null> => {
  if (DECIMAL_REGEX.test(id)) {
    return {
      type: 'ledgers',
      path: buildPath(LEDGER_ROUTE, { identifier: id }),
    }
  }
  if (isValidClassicAddress(id)) {
    return {
      type: 'accounts',
      path: buildPath(ACCOUNT_ROUTE, { id: normalizeAccount(id) }),
    }
  }
  if (HASH256_REGEX.test(id)) {
    // Transactions, NFTs, ledger objects and Ledger-Hashes share the same 256-bit hash
    // syntax. We must make api calls to determine which type it is.
    const match = await determineHashType(id, rippledContext)
    const type = match?.type ?? null
    let path
    if (type === 'transactions') {
      path = buildPath(TRANSACTION_ROUTE, { identifier: id.toUpperCase() })
    } else if (type === 'nft') {
      path = buildPath(NFT_ROUTE, { id: id.toUpperCase() })
    } else if (type === 'vault') {
      path = buildPath(VAULT_ROUTE, { id: id.toUpperCase() })
    } else if ((type === 'loanBroker' || type === 'loan') && match?.vaultId) {
      // Loan brokers and loans have no page of their own: they are rendered by the
      // vault that owns them.
      path = buildPath(VAULT_ROUTE, { id: match.vaultId.toUpperCase() })
    } else if (type === 'ledgers') {
      path = buildPath(LEDGER_ROUTE, { identifier: id.toUpperCase() })
    }

    if (type === null) {
      return {
        type: 'hash_not_found',
        path: buildPath(SEARCH_RESULT_ROUTE, { id: id.toUpperCase() }),
      }
    }

    return {
      path,
      type,
    }
  }
  if (HASH192_REGEX.test(id)) {
    return {
      path: buildPath(MPT_ROUTE, { id: id.toUpperCase() }),
      type: 'mpt',
    }
  }
  if (isValidXAddress(id) || isValidClassicAddress(id.split(':')[0])) {
    return {
      type: 'accounts',
      path: buildPath(ACCOUNT_ROUTE, { id: normalizeAccount(id) }), // TODO: Consider a new path/page specific to X-addresses
    }
  }
  if (
    (CURRENCY_REGEX.test(id) || FULL_CURRENCY_REGEX.test(id)) &&
    isValidClassicAddress(id.split(separators)[1])
  ) {
    const components = id.split(separators)
    return {
      type: 'token',
      path: buildPath(TOKEN_ROUTE, {
        token: `${components[0]}.${components[1]}`,
      }),
    }
  }
  if (VALIDATORS_REGEX.test(id)) {
    return {
      type: 'validators',
      path: buildPath(VALIDATOR_ROUTE, { identifier: normalizeAccount(id) }),
    }
  }
  if (CTID_REGEX.test(id)) {
    return {
      type: 'transactions',
      path: buildPath(TRANSACTION_ROUTE, { identifier: id.toUpperCase() }),
    }
  }

  return null
}

// normalize classicAddress:tag to X-address
// TODO: Take network into account (!)
const normalizeAccount = (id: string) => {
  if (!id.includes(':')) {
    return id
  }
  // TODO: Test invalid classic address; "invalid" tag (?)
  const components = id.split(':')
  try {
    const xAddress = classicAddressToXAddress(
      components[0],
      components[1] === undefined || components[1] === 'false'
        ? false
        : Number(components[1]),
      false,
    ) // TODO: Take network into account (!)
    return xAddress
  } catch (_) {
    /* version_invalid: version bytes do not match any of the provided version(s) */
  }

  return id
}

export interface SearchProps {
  callback?: Function
}

export const Search = ({ callback = () => {} }: SearchProps) => {
  const { track } = useAnalytics()
  const { t } = useTranslation()
  const socket = useContext(SocketContext)
  const navigate = useNavigate()

  const [currentSearchInput, setCurrentSearchInput] = useState('')

  const handleSearch = async (id: string) => {
    const strippedId = id.replace(/^["']|["']$/g, '')
    const route = await getRoute(strippedId, socket)
    track('search', {
      search_term: strippedId,
      search_category: route?.type,
    })

    navigate(route === null ? `/search/${strippedId}` : route.path)
    callback()
  }

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      handleSearch(event.currentTarget?.value?.trim())
      setCurrentSearchInput('')
    }
  }

  return (
    <div className="search">
      <input
        type="text"
        placeholder={t('header.search.placeholder')}
        onKeyDown={onKeyDown}
        value={currentSearchInput}
        onChange={(e) => setCurrentSearchInput(e.target.value)}
      />
      {process.env.VITE_ENVIRONMENT === 'mainnet' && (
        <TokenSearchResults
          setCurrentSearchInput={setCurrentSearchInput}
          currentSearchValue={currentSearchInput}
        />
      )}
    </div>
  )
}
