import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import mockLedger from './mockLedger.json'
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../shared/utils'
import { initialState } from '../reducer'
import * as actions from '../actions'
import * as actionTypes from '../actionTypes'
import { summarizeLedger } from '../../../rippled/lib/utils'
import ledgerNotFound from './ledgerNotFound.json'
import MockWsClient from '../../test/mockWsClient'

describe('Ledger actions', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  let store
  let client
  beforeEach(() => {
    store = mockStore({ ledger: initialState })
    client = new MockWsClient()
  })

  afterEach(() => {
    store = null
    client.close()
  })

  it('should dispatch correct actions on success for loadLedger', async () => {
    const expectedActions = [
      {
        type: actionTypes.START_LOADING_FULL_LEDGER,
        data: { id: mockLedger.result.ledger.ledger_index },
      },
      { type: actionTypes.FINISH_LOADING_FULL_LEDGER },
      {
        type: actionTypes.LOADING_FULL_LEDGER_SUCCESS,
        data: summarizeLedger(mockLedger.result.ledger, true),
      },
    ]
    client.addResponse('ledger', mockLedger)

    await store.dispatch(
      actions.loadLedger(mockLedger.result.ledger.ledger_index, client),
    )
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should dispatch correct actions on success for loadLedger (ledger hash)', async () => {
    const expectedActions = [
      {
        type: actionTypes.START_LOADING_FULL_LEDGER,
        data: { id: mockLedger.result.ledger.ledger_hash },
      },
      { type: actionTypes.FINISH_LOADING_FULL_LEDGER },
      {
        type: actionTypes.LOADING_FULL_LEDGER_SUCCESS,
        data: summarizeLedger(mockLedger.result.ledger, true),
      },
    ]
    client.addResponse('ledger', mockLedger)

    await store.dispatch(
      actions.loadLedger(mockLedger.result.ledger.ledger_hash, client),
    )
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should dispatch correct actions on fail for loadLedger with invalid id', () => {
    const expectedActions = [
      {
        type: actionTypes.LOADING_FULL_LEDGER_FAIL,
        data: { error: BAD_REQUEST },
      },
    ]
    store.dispatch(actions.loadLedger('zzz', null))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should dispatch correct actions on fail for loadLedger 404', async () => {
    const LEDGER_INDEX = 1234
    const expectedActions = [
      {
        type: actionTypes.START_LOADING_FULL_LEDGER,
        data: { id: LEDGER_INDEX },
      },
      { type: actionTypes.FINISH_LOADING_FULL_LEDGER },
      {
        type: actionTypes.LOADING_FULL_LEDGER_FAIL,
        data: {
          error: NOT_FOUND,
          id: LEDGER_INDEX,
        },
        error: '',
      },
    ]
    client.addResponse('ledger', ledgerNotFound)

    await store.dispatch(actions.loadLedger(LEDGER_INDEX, client))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should dispatch correct actions on fail for loadLedger 500', async () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_FULL_LEDGER, data: { id: 1 } },
      { type: actionTypes.FINISH_LOADING_FULL_LEDGER },
      {
        type: actionTypes.LOADING_FULL_LEDGER_FAIL,
        error: 'get_ledger_failed',
        data: {
          error: SERVER_ERROR,
          id: 1,
        },
      },
    ]
    client.setReturnError()
    await store.dispatch(actions.loadLedger(1, client))

    const receivedActions = store.getActions()
    expect(receivedActions).toEqual(expectedActions)
  })
})
