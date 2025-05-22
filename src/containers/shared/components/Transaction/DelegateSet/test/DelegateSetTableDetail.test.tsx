import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockDelegateSet from './mock_data/DelegateSet.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('DelegateSetTableDetail', () => {
  it('render DelegateSetTableDetail', () => {
    const wrapper = createWrapper(mockDelegateSet)
    expect(wrapper).toHaveText(
      'delegate ' +
        'Payment, AccountDomainSet permissions ' +
        'to ' +
        'rNRfqQc9b9ehXJJYVR6NqPPwrS26tWeB6N',
    )
    wrapper.unmount()
  })
})
