import { summarizeLedger } from './lib/summarizeLedger'
import { getLedger as getRippledLedger } from './lib/rippled'
import logger from './lib/logger'
import type { ExplorerXrplClient } from '../containers/shared/SocketContext'

const log = logger({ name: 'ledgers' })

const getLedger = async (
  identifier: string | number,
  rippledSocket: ExplorerXrplClient,
): Promise<any> => {
  const parameters: any = {}
  if (!isNaN(Number(identifier))) {
    parameters.ledger_index = Number(identifier)
  } else if (['validated', 'closed', 'current'].includes(String(identifier))) {
    // TODO: (this is not reachable as id is validated prior to reaching here)
    parameters.ledger_index = identifier
  } else if (!identifier) {
    parameters.ledger_index = 'validated'
  } else {
    parameters.ledger_hash = String(identifier).toUpperCase()
  }

  log.info(`get ledger: ${JSON.stringify(parameters)}`)
  try {
    const ledger = await getRippledLedger(rippledSocket, parameters)
    return summarizeLedger(ledger, true)
  } catch (error: any) {
    log.error(error.toString())
    throw error
  }
}

export default getLedger
