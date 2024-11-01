import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { useQuery, QueryClientProvider } from 'react-query'
import userEvent from '@testing-library/user-event'
import { MPTHeader } from '../MPTHeader'
import i18n from '../../../../i18n/testConfig'
import { queryClient } from '../../../shared/QueryClient'

const data = {
  issuer: 'r3SnSE9frruxwsC9qGHFiUJShda62fNFGQ',
  assetScale: 2,
  maxAmt: '100',
  outstandingAmt: '64',
  transferFee: 3,
  sequence: 3949,
  metadata: 'https://www.google.com/',
  flags: ['lsfMPTCanClawback', 'lsfMPTCanTransfer'],
}

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))
const setError = jest.fn()

describe('MPT header container', () => {
  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <MPTHeader
              tokenId="00000F6D5186FB5C90A8112419BED54193EDC7218835C6F5"
              setError={setError}
            />
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    )

  afterEach(cleanup)

  it('renders without crashing', async () => {
    useQuery.mockImplementation(() => ({
      data,
      isFetching: false,
    }))
    renderComponent()
  })

  it('renders MPT content', async () => {
    useQuery.mockImplementation(() => ({
      data,
      isFetching: false,
    }))
    renderComponent()

    // expect(screen.getByTestId('mpt-header')).toHaveTextContent(
    //   /00000F6D5186FB5C90A8112419BED54193EDC7218835C6F5$/i,
    // )
    expect(screen.getByTestId('mpt-header')).toHaveTextContent(
      'r3SnSE9frruxwsC9qGHFiUJShda62fNFGQ',
    )
    expect(screen.queryAllByTitle('settings')).toHaveLength(1)
    expect(screen.queryAllByTitle('details')).toHaveLength(1)
    fireEvent.mouseOver(screen.getByTitle('title-content'))
    screen.getByTitle('title-content').focus()
    await waitFor(() => screen.getByTestId('tooltip'))
    expect(screen.queryAllByTestId('tooltip')).toHaveLength(1)
  })

  it('renders loader', async () => {
    useQuery.mockImplementation(() => ({
      data,
      isFetching: true,
      error: {},
    }))
    renderComponent()
    expect(screen.queryByTitle('loader')).toBeDefined()
  })
})
