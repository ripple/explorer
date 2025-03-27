import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { useQuery, QueryClientProvider } from 'react-query'
import { MPTHeader } from '../MPTHeader'
import i18n from '../../../../i18n/testConfig'
import { queryClient } from '../../../shared/QueryClient'

const data = {
  issuer: 'r3SnSE9frruxwsC9qGHFiUJShda62fNFGQ',
  assetScale: 2,
  maxAmt: '100',
  outstandingAmt: '64',
  transferFee: 3,
  sequence: 3949,
  metadata: 'https://www.google.com/',
  flags: ['lsfMPTCanClawback', 'lsfMPTCanTransfer'],
}

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))
const setError = jest.fn()

describe('MPT header container', () => {
  const createWrapper = () =>
    mount(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <MPTHeader
              tokenId="00000F6D5186FB5C90A8112419BED54193EDC7218835C6F5"
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

  it('renders MPT content', async () => {
    useQuery.mockImplementation(() => ({
      data,
      isFetching: false,
    }))
    const wrapper = createWrapper()

    expect(
      wrapper
        .text()
        .includes('00000F6D5186FB5C90A8112419BED54193EDC7218835C6F5'),
    ).toBe(true)
    expect(wrapper.text().includes('r3SnSE9frruxwsC9qGHFiUJShda62fNFGQ')).toBe(
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
