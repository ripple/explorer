import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/ConfidentialMPTMergeInbox.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('ConfidentialMPTMergeInbox: Simple', () => {
  it('renders MPT issuance ID', () => {
    const { container, unmount } = renderComponent(transaction)

    expectSimpleRowText(container, 'mpt-issuance-id', '0000001365...B04BEDAFCA')
    unmount()
  })
})
