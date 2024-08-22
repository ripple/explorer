export const getXRPLMetaSocket = (): WebSocket => {
  const socket = new WebSocket('wss://s1.xrplmeta.org', 'tokens')

  socket.addEventListener('open', (event) => {
    console.log('Connected!')
  })

  socket.addEventListener('message', (event) => {
    console.log('Got message from server:', event.data)
  })
  socket.addEventListener('close', (event) => {
    console.log('Disconnected...')
  })

  return socket
}
