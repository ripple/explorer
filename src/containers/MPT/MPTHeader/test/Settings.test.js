import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { Settings } from '../Settings'
import i18n from '../../../../i18n/testConfig'

describe('MPT Setttings container', () => {
  const flags = ['lsfMPTCanClawback', 'lsfMPTCanTransfer']

  const createWrapper = () =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Settings flags={flags} />
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders defined fields', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.row').length).toEqual(7)

    expect(wrapper.find('.row').at(0).html()).toBe(
      '<tr class="row" title="row"><td class="col1">locked</td><td class="col2">disabled</td></tr>',
    )
    expect(wrapper.find('.row').at(1).html()).toBe(
      '<tr class="row" title="row"><td class="col1">can_lock</td><td class="col2">disabled</td></tr>',
    )
    expect(wrapper.find('.row').at(2).html()).toBe(
      '<tr class="row" title="row"><td class="col1">require_auth</td><td class="col2">disabled</td></tr>',
    )
    expect(wrapper.find('.row').at(3).html()).toBe(
      '<tr class="row" title="row"><td class="col1">can_escrow</td><td class="col2">disabled</td></tr>',
    )
    expect(wrapper.find('.row').at(4).html()).toBe(
      '<tr class="row" title="row"><td class="col1">can_trade</td><td class="col2">disabled</td></tr>',
    )
    expect(wrapper.find('.row').at(5).html()).toBe(
      '<tr class="row" title="row"><td class="col1">can_transfer</td><td class="col2">enabled</td></tr>',
    )
    expect(wrapper.find('.row').at(6).html()).toBe(
      '<tr class="row" title="row"><td class="col1">can_clawback</td><td class="col2">enabled</td></tr>',
    )
    wrapper.unmount()
  })
})
