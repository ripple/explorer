class TestWsClient {
  constructor() {
    this.responses = [];
    this.responseCounter = 0;
  }

  addResponse(response, error = false) {
    this.responses.push({ response, error });
  }

  async send(obj) {
    const response = this.responses[this.responseCounter];
    this.responseCounter += 1;
    if (response.error) {
      throw new Error(response);
    }
    return response.response;
  }
}

export default TestWsClient;
