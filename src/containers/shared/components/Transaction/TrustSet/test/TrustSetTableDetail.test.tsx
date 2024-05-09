import { cleanup, screen } from '@testing-library/react'
import {
  createTableDetailRenderFactory,
  expectSimpleRowLabel,
} from '../../test'
import { TableDetail } from '../TableDetail'
import mockTrustSet from './mock_data/TrustSet.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('TrustSet: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockTrustSet)
    expectSimpleRowLabel(screen, 'Set Trust Limit', 'Set Trust Limit')
    expect(screen.getByTestId('Amount')).toHaveTextContent(
      'CN¥1,000,000,000.00 CNY.razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA',
    )
  })
})
