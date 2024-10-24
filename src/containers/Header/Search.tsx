import { KeyboardEventHandler, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { XrplClient } from 'xrpl-client'

import {
  isValidClassicAddress,
  isValidXAddress,
  classicAddressToXAddress,
} from 'ripple-address-codec'
import { useAnalytics } from '../shared/analytics'
import SocketContext from '../shared/SocketContext'
import {
  CURRENCY_REGEX,
  DECIMAL_REGEX,
  FULL_CURRENCY_REGEX,
  HASH_REGEX,
  VALIDATORS_REGEX,
  CTID_REGEX,
} from '../shared/utils'
import './search.scss'
import { isValidPayString } from '../../rippled/payString'
import { getTransaction } from '../../rippled/lib/rippled'
import { buildPath } from '../shared/routing'
import {
  ACCOUNT_ROUTE,
  LEDGER_ROUTE,
  NFT_ROUTE,
  PAYSTRING_ROUTE,
  TOKEN_ROUTE,
  TRANSACTION_ROUTE,
  VALIDATOR_ROUTE,
} from '../App/routes'
import SearchResults from '../shared/components/SearchResults/SearchResults'
import {
  Tooltip,
  TooltipInstance,
  useTooltip,
} from '../shared/components/Tooltip'

const determineHashType = async (id: string, rippledContext: XrplClient) => {
  try {
    await getTransaction(rippledContext, id)
    return 'transactions'
  } catch (e) {
    return 'nft'
  }
}

// separator for currency formats
const separators = /[.:+-]/

const getRoute = async (
  id: string,
  rippledContext: XrplClient,
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
  if (HASH_REGEX.test(id)) {
    // Transactions and NFTs share the same syntax
    // We must make an api call to ensure if it's one or the other
    const type = await determineHashType(id, rippledContext)
    let path
    if (type === 'transactions') {
      path = buildPath(TRANSACTION_ROUTE, { identifier: id.toUpperCase() })
    } else if (type === 'nft') {
      path = buildPath(NFT_ROUTE, { id: id.toUpperCase() })
    }

    return {
      path,
      type,
    }
  }
  if (isValidXAddress(id) || isValidClassicAddress(id.split(':')[0])) {
    return {
      type: 'accounts',
      path: buildPath(ACCOUNT_ROUTE, { id: normalizeAccount(id) }), // TODO: Consider a new path/page specific to X-addresses
    }
  }
  if (isValidPayString(id) || isValidPayString(id.replace('@', '$'))) {
    let normalizedId = id
    if (!isValidPayString(id)) {
      normalizedId = id.replace('@', '$')
    }

    return {
      type: 'paystrings',
      path: buildPath(PAYSTRING_ROUTE, { id: normalizedId }),
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

  const [isVisible, setIsVisible] = useState(true)

  const mytooltip: TooltipInstance = {
    mode: 'searchbanner',
    data: {},
    x: 175,
    y: -75,
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false)
    }, 10000) // Disappear after 3 seconds

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div>
      <div className={isVisible ? 'normal' : 'normal fade-out'}>
        <Tooltip tooltip={mytooltip} />
      </div>
      <div className="search">
        <input
          type="text"
          placeholder={t('header.search.placeholder')}
          onKeyDown={onKeyDown}
          value={currentSearchInput}
          onChange={(e) => setCurrentSearchInput(e.target.value)}
        />
        <div className="search-results">
          <SearchResults
            setCurrentSearchInput={setCurrentSearchInput}
            currentSearchValue={currentSearchInput}
          />
        </div>
      </div>
    </div>
  )
}
