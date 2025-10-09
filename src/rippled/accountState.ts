import {
  isValidClassicAddress,
  isValidXAddress,
  xAddressToClassicAddress,
} from 'ripple-address-codec'
import {
  getAccountInfo,
  getAccountPaychannels,
  getServerInfo,
  getAccountTransactions,
} from './lib/rippled'
import logger from './lib/logger'
import { formatAccountInfo, formatSignerList } from './lib/utils'
import type { ExplorerXrplClient } from '../containers/shared/SocketContext'

interface XAddress {
  classicAddress: string
  tag: number | false
  test: boolean
}

export interface AccountState {
  account: string
  paychannels?: {
    // eslint-disable-next-line camelcase
    total_available: number
    channels: any[]
  }
  signerList?: {
    signers: {
      account: string
      weight: number
    }[]
    quorum: number
    maxSigners: number
  }
  info: {
    accountTransactionID?: string
    reserve: number
    sequence?: number
    ticketCount: number
    domain?: string
    emailHash?: string
    flags: string[]
    nftMinter?: string
  }
  xAddress?: {
    classicAddress: string
    tag: number | boolean
    test: boolean
  }
  deleted: boolean
}

const log = logger({ name: 'GetAccountState' })

async function getAccountState(
  account: string,
  rippledSocket: ExplorerXrplClient,
): Promise<AccountState> {
  let classicAddress: string
  let decomposedAddress: XAddress | null = null
  try {
    if (!isValidClassicAddress(account) && !isValidXAddress(account)) {
      throw new Error('Malformed address')
    }

    if (isValidXAddress(account)) {
      decomposedAddress = xAddressToClassicAddress(account)
      ;({ classicAddress } = decomposedAddress)
      const isTestnet = decomposedAddress.test
      if (
        (isTestnet && process.env.VITE_ENVIRONMENT === 'mainnet') ||
        (!isTestnet &&
          (process.env.VITE_ENVIRONMENT === 'testnet' ||
            process.env.VITE_ENVIRONMENT === 'devnet'))
      ) {
        throw Error('Address on wrong network.')
      }
    } else {
      classicAddress = account
    }
  } catch (error: any) {
    log.error(error.toString())
    throw error
  }

  return getAccountInfo(rippledSocket, classicAddress)
    .then((info) =>
      Promise.all([
        getAccountPaychannels(rippledSocket, classicAddress, info.ledger_index),
        getServerInfo(rippledSocket),
      ]).then((data) => ({
        account: info.Account as string,
        info: formatAccountInfo(info, data[1].info.validated_ledger),
        signerList: info.signer_lists?.[0]
          ? formatSignerList(info.signer_lists[0])
          : undefined,
        paychannels: data[1],
        xAddress: decomposedAddress || undefined,
        deleted: false,
      })),
    )
    .catch((error) => {
      // Check if it's a deleted account
      if (error.code === 404) {
        return getAccountTransactions(rippledSocket, classicAddress, 1).then(
          (data) => {
            if (data.transactions[0]?.tx.TransactionType === 'AccountDelete') {
              return {
                account: classicAddress,
                deleted: true,
                xAddress: decomposedAddress || undefined,
                info: { reserve: 0, ticketCount: 0, flags: [] },
              }
            }
            throw error
          },
        )
      }
      log.error(error.message.toString())
      throw error
    })
}

export default getAccountState
