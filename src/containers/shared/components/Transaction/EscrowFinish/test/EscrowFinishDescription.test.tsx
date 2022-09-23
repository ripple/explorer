import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import i18n from '../../../../../../i18nTestConfig'
import EscrowFinish from './mock_data/EscrowFinish.json'
import { Description } from '../Description'

function createWrapper(tx: any) {
  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Description data={tx} />
      </BrowserRouter>
    </I18nextProvider>,
  )
}

describe('EscrowFinishDescription', () => {
  it('renders description for EscrowFinish', () => {
    const wrapper = createWrapper(EscrowFinish)
    expect(wrapper.html()).toBe(
      '<div>escrow_completion_desc <a class="account" title="r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8" href="/accounts/r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8">r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8</a></div><div>The escrowed amount of<b>\uE9000.0154<small>XRP</small></b>was delivered to<a class="account" title="r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8" href="/accounts/r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8">r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8</a><span> (<b>\uE9000.015388<small>XRP</small></b> escrow_after_transaction_cost)</span></div>The escrow was created by<a class="account" title="r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8" href="/accounts/r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8">r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8</a>with transaction<a class="hash" href="/transactions/3E2E755FA75FF1020C39E2ECC407E9F1C0E49A7229EDD15FF93B9F869878F1CC">3E2E75...</a><div>escrow_finish_fullfillment_desc<span class="fulfillment"> Fulfillment</span></div>',
    )
    wrapper.unmount()
  })
})
