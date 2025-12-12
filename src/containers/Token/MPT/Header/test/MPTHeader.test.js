import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { useQuery, QueryClientProvider } from 'react-query'
import { Header as MPTHeader } from '../index'
import i18n from '../../../../../i18n/testConfig'
import { queryClient } from '../../../../shared/QueryClient'

const data = {
  issuer: 'r3SnSE9frruxwsC9qGHFiUJShda62fNFGQ',
  assetScale: 2,
  maxAmt: '100',
  outstandingAmt: '64',
  transferFee: 3,
  sequence: 3949,
  rawMPTMetadata: 'https://www.google.com/',
  isMPTMetadataCompliant: true,
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
              mptIssuanceId="00000F6D5186FB5C90A8112419BED54193EDC7218835C6F5"
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
    // Header boxes are rendered directly
    expect(wrapper.find('.header-boxes').length).toBe(1)
    expect(wrapper.find('GeneralOverview').length).toBe(1)
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

  it('renders metadata warning when metadata is not compliant', async () => {
    const dataWithNonCompliantMetadata = {
      ...data,
      isMPTMetadataCompliant: false,
      parsedMPTMetadata: {},
    }
    useQuery.mockImplementation(() => ({
      data: dataWithNonCompliantMetadata,
      isFetching: false,
    }))
    const wrapper = createWrapper()

    // Check that the warning section is rendered
    expect(wrapper.find('.metadata-warning').length).toBe(1)

    // Check that the warning message contains the expected text
    const warningText = wrapper.find('.metadata-warning').text()
    expect(warningText).toContain(
      'This MPT does not follow the recommended metadata standards',
    )
    expect(warningText).toContain('Recommended metadata standards')

    // Check that the link is rendered with correct attributes
    const link = wrapper.find('.metadata-warning a')
    expect(link.length).toBe(1)
    expect(link.prop('href')).toBe(
      'https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens#metadata-schema',
    )
    expect(link.prop('target')).toBe('_blank')
    expect(link.prop('rel')).toBe('noopener noreferrer')

    wrapper.unmount()
  })

  it('does not render metadata warning when metadata is compliant', async () => {
    const dataWithCompliantMetadata = {
      ...data,
      isMPTMetadataCompliant: true,
      parsedMPTMetadata: {},
    }
    useQuery.mockImplementation(() => ({
      data: dataWithCompliantMetadata,
      isFetching: false,
    }))
    const wrapper = createWrapper()

    // Check that the warning section is NOT rendered
    expect(wrapper.find('.metadata-warning').length).toBe(0)

    wrapper.unmount()
  })
})
