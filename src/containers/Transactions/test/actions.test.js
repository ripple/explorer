import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import WS from 'jest-websocket-mock';
import { XrplClient } from 'xrpl-client';
import { BAD_REQUEST } from '../../shared/utils';
import { initialState } from '../reducer';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import OfferCreateData from './mock_data/rippledOfferCreate.json';
import { formatTransaction } from '../../../rippled/lib/utils';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class TestWsClient {
  constructor() {
    this.responses = [];
    this.responseCounter = 0;
  }

  addResponse(response) {
    this.responses.push(response);
  }

  async send(obj) {
    console.log(`RECEIVED ${JSON.stringify(obj, null, 2)}`);
    const response = this.responses[this.responseCounter];
    console.log(response);
    this.responseCounter += 1;
    return response;
  }
}

describe('Transaction actions', () => {
  jest.setTimeout(5000);

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;
  beforeEach(() => {
    store = mockStore({ transaction: initialState });
    moxios.install();
  });

  afterEach(() => {
    store = null;
    moxios.uninstall();
  });

  // it('should dispatch correct actions on success for loadTransaction', done => {
  //   const expectedActions = [
  //     { type: actionTypes.START_LOADING_TRANSACTION, data: { id: OfferCreateData.result.hash } },
  //     { type: actionTypes.FINISH_LOADING_TRANSACTION },
  //   ];
  //   const expectedData = formatTransaction(OfferCreateData.result);
  //   store.dispatch(actions.loadTransaction(OfferCreateData.result.hash));
  //   moxios.wait(() => {
  //     const request = moxios.requests.mostRecent();
  //     request
  //       .respondWith({
  //         status: 200,
  //         response: OfferCreateData,
  //       })
  //       .then(() => {
  //         const receivedActions = store.getActions();
  //         expect(receivedActions[0]).toEqual(expectedActions[0]);
  //         expect(receivedActions[1]).toEqual(expectedActions[1]);
  //         const actions2 = receivedActions[2];
  //         expect(actions2.type).toEqual(actionTypes.LOADING_TRANSACTION_SUCCESS);
  //         expect(actions2.data.raw).toEqual(expectedData);
  //         done();
  //       });
  //   });
  // });

  it('should dispatch correct actions on fails for loadTransaction', async () => {
    const client = new TestWsClient();
    const expectedActions = [
      { type: actionTypes.START_LOADING_TRANSACTION, data: { id: OfferCreateData.result.hash } },
      { type: actionTypes.FINISH_LOADING_TRANSACTION },
      {
        type: actionTypes.LOADING_TRANSACTION_FAIL,
        data: { error: 500, id: OfferCreateData.result.hash },
        error: 'get_transaction_failed',
      },
    ];

    client.addResponse({});
    // server.send(response);

    // this method sends a request to the server
    store.dispatch(actions.loadTransaction(OfferCreateData.result.hash, client));

    await sleep(100);
    const result = store.getActions();
    console.log(result);
    expect(result).toEqual(expectedActions);
  });

  // it('should dispatch correct actions on fail for loadTransaction with invalid hash', async () => {
  //   const expectedActions = [
  //     { type: actionTypes.LOADING_TRANSACTION_FAIL, data: { error: BAD_REQUEST } },
  //   ];
  //   await store.dispatch(actions.loadTransaction('invalid_transaction_hash'));
  //   expect(store.getActions()).toEqual(expectedActions);
  // });
});
