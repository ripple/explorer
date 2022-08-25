import React from 'react'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, useInfiniteQuery, QueryClientProvider } from 'react-query'
import Offers from '../Offers'
import i18n from '../../../../i18nTestConfig'

const data = {
  pages: [
    {
      limit: 50,
      marker:
        '99511000B8DD99BC26E4EAF4950A4D3828154C32FF87E488CDF97090FF50C7E3',
      nft_id:
        '000800011C7D8ED1D715A0017E41BF9499ECC17E7FB666320000099B00000000',
      offers: [
        {
          amount: '43',
          flags: 1,
          nft_offer_index:
            '04A971FB801C8EDD9B839F5814A7996441303C1E9BB112BFC239A803D614AA23',
          owner: 'rsbeLHcGyFjt2oQsgoao9s3p5BLhP4CdMo',
        },
        {
          amount: '43',
          flags: 1,
          nft_offer_index:
            '0758BE16FBC30B823F4C80E46378F7FEA4CCE3115EB9637F73211ADD1E17C298',
          owner: 'rsbeLHcGyFjt2oQsgoao9s3p5BLhP4CdMo',
        },
      ],
    },
  ],
  pageParams: [null],
}

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useInfiniteQuery: jest.fn(),
}))
const fetchOffers = jest.fn()

describe('NFT Offers container', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false,
      },
    },
  })

  const createWrapper = () =>
    mount(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <Offers
              tokenId="0008000053CB74A272C39586ACD55AEC7594A05003AB08830000099B00000000"
              fetchOffers={fetchOffers}
              offerType="Offers"
            />
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    )

  it('renders without crashing', async () => {
    useInfiniteQuery.mockImplementation(() => ({
      data,
      isFetching: false,
      error: {},
    }))
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders table content', async () => {
    useInfiniteQuery.mockImplementation(() => ({
      data,
      isFetching: false,
      error: {},
    }))
    const wrapper = createWrapper()
    expect(wrapper.find('tr').length).toEqual(3)
    expect(wrapper.find('Link').length).toEqual(2)
    expect(wrapper.text().includes('0.000043')).toBe(true)
    expect(
      wrapper
        .text()
        .includes(
          '04A971FB801C8EDD9B839F5814A7996441303C1E9BB112BFC239A803D614AA23',
        ),
    ).toBe(true)
    expect(
      wrapper
        .text()
        .includes(
          '0758BE16FBC30B823F4C80E46378F7FEA4CCE3115EB9637F73211ADD1E17C298',
        ),
    ).toBe(true)
    expect(wrapper.find('.load-more-btn').length).toEqual(0)
    wrapper.unmount()
  })

  it('renders loader', async () => {
    useInfiniteQuery.mockImplementation(() => ({
      data,
      isFetching: true,
      error: {},
    }))
    const wrapper = createWrapper()
    expect(wrapper.find('Loader').length).toEqual(1)
    wrapper.unmount()
  })

  it('renders no information warning when there is no data', async () => {
    useInfiniteQuery.mockImplementation(() => ({
      data: undefined,
      isFetching: false,
      error: {},
    }))
    const wrapper = createWrapper()
    expect(wrapper.find('.no-info-content').length).toEqual(1)
    wrapper.unmount()
  })

  it('renders load more button', async () => {
    useInfiniteQuery.mockImplementation(() => ({
      data: undefined,
      isFetching: false,
      error: {},
      hasNextPage: true,
    }))
    const wrapper = createWrapper()
    expect(wrapper.find('.load-more-btn').length).toEqual(1)
    wrapper.unmount()
  })
})
