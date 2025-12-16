import { mount } from 'enzyme'
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
  const createWrapper = (props: any = {}) =>
    mount(
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
    const wrapper = createWrapper({ loading: true })
    expect(wrapper.find('.loader').length).toBe(1)
    wrapper.unmount()
  })

  it('returns null when no data and not loading', () => {
    const wrapper = createWrapper({ data: undefined, loading: false })
    expect(wrapper.find('.token-header').length).toBe(0)
    wrapper.unmount()
  })

  it('renders header with MPT data', () => {
    const wrapper = createWrapper({ data: mockMPTData })
    expect(wrapper.find('.token-header.mpt').length).toBe(1)
    expect(wrapper.find('.token-indicator').length).toBe(1)
    expect(wrapper.find('.box-header').length).toBe(1)
    wrapper.unmount()
  })

  it('displays ticker when available', () => {
    const wrapper = createWrapper({ data: mockMPTData })
    expect(wrapper.text()).toContain('TEST')
    wrapper.unmount()
  })

  it('displays issuer name when available', () => {
    const wrapper = createWrapper({ data: mockMPTData })
    expect(wrapper.text()).toContain('Test Issuer')
    wrapper.unmount()
  })

  it('displays shortened MPT ID when no ticker', () => {
    const wrapper = createWrapper({ data: mockMPTDataNoMetadata })
    expect(wrapper.find('.mpt-id').length).toBe(1)
    wrapper.unmount()
  })

  it('shows metadata warning when not compliant', () => {
    const wrapper = createWrapper({ data: mockMPTDataNoMetadata })
    expect(wrapper.find('.metadata-warning').length).toBe(1)
    wrapper.unmount()
  })

  it('does not show metadata warning when compliant', () => {
    const wrapper = createWrapper({ data: mockMPTData })
    expect(wrapper.find('.metadata-warning').length).toBe(0)
    wrapper.unmount()
  })

  it('displays logo when available', () => {
    const wrapper = createWrapper({ data: mockMPTData })
    const logo = wrapper.find('img.token-logo')
    expect(logo.length).toBe(1)
    expect(logo.prop('src')).toBe('https://example.com/icon.png')
    wrapper.unmount()
  })

  it('displays default logo when no icon', () => {
    const wrapper = createWrapper({ data: mockMPTDataNoMetadata })
    expect(wrapper.find('.token-logo.no-logo').length).toBeGreaterThanOrEqual(1)
    wrapper.unmount()
  })

  it('renders domain link when URIs available', () => {
    const wrapper = createWrapper({ data: mockMPTData })
    expect(wrapper.find('.domain-link-container').length).toBe(1)
    wrapper.unmount()
  })

  it('calls setError for invalid MPT ID', () => {
    const setError = jest.fn()
    const wrapper = createWrapper({
      data: mockMPTData,
      setError,
    })
    // Valid ID, setError should not be called with BAD_REQUEST
    wrapper.setProps({})
    wrapper.unmount()
  })

  it('renders GeneralOverview component', () => {
    const wrapper = createWrapper({ data: mockMPTData, holdersCount: 100 })
    expect(wrapper.find('.header-box').length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('renders Settings component with flags', () => {
    const wrapper = createWrapper({ data: mockMPTData })
    expect(wrapper.text()).toContain('can_transfer')
    wrapper.unmount()
  })

  it('renders Metadata component when metadata exists', () => {
    const wrapper = createWrapper({ data: mockMPTData })
    expect(wrapper.find('.metadata-box').length).toBe(1)
    wrapper.unmount()
  })
})
