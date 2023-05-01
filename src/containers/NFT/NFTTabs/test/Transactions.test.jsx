import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { useInfiniteQuery, QueryClientProvider } from 'react-query'
import { vi, describe, it, expect } from 'vitest'
import { Transactions } from '../Transactions'
import i18n from '../../../../i18n/testConfig'
import { queryClient } from '../../../shared/QueryClient'

vi.mock('react-query', async () => ({
  ...(await vi.importActual('react-query')),
  useInfiniteQuery: vi.fn(),
}))
describe('NFT Offers container', () => {
  const createWrapper = () =>
    mount(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <Transactions tokenId="0008000053CB74A272C39586ACD55AEC7594A05003AB08830000099B00000000" />
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    )

  it('renders without crashing', () => {
    useInfiniteQuery.mockImplementation(() => ({
      data: {},
      isFetching: false,
      error: {},
    }))
    const wrapper = createWrapper()
    expect(wrapper.find('TransactionTable').length).toEqual(1)
    wrapper.unmount()
  })
})
