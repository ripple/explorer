import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { TxLabel } from '../TxLabel'
import TransactionCancelIcon from '../TransactionActionIcon/TransactionCancelIcon.svg'
import TransactionSendIcon from '../TransactionActionIcon/TransactionSendIcon.svg'
import TransactionUnknownIcon from '../TransactionActionIcon/TransactionUnknownIcon.svg'
import i18n from '../../../../i18nTestConfig.en-US'

describe('TxLabel', () => {
  const createWapper = (component: any) =>
    mount(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>)

  it('renders with an action specified ', () => {
    let wrapper = createWapper(<TxLabel type="Payment" />)
    expect(wrapper.find('.tx-category-PAYMENT')).toExist()
    expect(wrapper).toContainReact(<TransactionSendIcon />)
    expect(wrapper.find('.tx-type-name')).toHaveText('Payment')
    wrapper.unmount()

    wrapper = createWapper(<TxLabel type="OfferCancel" />)
    expect(wrapper.find('.tx-category-DEX')).toExist()
    expect(wrapper).toContainReact(<TransactionCancelIcon />)
    expect(wrapper.find('.tx-type-name')).toHaveText('Offer Cancel')
    wrapper.unmount()
  })

  it('renders with type that is not defined', () => {
    const wrapper = createWapper(<TxLabel type="WooCreate" />)
    expect(wrapper.find('.tx-category-UNKNOWN')).toExist()
    expect(wrapper).toContainReact(<TransactionUnknownIcon />)
    expect(wrapper.find('.tx-type-name')).toHaveText('WooCreate')
    wrapper.unmount()
  })
})
