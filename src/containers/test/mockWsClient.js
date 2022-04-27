/**
 * This is a mock WS client for testing purposes.
 */

class MockWsClient {
  /**
   * Construct the MockWsClient object.
   * @param wsUrl The URL for a WebSocket connection. If null, there is no
   * stream support (you can't test anything stream-related). The default is
   * null.
   */
  constructor(wsUrl = null) {
    this.handlesStreams = wsUrl != null;
    this.handlers = {};
    this.responses = {};
    this.returnError = false;
    this.endpoint = 'wss://fakenode.ripple.com:51233';
    this.p2pSocket = this;
    this.debug = false;

    // set up the message handler for streams
    if (this.handlesStreams) {
      this.ws = new WebSocket(wsUrl);
      this.ws.onmessage = message => {
        const streamResult = JSON.parse(message.data);
        if (this.handlers[streamResult?.type] != null) {
          const handler = this.handlers[streamResult.type];
          handler(streamResult);
        }
      };
    }
  }

  setDebug(debug = true) {
    this.debug = debug;
  }

  /**
   * Close the WS connection (if needed).
   */
  close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  /**
   * Mock the `on` method of XrplClient.
   * @param listenerType The category of stream. Not all streams are supported
   * here, because we don't use all the streams.
   * @param callback The callback method for the stream result.
   */
  on(listenerType, callback) {
    if (!this.handlesStreams) {
      throw new Error('This TestWsClient is not set up to handle streams');
    }
    let key;
    if (listenerType === 'ledger') {
      key = 'ledgerClosed';
    } else if (listenerType === 'validation') {
      key = 'validationReceived';
    } else {
      throw new Error(`listener type doesn't exist: ${listenerType}`);
    }
    this.handlers[key] = callback;
  }

  /**
   * Set whether the `send` method should return an error.
   * @param returnError Whether the send method should return an error.
   */
  setReturnError(returnError = true) {
    this.returnError = returnError;
  }

  /**
   * Add a new response to the mocks.
   * @param command The rippled command that the message will contain.
   * @param response The mock response object.
   */
  addResponse(command, response) {
    this.responses[command] = response;
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
    this.responses = Object.assign(this.responses, responseObj);
  }

  /**
   * Mocks the `send` method on XrplClient.
   * @param message The message to rippled.
   * @returns a Promise result. If `this.returnError` has been set to `true`,
   * the promise will be rejected with an empty shape.
   */
  send(message) {
    if (this.debug) {
      console.log(message);
    }
    if (this.returnError) {
      return Promise.reject(new Error({}));
    }
    const { command } = message;
    return Promise.resolve(this.responses[command]?.result);
  }
}

export default MockWsClient;
