import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../../i18n/testConfig'
import { GeneralOverview } from '../../Header/GeneralOverview'
import { V7_FUTURE_ROUTER_FLAGS } from '../../../../test/utils'

const TEST_MPT_ID = '00000004A407AF5856CCF3C42619DAA925813FC955C72983'
const TEST_ISSUER = 'rTestIssuer123456789012345678901234'

describe('GeneralOverview component', () => {
  const createWrapper = (props: any = {}) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Router future={V7_FUTURE_ROUTER_FLAGS}>
          <GeneralOverview
            issuer={props.issuer || TEST_ISSUER}
            issuerName={props.issuerName}
            transferFee={props.transferFee}
            assetScale={props.assetScale}
            mptIssuanceId={props.mptIssuanceId || TEST_MPT_ID}
            showMptId={props.showMptId ?? false}
            holdersCount={props.holdersCount}
            holdersLoading={props.holdersLoading || false}
          />
        </Router>
      </I18nextProvider>,
    )

  it('renders header box', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.header-box').length).toBe(1)
    expect(wrapper.find('.header-box-title').text()).toBe(
      'token_page.general_overview',
    )
    wrapper.unmount()
  })

  it('displays issuer account', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.account-link').length).toBe(1)
    wrapper.unmount()
  })

  it('displays issuer name when provided', () => {
    const wrapper = createWrapper({ issuerName: 'Test Issuer' })
    expect(wrapper.text()).toContain('Test Issuer')
    wrapper.unmount()
  })

  it('displays transfer fee when provided', () => {
    const wrapper = createWrapper({ transferFee: 1000 })
    // transferFee 1000 / 1000 = 1, formatted as percent = 1.000%
    expect(wrapper.text()).toContain('1.000%')
    wrapper.unmount()
  })

  it('displays -- when no transfer fee', () => {
    const wrapper = createWrapper({ transferFee: undefined })
    expect(wrapper.text()).toContain('--')
    wrapper.unmount()
  })

  it('displays asset scale', () => {
    const wrapper = createWrapper({ assetScale: 6 })
    expect(wrapper.text()).toContain('6')
    wrapper.unmount()
  })

  it('displays 0 for undefined asset scale', () => {
    const wrapper = createWrapper({ assetScale: undefined })
    expect(wrapper.text()).toContain('0')
    wrapper.unmount()
  })

  it('displays holders count', () => {
    const wrapper = createWrapper({ holdersCount: 1234 })
    expect(wrapper.text()).toContain('1,234')
    wrapper.unmount()
  })

  it('shows loading spinner when holdersLoading', () => {
    const wrapper = createWrapper({ holdersLoading: true })
    expect(wrapper.find('.loading-spinner').length).toBe(1)
    wrapper.unmount()
  })

  it('shows MPT issuance ID when showMptId is true', () => {
    const wrapper = createWrapper({ showMptId: true })
    expect(wrapper.text()).toContain('mpt_issuance_id')
    wrapper.unmount()
  })

  it('hides MPT issuance ID when showMptId is false', () => {
    const wrapper = createWrapper({ showMptId: false })
    expect(wrapper.text()).not.toContain('mpt_issuance_id')
    wrapper.unmount()
  })
})
