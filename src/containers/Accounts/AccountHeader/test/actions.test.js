import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../actions'
import * as actionTypes from '../actionTypes'
import { initialState } from '../reducer'
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../../shared/utils'
import rippledResponses from './rippledResponses.json'
import actNotFound from '../../../Token/TokenHeader/test/actNotFound.json'
import actWithTokens from './accountWithTokens.json'
import MockWsClient from '../../../test/mockWsClient'

const TEST_ADDRESS = 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv'
const TEST_X_ADDRESS = 'XV3oNHx95sqdCkTDCBCVsVeuBmvh2dz5fTZvfw8UCcMVsfe'

describe('AccountHeader Actions', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  let client
  beforeEach(() => {
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
  })

  it('should dispatch correct actions on successful loadAccountState', () => {
    client.addResponses(rippledResponses)
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
        nftMinter: undefined,
        previousTxn:
          '6B6F2CA1633A22247058E988372BA9EFFFC5BF10212230B67341CA32DC9D4A82',
        previousLedger: 68990183,
      },
      deleted: false,
      balances: { XRP: 123.456 },
      signerList: undefined,
      tokens: [],
      escrows: undefined,
      paychannels: null,
      xAddress: undefined,
    }
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS, data: expectedData },
    ]
    const store = mockStore({ news: initialState })

    return store
      .dispatch(actions.loadAccountState(TEST_ADDRESS, client))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should dispatch correct actions on account with tokens', () => {
    client.addResponses(actWithTokens)
    const expectedData = {
      account: 'rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY',
      ledger_index: 72338736,
      info: {
        sequence: 1227,
        ticketCount: undefined,
        ownerCount: 28,
        reserve: 66,
        tick: undefined,
        rate: undefined,
        domain: undefined,
        emailHash: undefined,
        flags: [],
        balance: '1172875760329',
        gravatar: undefined,
        previousTxn:
          '259A84CE4B3B09D5FBCAA133F62FC767CA2B57B3C64CF065F7546AA63D55E070',
        previousLedger: 67657581,
      },
      balances: {
        '0158415500000000C1F76FF6ECB0BAC600000000': 3.692385398244198,
        BTC: 1.075524263886059,
        CHF: 0.7519685210971255,
        CNY: 12.328638002,
        DYM: 95.13258522535791,
        EUR: 53.426387263174405,
        GBP: 79.51188949705619,
        JPY: 4986.30908732758,
        USD: 936.8290046958887,
        XAU: 3.419442510305086,
        XRP: 1172875.760329,
      },
      signerList: undefined,
      tokens: [
        {
          amount: 95.13258522535791,
          currency: 'DYM',
          issuer: 'rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E',
        },
        {
          amount: 20,
          currency: 'USD',
          issuer: 'rME7HanzUymzFvETpoLgAy5rvxGcKiLrYL',
        },
        {
          amount: 255.7836054268899,
          currency: 'USD',
          issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
        },
        {
          amount: 1.075524263886059,
          currency: 'BTC',
          issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
        },
        {
          amount: 12.328638002,
          currency: 'CNY',
          issuer: 'rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK',
        },
        {
          amount: 3.419442510305086,
          currency: 'XAU',
          issuer: 'rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67',
        },
        {
          amount: 3.692385398244198,
          currency: '0158415500000000C1F76FF6ECB0BAC600000000',
          issuer: 'rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67',
        },
        {
          amount: 0.7519685210971255,
          currency: 'CHF',
          issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        },
        {
          amount: 78.5098894970562,
          currency: 'GBP',
          issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        },
        {
          amount: 4986.30908732758,
          currency: 'JPY',
          issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        },
        {
          amount: 28.42638726317441,
          currency: 'EUR',
          issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        },
      ],
      escrows: undefined,
      paychannels: null,
      xAddress: undefined,
      deleted: false,
    }
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS, data: expectedData },
    ]
    const store = mockStore({ news: initialState })

    return store
      .dispatch(actions.loadAccountState(TEST_ADDRESS, client))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should dispatch correct actions on successful loadAccountState for X-Address', () => {
    client.addResponses(rippledResponses)
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
        nftMinter: undefined,
        previousTxn:
          '6B6F2CA1633A22247058E988372BA9EFFFC5BF10212230B67341CA32DC9D4A82',
        previousLedger: 68990183,
      },
      deleted: false,
      balances: { XRP: 123.456 },
      signerList: undefined,
      tokens: [],
      escrows: undefined,
      paychannels: null,
      xAddress: {
        classicAddress: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
        tag: 0,
        test: false,
      },
    }
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS, data: expectedData },
    ]
    const store = mockStore({ news: initialState })
    return store
      .dispatch(actions.loadAccountState(TEST_X_ADDRESS, client))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should dispatch correct actions on server error', () => {
    client.setReturnError()
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      {
        type: actionTypes.ACCOUNT_STATE_LOAD_FAIL,
        status: SERVER_ERROR,
        error: 'get_account_state_failed',
      },
    ]
    const store = mockStore({ news: initialState })

    return store
      .dispatch(actions.loadAccountState(TEST_ADDRESS, client))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should dispatch correct actions on address not found', () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      {
        type: actionTypes.ACCOUNT_STATE_LOAD_FAIL,
        status: NOT_FOUND,
        error: '',
      },
    ]
    client.addResponse('account_info', { result: actNotFound })
    client.addResponse('account_tx', { result: actNotFound })
    const store = mockStore({ news: initialState })
    return store
      .dispatch(actions.loadAccountState(TEST_ADDRESS, client))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should dispatch correct actions on invalid address', () => {
    const expectedActions = [
      {
        type: actionTypes.ACCOUNT_STATE_LOAD_FAIL,
        status: BAD_REQUEST,
        error: '',
      },
    ]
    const store = mockStore({ news: initialState })
    store.dispatch(actions.loadAccountState('ZZZ', client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
