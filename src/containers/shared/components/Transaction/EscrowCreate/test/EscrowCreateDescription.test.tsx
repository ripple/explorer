import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import i18n from '../../../../../../i18nTestConfig'
import EscrowCreate from './mock_data/EscrowCreate.json'
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

describe('EscrowCreateDescription', () => {
  it('renders description for EscrowCreate', () => {
    const wrapper = createWrapper(EscrowCreate)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>104</span></b></div>The escrow is from<a class="account" title="rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi8q" href="/accounts/rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi8q">rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi8q</a>to<a class="account" title="rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q" href="/accounts/rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q">rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q</a><div>escrow_condition<span class="condition"> A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120</span></div><div>escrowed_amount<b> \uE900997.50<small>XRP</small></b></div><div>describe_cancel_after<span class="time"> March 1, 2020, 8:54:20 AM UTC</span></div><div>describe_finish_after<span class="time"> March 1, 2020, 9:01:00 AM UTC</span></div></div>',
    )
    wrapper.unmount()
  })
})
