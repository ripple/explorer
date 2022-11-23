import React from 'react'
import { mount } from 'enzyme'
import moxios from 'moxios'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { BAD_REQUEST } from '../../shared/utils'
import i18n from '../../../i18nTestConfig'
import Validator from '../index'
import { queryClient } from '../../shared/QueryClient'
import { getLedger } from '../../../rippled'

global.location = '/validators/aaaa'

const MOCK_IDENTIFIER = 'mock-validator-hash'

jest.mock('../../../rippled', () => ({
  __esModule: true,
  getLedger: jest.fn(),
}))

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve))
}

queryClient.setDefaultOptions({
  queries: {
    ...queryClient.defaultQueryOptions(),
    cacheTime: 0,
  },
})

describe('Validator container', () => {
  const createWrapper = (
    getLedgerImpl = () =>
      new Promise(
        () => {},
        () => {},
      ),
  ) => {
    getLedger.mockImplementation(getLedgerImpl)
    return mount(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Router>
            <Validator
              match={{
                params: { identifier: MOCK_IDENTIFIER },
                path: '/',
              }}
            />
          </Router>
        </I18nextProvider>
      </QueryClientProvider>,
    )
  }

  beforeEach(async () => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.validator').length).toBe(1)
    wrapper.unmount()
  })

  it('renders loading', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.loader').length).toBe(1)
    wrapper.unmount()
  })

  it('sets title to domain', async () => {
    moxios.stubRequest(
      `/api/v1/validators?verbose=true&key=${MOCK_IDENTIFIER}`,
      {
        status: 200,
        response: {
          domain: 'example.com',
        },
      },
    )
    const wrapper = createWrapper()
    await flushPromises()
    expect(document.title).toBe('Validator example.com | xrpl_explorer')
    wrapper.unmount()
  })

  it('sets title to master_key', async () => {
    moxios.stubRequest(
      `/api/v1/validators?verbose=true&key=${MOCK_IDENTIFIER}`,
      {
        status: 200,
        response: {
          master_key: 'foo',
        },
      },
    )
    const wrapper = createWrapper()
    await flushPromises()
    expect(document.title).toBe('Validator foo... | xrpl_explorer')
    wrapper.unmount()
  })

  it('sets title to signing_key', async () => {
    moxios.stubRequest(
      `/api/v1/validators?verbose=true&key=${MOCK_IDENTIFIER}`,
      {
        status: 200,
        response: {
          signing_key: 'bar',
        },
      },
    )
    const wrapper = createWrapper()
    await flushPromises()
    expect(document.title).toBe('Validator bar... | xrpl_explorer')
    wrapper.unmount()
  })

  it('renders 404 page on no match', async () => {
    moxios.stubRequest(
      `/api/v1/validators?verbose=true&key=${MOCK_IDENTIFIER}`,
      {
        status: BAD_REQUEST,
        response: { error: 'something went wrong' },
      },
    )
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.find('.no-match').length).toBe(1)
    wrapper.unmount()
  })
})
