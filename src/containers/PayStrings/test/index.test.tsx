import { mount } from 'enzyme'
import { Route } from 'react-router'
import i18n from '../../../i18n/testConfig'
import { PayString } from '../index'
import { getPayString } from '../../../rippled'
import mockPayStringData from './mockPayStringData.json'
import { QuickHarness, flushPromises } from '../../test/utils'
import { PAYSTRING } from '../../App/routes'
import Mock = jest.Mock

jest.mock('../../../rippled', () => {
  const originalModule = jest.requireActual('../../../rippled')

  return {
    __esModule: true,
    ...originalModule,
    getPayString: jest.fn(),
  }
})

const mockGetPayString = getPayString as Mock

describe('PayString container', () => {
  const TEST_PAY_ID = 'blunden$paystring.crypto.com'

  const createWrapper = () =>
    mount(
      <QuickHarness i18n={i18n} initialEntries={[`/paystrings/${TEST_PAY_ID}`]}>
        <Route path={PAYSTRING.path} element={<PayString />} />
      </QuickHarness>,
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
