import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter as Router, Route } from 'react-router'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../i18n/testConfig'
import { PayString } from '../index'
import { getPayString } from '../../../rippled'
import { testQueryClient } from '../../test/QueryClient'
import mockPayStringData from './mockPayStringData.json'
import { flushPromises } from '../../test/utils'

jest.mock('../../../rippled', () => {
  const originalModule = jest.requireActual('../../../rippled')

  return {
    __esModule: true,
    ...originalModule,
    getPayString: jest.fn(),
  }
})

const mockGetPayString = getPayString

describe('PayString container', () => {
  const TEST_PAY_ID = 'blunden$paystring.crypto.com'

  const createWrapper = () =>
    mount(
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={testQueryClient}>
          <Router initialEntries={[`/paystrings/${TEST_PAY_ID}`]}>
            <Route path="/paystrings/:id?" component={PayString} />
          </Router>
        </QueryClientProvider>
      </I18nextProvider>,
    )

  afterEach(() => {
    mockGetPayString.mockReset()
  })

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders static parts', async () => {
    mockGetPayString.mockImplementation(() =>
      Promise.resolve(mockPayStringData),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()
  })
})
