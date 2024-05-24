import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'

import EnableAmendment from './mock_data/EnableAmendment.json'
import Payment from './mock_data/PaymentBreakdown.json'
import { BreakDownTab } from '../BreakDownTab'
import i18n from '../../../i18n/testConfig'

describe('BreakdownTab container', () => {
  const createWrapper = (tx) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <BreakDownTab data={tx} />
        </I18nextProvider>
      </Router>,
    )

  it('renders EnableAmendment without crashing', () => {
    const wrapper = createWrapper(EnableAmendment)
    wrapper.unmount()
  })

  it('renders breakdown tab information', () => {
    const wrapper = createWrapper(Payment)

    // console.log(Payment)

    expect(wrapper.find('.breakdown-body').length).toBe(1)
    expect(wrapper.find('.detail-section').length).toBe(3)

    expect(wrapper.find('.source-account').length).toBe(1)
    expect(wrapper.find('.source-amount').length).toBe(1)
    expect(wrapper.find('.destination-account').length).toBe(1)
    expect(wrapper.find('.destination-amount').length).toBe(1)

    expect(
      wrapper.contains(<div className="title">liquidity_source</div>),
    ).toBe(true)

    expect(wrapper.contains(<option value="source">USD source</option>)).toBe(
      true,
    )
    expect(
      wrapper.contains(<option value="destination">XRP destination</option>),
    ).toBe(true)

    expect(wrapper.contains(<p>graph_dependent_currency</p>)).toBe(true)

    expect(
      wrapper.contains(<span className="margin-text">amm (98%)</span>),
    ).toBe(true)
    expect(
      wrapper.contains(<span className="margin-text">rippling (0%)</span>),
    ).toBe(true)
    expect(
      wrapper.contains(<span className="margin-text">dex (2%)</span>),
    ).toBe(true)
    expect(
      wrapper.contains(<span className="margin-text">direct (0%)</span>),
    ).toBe(true)

    expect(wrapper.contains(<div className="title">balance_changes</div>)).toBe(
      true,
    )
    expect(wrapper.contains(<span className="badge dex">dex</span>)).toBe(true)
    expect(
      wrapper.contains(<span className="badge rippling">rippling</span>),
    ).toBe(true)
    expect(wrapper.contains(<span className="badge amm">amm</span>)).toBe(true)

    // console.log(wrapper.debug())
    wrapper.unmount()
  })
})
