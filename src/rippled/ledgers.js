import { summarizeLedger } from './lib/utils'
import {
  getLedger as getRippledLedger,
  getLedgerData as getRippledLedgerData,
} from './lib/rippled'
import logger from './lib/logger'

const log = logger({ name: 'ledgers' })

function getParameters(identifier) {
  const parameters = {}
  if (!isNaN(identifier)) {
    parameters.ledger_index = Number(identifier)
  } else if (['validated', 'closed', 'current'].includes(identifier)) {
    // TODO: (this is not reachable as id is validated prior to reaching here)
    parameters.ledger_index = identifier
  } else if (!identifier) {
    parameters.ledger_index = 'validated'
  } else {
    parameters.ledger_hash = identifier.toUpperCase()
  }

  return parameters
}

const getLedger = (identifier, rippledSocket) => {
  const parameters = getParameters(identifier)

  log.info(`get ledger: ${JSON.stringify(parameters)}`)
  return getRippledLedger(rippledSocket, parameters)
    .then((ledger) => summarizeLedger(ledger, true))
    .then((data) => data)
    .catch((error) => {
      log.error(error.toString())
      throw error
    })
}

const getLedgerData = (identifier, rippledSocket) => {
  const parameters = getParameters(identifier)

  log.info(`get ledger data: ${JSON.stringify(parameters)}`)
  return getRippledLedgerData(rippledSocket, parameters)
    .then((data) => data)
    .catch((error) => {
      log.error(error.toString())
      throw error
    })
}

export { getLedger, getLedgerData }
