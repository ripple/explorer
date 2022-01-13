import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { initialState } from '../reducer';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../../shared/utils';

const TEST_ADDRESS = 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv';

const accountInfo = {
  result: {
    account_data: {
      Account: TEST_ADDRESS,
      Balance: '123456000',
      Flags: 0,
      LedgerEntryType: 'AccountRoot',
      OwnerCount: 0,
      PreviousTxnID: '6B6F2CA1633A22247058E988372BA9EFFFC5BF10212230B67341CA32DC9D4A82',
      PreviousTxnLgrSeq: 68990183,
      Sequence: 2148991,
      index: 'C3B625B296E95A21D7BBBB7E3D343AF423B463B87B5D56EE7F79C8E16A47A6F5',
      signer_lists: [],
    },
    ledger_hash: '43C4195B2C90423771E6C5DF4AED11BF3D77FFD1E8A153A489E5B00C96318FCA',
    ledger_index: 68990183,
    validated: true,
  },
  status: 'success',
  type: 'response',
};
const accountObjects = {
  result: {
    account: TEST_ADDRESS,
    account_objects: [],
    ledger_current_index: 24402380,
    validated: false,
  },
  status: 'success',
  type: 'response',
};
const gatewayBalances = {
  result: {
    account: TEST_ADDRESS,
    ledger_hash: 'F4023C801B8B4D05F16EFE5D8C4C3C14D02354AABBB94151F581A6BF0E04C20B',
    ledger_index: 24402706,
    validated: true,
  },
  status: 'success',
  type: 'response',
};
const serverInfo = {
  result: {
    info: {
      validated_ledger: {
        age: 1,
        base_fee_xrp: 0.00001,
        hash: 'EA01E248FCA5CFD33A3393DA5EBCCD9219BA8DB6AF6DC28A3B0A968604F46A76',
        reserve_base_xrp: 10,
        reserve_inc_xrp: 2,
        seq: 24402729,
      },
      validation_quorum: 5,
    },
  },
  status: 'success',
  type: 'response',
};

const moxiosData = {
  account_info: accountInfo,
  account_objects: accountObjects,
  server_info: serverInfo,
  gateway_balances: gatewayBalances,
};

class MockResponse {
  constructor() {
    this.iterations = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  get response() {
    const request = moxios.requests.mostRecent();
    const postParams = JSON.parse(request.config.data);
    const { method } = postParams.options;
    return moxiosData[method];
  }

  // eslint-disable-next-line class-methods-use-this
  get status() {
    return 200;
  }
}

describe('AccountHeader Actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should dispatch correct actions on successful loadAccountState', () => {
    const expectedData = {
      account: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
      ledger_index: 68990183,
      info: {
        sequence: 2148991,
        ticketCount: undefined,
        ownerCount: 0,
        reserve: 10,
        tick: undefined,
        rate: undefined,
        domain: undefined,
        emailHash: undefined,
        flags: [],
        balance: '123456000',
        gravatar: undefined,
        previousTxn: '6B6F2CA1633A22247058E988372BA9EFFFC5BF10212230B67341CA32DC9D4A82',
        previousLedger: 68990183,
      },
      balances: { XRP: 123.456 },
      signerList: undefined,
      escrows: undefined,
      paychannels: null,
      xAddress: undefined,
    };
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS, data: expectedData },
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`, new MockResponse());
    return store.dispatch(actions.loadAccountState(TEST_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on server error', () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      {
        type: actionTypes.ACCOUNT_STATE_LOAD_FAIL,
        status: SERVER_ERROR,
        error: 'get_account_state_failed',
      },
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`, {
      status: SERVER_ERROR,
      response: null,
    });
    return store.dispatch(actions.loadAccountState(TEST_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on ripple address not found', () => {
    const response = {
      account: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
      error: 'actNotFound',
      error_code: 19,
      error_message: 'Account not found.',
      ledger_hash: '97992DBB4ED350B572B39D0026604943ACC84A3E5967454147253CB317551891',
      ledger_index: 68989958,
      request: {
        account: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
        command: 'account_info',
        ledger_index: 'validated',
        queue: false,
        signer_lists: false,
        strict: false,
      },
      validated: true,
    };
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_FAIL, status: NOT_FOUND, error: '' },
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`, {
      status: 200,
      response: { result: response },
    });
    return store.dispatch(actions.loadAccountState(TEST_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on invalid ripple address', () => {
    const expectedActions = [
      { type: actionTypes.ACCOUNT_STATE_LOAD_FAIL, status: BAD_REQUEST, error: '' },
    ];
    const store = mockStore({ news: initialState });
    store.dispatch(actions.loadAccountState('ZZZ')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
