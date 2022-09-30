import EscrowCreate from './mock_data/EscrowCreate.json'
import { Description } from '../Description'
import { createDescriptionWrapperFactory } from '../../test'

const createWrapper = createDescriptionWrapperFactory(Description)

describe('EscrowCreateDescription', () => {
  it('renders description for EscrowCreate', () => {
    const wrapper = createWrapper(EscrowCreate)
    expect(wrapper.html()).toBe(
      'The escrow is from<a class="account" title="rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi8q" href="/accounts/rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi8q">rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi8q</a>to<a class="account" title="rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q" href="/accounts/rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q">rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q</a><div>escrow_condition<span class="condition"> A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120</span></div><div>escrowed_amount<b> \uE900997.50<small>XRP</small></b></div><div>describe_cancel_after<span class="time"> March 1, 2020, 8:54:20 AM UTC</span></div><div>describe_finish_after<span class="time"> March 1, 2020, 9:01:00 AM UTC</span></div>',
    )
    wrapper.unmount()
  })
})
