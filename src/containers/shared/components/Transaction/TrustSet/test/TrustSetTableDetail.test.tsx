import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockTrustSet from './mock_data/TrustSet.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const createWrapper = createTableDetailRenderFactory(TableDetail, i18n)

describe('TrustSet: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockTrustSet)
    expect(wrapper.find('.label')).toHaveText('Set Trust Limit')
    expect(wrapper.find('Amount')).toHaveText(
      'CN¥1,000,000,000.00 CNY.razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA',
    )
    wrapper.unmount()
  })
})
