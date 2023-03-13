import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import i18n from '../../../../i18n/testConfig'
import { Account } from '../Account'

const createWrapper = (component: JSX.Element) =>
  mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>{component}</BrowserRouter>
    </I18nextProvider>,
  )

describe('Account', () => {
  it('should render with a link', () => {
    const wrapper = createWrapper(
      <Account account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt" />,
    )
    const anchor = wrapper.find('a')
    expect(anchor).toHaveClassName('account')
    expect(anchor).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(anchor).toHaveProp(
      'href',
      '/accounts/rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt',
    )
    expect(anchor).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(wrapper.find('.dt')).not.toExist()
    wrapper.unmount()
  })
  it('should render without a link', () => {
    const wrapper = createWrapper(
      <Account account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt" link={false} />,
    )
    const address = wrapper.find('.account').hostNodes()
    expect(address).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(address).not.toHaveDisplayName('a')
    expect(address).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(wrapper.find('.dt')).not.toExist()
    wrapper.unmount()
  })

  it('should render with a destination tag', () => {
    const wrapper = createWrapper(
      <Account account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702" />,
    )
    const anchor = wrapper.find('a')
    expect(anchor).toHaveClassName('account')
    expect(anchor).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(anchor).toHaveProp(
      'href',
      '/accounts/rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt',
    )
    expect(anchor).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(wrapper.find('.dt')).toHaveText(':381702')
    wrapper.unmount()
  })

  it('should render with a destination tag and no link', () => {
    const wrapper = createWrapper(
      <Account
        account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702"
        link={false}
      />,
    )
    const address = wrapper.find('.account')
    expect(address).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(address).not.toHaveDisplayName('a')
    expect(address).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(wrapper.find('.dt')).toHaveText(':381702')
    wrapper.unmount()
  })

  it('should render with a destination tag supplied separately', () => {
    const wrapper = createWrapper(
      <Account account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt" tag={123} />,
    )
    const anchor = wrapper.find('a')
    expect(anchor).toHaveClassName('account')
    expect(anchor).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(anchor).toHaveProp(
      'href',
      '/accounts/rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt',
    )
    expect(anchor).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(wrapper.find('.dt')).toHaveText(':123')
    wrapper.unmount()
  })

  it('should render with a destination tag supplied separately and no link', () => {
    const wrapper = createWrapper(
      <Account
        account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt"
        tag={123}
        link={false}
      />,
    )
    const address = wrapper.find('.account')
    expect(address).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(address).not.toHaveDisplayName('a')
    expect(address).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(wrapper.find('.dt')).toHaveText(':123')
    wrapper.unmount()
  })
})
