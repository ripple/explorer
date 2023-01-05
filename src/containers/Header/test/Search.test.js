import React from 'react'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../i18nTestConfig'
import Search from '../Search'
import * as rippled from '../../../rippled/lib/rippled'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'

describe('Header component', () => {
  const createWrapper = (state = {}) => {
    const client = new MockWsClient()
    return mount(
      <I18nextProvider i18n={i18n}>
        <SocketContext.Provider value={client}>
          <Router>
            <Search />
          </Router>
        </SocketContext.Provider>
      </I18nextProvider>,
    )
  }

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.search').length).toEqual(1)
    expect(wrapper.find('.search input').length).toEqual(1)
    expect(wrapper.find('.search input').prop('placeholder')).toEqual(
      'header.search.placeholder',
    )
    wrapper.unmount()
  })

  it('search values', async () => {
    const flushPromises = () => new Promise((resolve) => setImmediate(resolve))
    const wrapper = createWrapper()
    const input = wrapper.find('.search input')
    const ledgerIndex = '123456789'
    const rippleAddress = 'rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX'
    const rippleXAddress = 'XVVFXHFdehYhofb7XRWeJYV6kjTEwboaHpB9S1ruYMsuXcG'
    const rippleSplitAddress = 'rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb:1888963938'
    const paystring = 'blunden$paystring.crypto.com'
    const paystringWithAt = 'blunden@paystring.crypto.com'
    const validator = 'nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p'

    const hash =
      '59239EA78084F6E2F288473F8AE02F3E6FC92F44BDE59668B5CAE361D3D32838'
    const token1 = 'cny.rJ1adrpGS3xsnQMb9Cw54tWJVFPuSdZHK'
    const token2 =
      '534f4c4f00000000000000000000000000000000.rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz'
    const nftoken =
      '000800011C7D8ED1D715A0017E41BF9499ECC17E7FB666320000099B00000000'
    const invalidString = '123invalid'

    // mock getNFTInfo api to test transactions and nfts
    const mockAPI = jest.spyOn(rippled, 'getTransaction')

    input.simulate('keyDown', { key: 'a' })
    expect(window.location.pathname).toEqual('/')

    input.instance().value = ledgerIndex
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/ledgers/${ledgerIndex}`)

    input.instance().value = rippleAddress
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/accounts/${rippleAddress}`)

    input.instance().value = rippleXAddress
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/accounts/${rippleXAddress}`)

    // Normalize split address format to a X-Address
    input.instance().value = rippleSplitAddress
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/accounts/${rippleXAddress}`)

    input.instance().value = paystring
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/paystrings/${paystring}`)

    // Normalize paystrings with @ to $
    input.instance().value = paystringWithAt
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/paystrings/${paystring}`)

    // Validator
    input.instance().value = validator
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/validators/${validator}`)

    mockAPI.mockImplementation(() => {
      '123'
    })
    input.instance().value = hash
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/transactions/${hash}`)

    input.instance().value = token1
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/token/${token1}`)

    input.instance().value = token2
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/token/${token2}`)

    // Returns a response upon a valid nft_id, redirect to NFT
    mockAPI.mockImplementation(() => {
      throw new Error('Tx not found', 404)
    })
    input.instance().value = nftoken
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/nft/${nftoken}`)

    input.instance().value = invalidString
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/search/${invalidString}`)

    // ensure strings are trimmed
    mockAPI.mockImplementation(() => {
      '123'
    })
    input.instance().value = ` ${hash} `
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/transactions/${hash}`)

    // handle lower case tx hash
    input.instance().value = hash.toLowerCase()
    input.simulate('keyDown', { key: 'Enter' })
    await flushPromises()
    expect(window.location.pathname).toEqual(`/transactions/${hash}`)
    wrapper.unmount()
  })
})
