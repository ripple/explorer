import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { useInfiniteQuery, QueryClientProvider } from 'react-query'
import { Offers } from '../Offers'
import i18n from '../../../../i18n/testConfig'
import { queryClient } from '../../../shared/QueryClient'

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
  const renderOffers = () =>
    render(
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

  it('renders without crashing', () => {
    useInfiniteQuery.mockImplementation(() => ({
      data,
      isFetching: false,
      error: {},
    }))
    renderOffers()
  })

  it('renders table content', () => {
    useInfiniteQuery.mockImplementation(() => ({
      data,
      isFetching: false,
      error: {},
    }))
    const { container } = renderOffers()
    expect(container.querySelectorAll('tr').length).toEqual(3)
    expect(container.querySelectorAll('a').length).toEqual(2)
    expect(container.textContent.includes('0.000043')).toBe(true)
    expect(
      container.textContent.includes(
        '04A971FB801C8EDD9B839F5814A7996441303C1E9BB112BFC239A803D614AA23',
      ),
    ).toBe(true)
    expect(
      container.textContent.includes(
        '0758BE16FBC30B823F4C80E46378F7FEA4CCE3115EB9637F73211ADD1E17C298',
      ),
    ).toBe(true)
    expect(container.querySelectorAll('.load-more-btn').length).toEqual(0)
  })

  it('renders loader', () => {
    useInfiniteQuery.mockImplementation(() => ({
      data,
      isFetching: true,
      error: {},
    }))
    const { container } = renderOffers()
    expect(container.querySelectorAll('.loader').length).toEqual(1)
  })

  it('renders no information warning when there is no data', () => {
    useInfiniteQuery.mockImplementation(() => ({
      data: undefined,
      isFetching: false,
      error: {},
    }))
    const { container } = renderOffers()
    expect(container.querySelectorAll('.no-info-content').length).toEqual(1)
  })

  it('renders load more button', () => {
    useInfiniteQuery.mockImplementation(() => ({
      data: undefined,
      isFetching: false,
      error: {},
      hasNextPage: true,
    }))
    const { container } = renderOffers()
    expect(container.querySelectorAll('.load-more-btn').length).toEqual(1)
  })
})
