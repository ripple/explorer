import { render, screen, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'

import { QueryClientProvider } from 'react-query'
import EnableAmendment from './mock_data/EnableAmendment.json'
import Payment from '../../shared/components/Transaction/Payment/test/mock_data/Payment.json'
import { SimpleTab } from '../SimpleTab'
import summarize from '../../../rippled/lib/txSummary'
import i18n from '../../../i18n/testConfig'
import { expectSimpleRowText } from '../../shared/components/Transaction/test'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { queryClient } from '../../shared/QueryClient'

describe('SimpleTab container', () => {
  let client
  const renderComponent = (tx, width = 1200) =>
    render(
      <Router>
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
    cleanup()
    client.close()
  })

  it('renders EnableAmendment without crashing', () => {
    renderComponent(EnableAmendment)
  })

  it('renders simple tab information', () => {
    renderComponent(Payment)
    expect(screen.queryByTestId('simple-body')).toBeDefined()
    expect(screen.getAllByRole('link')).toHaveLength(3)
    expectSimpleRowText(screen, 'tx-date', '3/23/2018, 1:34:51 PM')
    expectSimpleRowText(screen, 'ledger-index', '37432866')
    expectSimpleRowText(
      screen,
      'tx-account',
      'rNQEMJA4PsoSrZRn9J6RajAYhcDzzhf8ok',
    )
    expectSimpleRowText(screen, 'sequence', '31030')
    expectSimpleRowText(screen, 'tx-cost', '\uE9000.15')
  })
})
