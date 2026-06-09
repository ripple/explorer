import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import transaction from './mock_data/ConfidentialMPTMergeInbox.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('ConfidentialMPTMergeInbox: TableDetail', () => {
  it('renders merge inbox details', () => {
    const { container, unmount } = renderComponent(transaction)

    expect(
      container.querySelector('.confidential-mpt-merge-inbox'),
    ).toHaveTextContent('merge_inbox')
    expect(
      container.querySelector('.confidential-mpt-merge-inbox'),
    ).toHaveTextContent('0000001365...B04BEDAFCA')
    unmount()
  })
})
