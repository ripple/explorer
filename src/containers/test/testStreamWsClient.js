class TestStreamWsClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.handlers = {};
    this.connected = false;

    this.ws.onmessage = message => {
      const streamResult = JSON.parse(message.data);
      if (this.handlers[streamResult.type] != null) {
        const handler = this.handlers[streamResult.type];
        handler(streamResult);
      }
    };

    this.ws.onopen = () => {
      this.connected = true;
    };
  }

  on(key, fn) {
    this.handlers[key] = fn;
  }

  send(_message) {
    if (!this.connected) {
      throw new Error('Not connected');
    }
  }
}

export default TestStreamWsClient;
