import { encodeNodePublic } from 'ripple-address-codec'
import { hexToBytes } from '@xrplf/isomorphic/utils'

import { getNegativeUNL as getRippledNegativeUNL } from './lib/rippled'
import logger from './lib/logger'
import type { ExplorerXrplClient } from '../containers/shared/SocketContext'

const log = logger({ name: 'nunl' })

const getNegativeUNL = async (
  rippledSocket: ExplorerXrplClient,
): Promise<string[]> => {
  log.info(`getting nUNL from rippled`)

  try {
    const result = await getRippledNegativeUNL(rippledSocket)
    if (result === undefined || result.length === 0) return []

    if (result.node === undefined)
      throw new Error('node is not a included in this ledger_entry')

    const validators = result.node.DisabledValidators
    if (validators !== undefined) {
      return validators
        .map((obj: any) => obj.DisabledValidator.PublicKey)
        .map((key: string) => encodeNodePublic(hexToBytes(key)))
    }

    return []
  } catch (error: any) {
    log.error(error.toString())
    throw error
  }
}

export default getNegativeUNL
