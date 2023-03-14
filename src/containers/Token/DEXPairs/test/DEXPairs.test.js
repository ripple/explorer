import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../i18n/testConfig'
import DEXPairs from '../index'

const address = 'rHEQnRvqWccQALFfpG3YuoxxVyhDZnF4TS'
const currency = 'USD'
describe('The page', () => {
  let wrapper

  const createWrapper = () =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <DEXPairs accountId={address} currency={currency} />
        </Router>
      </I18nextProvider>,
    )

  beforeEach(async () => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders without crashing', () => {
    const dexPairsNode = wrapper.find('.dex-pairs-container')
    expect(dexPairsNode.length).toEqual(1)
  })

  it('renders the table', () => {
    const tableNode = wrapper.find('.pairs-table')
    expect(tableNode.length).toEqual(1)
  })

  describe('While fetching data', () => {
    it('renders the Loader first', () => {
      const loader = wrapper.find('Loader')
      expect(loader).toExist()
    })
  })
})
