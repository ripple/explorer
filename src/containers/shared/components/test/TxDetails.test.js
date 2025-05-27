import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { cleanup, render } from '@testing-library/react'
import i18n from '../../../../i18n/testConfig'
import EnableAmendment from '../../../Transactions/test/mock_data/EnableAmendment.json'
import { TxDetails } from '../TxDetails'
import summarize from '../../../../rippled/lib/txSummary'

describe('TxDetails', () => {
  afterEach(cleanup)
  const renderComponent = (tx) =>
    render(
      <Router>
        <I18nextProvider i18n={i18n}>
          <TxDetails
            t={(s) => s}
            language="en-US"
            instructions={summarize(tx, true).details.instructions}
            type={tx.tx.TransactionType}
          />
        </I18nextProvider>
      </Router>,
    )

  it('renders EnableAmendment without crashing', () => {
    renderComponent(EnableAmendment)
  })
})
