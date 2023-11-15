import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import moxios from 'moxios'
import i18n from '../../../i18n/testConfig'
import { Search } from '../Search'
import * as rippled from '../../../rippled/lib/rippled'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { flushPromises } from '../../test/utils'

describe('Search component', () => {
  const createWrapper = () => {
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

  const oldEnvs = process.env

  beforeEach(() => {
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
  })

  afterEach(() => {
    process.env = oldEnvs
  })

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
    moxios.install()
    const wrapper = createWrapper()
    const input = wrapper.find('.search input')
    const ledgerIndex = '123456789'
    const rippleAddress = 'rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX'
    const rippleXAddress = 'XVVFXHFdehYhofb7XRWeJYV6kjTEwboaHpB9S1ruYMsuXcG'
    const rippleSplitAddress = 'rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb:1888963938'
    const paystring = 'blunden$paystring.crypto.com'
    const paystringWithAt = 'blunden@paystring.crypto.com'
    const validator = 'nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p'
    const addressWithQuotes = '"rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX"'
    const addressWithSpace = ' rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX '
    const addressWithSingleQuote = '"rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX'

    const hash =
      '59239EA78084F6E2F288473F8AE02F3E6FC92F44BDE59668B5CAE361D3D32838'
    const ctid = 'C0BF433500020000'
    const token1 = 'cny.rJ1adrpGS3xsnQMb9Cw54tWJVFPuSdZHK'
    const token1VariantPlus = 'cny.rJ1adrpGS3xsnQMb9Cw54tWJVFPuSdZHK'
    const token1VariantMinus = 'cny-rJ1adrpGS3xsnQMb9Cw54tWJVFPuSdZHK'
    const token1VariantColon = 'cny:rJ1adrpGS3xsnQMb9Cw54tWJVFPuSdZHK'

    const token2 =
      '534f4c4f00000000000000000000000000000000.rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz'
    const token2VariantPlus =
      '534f4c4f00000000000000000000000000000000+rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz'
    const token2VariantMinus =
      '534f4c4f00000000000000000000000000000000-rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz'
    const token2VariantColon =
      '534f4c4f00000000000000000000000000000000:rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz'

    const nftoken =
      '000800011C7D8ED1D715A0017E41BF9499ECC17E7FB666320000099B00000000'
    const invalidString = '123invalid'

    // mock getNFTInfo api to test transactions and nfts
    const mockAPI = jest.spyOn(rippled, 'getTransaction')

    const testValue = async (searchInput, expectedPath) => {
      input.instance().value = searchInput
      input.simulate('keyDown', { key: 'Enter' })
      await flushPromises()
      expect(window.location.pathname).toEqual(expectedPath)
    }

    input.simulate('keyDown', { key: 'a' })
    expect(window.location.pathname).toEqual('/')

    await testValue(ledgerIndex, `/ledgers/${ledgerIndex}`)

    await testValue(rippleAddress, `/accounts/${rippleAddress}`)

    await testValue(addressWithQuotes, `/accounts/${rippleAddress}`)

    await testValue(addressWithSingleQuote, `/accounts/${rippleAddress}`)

    await testValue(addressWithSpace, `/accounts/${rippleAddress}`)

    await testValue(rippleXAddress, `/accounts/${rippleXAddress}`)

    // Normalize split address format to a X-Address
    await testValue(rippleSplitAddress, `/accounts/${rippleXAddress}`)

    await testValue(paystring, `/paystrings/${paystring}`)

    // Normalize paystrings with @ to $
    await testValue(paystringWithAt, `/paystrings/${paystring}`)

    // Validator
    await testValue(validator, `/validators/${validator}`)

    mockAPI.mockImplementation(() => {
      '123'
    })
    await testValue(hash, `/transactions/${hash}`)

    await testValue(ctid, `/transactions/${ctid}`)

    await testValue(token1, `/token/${token1}`)

    // testing multiple variants of token format
    await testValue(token1VariantColon, `/token/${token1}`)

    await testValue(token1VariantPlus, `/token/${token1}`)

    await testValue(token1VariantMinus, `/token/${token1}`)

    await testValue(token2, `/token/${token2}`)

    // testing multiple variants of full token format
    await testValue(token2VariantColon, `/token/${token2}`)

    await testValue(token2VariantPlus, `/token/${token2}`)

    await testValue(token2VariantMinus, `/token/${token2}`)

    // Returns a response upon a valid nft_id, redirect to NFT
    mockAPI.mockImplementation(() => {
      throw new Error('Tx not found', 404)
    })
    await testValue(nftoken, `/nft/${nftoken}`)

    await testValue(invalidString, `/search/${invalidString}`)

    // ensure strings are trimmed
    mockAPI.mockImplementation(() => {
      '123'
    })
    await testValue(` ${hash} `, `/transactions/${hash}`)

    // handle lower case tx hash
    await testValue(hash.toLowerCase(), `/transactions/${hash}`)

    // handle lower case ctid
    await testValue(ctid.toLowerCase(), `/transactions/${ctid}`)
    wrapper.unmount()
  })

  // TODO: Add custom search tests
})
