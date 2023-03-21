import { KeyboardEventHandler, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { XrplClient } from 'xrpl-client'

import {
  isValidClassicAddress,
  isValidXAddress,
  classicAddressToXAddress,
} from 'ripple-address-codec'
import SocketContext from '../shared/SocketContext'
import {
  analytics,
  ANALYTIC_TYPES,
  CURRENCY_REGEX,
  DECIMAL_REGEX,
  FULL_CURRENCY_REGEX,
  HASH_REGEX,
  VALIDATORS_REGEX,
} from '../shared/utils'
import './search.scss'
import { getTransaction } from '../../rippled/lib/rippled'
import { isValidPayString } from '../../rippled/payString'

const determineHashType = async (id: string, rippledContext: XrplClient) => {
  try {
    await getTransaction(rippledContext, id)
    return 'transactions'
  } catch (e) {
    return 'nft'
  }
}

const getIdType = async (id: string, rippledContext: XrplClient) => {
  if (DECIMAL_REGEX.test(id)) {
    return 'ledgers'
  }
  if (isValidClassicAddress(id)) {
    return 'accounts'
  }
  if (HASH_REGEX.test(id)) {
    // Transactions and NFTs share the same syntax
    // We must make an api call to ensure if it's one or the other
    return determineHashType(id, rippledContext)
  }
  if (isValidXAddress(id) || isValidClassicAddress(id.split(':')[0])) {
    return 'accounts' // TODO: Consider a new path/page specific to X-addresses
  }
  if (isValidPayString(id) || isValidPayString(id.replace('@', '$'))) {
    return 'paystrings'
  }
  if (
    (CURRENCY_REGEX.test(id) || FULL_CURRENCY_REGEX.test(id)) &&
    isValidClassicAddress(id.split('.')[1])
  ) {
    return 'token'
  }
  if (VALIDATORS_REGEX.test(id)) {
    return 'validators'
  }

  return 'invalid'
}

// normalize classicAddress:tag to X-address
// TODO: Take network into account (!)
const normalize = (id: string, type: string) => {
  if (type === 'transactions') {
    return id.toUpperCase()
  }
  if (type === 'accounts' && id.includes(':')) {
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
  } else if (type === 'paystrings') {
    if (!isValidPayString(id)) {
      return id.replace('@', '$')
    }
  } else if (type === 'token') {
    const components = id.split('.')
    return `${components[0].toLowerCase()}.${components[1]}`
  }
  return id
}

export interface SearchProps {
  mobile: boolean
  callback: Function
}

export const Search = ({
  callback = () => {},
  mobile = false,
}: SearchProps) => {
  const { t } = useTranslation()
  const socket = useContext(SocketContext)
  const history = useHistory()

  const handleSearch = async (id: string) => {
    const type = await getIdType(id, socket)

    analytics(ANALYTIC_TYPES.event, {
      eventCategory: 'globalSearch',
      eventAction: type,
      eventLabel: id,
    })

    history.push(
      type === 'invalid' ? `/search/${id}` : `/${type}/${normalize(id, type)}`,
    )
    callback()
  }

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      handleSearch(event.currentTarget?.value?.trim())
    }
  }

  return (
    <div className={mobile ? 'search' : 'search in-header'}>
      <input
        type="text"
        placeholder={t('header.search.placeholder')}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}
