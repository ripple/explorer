import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'

import { QueryClientProvider } from 'react-query'
import EnableAmendment from './mock_data/EnableAmendment.json'
import Payment from '../../shared/components/Transaction/Payment/test/mock_data/Payment.json'
import DelegatePayment from './mock_data/DelegatePayment.json'
import { SimpleTab } from '../SimpleTab'
import summarize from '../../../rippled/lib/txSummary'
import i18n from '../../../i18n/testConfig'
import { expectSimpleRowText } from '../../shared/components/Transaction/test'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { queryClient } from '../../shared/QueryClient'
import { V7_FUTURE_ROUTER_FLAGS } from '../../test/utils'

describe('SimpleTab container', () => {
  let client
  const createWrapper = (tx, width = 1200) =>
    mount(
      <Router future={V7_FUTURE_ROUTER_FLAGS}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <SocketContext.Provider value={client}>
              <SimpleTab
                data={{ processed: tx, summary: summarize(tx, true).details }}
                width={width}
              />
            </SocketContext.Provider>
          </I18nextProvider>
        </QueryClientProvider>
      </Router>,
    )

  beforeEach(() => {
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
  })

  it('renders EnableAmendment without crashing', () => {
    const wrapper = createWrapper(EnableAmendment)
    wrapper.unmount()
  })

  it('renders simple tab information', () => {
    const wrapper = createWrapper(Payment)
    expect(wrapper.find('.simple-body').length).toBe(1)
    expect(wrapper.find('a').length).toBe(3)
    expectSimpleRowText(wrapper, 'tx-date', '3/23/2018, 1:34:51 PM')
    expectSimpleRowText(wrapper, 'ledger-index', '37432866')
    expectSimpleRowText(
      wrapper,
      'account',
      'rNQEMJA4PsoSrZRn9J6RajAYhcDzzhf8ok',
    )
    expectSimpleRowText(wrapper, 'sequence', '31030')
    expectSimpleRowText(wrapper, 'tx-cost', '\uE9000.15')
    wrapper.unmount()
  })

  it('renders simple tab information with delegate', () => {
    const wrapper = createWrapper(DelegatePayment)
    expect(wrapper.find('.simple-body').length).toBe(1)
    expect(wrapper.find('a').length).toBe(4)
    expectSimpleRowText(wrapper, 'tx-date', '5/20/2025, 6:23:20 PM')
    expectSimpleRowText(wrapper, 'ledger-index', '2947137')
    expectSimpleRowText(
      wrapper,
      'account',
      'rfFLs8ZknoJKHCw7MtJKcs8GL81dqoDGRz',
    )
    expectSimpleRowText(
      wrapper,
      'delegate',
      'rNRfqQc9b9ehXJJYVR6NqPPwrS26tWeB6N',
    )
    expectSimpleRowText(wrapper, 'sequence', '2947132')
    expectSimpleRowText(wrapper, 'tx-cost', '\uE9000.000001')
    wrapper.unmount()
  })
})
