class TestStreamWsClient {
  constructor(wsUrl = null) {
    this.handlesStreams = wsUrl != null;
    this.handlers = {};
    this.responses = {};
    this.returnError = false;
    this.endpoint = 'wss:localhost:1234';

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

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  on(listenerType, fn) {
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
    this.handlers[key] = fn;
  }

  setReturnError(error = true) {
    this.returnError = error;
  }

  addResponse(command, response) {
    this.responses[command] = response;
  }

  addResponses(responseObj) {
    this.responses = Object.assign(this.responses, responseObj);
  }

  send(message) {
    if (this.returnError) {
      return Promise.reject(new Error({}));
    }
    const { command } = message;
    return Promise.resolve(this.responses[command]?.result);
  }
}

export default TestStreamWsClient;
