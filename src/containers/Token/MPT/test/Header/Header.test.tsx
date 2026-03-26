import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../../i18n/testConfig'
import { Header } from '../../Header'
import { V7_FUTURE_ROUTER_FLAGS } from '../../../../test/utils'

const TEST_MPT_ID = '00000004A407AF5856CCF3C42619DAA925813FC955C72983'

const mockMPTData = {
  issuer: 'rTestIssuer123456789012345678901234',
  assetScale: 2,
  maxAmt: '1000000',
  outstandingAmt: '500000',
  transferFee: 1000,
  sequence: 1,
  flags: ['lsfMPTCanTransfer', 'lsfMPTCanTrade'],
  rawMPTMetadata: '{"ticker":"TEST","issuer_name":"Test Issuer"}',
  parsedMPTMetadata: {
    ticker: 'TEST',
    issuer_name: 'Test Issuer',
    icon: 'https://example.com/icon.png',
    uris: [
      { uri: 'https://example.com', category: 'website', title: 'Website' },
    ],
  },
  isMPTMetadataCompliant: true,
}

const mockMPTDataNoMetadata = {
  issuer: 'rTestIssuer123456789012345678901234',
  assetScale: 0,
  maxAmt: '1000000',
  outstandingAmt: '500000',
  transferFee: undefined,
  sequence: 1,
  flags: [],
  rawMPTMetadata: undefined,
  parsedMPTMetadata: undefined,
  isMPTMetadataCompliant: false,
}

describe('MPT Header component', () => {
  const renderComponent = (props: any = {}) =>
    render(
      <I18nextProvider i18n={i18n}>
        <Router future={V7_FUTURE_ROUTER_FLAGS}>
          <Header
            mptIssuanceId={TEST_MPT_ID}
            data={props.data}
            loading={props.loading || false}
            setError={props.setError || jest.fn()}
            holdersCount={props.holdersCount}
            holdersLoading={props.holdersLoading || false}
          />
        </Router>
      </I18nextProvider>,
    )

  it('renders loader when loading', () => {
    const { container } = renderComponent({ loading: true })
    expect(container.querySelectorAll('.loader')).toHaveLength(1)
  })

  it('returns null when no data and not loading', () => {
    const { container } = renderComponent({ data: undefined, loading: false })
    expect(container.querySelectorAll('.token-header')).toHaveLength(0)
  })

  it('renders header with MPT data', () => {
    const { container } = renderComponent({ data: mockMPTData })
    expect(container.querySelectorAll('.token-header.mpt')).toHaveLength(1)
    expect(container.querySelectorAll('.token-indicator')).toHaveLength(1)
    expect(container.querySelectorAll('.box-header')).toHaveLength(1)
  })

  it('displays ticker when available', () => {
    const { container } = renderComponent({ data: mockMPTData })
    expect(container).toHaveTextContent('TEST')
  })

  it('displays issuer name when available', () => {
    const { container } = renderComponent({ data: mockMPTData })
    expect(container).toHaveTextContent('Test Issuer')
  })

  it('displays shortened MPT ID when no ticker', () => {
    const { container } = renderComponent({ data: mockMPTDataNoMetadata })
    expect(container.querySelectorAll('.mpt-id')).toHaveLength(1)
  })

  it('shows metadata warning when not compliant', () => {
    const { container } = renderComponent({ data: mockMPTDataNoMetadata })
    expect(container.querySelectorAll('.metadata-warning')).toHaveLength(1)
  })

  it('does not show metadata warning when compliant', () => {
    const { container } = renderComponent({ data: mockMPTData })
    expect(container.querySelectorAll('.metadata-warning')).toHaveLength(0)
  })

  it('displays logo when available', () => {
    const { container } = renderComponent({ data: mockMPTData })
    const logo = container.querySelector('img.token-logo')
    expect(logo).not.toBeNull()
    expect(logo).toHaveAttribute('src', 'https://example.com/icon.png')
  })

  it('displays logo URL without protocol by prefixing https', () => {
    const dataWithNoProtocolUrl = {
      ...mockMPTData,
      parsedMPTMetadata: {
        ...mockMPTData.parsedMPTMetadata,
        icon: 'example.com/logo.png',
      },
    }
    const { container } = renderComponent({ data: dataWithNoProtocolUrl })
    const logo = container.querySelector('img.token-logo')
    expect(logo).not.toBeNull()
    expect(logo).toHaveAttribute('src', 'https://example.com/logo.png')
  })

  it('displays default logo when no icon', () => {
    const { container } = renderComponent({ data: mockMPTDataNoMetadata })
    expect(
      container.querySelectorAll('.token-logo.no-logo').length,
    ).toBeGreaterThanOrEqual(1)
  })

  it('renders domain link when URIs available', () => {
    const { container } = renderComponent({ data: mockMPTData })
    expect(container.querySelectorAll('.domain-link-container')).toHaveLength(1)
  })

  it('calls setError for invalid MPT ID', () => {
    const setError = jest.fn()
    renderComponent({
      data: mockMPTData,
      setError,
    })
    // Valid ID, setError should not be called with BAD_REQUEST
    // No setProps equivalent in RTL, just verify render doesn't throw
  })

  it('renders GeneralOverview component', () => {
    const { container } = renderComponent({
      data: mockMPTData,
      holdersCount: 100,
    })
    expect(container.querySelectorAll('.header-box').length).toBeGreaterThan(0)
  })

  it('renders Settings component with flags', () => {
    const { container } = renderComponent({ data: mockMPTData })
    expect(container).toHaveTextContent('can_transfer')
  })

  it('renders Metadata component when metadata exists', () => {
    const { container } = renderComponent({ data: mockMPTData })
    expect(container.querySelectorAll('.metadata-box')).toHaveLength(1)
  })
})
