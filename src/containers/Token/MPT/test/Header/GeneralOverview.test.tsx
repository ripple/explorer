import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router'
import i18n from '../../../../../i18n/testConfig'
import { GeneralOverview } from '../../Header/GeneralOverview'

const TEST_MPT_ID = '00000004A407AF5856CCF3C42619DAA925813FC955C72983'
const TEST_ISSUER = 'rTestIssuer123456789012345678901234'

describe('GeneralOverview component', () => {
  const renderComponent = (props: any = {}) =>
    render(
      <I18nextProvider i18n={i18n}>
        <Router>
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
    const { container } = renderComponent()
    expect(container.querySelectorAll('.header-box')).toHaveLength(1)
    expect(container.querySelector('.header-box-title')).toHaveTextContent(
      'token_page.general_overview',
    )
  })

  it('displays issuer account', () => {
    const { container } = renderComponent()
    expect(container.querySelectorAll('.account-link')).toHaveLength(1)
  })

  it('displays issuer name when provided', () => {
    const { container } = renderComponent({ issuerName: 'Test Issuer' })
    expect(container).toHaveTextContent('Test Issuer')
  })

  it('displays the full issuer name untruncated (no address-style shortening)', () => {
    const longName = 'Franklin Templeton Investments'
    const { container } = renderComponent({ issuerName: longName })
    // Full name should render; it must NOT be shortened to e.g. "Frankli...ments".
    expect(container).toHaveTextContent(longName)
    expect(container).not.toHaveTextContent('...')
  })

  it('falls back to the shortened account address when no issuer name', () => {
    const { container } = renderComponent({ issuerName: undefined })
    // shortenAccount keeps first 7 + last 5 chars of the address.
    expect(container).toHaveTextContent('rTestIs...01234')
  })

  it('displays transfer fee when provided', () => {
    const { container } = renderComponent({ transferFee: 1000 })
    // transferFee 1000 / 1000 = 1, formatted as percent = 1.000%
    expect(transferFeeValue(container)).toBe('1.000%')
  })

  // The Price row is hardcoded to "--", so assertions must target the transfer
  // fee cell specifically rather than the whole container.
  const transferFeeValue = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('.header-box-item'))
      .find((row) =>
        row
          .querySelector('.item-name')
          ?.textContent?.includes('token_page.transfer_fee'),
      )
      ?.querySelector('.item-value')?.textContent

  it('displays -- when the transfer fee is missing or zero', () => {
    const { container: missing } = renderComponent({ transferFee: undefined })
    expect(transferFeeValue(missing)).toBe('--')

    // Regression: `(0 && parsePercent(...)) ?? '--'` evaluated to 0, so a zero
    // fee rendered "0" instead of the "--" placeholder.
    const { container: zero } = renderComponent({ transferFee: 0 })
    expect(transferFeeValue(zero)).toBe('--')
  })

  it('displays asset scale', () => {
    const { container } = renderComponent({ assetScale: 6 })
    expect(container).toHaveTextContent('6')
  })

  it('displays 0 for undefined asset scale', () => {
    const { container } = renderComponent({ assetScale: undefined })
    expect(container).toHaveTextContent('0')
  })

  it('displays holders count', () => {
    const { container } = renderComponent({ holdersCount: 1234 })
    expect(container).toHaveTextContent('1,234')
  })

  it('shows loading spinner when holdersLoading', () => {
    const { container } = renderComponent({ holdersLoading: true })
    expect(container.querySelectorAll('.loading-spinner')).toHaveLength(1)
  })

  it('shows MPT issuance ID when showMptId is true', () => {
    const { container } = renderComponent({ showMptId: true })
    expect(container).toHaveTextContent('mpt_issuance_id')
  })

  it('hides MPT issuance ID when showMptId is false', () => {
    const { container } = renderComponent({ showMptId: false })
    expect(container).not.toHaveTextContent('mpt_issuance_id')
  })
})
