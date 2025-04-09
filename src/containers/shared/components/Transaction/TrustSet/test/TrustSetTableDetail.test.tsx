import { cleanup } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockTrustSet from './mock_data/TrustSet.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('TrustSet: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    const { container } = renderComponent(mockTrustSet)
    expect(container).toHaveTextContent('Set Trust Limit')
    expect(container).toHaveTextContent(
      'CN¥1,000,000,000.00 CNY.razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA',
    )
  })
})
