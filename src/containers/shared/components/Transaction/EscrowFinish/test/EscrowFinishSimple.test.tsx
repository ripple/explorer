import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { Simple } from '../Simple'
import i18n from '../../../../../../i18nTestConfig'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import mockEscrowFinish from './mock_data/EscrowFinish.json'

function createWrapper(tx: any) {
  const data = summarizeTransaction(tx, true)
  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Simple data={data.details} />
      </BrowserRouter>
    </I18nextProvider>,
  )
}

describe('EscrowFinishSimple', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockEscrowFinish)
    expect(wrapper.find('[data-test="escrow-amount"] .value')).toHaveText(
      `\uE9000.0154 XRP`,
    )
    expect(wrapper.find('[data-test="escrow-tx"]')).toHaveText(
      `escrow_transaction3E2E755FA75FF1020C39E2ECC407E9F1C0E49A7229EDD15FF93B9F869878F1CC`,
    )
    wrapper.unmount()
  })
})
