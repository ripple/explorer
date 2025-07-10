import { mount } from 'enzyme'
import i18n from '../../../../../../i18n/testConfigEnglish'
import * as rippled from '../../../../../../rippled/lib/rippled'
import { TableDetail } from '../TableDetail'
import Batch from './mock_data/Batch.json'
import InnerTransaction from './mock_data/InnerTx.json'
import MockWsClient from '../../../../../test/mockWsClient'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import { flushPromises, QuickHarness } from '../../../../../test/utils'
import SocketContext from '../../../../SocketContext'

function createWrapper(tx: any, socketMock: any = {}) {
  const data = summarizeTransaction(tx, true)
  return mount(
    <QuickHarness i18n={i18n}>
      <SocketContext.Provider value={socketMock}>
        <TableDetail instructions={data.details!.instructions} />
      </SocketContext.Provider>
    </QuickHarness>,
  )
}

jest.mock('../../../../../../rippled/lib/rippled', () => ({
  __esModule: true,
  getTransaction: jest.fn(),
}))

const mockedGetTransaction = rippled.getTransaction as jest.Mock

describe('Batch: TableDetail', () => {
  let client

  beforeEach(() => {
    client = new MockWsClient()
  })
  afterEach(() => {
    client.close()
    mockedGetTransaction.mockReset()
  })
  it('renders', async () => {
    mockedGetTransaction.mockImplementation((_, txId) => {
      if (
        txId ===
        'EB5933399A49541B65552C5B5959AEECC520D10B946EC30F5A39B9EAA16C7D56'
      ) {
        return Promise.resolve(InnerTransaction)
      }
      return Promise.reject(new Error('transaction not found'))
    })
    const wrapper = createWrapper(Batch)
    await flushPromises()
    wrapper.update()
    expect(wrapper).toHaveText(
      'Batch 3 transactions' +
        'Applied Inner Transactions: ' +
        'EB5933399A49541B65552C5B5959AEECC520D10B946EC30F5A39B9EAA16C7D56',
    )
    wrapper.unmount()
  })
})
