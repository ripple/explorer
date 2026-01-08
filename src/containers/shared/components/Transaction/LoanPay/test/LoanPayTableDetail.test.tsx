import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanPay from './mock_data/LoanPay.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('LoanPayTableDetail', () => {
  it('renders with amount and loan ID', () => {
    const wrapper = createWrapper(LoanPay)

    expect(wrapper.find('.loan-pay')).toHaveText(
      'Send$5.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7to Loan ID28375E885D1F8E46502B1A6FA44B9E2EFC15244F467010082BE314AE6224CD66',
    )

    wrapper.unmount()
  })
})
