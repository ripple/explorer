import React from 'react'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { cleanup, render, screen } from '@testing-library/react'
import i18n from '../../../../i18nTestConfig'
import { Account } from '../Account'

const createWrapper = (component: JSX.Element) => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>{component}</BrowserRouter>
  </I18nextProvider>
)

describe('Account', () => {
  afterEach(cleanup)
  it('should render with a link', () => {
    const account = 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt'
    render(createWrapper(<Account account={account} />))
    const link = screen.getByRole('link')
    expect(link).toHaveClass('account')
    expect(link).toHaveTextContent(account)
    expect(link).toHaveAttribute('href', `/accounts/${account}`)
    expect(link).toHaveAttribute('title', account)
    expect(screen.queryByTestId('dt')).toBeNull()
    screen.debug()
  })
  // it('should render without a link', () => {
  //   const wrapper = createWrapper(
  //     <Account account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt" link={false} />,
  //   )
  //   const address = wrapper.find('.account').hostNodes()
  //   expect(address).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
  //   expect(address).not.toHaveTagName('a')
  //   expect(address).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
  //   expect(wrapper.find('.dt')).not.toExist()
  //   wrapper.unmount()
  // })

  // it('should render with a destination tag', () => {
  //   const wrapper = createWrapper(
  //     <Account account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702" />,
  //   )
  //   const anchor = wrapper.find('a')
  //   expect(anchor).toHaveClassName('account')
  //   expect(anchor).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
  //   expect(anchor).toHaveProp(
  //     'href',
  //     '/accounts/rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt',
  //   )
  //   expect(anchor).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
  //   expect(wrapper.find('.dt')).toHaveText(':381702')
  //   wrapper.unmount()
  // })

  // it('should render with a destination tag and no link', () => {
  //   const wrapper = createWrapper(
  //     <Account
  //       account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702"
  //       link={false}
  //     />,
  //   )
  //   const address = wrapper.find('.account')
  //   expect(address).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
  //   expect(address).not.toHaveTagName('a')
  //   expect(address).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
  //   expect(wrapper.find('.dt')).toHaveText(':381702')
  //   wrapper.unmount()
  // })

  // it('should render with a destination tag supplied separately', () => {
  //   const wrapper = createWrapper(
  //     <Account account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt" tag={123} />,
  //   )
  //   const anchor = wrapper.find('a')
  //   expect(anchor).toHaveClassName('account')
  //   expect(anchor).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
  //   expect(anchor).toHaveProp(
  //     'href',
  //     '/accounts/rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt',
  //   )
  //   expect(anchor).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
  //   expect(wrapper.find('.dt')).toHaveText(':123')
  //   wrapper.unmount()
  // })

  // it('should render with a destination tag supplied separately and no link', () => {
  //   const wrapper = createWrapper(
  //     <Account
  //       account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt"
  //       tag={123}
  //       link={false}
  //     />,
  //   )
  //   const address = wrapper.find('.account')
  //   expect(address).toHaveText('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
  //   expect(address).not.toHaveTagName('a')
  //   expect(address).toHaveProp('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
  //   expect(wrapper.find('.dt')).toHaveText(':123')
  //   wrapper.unmount()
  // })
})
