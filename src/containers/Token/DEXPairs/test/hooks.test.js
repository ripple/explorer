import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import moxios from 'moxios'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router'
import i18n from '../../../../i18n/testConfig'
import { DEXPairs } from '../index'
import mockTopEndpoint from './mockTopEndpoint.json'
import mockExchangeData from './mockExchangeData.json'
import SocketContext from '../../../shared/SocketContext'
import BaseMockWsClient from '../../../test/mockWsClient'

const address = 'rHEQnRvqWccQALFfpG3YuoxxVyhDZnF4TS'
const currency = 'USD'

class MockWsClient extends BaseMockWsClient {
  send(message) {
    if (this.returnError) {
      return Promise.reject(new Error({}))
    }
    const { taker_pays: takerPays } = message
    const token = `${takerPays.currency}.${takerPays.issuer}`
    const tokenName = takerPays.currency === 'XRP' ? 'XRP' : token

    return Promise.resolve(this.responses[tokenName]?.result)
  }
}

describe('Testing hooks', () => {
  let client
  beforeEach(() => {
    client = new MockWsClient()
    moxios.install()
  })

  afterEach(() => {
    client.close()
    moxios.uninstall()
  })

  const setupPage = async (shouldRender = true) => {
    const topUrl = '/api/v1/token/top'

    moxios.stubRequest(topUrl, {
      status: shouldRender ? 200 : 400,
      response: shouldRender ? mockTopEndpoint : { message: 'Bad Request' },
    })

    client.addResponses(mockExchangeData)
    client.setReturnError(!shouldRender)

    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SocketContext.Provider value={client}>
          <HelmetProvider>
            <MemoryRouter>
              <DEXPairs accountId={address} currency={currency} />
            </MemoryRouter>
          </HelmetProvider>
        </SocketContext.Provider>
      </I18nextProvider>,
    )

    return wrapper
  }

  describe('renders DEXPairs table', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await setupPage(true)
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('renders all pairs', (done) => {
      setImmediate(() => {
        wrapper.update()
        const allPairs = wrapper.find('.pair')
        // 3 from the mockTopEndpoint and 3 from hardcoded pairs
        expect(allPairs.length).toEqual(6)
        done()
      })
    })
    it('renders all PairStats components', (done) => {
      setImmediate(() => {
        wrapper.update()
        const allLows = wrapper.find('.low')
        const allHighs = wrapper.find('.high')
        expect(allLows.length).toEqual(12)
        expect(allHighs.length).toEqual(12)
        done()
      })
    })
  })

  describe('renders on top tokens endpoint failure', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await setupPage(false)
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('renders on top tokens failure', (done) => {
      // setImmediate will execute the callback immediately after all queued promise callbacks are executed
      setImmediate(() => {
        wrapper.update()
        const noTokensNode = wrapper.find('.no-pairs-message')
        expect(noTokensNode.length).toEqual(1)
        done()
      })
    })
  })
})
