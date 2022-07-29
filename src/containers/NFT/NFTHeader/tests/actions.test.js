import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { initialState } from '../reducer';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../../shared/utils';
import rippledResponses from './clioResponse.json';
import objectNotFound from './objectNotFound.json';
import MockWsClient from '../../../test/mockWsClient';

const TEST_ID = '0000000025CC40A6A240DB42512BA22826B903A785EE2FA512C5D5A70000000C';

describe('NFTHeader Actions', () => {
  jest.setTimeout(10000);

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let client;
  beforeEach(() => {
    client = new MockWsClient();
  });

  afterEach(() => {
    client.close();
  });

  it('should dispatch correct actions on successful loadNFTState', () => {
    client.addResponses(rippledResponses);
    const expectedData = {
      NFTId: '0000000025CC40A6A240DB42512BA22826B903A785EE2FA512C5D5A70000000C',
      ledgerIndex: 2436210,
      owner: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
      isBurned: false,
      flags: ['lsfTransferable', 'lsfOnlyXRP'],
      transferFee: 0,
      issuer: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
      NFTTaxon: 0,
      NFTSequence: 12,
      uri: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
      validated: true,
      status: 'success',
      warnings: [
        "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request",
      ],
    };
    const expectedActions = [
      { type: actionTypes.START_LOADING_NFT_STATE },
      { type: actionTypes.FINISHED_LOADING_NFT_STATE },
      { type: actionTypes.NFT_STATE_LOAD_SUCCESS, data: expectedData },
    ];
    const store = mockStore({ news: initialState });
    return store.dispatch(actions.loadNFTState(TEST_ID, client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on server error', () => {
    client.setReturnError();
    const expectedActions = [
      { type: actionTypes.START_LOADING_NFT_STATE },
      { type: actionTypes.FINISHED_LOADING_NFT_STATE },
      {
        type: actionTypes.NFT_STATE_LOAD_FAIL,
        status: SERVER_ERROR,
        error: 'get_nft_state_failed',
      },
    ];
    const store = mockStore({ news: initialState });
    return store.dispatch(actions.loadNFTState(TEST_ID, client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on ripple address not found', () => {
    client.addResponse('nft_info', { result: objectNotFound });
    const expectedActions = [
      { type: actionTypes.START_LOADING_NFT_STATE },
      { type: actionTypes.FINISHED_LOADING_NFT_STATE },
      { type: actionTypes.NFT_STATE_LOAD_FAIL, status: NOT_FOUND, error: '' },
    ];
    const store = mockStore({ news: initialState });
    return store.dispatch(actions.loadNFTState(TEST_ID, client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on invalid ripple address', () => {
    const expectedActions = [
      { type: actionTypes.NFT_STATE_LOAD_FAIL, status: BAD_REQUEST, error: '' },
    ];
    const store = mockStore({ news: initialState });
    store.dispatch(actions.loadNFTState('ZZZ', client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
