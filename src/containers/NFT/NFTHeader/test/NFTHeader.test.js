import React from 'react'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { useQuery, QueryClientProvider } from 'react-query'
import { NFTHeader } from '../NFTHeader'
import i18n from '../../../../i18nTestConfig'
import { queryClient } from '../../../shared/QueryClient'

const data = {
  NFTId: '0000000025CC40A6A240DB42512BA22826B903A785EE2FA512C5D5A70000000C',
  ledgerIndex: 2436210,
  owner: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
  isBurned: false,
  flags: ['lsfBurnable', 'lsfOnlyXRP'],
  transferFee: 0,
  issuer: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
  NFTTaxon: 0,
  NFTSequence: 12,
  uri: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
  validated: true,
  status: 'success',
  warnings: [
    "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request",
  ],
}

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))
const setError = jest.fn()

describe('NFT header container', () => {
  const createWrapper = () =>
    mount(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <NFTHeader
              tokenId="0000000025CC40A6A240DB42512BA22826B903A785EE2FA512C5D5A70000000C"
              setError={setError}
            />
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    )

  it('renders without crashing', async () => {
    useQuery.mockImplementation(() => ({
      data,
      isFetching: false,
    }))
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders NFT content', async () => {
    useQuery.mockImplementation(() => ({
      data,
      isFetching: false,
    }))
    const wrapper = createWrapper()

    expect(
      wrapper
        .text()
        .includes(
          '0000000025CC40A6A240DB42512BA22826B903A785EE2FA512C5D5A70000000C',
        ),
    ).toBe(true)
    expect(wrapper.text().includes('rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W')).toBe(
      true,
    )
    expect(wrapper.find('Settings').length).toBe(1)
    expect(wrapper.find('Details').length).toBe(1)
    wrapper.find('.title-content').first().simulate('mouseOver')
    expect(wrapper.find('.tooltip').length).toBe(1)
    wrapper.unmount()
  })

  it('renders loader', async () => {
    useQuery.mockImplementation(() => ({
      data,
      isFetching: true,
      error: {},
    }))
    const wrapper = createWrapper()
    expect(wrapper.find('Loader').length).toEqual(1)
    wrapper.unmount()
  })
})
