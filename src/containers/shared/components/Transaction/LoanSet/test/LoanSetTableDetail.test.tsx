import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanSet from './mock_data/LoanSet.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('LoanSetTableDetail', () => {
  it('renders with all loan details', () => {
    const wrapper = createWrapper(LoanSet)

    expect(wrapper.find('.loan-set')).toHaveText(
      'Loan Broker ID: 7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80BRequest: \uE9000.00001 XRP from rH4absn9JcB8m943YRMNJpuR9HQs56hkr8Rates: interest rate 0.50%, late interest rate 1.00%, overpayment fee 0.50%Fees: loan origination fee \uE9000.000001 XRP, loan service fee \uE9000.0000001 XRPTerms: 12 payment total, payment interval 30d, grace period 7d',
    )

    wrapper.unmount()
  })
})
