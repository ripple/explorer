import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanSet from './mock_data/LoanSet.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('LoanSetTableDetail', () => {
  it('renders with all loan details', () => {
    const wrapper = createWrapper(LoanSet)

    expect(wrapper.find('.loan-set')).toHaveText(
      'Loan Broker ID: 7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80BRequest: 0.00001 XRP from rH4absn9JcB8m943YRMNJpuR9HQs56hkr8Rates: Interest Rate 0.50%, Late Interest Rate 1.00%, Overpayment Fee 0.50%Fees: Loan Origination Fee 0.000001 XRP, Loan Service Fee 0.0000001 XRPTerms: 12 Payment Total, Payment Interval 30d, Grace Period 7d',
    )

    wrapper.unmount()
  })
})
