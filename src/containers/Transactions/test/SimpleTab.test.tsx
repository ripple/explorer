import { render, cleanup } from '@testing-library/react'
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
  const renderSimpleTab = (tx: any, width = 1200) =>
    render(
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
    cleanup()
  })

  it('renders EnableAmendment without crashing', () => {
    renderSimpleTab(EnableAmendment)
  })

  it('renders simple tab information', () => {
    const { container } = renderSimpleTab(Payment)
    expect(container.querySelectorAll('.simple-body').length).toBe(1)
    expect(container.querySelectorAll('a').length).toBe(3)
    expectSimpleRowText(container, 'tx-date', '3/23/2018, 1:34:51 PM')
    expectSimpleRowText(container, 'ledger-index', '37432866')
    expectSimpleRowText(
      container,
      'account',
      'rNQEMJA4PsoSrZRn9J6RajAYhcDzzhf8ok',
    )
    expectSimpleRowText(container, 'sequence', '31030')
    expectSimpleRowText(container, 'tx-cost', '\uE9000.15')
  })

  it('renders simple tab information with delegate', () => {
    const { container } = renderSimpleTab(DelegatePayment)
    expect(container.querySelectorAll('.simple-body').length).toBe(1)
    expect(container.querySelectorAll('a').length).toBe(4)
    expectSimpleRowText(container, 'tx-date', '5/20/2025, 6:23:20 PM')
    expectSimpleRowText(container, 'ledger-index', '2947137')
    expectSimpleRowText(
      container,
      'account',
      'rfFLs8ZknoJKHCw7MtJKcs8GL81dqoDGRz',
    )
    expectSimpleRowText(
      container,
      'delegate',
      'rNRfqQc9b9ehXJJYVR6NqPPwrS26tWeB6N',
    )
    expectSimpleRowText(container, 'sequence', '2947132')
    expectSimpleRowText(container, 'tx-cost', '\uE9000.000001')
  })
})
