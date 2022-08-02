import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../actions'
import * as actionTypes from '../actionTypes'
import { initialState } from '../reducer'
import successfulAccountTx from './successfulAccountTx.json'
import MockWsClient from '../../../test/mockWsClient'

const TEST_ADDRESS = 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv'
const TEST_CURRENCY = 'abc'

describe('TokenTransactionsTable Actions', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  let client
  beforeEach(() => {
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
  })

  it('should dispatch correct actions on successful loadTokenTransactions', () => {
    const expectedData = {
      marker: undefined,
      transactions: [
        {
          account: 'rPPbi1iNXmvY9HmJ9sH9g4gxvgVEfN4NaZ',
          date: '2022-01-13T23:16:22Z',
          details: {
            effects: undefined,
            instructions: {
              amount: {
                amount: 3.75,
                currency: TEST_CURRENCY.toUpperCase(),
                issuer: 'garbage',
              },
              destination: 'rBWpYJhuJWBPAkzJ4kYQqHShSkkF3rgeD:2471596944',
              max: undefined,
              partial: false,
              sourceTag: undefined,
            },
          },
          fee: 0.02,
          hash: '7D150D03E799748425B45B59CF2511ACA58795EEC393663702C302A57460C53D',
          index: 54,
          result: 'tesSUCCESS',
          sequence: 57083164,
          ticketSequence: undefined,
          type: 'Payment',
        },
      ],
    }
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_TRANSACTIONS },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS },
      {
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_SUCCESS,
        data: expectedData,
      },
    ]
    const store = mockStore({ news: initialState })
    client.addResponse('account_tx', successfulAccountTx)
    return store
      .dispatch(
        actions.loadTokenTransactions(
          TEST_ADDRESS,
          TEST_CURRENCY,
          undefined,
          client,
        ),
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should dispatch correct actions on none 2xx fail loadTokenTransactions', () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_TRANSACTIONS },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS },
      {
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_FAIL,
        error: 'get_account_transactions_failed',
      },
    ]
    const store = mockStore({ news: initialState })
    return store
      .dispatch(
        actions.loadTokenTransactions(
          TEST_ADDRESS,
          TEST_CURRENCY,
          undefined,
          null,
        ),
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
