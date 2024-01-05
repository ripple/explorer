import { encodeNodePublic } from 'ripple-address-codec'
import { hexToBytes } from '@xrplf/isomorphic/utils'

import { getNegativeUNL as getRippledNegativeUNL } from './lib/rippled'
import logger from './lib/logger'

const log = logger({ name: 'nunl' })

const getNegativeUNL = (rippledSocket) => {
  log.info(`getting nUNL from rippled`)

  return getRippledNegativeUNL(rippledSocket)
    .then((result) => {
      if (result === undefined || result.length === 0) return []

      if (result.node === undefined)
        throw new Error('node is not a included in this ledger_entry')

      const validators = result.node.DisabledValidators
      if (validators !== undefined) {
        return validators
          .map((obj) => obj.DisabledValidator.PublicKey)
          .map((key) => encodeNodePublic(hexToBytes(key)))
      }

      return []
    })
    .catch((error) => {
      log.error(error.toString())
      throw error
    })
}

export default getNegativeUNL
