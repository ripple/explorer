import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { Simple } from '../Simple'
import i18n from '../../../../../../i18nTestConfig'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import mockEscrowCreate from './mock_data/EscrowCreate.json'

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

describe('EscrowCreateSimple', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockEscrowCreate)
    expect(wrapper.find('[data-test="escrow-amount"] .value')).toHaveText(
      `\uE900997.50 XRP`,
    )
    expect(wrapper.find('[data-test="escrow-destination"] .value')).toHaveText(
      `rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi8q`,
    )
    expect(wrapper.find('[data-test="escrow-condition"] .value')).toHaveText(
      `A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120`,
    )
    wrapper.unmount()
  })
})
