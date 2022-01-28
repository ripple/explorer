// eslint-disable-next-line import/no-extraneous-dependencies -- test helper file
import moxios from 'moxios';

export default class MockResponse {
  constructor(moxiosData) {
    this.moxiosData = moxiosData;
  }

  // eslint-disable-next-line class-methods-use-this
  get response() {
    const request = moxios.requests.mostRecent();
    const postParams = JSON.parse(request.config.data);
    const { method } = postParams.options;
    return this.moxiosData[method];
  }

  // eslint-disable-next-line class-methods-use-this
  get status() {
    return 200;
  }
}
