import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockDelegateSet from './mock_data/DelegateSet.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('DelegateSetTableDetail', () => {
  it('render DelegateSetTableDetail', () => {
    const { container, unmount } = renderComponent(mockDelegateSet)
    expect(container).toHaveTextContent(
      'Delegate ' +
        'Payment, AccountDomainSet permissions ' +
        'to ' +
        'rNRfqQc9b9ehXJJYVR6NqPPwrS26tWeB6N',
    )
    unmount()
  })
})
