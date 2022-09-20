import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import i18n from '../../../../../../i18nTestConfig'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import { TableDetail } from '../TableDetail'
import mockOfferCreateInvertedCurrencies from './mock_data/OfferCreateInvertedCurrencies.json'
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json'
import mockOfferCreate from './mock_data/OfferCreate.json'

function createWrapper(tx: any) {
  const data = summarizeTransaction(tx, true)

  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <TableDetail instructions={data.details.instructions} />
      </BrowserRouter>
    </I18nextProvider>,
  )
}

describe('OfferCreate: TableDetail', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockOfferCreateWithCancel)

    expect(wrapper.find('[data-test="pair"]')).toHaveText(
      'price: 612.518 XRP/CSC',
    )
    expect(wrapper.find('[data-test="cancel-id"]')).toHaveText(
      'cancel_offer #44866443',
    )
    expect(wrapper.find('[data-test="amount-buy"]')).toHaveText(
      `1,080,661.95882 CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr`,
    )
    expect(wrapper.find('[data-test="amount-sell"]')).toHaveText(
      `\uE9001,764.293151 XRP`,
    )
    wrapper.unmount()
  })

  it('renders', () => {
    const wrapper = createWrapper(mockOfferCreate)

    expect(wrapper.find('[data-test="pair"]')).toHaveText(
      'price: 0.00207696 XRP/BCH',
    )
    expect(wrapper.find('[data-test="offer-id"]')).not.toExist()
    expect(wrapper.find('[data-test="amount-buy"]')).toHaveText(
      `51.41523894 BCH.rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds`,
    )
    expect(wrapper.find('[data-test="amount-sell"]')).toHaveText(
      `\uE90024,755.081083 XRP`,
    )
  })

  it('renders inverted currencies', () => {
    const wrapper = createWrapper(mockOfferCreateInvertedCurrencies)

    expect(wrapper.find('[data-test="pair"]')).toHaveText(
      'price: 0.346896 XRP/USD',
    )
  })
})
