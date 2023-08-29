import mockAMMDelete from './mock_data/AMMDelete.json'
import { Description } from '../Description'
import { createDescriptionWrapperFactory } from '../../test'

const createWrapper = createDescriptionWrapperFactory(Description)

describe('AMMDelete: Description', () => {
  it('renders description for AMMDelete transaction', () => {
    const wrapper = createWrapper(mockAMMDelete)

    expect(wrapper.html()).toBe(
      '<div data-test="amm-delete-description">Attempted to delete the AMM for <span class="currency">\uE900 XRP</span> and <span class="currency"><a class="" href="/token/FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9">FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9</a></span>.<br>If there were more than 512 trustlines, this only removes 512 trustlines instead.</div>',
    )
    wrapper.unmount()
  })
})
