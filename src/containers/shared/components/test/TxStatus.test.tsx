import * as React from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { mount } from 'enzyme'
import i18n from '../../../../i18nTestConfig.en-US'
import { TxStatus } from '../TxStatus'

describe('TxStatus', () => {
  const createWrapper = (component: React.ReactElement) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>{component}</MemoryRouter>
      </I18nextProvider>,
    )

  it('renders success correctly ', () => {
    const wrapper = createWrapper(<TxStatus status="tesSUCCESS" />)
    expect(wrapper.find('.status')).toHaveText('Success')
    expect(wrapper.find('svg.success')).toExist()
    wrapper.unmount()
  })

  it('renders success correctly without message in shorthand mode', () => {
    const wrapper = createWrapper(<TxStatus status="tesSUCCESS" shorthand />)
    expect(wrapper.find('.status')).not.toHaveText('Success')
    expect(wrapper.find('svg.success')).toExist()
    wrapper.unmount()
  })

  it('renders failure correctly ', () => {
    const wrapper = createWrapper(<TxStatus status="tecPATH_DRY" />)
    expect(wrapper.find('.status-message')).toHaveText('Fail')
    expect(wrapper.find('.status-code')).toHaveText('tecPATH_DRY')
    expect(wrapper.find('svg.fail')).toExist()
    expect(wrapper.find('a')).toHaveProp(
      'href',
      'https://xrpl.org/tec-codes.html#tecPATH_DRY',
    )
    wrapper.unmount()
  })

  it('renders failure correctly without message in shorthand mode ', () => {
    const wrapper = createWrapper(<TxStatus status="tecPATH_DRY" shorthand />)
    expect(wrapper.find('.status-message')).not.toExist()
    expect(wrapper.find('.status-code')).toHaveText('tecPATH_DRY')
    expect(wrapper.find('svg.fail')).toExist()
    expect(wrapper.find('a')).not.toExist() // Not a link in shorthand
    wrapper.unmount()
  })
})
