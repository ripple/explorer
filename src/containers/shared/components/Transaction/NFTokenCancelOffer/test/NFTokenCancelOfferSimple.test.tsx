import { BrowserRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import { Simple as NFTokenCancelOffer } from '../Simple'
import transaction from './mock_data/NFTokenCancelOffer.json'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18n/testConfig'
import { queryClient } from '../../../../QueryClient'

describe('NFTokenCancelOffer', () => {
  it.only('handles NFTokenCancelOffer simple view ', () => {
    const screen = mount(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Router>
            <NFTokenCancelOffer
              data={summarizeTransaction(transaction, true).details}
            />
          </Router>
        </I18nextProvider>
      </QueryClientProvider>,
    )
    expect(screen.find('[data-testid="token-id"] .value')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C258BA1B200000018',
    )
    expect(screen.find('[data-testid="offer-id"] .value')).toHaveText(
      '35F3D6D99548FA5F5315580FBF8BA6B15CAA2CAE93023D5CE4FDC130602BC5C3',
    )
    expect(screen.find('[data-testid="amount"] .value')).toHaveText(
      '$100.00 USD.r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    expect(screen.find('[data-testid="offerer"] .value')).toHaveText(
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
  })
})
