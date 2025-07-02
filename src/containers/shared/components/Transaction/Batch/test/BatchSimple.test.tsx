import { mount } from 'enzyme'
import { expectSimpleRowText } from '../../test'
import { flushPromises, QuickHarness } from '../../../../../test/utils'
import { Simple } from '../Simple'
import * as rippled from '../../../../../../rippled/lib/rippled'
import SocketContext from '../../../../SocketContext'
import MockWsClient from '../../../../../test/mockWsClient'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18n/testConfigEnglish'
import Batch from './mock_data/Batch.json'
import InnerTransaction from './mock_data/InnerTx.json'

jest.mock('../../../../../../rippled/lib/rippled', () => ({
  __esModule: true,
  getTransaction: jest.fn(),
}))

const mockedGetTransaction = rippled.getTransaction as jest.Mock

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

    const wrapper = createWrapper(Batch, client)

    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.group')).toHaveLength(3)

    const innerTx1 = wrapper.find('.group').at(0)
    const innerTx2 = wrapper.find('.group').at(1)
    const innerTx3 = wrapper.find('.group').at(2)

    expectSimpleRowText(
      innerTx1,
      'tx-account',
      'rGfNFbXcdrx1t7UDEzrJkPCVBRAR2o6HVc',
    )
    expectSimpleRowText(
      innerTx1,
      'tx-hash',
      'EB5933399A49541B65552C5B5959AEECC520D10B946EC30F5A39B9EAA16C7D56',
    )

    expectSimpleRowText(innerTx1, 'tx-status', 'Successful')

    expectSimpleRowText(
      innerTx2,
      'tx-account',
      'rH84ztgQsQuUnZwaM3ujHjQQJYEf4NR59M',
    )
    expectSimpleRowText(
      innerTx2,
      'tx-hash',
      'FD62E8028755E60A8529C76861FAF31A71C97AEAE4E1B27D2D3FAAD234272C11',
    )

    expectSimpleRowText(innerTx2, 'tx-status', 'Failed')

    expectSimpleRowText(
      innerTx3,
      'tx-account',
      'rGPoXHWJgeSQow8NQYZgW6HT82GMwTLAaB',
    )
    expectSimpleRowText(
      innerTx3,
      'tx-hash',
      'B7EB7E00B47E4CD57FECAB8E0EBAF5EB9471C66A3F80CB5C7D88856FAA7CD090',
    )

    expectSimpleRowText(innerTx3, 'tx-status', 'Failed')

    wrapper.unmount()
  })
})
