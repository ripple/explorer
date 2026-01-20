import { render, waitFor } from '@testing-library/react'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfig'
import { TokenNonMain } from '../index'
import { flushPromises, QuickHarness } from '../../test/utils'
import { TOKEN_ROUTE } from '../../App/routes'
import mockAccount from '../../Accounts/test/mockAccountState.json'
import Mock = jest.Mock
import getToken from '../../../rippled/token'

jest.mock('../../../rippled/token', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('Token container', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const renderTokenNonMain = (getAccountImpl = () => new Promise(() => {})) => {
    ;(getToken as Mock).mockImplementation(getAccountImpl)
    return render(
      <QuickHarness
        i18n={i18n}
        initialEntries={[`/token/USD.${TEST_ACCOUNT_ID}`]}
      >
        <Route path={TOKEN_ROUTE.path} element={<TokenNonMain />} />
      </QuickHarness>,
    )
  }

  beforeEach(() => {
    jest.resetModules()
  })

  it('renders without crashing', () => {
    renderTokenNonMain()
  })

  it('renders static parts', async () => {
    const { container } = renderTokenNonMain(() => Promise.resolve(mockAccount))
    await flushPromises()
    await waitFor(() => {
      // TokenHeader renders with class 'token-header-non-main'
      expect(container.querySelectorAll('.token-header-non-main').length).toBe(
        1,
      )
    })
    // TokenTransactionTable renders with class 'transaction-table'
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
  })
})
