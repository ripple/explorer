import { mount } from 'enzyme'
import { Route } from 'react-router'
import i18n from '../../../../../i18n/testConfig'
import * as rippled from '../../../../../rippled/lib/rippled'
import NoMatch from '../../../../NoMatch'
import { AMMAccountHeader } from '../AMMAccountHeader/AMMAccountHeader'
import { AccountTransactionTable } from '../../../AccountTransactionTable'
import { AMMAccounts } from '../index'
import { flushPromises, QuickHarness } from '../../../../test/utils'
import { ACCOUNT_ROUTE } from '../../../../App/routes'

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

describe('AMM Account Page', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'
  const accountInfo: any = {
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

  const ledgerEntry: any = {
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

  const ammInfo: any = {
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

  const createWrapper = () =>
    mount(
      <QuickHarness
        i18n={i18n}
        initialEntries={[`/accounts/${TEST_ACCOUNT_ID}`]}
      >
        <Route path={ACCOUNT_ROUTE.path} element={<AMMAccounts />} />
      </QuickHarness>,
    )

  it('renders AMM account page', async () => {
    setSpy(accountInfo, ledgerEntry, ammInfo)

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(1)
    expect(wrapper.find(AccountTransactionTable).length).toBe(1)
    wrapper.unmount()
  })

  it('shows error when amm info data is formatted incorrectly', async () => {
    setSpy(accountInfo, ledgerEntry, 'ammInfo')

    const wrapper = await createWrapper()
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(0)
    expect(wrapper.find(AccountTransactionTable).length).toBe(0)
    expect(wrapper.find(NoMatch).length).toBe(1)
    wrapper.unmount()
  })

  it('shows error when account_info has no AMMID', async () => {
    const badAccountInfo: any = {
      ...accountInfo,
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

    setSpy(badAccountInfo, badLedgerEntry, ammInfo)

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(0)
    expect(wrapper.find(AccountTransactionTable).length).toBe(0)
    expect(wrapper.find(NoMatch).length).toBe(1)
    wrapper.unmount()
  })
})
