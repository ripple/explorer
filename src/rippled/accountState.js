/**
 * page path: /accounts/:id?
 *
 * part 1 of 2
 */

import {
  isValidClassicAddress,
  isValidXAddress,
  xAddressToClassicAddress,
} from 'ripple-address-codec'
import {
  getAccountInfo,
  getAccountEscrows,
  getAccountPaychannels,
  getBalances,
  getServerInfo,
  getAccountTransactions,
} from './lib/rippled'
import logger from './lib/logger'
import { formatAccountInfo, formatSignerList } from './lib/utils'

const log = logger({ name: 'account balances' })

const formatBalances = (info, data) => {
  const balances = { XRP: Number(info.Balance) / 1000000 }
  const { assets = {}, obligations = {} } = data
  const tokens = []

  Object.keys(obligations).forEach((currency) => {
    if (!balances[currency]) {
      balances[currency] = 0
    }

    balances[currency] += Number(obligations[currency])
  })

  Object.keys(assets).forEach((issuer) => {
    assets[issuer].forEach((d) => {
      if (!balances[d.currency]) {
        balances[d.currency] = 0
      }

      balances[d.currency] += Number(d.value)
      tokens.push({
        amount: Number(d.value),
        currency: d.currency,
        issuer,
      })
    })
  })

  return {
    balances,
    tokens,
  }
}
const getAccountState = (account, rippledSocket) => {
  // TODO: Retrieve balances for untagged X-address only? or display notice/warning

  let classicAddress
  let decomposedAddress = null

  try {
    if (!isValidClassicAddress(account) && !isValidXAddress(account)) {
      throw new Error('Malformed address')
    }

    if (isValidXAddress(account)) {
      decomposedAddress = xAddressToClassicAddress(account)
      ;({ classicAddress } = decomposedAddress)
      // TODO: Display tag, if present
      const isTestnet = decomposedAddress.test

      // TODO: Display tag, if present
      if (
        (isTestnet && import.meta.env.REACT_APP_ENVIRONMENT === 'mainnet') ||
        (!isTestnet &&
          (import.meta.env.REACT_APP_ENVIRONMENT === 'testnet' ||
            import.meta.env.REACT_APP_ENVIRONMENT === 'devnet'))
      ) {
        throw Error('Address on wrong network.')
      }
    } else {
      classicAddress = account
    }
  } catch (error) {
    log.error(error.toString())
    throw error
  }
  log.info(`get balances: ${account} -> ${classicAddress}`)
  return getAccountInfo(rippledSocket, classicAddress)
    .then((info) =>
      Promise.all([
        getBalances(rippledSocket, classicAddress).then((data) =>
          formatBalances(info, data),
        ),
        getAccountEscrows(rippledSocket, classicAddress, info.ledger_index),
        getAccountPaychannels(rippledSocket, classicAddress, info.ledger_index),
        getServerInfo(rippledSocket),
      ]).then((data) => ({
        account: info.Account,
        ledger_index: info.ledger_index,
        info: formatAccountInfo(info, data[3].info.validated_ledger),
        balances: data[0].balances,
        tokens: data[0].tokens,
        signerList: info.signer_lists[0]
          ? formatSignerList(info.signer_lists[0])
          : undefined,
        escrows: data[1],
        paychannels: data[2],
        xAddress: decomposedAddress || undefined,
        deleted: false,
      })),
    )
    .catch((error) => {
      // X-address:
      //   error.toString(): CustomError: account not found
      //   error.code: 404
      if (error.code === 404) {
        return getAccountTransactions(rippledSocket, classicAddress, 1).then(
          (data) => {
            if (data.transactions[0]?.tx.TransactionType === 'AccountDelete') {
              return {
                account: classicAddress,
                deleted: true,
                xAddress: decomposedAddress || undefined,
              }
            }
            throw error
          },
        )
      }
      log.error(error.toString())
      throw error
    })
}

export default getAccountState
