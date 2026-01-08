import logger from './lib/logger'
import { Error } from './lib/utils'
import { getServerInfo } from './lib/rippled'
import type { ExplorerXrplClient } from '../containers/shared/SocketContext'

const log = logger({ name: 'quorum' })

const getQuorum = async (
  rippledSocket: ExplorerXrplClient,
): Promise<number> => {
  log.info(`fetching server_info from rippled`)

  try {
    const result = await getServerInfo(rippledSocket)
    if (result === undefined || result.info === undefined) {
      throw new Error('Undefined result from getServerInfo()', 500)
    }

    const quorum = result.info.validation_quorum
    if (quorum === undefined) {
      throw new Error('Undefined validation_quorum', 500)
    }

    return quorum
  } catch (error: any) {
    log.error(error.toString())
    throw error
  }
}

export default getQuorum
