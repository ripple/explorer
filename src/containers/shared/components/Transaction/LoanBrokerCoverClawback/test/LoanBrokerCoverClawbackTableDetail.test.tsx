import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerCoverClawback from './mock_data/LoanBrokerCoverClawback.json'
import LoanBrokerCoverClawbackZeroAmount from './mock_data/LoanBrokerCoverClawbackZeroAmount.json'
import LoanBrokerCoverClawbackNoAmount from './mock_data/LoanBrokerCoverClawbackNoAmount.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('LoanBrokerCoverClawbackTableDetail', () => {
  it('renders with explicit amount', () => {
    const wrapper = createWrapper(LoanBrokerCoverClawback)

    expect(wrapper.find('.loan-broker-cover-clawback')).toHaveText(
      'Claws back$5.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7from Loan Broker ID 7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B ',
    )

    wrapper.unmount()
  })

  it('renders with calculated amount when Amount is 0', () => {
    const wrapper = createWrapper(LoanBrokerCoverClawbackZeroAmount)

    expect(wrapper.find('.loan-broker-cover-clawback')).toHaveText(
      'Claws back$14.95 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7from Loan Broker ID 7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B ',
    )

    wrapper.unmount()
  })

  it('renders with calculated amount when Amount is undefined', () => {
    const wrapper = createWrapper(LoanBrokerCoverClawbackNoAmount)

    expect(wrapper.find('.loan-broker-cover-clawback')).toHaveText(
      'Claws back$4.94151169 USD.rh2z5N9avJKVKvWFXyayEMqd7ABqo7Disxfrom Loan Broker ID 693FCCFB835B322B2714107323EAC727D710DF827030B3935E0A6B62D15B1EEC ',
    )

    wrapper.unmount()
  })
})
