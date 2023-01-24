import { createContext } from 'react'
import { XrplClient } from 'xrpl-client'

const LOCALHOST_URLS = ['localhost', '127.0.0.1', '0.0.0.0']

function isInsecureWs(rippledHost: string | undefined): boolean {
  return (
    !!Number(process.env.REACT_APP_INSECURE_WS) ||
    LOCALHOST_URLS.some((url) => rippledHost?.includes(url)) ||
    rippledHost === ''
  )
}

function getSocket(rippledUrl?: string): XrplClient {
  const rippledHost = rippledUrl ?? process.env.REACT_APP_RIPPLED_HOST
  const prefix = isInsecureWs(rippledHost) ? 'ws' : 'wss'
  const wsUrls: string[] = []
  if (rippledHost?.includes(':')) {
    wsUrls.push(`${prefix}://${rippledHost}`)
  } else {
    wsUrls.push.apply(wsUrls, [
      `${prefix}://${rippledHost}:${process.env.REACT_APP_RIPPLED_WS_PORT}`,
      `${prefix}://${rippledHost}:443`,
    ])
  }
  const socket = new XrplClient(wsUrls, { tryAllNodes: true })
  const hasP2PSocket =
    process.env.REACT_APP_P2P_RIPPLED_HOST != null &&
    process.env.REACT_APP_P2P_RIPPLED_HOST !== ''
  // @ts-ignore - will be removed eventually
  socket.p2pSocket = hasP2PSocket
    ? new XrplClient([
        `${prefix}://${process.env.REACT_APP_P2P_RIPPLED_HOST}:${process.env.REACT_APP_RIPPLED_WS_PORT}`,
      ])
    : undefined
  return socket
}

const SocketContext = createContext<XrplClient>(undefined!)

export { getSocket }

export default SocketContext
