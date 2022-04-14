import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { BAD_REQUEST } from '../../shared/utils';
import { initialState } from '../reducer';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import offerCreateData from './mock_data/rippledOfferCreate.json';
import { formatTransaction } from '../../../rippled/lib/utils';
import MockWsClient from '../../test/mockWsClient';

describe('Transaction actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;
  let client;
  beforeEach(() => {
    store = mockStore({ transaction: initialState });
    client = new MockWsClient();
  });

  afterEach(() => {
    store = null;
    client.close();
  });

  it('should dispatch correct actions on success for loadTransaction', async () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_TRANSACTION, data: { id: offerCreateData.result.hash } },
      { type: actionTypes.FINISH_LOADING_TRANSACTION },
    ];
    const expectedData = formatTransaction(offerCreateData.result);

    client.addResponse('tx', offerCreateData);

    await store.dispatch(actions.loadTransaction(offerCreateData.result.hash, client));

    const receivedActions = store.getActions();
    expect(receivedActions[0]).toEqual(expectedActions[0]);
    expect(receivedActions[1]).toEqual(expectedActions[1]);
    const actions2 = receivedActions[2];
    expect(actions2.type).toEqual(actionTypes.LOADING_TRANSACTION_SUCCESS);
    expect(actions2.data.raw).toEqual(expectedData);
  });

  it('should dispatch correct actions on fails for loadTransaction', async () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_TRANSACTION, data: { id: offerCreateData.result.hash } },
      { type: actionTypes.FINISH_LOADING_TRANSACTION },
      {
        type: actionTypes.LOADING_TRANSACTION_FAIL,
        data: { error: 500, id: offerCreateData.result.hash },
        error: 'get_transaction_failed',
      },
    ];

    client.setReturnError();

    await store.dispatch(actions.loadTransaction(offerCreateData.result.hash, client));

    const receivedActions = store.getActions();
    expect(receivedActions).toEqual(expectedActions);
  });

  it('should dispatch correct actions on fail for loadTransaction with invalid hash', async () => {
    const expectedActions = [
      { type: actionTypes.LOADING_TRANSACTION_FAIL, data: { error: BAD_REQUEST } },
    ];
    await store.dispatch(actions.loadTransaction('invalid_transaction_hash'));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
