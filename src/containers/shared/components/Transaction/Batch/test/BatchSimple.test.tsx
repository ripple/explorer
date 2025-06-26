import { mount } from 'enzyme'
import { expectSimpleRowText } from '../../test'
import { flushPromises, QuickHarness } from '../../../../../test/utils'
import { Simple } from '../Simple'
import * as rippled from '../../../../../../rippled'
import SocketContext from '../../../../SocketContext'
import MockWsClient from '../../../../../test/mockWsClient'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18n/testConfig'
import Batch from './mock_data/Batch.json'
import Ledger from './mock_data/Ledger.json'
import LedgerOneTx from './mock_data/LedgerOneTx.json'
import Mock = jest.Mock

jest.mock('../../../../../../rippled', () => ({
  __esModule: true,
  getLedger: jest.fn(),
}))

const mockedGetLedger = rippled.getLedger as Mock

function createWrapper(tx: any, socketMock: any = {}) {
  const data = summarizeTransaction(tx, true)
  return mount(
    <QuickHarness i18n={i18n}>
      <SocketContext.Provider value={socketMock}>
        <Simple data={data.details!} />
      </SocketContext.Provider>
    </QuickHarness>,
  )
}

describe('Batch: Simple', () => {
  let client

  beforeEach(() => {
    client = new MockWsClient()
  })
  afterEach(() => {
    client.close()
    mockedGetLedger.mockReset()
  })

  it('renders - all tx applied', async () => {
    mockedGetLedger.mockResolvedValue(Ledger)

    const wrapper = createWrapper(Batch, client)

    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.group')).toHaveLength(3)

    const appliedTx1 = wrapper.find('.group').at(0)
    const appliedTx2 = wrapper.find('.group').at(1)
    const appliedTx3 = wrapper.find('.group').at(2)

    expectSimpleRowText(wrapper, 'inner-count', '3')
    expectSimpleRowText(wrapper, 'applied-count', '3')

    expectSimpleRowText(
      appliedTx1,
      'tx-account',
      'rGNaz5pSs432sVvaE5EqxAWBXKedHqQ9Rj',
    )
    expectSimpleRowText(appliedTx1, 'tx-type', 'Payment')
    expectSimpleRowText(appliedTx1, 'tx-sequence', '3918585')
    expectSimpleRowText(appliedTx1, 'tx-hash', '3EBD47...')

    expectSimpleRowText(
      appliedTx2,
      'tx-account',
      'rEizmA2JpsvJUrjhH9pZ4AAiN9ztiH4LeF',
    )
    expectSimpleRowText(appliedTx2, 'tx-type', 'Payment')
    expectSimpleRowText(appliedTx2, 'tx-sequence', '3918587')
    expectSimpleRowText(appliedTx2, 'tx-hash', 'F636E5...')

    expectSimpleRowText(
      appliedTx3,
      'tx-account',
      'rBe5QUgwCdMTVXmc4jJwCNXgBsDa5LJFso',
    )
    expectSimpleRowText(appliedTx3, 'tx-type', 'Payment')
    expectSimpleRowText(appliedTx3, 'tx-sequence', '3918588')
    expectSimpleRowText(appliedTx3, 'tx-hash', 'ABE5B2...')

    wrapper.unmount()
  })

  it('renders - only one tx applied', async () => {
    mockedGetLedger.mockResolvedValue(LedgerOneTx)

    const wrapper = createWrapper(Batch, client)

    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.group')).toHaveLength(1)

    const appliedTx1 = wrapper.find('.group').at(0)

    expectSimpleRowText(wrapper, 'inner-count', '3')
    expectSimpleRowText(wrapper, 'applied-count', '1')

    expectSimpleRowText(
      appliedTx1,
      'tx-account',
      'rGNaz5pSs432sVvaE5EqxAWBXKedHqQ9Rj',
    )
    expectSimpleRowText(appliedTx1, 'tx-type', 'Payment')
    expectSimpleRowText(appliedTx1, 'tx-sequence', '3918585')
    expectSimpleRowText(appliedTx1, 'tx-hash', '3EBD47...')

    wrapper.unmount()
  })
})
