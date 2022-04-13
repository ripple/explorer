class TestStreamWsClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.handlers = {};
    this.responses = {};
    this.connected = false;

    this.ws.onmessage = message => {
      const streamResult = JSON.parse(message.data);
      if (this.handlers[streamResult?.type] != null) {
        const handler = this.handlers[streamResult.type];
        handler(streamResult);
      }
    };

    this.ws.onopen = () => {
      this.connected = true;
    };
  }

  on(listenerType, fn) {
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

  addResponse(command, response) {
    this.responses[command] = response;
  }

  addResponses(responseObj) {
    this.responses = Object.assign(this.responses, responseObj);
  }

  send(message) {
    if (!this.connected) {
      throw new Error('Not connected');
    }
    const { command } = message;
    return Promise.resolve(this.responses[command]?.result);
  }
}

export default TestStreamWsClient;
