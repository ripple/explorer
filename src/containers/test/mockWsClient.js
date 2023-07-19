import EventEmitter from 'events'

function wsEventToType(event) {
  if (event === 'ledgerClosed') {
    return 'ledger'
  }
  if (event === 'validationReceived') {
    return 'validation'
  }
  return null
}
/**
 * This is a mock WS client for testing purposes.
 */
class MockWsClient extends EventEmitter {
  /**
   * Construct the MockWsClient object.
   * @param wsUrl The URL for a WebSocket connection. If null, there is no
   * stream support (you can't test anything stream-related). The default is
   * null.
   */
  constructor(wsUrl = null) {
    super()
    this.handlesStreams = wsUrl != null
    this.handlers = {}
    this.responses = {}
    this.returnError = false
    this.endpoint = 'wss://fakenode.ripple.com:51233'
    this.p2pSocket = this
    this.debug = false

    // set up the message handler for streams
    if (this.handlesStreams) {
      this.ws = new WebSocket(wsUrl)
      this.ws.onmessage = (message) => {
        const streamResult = JSON.parse(message.data)
        const type = wsEventToType(streamResult?.type)
        if (type) {
          this.emit(type, streamResult)
        }
      }
    }
  }

  setDebug(debug = true) {
    this.debug = debug
  }

  /**
   * Close the WS connection (if needed).
   */
  close() {
    if (this.ws) {
      this.ws.close()
    }
  }

  /**
   * Set whether the `send` method should return an error.
   * @param returnError Whether the send method should return an error.
   */
  setReturnError(returnError = true) {
    this.returnError = returnError
  }

  /**
   * Add a new response to the mocks.
   * @param command The rippled command that the message will contain.
   * @param response The mock response object.
   */
  addResponse(command, response) {
    this.responses[command] = response
  }

  /**
   * Add several new responses to the mocks.
   *
   * The object should be in the shape of {command: response} where `command`
   * is the rippled command that the message will contain, and `response` is
   * the mock response object.
   * @param responseObj The responses to add to the mocks.
   */
  addResponses(responseObj) {
    this.responses = Object.assign(this.responses, responseObj)
  }

  /**
   * Mocks the `send` method on XrplClient.
   * @param message The message to rippled.
   * @returns a Promise result. If `this.returnError` has been set to `true`,
   * the promise will be rejected with an empty shape.
   */
  send(message) {
    if (this.debug) {
      // eslint-disable-next-line no-console -- For testing purposes
      console.log(message)
    }
    if (this.returnError) {
      return Promise.reject(new Error({}))
    }
    const { command } = message
    return Promise.resolve(
      // When an error (no result) return the whole response like xrpl-client does.
      this.responses[command]?.result || this.responses[command],
    )
  }

  /**
   * Mocks the `getState` method on XrplClient.
   * @returns a dictionary indicating that the client is connected.
   */
  // eslint-disable-next-line class-methods-use-this -- not needed for a mock
  getState() {
    return {
      online: true,
      server: {
        version: '1.9.4',
      },
    }
  }

  /**
   * Mocks the `ready` method on XrplClient.
   * @returns a Promise that resolves with `true`.
   */
  // eslint-disable-next-line class-methods-use-this -- not needed for a mock
  ready() {
    return Promise.resolve(true)
  }
}

export default MockWsClient
