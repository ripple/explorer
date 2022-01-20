import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { initialState } from '../reducer';

const TEST_ADDRESS = 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv';
const TEST_CURRENCY = 'abc';

describe('TokenTransactionsTable Actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should dispatch correct actions on successful loadTokenTransactions', () => {
    const data = {
      result: {
        account: TEST_ADDRESS,
        limit: 0,
        transactions: [
          {
            meta: {
              AffectedNodes: [
                {
                  ModifiedNode: {
                    FinalFields: {
                      Account: 'rPPbi1iNXmvY9HmJ9sH9g4gxvgVEfN4NaZ',
                      Balance: '316010893320',
                      Flags: 0,
                      OwnerCount: 0,
                      Sequence: 57083165,
                    },
                    LedgerEntryType: 'AccountRoot',
                    LedgerIndex: '1991E4EF8C9693AFFC9E200D112DFAD12449444CD8685FF859199B63B7C22341',
                    PreviousFields: {
                      Balance: '316014663320',
                      Sequence: 57083164,
                    },
                    PreviousTxnID:
                      'ADD23A6189E86A345821A1FBC7A076A677E08947D9D09856E2BD2A8B5D2CF751',
                    PreviousTxnLgrSeq: 68995185,
                  },
                },
                {
                  ModifiedNode: {
                    FinalFields: {
                      Account: 'rBWpYJhuJWBPAkzJ4kYQqHShSkkF3rgeD',
                      Balance: '23750000',
                      Flags: 131072,
                      OwnerCount: 0,
                      Sequence: 199377,
                    },
                    LedgerEntryType: 'AccountRoot',
                    LedgerIndex: '96F9BDDED4A0E0F33AD1B28CC202B0E8FA357F3FC8EB2F716FE25B49B9BBA7FA',
                    PreviousFields: {
                      Balance: '20000000',
                    },
                    PreviousTxnID:
                      '3832CD380B8EF414B3504FC63B5B3A28EC24284183E8E759985A657710559847',
                    PreviousTxnLgrSeq: 68995265,
                  },
                },
              ],
              TransactionIndex: 54,
              TransactionResult: 'tesSUCCESS',
              delivered_amount: '3750000',
            },
            tx: {
              Account: 'rPPbi1iNXmvY9HmJ9sH9g4gxvgVEfN4NaZ',
              Amount: {
                currency: TEST_CURRENCY.toUpperCase(),
                issuer: 'garbage',
                value: '3.75',
              },
              Destination: 'rBWpYJhuJWBPAkzJ4kYQqHShSkkF3rgeD',
              DestinationTag: 2471596944,
              Fee: '20000',
              Flags: 2147483648,
              LastLedgerSequence: 68995327,
              Sequence: 57083164,
              SigningPubKey: '02CA41BA17A2CDE0E5B7BEA8FC97CA0E9A196DCD5F524E4CA44F1C38B610F4A054',
              TransactionType: 'Payment',
              TxnSignature:
                '304402200478EDD72D70A452C72EEA4AA9F3A72E6E706A594A373C54AC31810B351ADC2502200E4F4D0960AE6AF7ED93878FD35582507ACAD38CF5509DFD2BE1C67CA3C93C46',
              date: 695430982,
              hash: '7D150D03E799748425B45B59CF2511ACA58795EEC393663702C302A57460C53D',
              inLedger: 68995325,
              ledger_index: 68995325,
            },
            validated: true,
          },
        ],
        used_postgres: true,
        validated: true,
      },
      status: 'success',
      type: 'response',
    };
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
    };
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_TRANSACTIONS },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS },
      { type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_SUCCESS, data: expectedData },
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`, {
      status: 200,
      response: data,
    });
    return store.dispatch(actions.loadTokenTransactions(TEST_ADDRESS, TEST_CURRENCY)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on none 2xx fail loadTokenTransactions', () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_TRANSACTIONS },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS },
      {
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_FAIL,
        error: 'get_account_transactions_failed',
      },
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`, {
      status: 500,
      response: null,
    });
    return store.dispatch(actions.loadTokenTransactions(TEST_ADDRESS, TEST_CURRENCY)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
