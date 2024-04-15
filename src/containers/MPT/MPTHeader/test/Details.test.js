import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { Details } from '../Details'
import i18n from '../../../../i18n/testConfig'

describe('MPT Details container', () => {
  const dataDefault = {
    issuer: 'r3SnSE9frruxwsC9qGHFiUJShda62fNFGQ',
    assetScale: 2,
    maxAmt: '100',
    outstandingAmt: '64',
    transferFee: 3,
    sequence: 3949,
    metadata: 'https://www.google.com/',
    flags: ['lsfMPTCanClawback', 'lsfMPTCanTransfer'],
  }

  const createWrapper = (data = dataDefault) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Details data={data} />
        </BrowserRouter>
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders defined fields', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.row').length).toEqual(6)

    expect(wrapper.find('.row').at(0).html()).toBe(
      '<tr class="row"><td class="col1">asset_scale</td><td class="col2">2</td></tr>',
    )
    expect(wrapper.find('.row').at(1).html()).toBe(
      '<tr class="row"><td class="col1">max_amount</td><td class="col2">256</td></tr>',
    )
    expect(wrapper.find('.row').at(2).html()).toBe(
      '<tr class="row"><td class="col1">outstanding_amount</td><td class="col2">100</td></tr>',
    )
    expect(wrapper.find('.row').at(3).html()).toBe(
      '<tr class="row"><td class="col1">transfer_fee</td><td class="col2">0.003%</td></tr>',
    )
    expect(wrapper.find('.row').at(4).html()).toBe(
      '<tr class="row"><td class="col1">sequence_number_short</td><td class="col2">3949</td></tr>',
    )
    expect(wrapper.find('.row').at(5).html()).toBe(
      '<tr class="row"><td class="col1">metadata</td><td class="col2">https://www.google.com/</td></tr>',
    )

    wrapper.unmount()
  })
})
