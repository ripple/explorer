import { render, screen, cleanup } from '@testing-library/react'
import { Route } from 'react-router'
import i18n from '../../../../../i18n/testConfig'
import * as rippled from '../../../../../rippled/lib/rippled'
import { AMMAccounts } from '../index'
import { flushPromises, QuickHarness } from '../../../../test/utils'
import { ACCOUNT_ROUTE } from '../../../../App/routes'

const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'
const ACCOUNT_INFO: any = {
  AMMID: '0017D8D412779284FDA6A63CEBEADD43BC2FEF37181C3C234ADAC9EFBB5FDB53',
  Account: 'rJbt6ryq1TzikBuvVQDaxVLqL77eJeibsj',
  Balance: '10000000',
  Flags: 26214400,
  LedgerEntryType: 'AccountRoot',
  OwnerCount: 1,
  PreviousTxnID:
    '2A9F2B8D74CBECFF339BBD5CD9E42468984D3D8AA5D521B9610F31B014629DC2',
  PreviousTxnLgrSeq: 58180,
  Sequence: 58180,
  index: '115CA30FD281E3265AA22F563B4ADE4BD15A6107F1E5105056F191882BE78FC4',
}

const LEDGER_ENTRY: any = {
  index: '0017D8D412779284FDA6A63CEBEADD43BC2FEF37181C3C234ADAC9EFBB5FDB53',
  ledger_hash:
    '6C1914FF5966D2FD060B92B07A30A303369F28132DB5E8D73BED4FFC8A372EF2',
  ledger_index: 285601,
  node: {
    Account: 'rJbt6ryq1TzikBuvVQDaxVLqL77eJeibsj',
    Asset: {
      currency: 'XRP',
    },
    Asset2: {
      currency: 'USD',
      issuer: 'rJd9Ti4TF2Mrn268LW7sSw8E16J4hYzMiD',
    },
    AuctionSlot: {
      Account: 'rJd9Ti4TF2Mrn268LW7sSw8E16J4hYzMiD',
      Expiration: 745719332,
      Price: {
        currency: '03930D02208264E2E40EC1B0C09E4DB96EE197B1',
        issuer: 'rJbt6ryq1TzikBuvVQDaxVLqL77eJeibsj',
        value: '0',
      },
    },
    Flags: 0,
    LPTokenBalance: {
      currency: '03930D02208264E2E40EC1B0C09E4DB96EE197B1',
      issuer: 'rJbt6ryq1TzikBuvVQDaxVLqL77eJeibsj',
      value: '10000',
    },
    LedgerEntryType: 'AMM',
    VoteSlots: [
      {
        VoteEntry: {
          Account: 'rJd9Ti4TF2Mrn268LW7sSw8E16J4hYzMiD',
          VoteWeight: 100000,
        },
      },
    ],
    index: '0017D8D412779284FDA6A63CEBEADD43BC2FEF37181C3C234ADAC9EFBB5FDB53',
  },
  validated: true,
}

const AMM_INFO: any = {
  amm: {
    account: 'rJbt6ryq1TzikBuvVQDaxVLqL77eJeibsj',
    amount: '10000000',
    amount2: {
      currency: 'USD',
      issuer: 'rJd9Ti4TF2Mrn268LW7sSw8E16J4hYzMiD',
      value: '10',
    },
    asset2_frozen: false,
    auction_slot: {
      account: 'rJd9Ti4TF2Mrn268LW7sSw8E16J4hYzMiD',
      discounted_fee: 0,
      expiration: '2023-08-19T00:15:32+0000',
      price: {
        currency: '03930D02208264E2E40EC1B0C09E4DB96EE197B1',
        issuer: 'rJbt6ryq1TzikBuvVQDaxVLqL77eJeibsj',
        value: '0',
      },
      time_interval: 20,
    },
    lp_token: {
      currency: '03930D02208264E2E40EC1B0C09E4DB96EE197B1',
      issuer: 'rJbt6ryq1TzikBuvVQDaxVLqL77eJeibsj',
      value: '10000',
    },
    trading_fee: 0,
    vote_slots: [
      {
        account: 'rJd9Ti4TF2Mrn268LW7sSw8E16J4hYzMiD',
        trading_fee: 0,
        vote_weight: 100000,
      },
    ],
  },
  ledger_current_index: 285641,
  validated: false,
}

describe('AMM Account Page', () => {
  afterAll(cleanup)

  function setSpy(accountInfo: any, getLedgerEntry: any, ammInfo: any) {
    const spyAccountInfo = jest.spyOn(rippled, 'getAccountInfo')
    const spyLedgerEntry = jest.spyOn(rippled, 'getLedgerEntry')
    const spyInfo = jest.spyOn(rippled, 'getAMMInfo')
    spyAccountInfo.mockReturnValue(
      new Promise((resolve) => {
        resolve(accountInfo)
      }),
    )
    spyLedgerEntry.mockReturnValue(
      new Promise((resolve) => {
        resolve(getLedgerEntry)
      }),
    )
    spyInfo.mockReturnValue(
      new Promise((resolve) => {
        resolve(ammInfo)
      }),
    )
  }

  const renderComponent = () =>
    render(
      <QuickHarness
        i18n={i18n}
        initialEntries={[`/accounts/${TEST_ACCOUNT_ID}`]}
      >
        <Route path={ACCOUNT_ROUTE.path} element={<AMMAccounts />} />
      </QuickHarness>,
    )

  it('renders AMM account page', async () => {
    setSpy(ACCOUNT_INFO, LEDGER_ENTRY, AMM_INFO)

    renderComponent()
    await flushPromises()

    expect(screen.queryByTestId('amm-header')).toBeDefined()
    expect(screen.queryByTitle('transaction-table')).toBeDefined()
  })

  it('shows error when amm info data is formatted incorrectly', async () => {
    setSpy(ACCOUNT_INFO, LEDGER_ENTRY, 'ammInfo')

    await renderComponent()
    await flushPromises()

    expect(screen.queryByTestId('amm-header')).toBeNull()
    expect(screen.queryByTitle('transaction-table')).toBeNull()
    expect(screen.queryByText('uh-oh')).toBeDefined()
  })

  it('shows error when account_info has no AMMID', async () => {
    const badAccountInfo: any = {
      ...ACCOUNT_INFO,
    }

    delete badAccountInfo.AMMID

    const badLedgerEntry = {
      error: 'invalidParams',
      error_code: 31,
      error_message: 'indexMalformed',
      status: 'error',
      type: 'response',
      request: {
        command: 'ledger_entry',
        index: '',
        ledger_index: 'validated',
      },
      warnings: [
        {
          id: 2001,
          message:
            "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request",
        },
      ],
    }

    setSpy(badAccountInfo, badLedgerEntry, AMM_INFO)

    renderComponent()
    await flushPromises()

    expect(screen.queryByTestId('amm-header')).toBeNull()
    expect(screen.queryByTitle('transaction-table')).toBeNull()
    expect(screen.queryByText('uh-oh')).toBeDefined()
  })
})
