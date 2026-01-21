import { render, waitFor } from '@testing-library/react'
import { expectSimpleRowText } from '../../test'
import { QuickHarness } from '../../../../../test/utils'
import { Simple } from '../Simple'
import * as rippled from '../../../../../../rippled/lib/rippled'
import SocketContext from '../../../../SocketContext'
import MockWsClient from '../../../../../test/mockWsClient'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18n/testConfigEnglish'
import Batch from './mock_data/Batch.json'
import InnerTransactionSuccessful from './mock_data/InnerTxSuccessful.json'
import InnerTransactionFailed from './mock_data/InnerTxFailed.json'

jest.mock('../../../../../../rippled/lib/rippled', () => ({
  __esModule: true,
  getTransaction: jest.fn(),
}))

const mockedGetTransaction = rippled.getTransaction as jest.Mock

function renderComponent(tx: any, socketMock: any = {}) {
  const data = summarizeTransaction(tx, true)
  return render(
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
        return Promise.resolve(InnerTransactionSuccessful)
      }
      return Promise.reject(new Error('transaction not found'))
    })

    const { container } = renderComponent(Batch, client)

    await waitFor(() => {
      expect(container.querySelectorAll('.group')).toHaveLength(3)
    })

    const groups = container.querySelectorAll('.group')
    const innerTx1 = groups[0]
    const innerTx2 = groups[1]
    const innerTx3 = groups[2]

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

    expectSimpleRowText(innerTx2, 'tx-status', 'Failed (Not Validated)')

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

    expectSimpleRowText(innerTx3, 'tx-status', 'Failed (Not Validated)')
  })

  it('show failed transaction', async () => {
    mockedGetTransaction.mockImplementation((_, txId) => {
      if (
        txId ===
        'EB5933399A49541B65552C5B5959AEECC520D10B946EC30F5A39B9EAA16C7D56'
      ) {
        return Promise.resolve(InnerTransactionFailed)
      }
      return Promise.reject(new Error('transaction not found'))
    })
    const { container } = renderComponent(Batch, client)

    await waitFor(() => {
      expect(container.querySelectorAll('.group')).toHaveLength(3)
    })

    const innerTx1 = container.querySelectorAll('.group')[0]
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

    expectSimpleRowText(innerTx1, 'tx-status', 'Failed (tecUNFUNDED_PAYMENT)')
  })
})
