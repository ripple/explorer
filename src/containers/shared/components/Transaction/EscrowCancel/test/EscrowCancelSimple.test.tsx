import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { Simple } from '../Simple'
import i18n from '../../../../../../i18nTestConfig'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import mockEscrowCancel from './mock_data/EscrowCancel.json'

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

describe('EscrowCancelSimple', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockEscrowCancel)
    expect(wrapper.find('[data-test="escrow-amount"] .value')).toHaveText(
      `\uE900135.79 XRP`,
    )
    expect(wrapper.find('[data-test="escrow-cancel"] .value')).toHaveText(
      'rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56 - 9',
    )
    expect(wrapper.find('[data-test="escrow-cancel-tx"] .value')).toHaveText(
      `A979AD5C6A6C844913DA51D71BF5F0B8E254D9A211FA837C4B322C4A8FD358E6`,
    )
    wrapper.unmount()
  })
})
